import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";
import Grid from "@mui/material/Grid";
import {
  TitleComponent
} from "./CommonComponents";

export const UNDERDEVELOPMENT_REF = "UnderDevelopment";

class UnderDevelopment extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
    };
    this.Module = UNDERDEVELOPMENT_REF;
  }

  render() {
    if (this.context.debug) {
      ConsoleLog(this.Module, "render");
    }
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12}>
            Under development
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

UnderDevelopment.defaultProps = {
  send: (msg) => {},
};

export default UnderDevelopment;