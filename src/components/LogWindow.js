import React, {Component} from "react";
import PropTypes from "prop-types";
import {darkTheme, lightTheme} from "../utils/Theme";
import {Drawer} from "@mui/material";

class LogWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
    this.Module = "LogWindow";
  }

  render() {
    const {visible, onClose, width} = this.props;
    return (
      <Drawer
        variant="temporary"
        anchor={"bottom"}
        open={visible}
        onClose={onClose}
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { boxSizing: 'border-box', backgroundColor: 'inherit', backgroundImage: 'inherit' },
        }}
      >
        <div
          style={{
            backgroundColor: theme === 'light' ? darkTheme.palette.primary.light : lightTheme.palette.primary.light,
            color: theme === 'light' ? darkTheme.palette.primary.contrastText : lightTheme.palette.primary.contrastText,
            padding: "0 20px",
            height: 200,
            marginLeft: 'auto',
            width: `calc(100vw - ${width})`
          }}
        >
          ddd d d d  d d d
        </div>
      </Drawer>
    )
  }
}

LogWindow.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  width: PropTypes.string,
}

LogWindow.defaultProps = {
  onClose: () => {},
  width: '100%',
}

export default LogWindow
