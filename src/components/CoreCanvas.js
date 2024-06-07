import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";
import WaterWave from 'react-water-wave';
import {withTheme} from "@mui/styles";
import Box from "@mui/material/Box";
import ValueGauge from "./ValueGauge";
import CoreImage from "../images/core-base.png";
import CherenkovImage from "../images/core-base-cherenkov.png";
import CoreRodImage from "../images/core-control-rod.png";
import PropTypes from "prop-types";
import {CHERENKOV_COLOR} from "../utils/constants";
import {configureRippleParameters, simulateMessages} from "../utils/Helpers";

const GAUGE_BORDER_COLOR = "#e36666";
const GAUGE_BORDER = `2px solid ${GAUGE_BORDER_COLOR}`;

// https://github.com/homerchen19/react-water-wave

function getImageDisplayParameters(width, height, inlet, outlet, rod, flux) {
  // const xmagic = width / 930; // 230/847;
  const xmagic = width/930; // 343/928;
  const rod_range = -(150*xmagic/8);
  return {
    valueFontSize: `${xmagic*3.0}em`, //"2.5em",
    labelFontSize: `${xmagic*1.2}em`, //"1.2em",
    coreImageX: Math.floor(50 * xmagic),
    coreImageY: Math.floor(50 * xmagic),
    coreImageSize: Math.floor(0.8 * width),
    rodImageX: Math.floor(375 * xmagic),
    rodImageY: Math.floor((80 * xmagic) + (rod_range * rod)),
    rodImageSize: Math.floor(0.5 * width),
    inlet_x: Math.floor(540 * xmagic),
    inlet_y: Math.floor(630 * xmagic),
    inlet_width: Math.floor(170 * xmagic),
    inlet_height: Math.floor(90 * xmagic),
    inlet_label_x: Math.floor(45 * xmagic),
    inlet_label_y: Math.floor(5 * xmagic),
    inlet_value_x: Math.floor(20 * xmagic),
    inlet_value_y: Math.floor(-45 * xmagic),
    outlet_x: Math.floor(550 * xmagic),
    outlet_y: Math.floor(470 * xmagic),
    outlet_width: Math.floor(160 * xmagic),
    outlet_height: Math.floor(90 * xmagic),
    outlet_label_x: Math.floor(30 * xmagic),
    outlet_label_y: Math.floor(-45 * xmagic),
    outlet_value_x: Math.floor(20 * xmagic),
    outlet_value_y: Math.floor(-45 * xmagic),
    rod_x: Math.floor(250 * xmagic),
    rod_y: Math.floor(430 * xmagic),
    rod_width: Math.floor(160 * xmagic),
    rod_height: Math.floor(90 * xmagic),
    rod_label_x: Math.floor(45 * xmagic),
    rod_label_y: Math.floor(45 * xmagic),
    rod_value_x: Math.floor(10 * xmagic),
    rod_value_y: Math.floor(-5 * xmagic),
    flux_x: Math.floor(150 * xmagic),
    flux_y: Math.floor(670 * xmagic),
    flux_width: Math.floor(190 * xmagic),
    flux_height: Math.floor(90 * xmagic),
    flux_label_x: Math.floor(20 * xmagic),
    flux_label_y: Math.floor(45 * xmagic),
    flux_value_x: Math.floor(25 * xmagic),
    flux_value_y: Math.floor(-5 * xmagic),
    coreImagePaddingBottom: Math.floor(50*xmagic),
    cherenkovFilterSize: Math.floor((flux / 10) * 100),
    cherenkovFilterYOffset: Math.floor(flux * 4),
    cherenkovImageX: Math.floor(64 * xmagic),
    cherenkovImageY: Math.floor(100 * xmagic),
    cherenkovImageSize: Math.floor(0.8 * width),
    rippleDropY: Math.floor(0.8 * width),
  }

}

