import React, {Component} from 'react';
import {enqueueErrorSnackbar} from "../utils/SnackbarVariants";


const MODULE = "Template";

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }
  render() {
    return <h2>Hi, I am a Car!</h2>;
  }
}

Template.defaultProps = {
};

export default Template;