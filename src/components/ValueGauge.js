import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";
import {withTheme} from "@mui/styles";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

class ValueGauge extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
    };
    this.Module = "ValueGauge";
  }

  render() {
    const {
      theme,
      label,
      labelColor,
      labelFontSize,
      labelFontFamily,
      value,
      valueColor,
      valueFontSize,
      valueFontFamily,
      valuePaddingChar,
      valueDigitsWidth,
      valuePrecision,
      border,
      x,
      y,
      width,
      height,
      backgroundColor,
      zIndex
    } = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render");
    }
    return (
      <Box style={{
        border: border || "none",
        borderRadius: "5px",
        width: width,
        height: height,
        position: "absolute",
        top: y,
        left: x,
        paddingTop: 10,
        backgroundColor: backgroundColor || theme.palette.text.secondary,
        zIndex: zIndex,
      }}>
        <Typography
          variant="h6"
          component="div"
          align={"left"}
          style={{
            textAlign: "center",
            lineHeight: "1.2em",
            color: valueColor || theme.palette.primary.contrastText,
            fontSize: valueFontSize || theme.typography.fontSize,
            fontFamily: valueFontFamily,
          }}
        >
          {value.toFixed(valuePrecision).padStart(valueDigitsWidth, valuePaddingChar)}
        </Typography>
        <Typography
          variant="h6"
          component="div"
          align={"left"}
          style={{
            textAlign: "center",
            lineHeight: "1.2em",
            color: labelColor || theme.palette.primary.contrastText,
            fontSize: labelFontSize || theme.typography.fontSize,
            fontFamily: labelFontFamily,
          }}
        >
          {label}
        </Typography>
      </Box>
    );
  }
}

ValueGauge.propTypes = {
  labelColor: PropTypes.string,
  valueColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.number,
  units: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  labelXPosition: PropTypes.number,
  labelYPosition: PropTypes.number,
  labelFontSize: PropTypes.string,
  labelFontFamily: PropTypes.string,
  valueXPosition: PropTypes.number,
  valueYPosition: PropTypes.number,
  valueFontSize: PropTypes.string,
  valuePaddingChar: PropTypes.string,
  border: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  fontSize: PropTypes.string,
  valueFontFamily: PropTypes.string,
  valueDigitsWidth: PropTypes.number,
  valuePrecision: PropTypes.number,
  zIndex: PropTypes.number,
}

ValueGauge.defaultProps = {
  label: "",
  value: "",
  units: "",
  x: 0,
  y: 0,
  labelFontSize: "1em",
  labelFontFamily: "lucidaconsole",
  labelXPosition: 0,
  labelYPosition: 0,
  valueFontFamily: "lucidaconsole",
  valueXPosition: 0,
  valueYPosition: 0,
  valuePaddingChar: " ",
  width: 1,
  height: 1,
  valueDigitsWidth: 5,
  valuePrecision: 2,
  zIndex: 2,
};

export default withTheme(ValueGauge);