class CoreCanvas extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      width: 0,
      height: 0,
    };
    this.Module = "CoreCanvas";
    this.canvasRef = React.createRef();
    this.rippleTimer = null;
    this.rippleTimerEvent = false;
  }

  updateWindowSize = () => {
    if (this.canvasRef.current) {
      this.setState({
        width: this.canvasRef.current.clientWidth,
        height: window.innerHeight
      });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowSize);
    this.updateWindowSize();
    // start ripple timer
    this.rippleTimer = setInterval(()=> {
      this.rippleTimerEvent = true;
      this.setState({ state: this.state });
    }, 6000);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowSize);
    if (this.rippleTimer) {
      this.rippleTimer = null;
    }
  }

  render() {
    const { theme, inlet_temp, outlet_temp, rod_position, flux, valueFontFamily, labelFontFamily } = this.props;
    const { width, height } = this.state;
    const idp = getImageDisplayParameters(width, height, inlet_temp, outlet_temp, rod_position, flux);
    let ripples = [];
    if (this.rippleTimerEvent) {
      ripples = configureRippleParameters(50,850,50, idp.rippleDropY,20,0.01,
        this.props.inlet_temp, this.props.outlet_temp);
      this.rippleTimerEvent = false;
    }
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "width", width, "height", height, "inlet_temp", inlet_temp,
        "outlet_temp", outlet_temp, "rod_position", rod_position, "flux", flux, "idp", idp, "ripples", ripples);
    }
    return (
      <Box
        ref={this.canvasRef}
        style={{ display: "relative" }}
      >
        <img
          id={"cherenkov-image"}
          src={CherenkovImage}
          alt={"cherenkov"}
          style={{
            position: "absolute",
            top: idp.cherenkovImageY,
            left: idp.cherenkovImageX+2,
            width: idp.cherenkovImageSize,
            paddingBottom: idp.coreImagePaddingBottom,
            filter: `drop-shadow(0px ${idp.cherenkovFilterYOffset}px ${idp.cherenkovFilterSize}px ${CHERENKOV_COLOR})`,
            zIndex: 1,
          }}
        />
        <WaterWave
          imageUrl={CoreImage}
          dropRadius={20}
          perturbance={0.03}
          resolution={256}
          interactive={false}
          style={{
            position: "relative",
            height: height,
            top: idp.coreImageY,
            left: idp.coreImageX,
            width: "100%",
            backgroundSize: `${idp.coreImageSize}px ${idp.coreImageSize}px`,
            backgroundRepeat: "no-repeat",
            zIndex: 2,
            paddingBottom: idp.coreImagePaddingBottom,
          }}
        >
          {({drop, updateSize}) => {
            updateSize()
            for (const ripple of ripples) {
              drop({x: ripple.x, y: ripple.y, radius: ripple.radius, strength: ripple.strength});
            }
            return (
              <div>
                <img
                  src={CoreRodImage}
                  alt={"control rod"}
                  style={{
                    position: "relative",
                    top: idp.rodImageY,
                    left: idp.rodImageX,
                    width: idp.rodImageSize * 0.1,
                    height: idp.rodImageSize,
                    zIndex: 3,
                  }}
                />
              </div>
            )}}
        </WaterWave>
        <ValueGauge
          valueColor={theme.palette.text.primary}
          labelColor={theme.palette.text.primary}
          backgroundColor={theme.palette.common.black}
          border={GAUGE_BORDER}
          label={"Inlet (°C)"}
          labelXPosition={idp.inlet_label_x}
          labelYPosition={idp.inlet_label_y}
          labelFontSize={idp.labelFontSize}
          value={inlet_temp}
          valueDigitsWidth={4}
          valuePrecision={1}
          valueXPosition={idp.inlet_value_x}
          valueYPosition={idp.inlet_value_y}
          valueFontSize={idp.valueFontSize}
          labelFontFamily={labelFontFamily}
          valueFontFamily={valueFontFamily}
          width={idp.inlet_width}
          height={idp.inlet_height}
          x={idp.inlet_x}
          y={idp.inlet_y}
          zIndex={10}
        />
        <ValueGauge
          valueColor={theme.palette.text.primary}
          labelColor={theme.palette.text.primary}
          backgroundColor={theme.palette.common.black}
          border={GAUGE_BORDER}
          label={"Outlet (°C)"}
          labelXPosition={idp.outlet_label_x}
          labelYPosition={idp.outlet_label_y}
          labelFontSize={idp.labelFontSize}
          value={outlet_temp}
          valueDigitsWidth={4}
          valuePrecision={1}
          valueXPosition={idp.outlet_value_x}
          valueYPosition={idp.outlet_value_y}
          valueFontSize={idp.valueFontSize}
          valueFontFamily={valueFontFamily}
          labelFontFamily={labelFontFamily}
          width={idp.outlet_width}
          height={idp.outlet_height}
          x={idp.outlet_x}
          y={idp.outlet_y}
          zIndex={10}
        />
        <ValueGauge
          valueColor={theme.palette.text.primary}
          labelColor={theme.palette.text.primary}
          backgroundColor={theme.palette.common.black}
          border={GAUGE_BORDER}
          label={"Flux (n/cm2/s)"}
          labelXPosition={idp.flux_label_x}
          labelYPosition={idp.flux_label_y}
          labelFontSize={idp.labelFontSize}
          value={flux}
          valueDigitsWidth={5}
          valuePrecision={2}
          valueXPosition={idp.flux_value_x}
          valueYPosition={idp.flux_value_y}
          valueFontSize={idp.valueFontSize}
          valueFontFamily={valueFontFamily}
          labelFontFamily={labelFontFamily}
          width={idp.flux_width}
          height={idp.flux_height}
          x={idp.flux_x}
          y={idp.flux_y}
          zIndex={10}
        />
        <ValueGauge
          valueColor={theme.palette.text.primary}
          labelColor={theme.palette.text.primary}
          backgroundColor={theme.palette.common.black}
          border={GAUGE_BORDER}
          label={"Rod (in)"}
          labelXPosition={idp.rod_label_x}
          labelYPosition={idp.rod_label_y}
          labelFontSize={idp.labelFontSize}
          value={rod_position}
          valueDigitsWidth={3}
          valuePrecision={1}
          valueXPosition={idp.rod_value_x}
          valueYPosition={idp.rod_value_y}
          valueFontSize={idp.valueFontSize}
          valueFontFamily={valueFontFamily}
          labelFontFamily={labelFontFamily}
          width={idp.rod_width}
          height={idp.rod_height}
          x={idp.rod_x}
          y={idp.rod_y}
          zIndex={10}
        />
      </Box>
    )
  }
}

