import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CoreCanvas from "./CoreCanvas";
import {
  MESSAGE_CONTROL_ROD_POSITION,
  MESSAGE_INLET_TEMPERATURE,
  MESSAGE_NEUTRON_FLUX,
  MESSAGE_OUTLET_TEMPERATURE
} from "../utils/constants";
import {scaleFontSize} from "../utils/Helpers";
import {withTheme} from "@mui/styles";

const operating_sign_on = {
  fontFamily: 'SanFrancisco',
  fontWeight: "bold",
  backgroundColor: "#d30101",
  borderRadius: ".2em",
  borderStyle: "solid",
  margin: "0 2em",
  borderColor: "#d30101",
  boxShadow: "0 0 20px rgba(211,211,211,.6), inset 0 0 10px rgba(211,211,211,.4), 0 2px 0 #000",
}

const operating_sign_off = {
  fontFamily: 'SanFrancisco',
  fontWeight: "bold",
  margin: "0 2em",
  color: "#d2d2d2",
}

class CoreCard extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      width: 1,
      inlet_temp: 0,
      inlet_temp_units: "",
      outlet_temp: 0,
      outlet_temp_units: "",
      rod_position: 0,
      rod_position_units: "",
      flux: 0,
      flux_units: "",
    };
    this.Module = "CoreCard";
    this.canvasRef = React.createRef();
  }

  updateWindowSize = () => {
    this.setState({ width: window.innerWidth });
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWindowSize);
    this.updateWindowSize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowSize);
  }

  ws_message = (message) => {
    const newStateObject = {};
    for (const m of message) {
      if (m.hasOwnProperty("id") && m.id === MESSAGE_INLET_TEMPERATURE) {
        newStateObject["inlet_temp"] = m.value;
        newStateObject["inlet_temp_units"] = m.units;
      } else if (m.hasOwnProperty("id") && m.id === MESSAGE_OUTLET_TEMPERATURE) {
        newStateObject["outlet_temp"] = m.value;
        newStateObject["outlet_temp_units"] = m.units;
      } else if (m.hasOwnProperty("id") && m.id === MESSAGE_CONTROL_ROD_POSITION) {
        newStateObject["rod_position"] = m.value;
        newStateObject["rod_position_units"] = m.units;
      } else if (m.hasOwnProperty("id") && m.id === MESSAGE_NEUTRON_FLUX) {
        newStateObject["flux"] = m.value;
        newStateObject["flux_units"] = m.units;
      }
    }
    this.setState( newStateObject );
  }

  render() {
    const { theme } = this.props;
    const { inlet_temp, inlet_temp_units, outlet_temp, outlet_temp_units, rod_position, rod_position_units,
      flux, flux_units, width } = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "width", width, "inlet_temp", inlet_temp, "inlet_temp_units",
        inlet_temp_units, "outlet_temp_units", outlet_temp_units, "rod_position", rod_position,
        "rod_position_units", rod_position_units, "flux", flux, "flux_units", flux_units);
    }
    return (
      <Card>
        <CardContent>
          <Typography
            component="div"
            align={"center"}
            style={rod_position > 0 ?
              {...operating_sign_on, fontSize: scaleFontSize(width/1920, "4em")} :
              {...operating_sign_off, fontSize: scaleFontSize(width/1600, "4em")}
            }
          >
            SLOWPOKE
          </Typography>
          <CoreCanvas
              theme={theme}
            inlet_temp={inlet_temp}
            outlet_temp={outlet_temp}
            rod_position={rod_position}
            flux={flux}
          />
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(CoreCard);