CoreCanvas.propTypes = {
  inlet_temp: PropTypes.number,
  outlet_temp: PropTypes.number,
  rod_position: PropTypes.number,
  flux: PropTypes.number,
  valueFontFamily: PropTypes.string,
  labelFontFamily: PropTypes.string,
  ripples: PropTypes.array,
}

CoreCanvas.defaultProps = {
  inlet_temp: 0,
  outlet_temp: 0,
  rod_position: 0,
  flux: 0,
  valueFontFamily: "lucidaconsole",
  labelFontFamily: "robotoslabregular",
  ripples: [],
};

// export default withSize({ refreshMode: "debounce", monitorHeight: true, monitorWidth: true })(withTheme(CoreCanvas));
export default CoreCanvas;
// export default withTheme(CoreCanvas);

// Method	Parameters	Description
// pause	none	Pause the simulation.
// play	none	Play the simulation.
// hide	none	Hide the effect.
// show	none	Show the effect.
// drop	{x: number, y: number, radius: number, strength: number}	Manually add a drop at the element's relative coordinates (x, y). radius controls the drop's size and strength the amplitude of the resulting ripple.
// destroy	none	Remove the effect from the element.
// set	{ property: string, value }	property should be one of:
// - dropRadius
// - perturbance
// - interactive
// - imageUrl: setting the image URL will update the background image used for the effect, but the background-image CSS property will be untouched.
// - dropRadius: setting this won't have any effect until imageUrl is changed.
// updateSize	none	The effect resizes automatically when the width or height of the window changes. When the dimensions of the element changes, you need to call updateSize to update the size of the effect accordingly.
