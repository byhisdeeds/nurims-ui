import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_PERSONNEL_RECORDS_PDF,
} from "../../utils/constants";
import {Grid} from "@mui/material";
import {toast} from "react-toastify";
import PdfViewer from "../../components/PdfViewer";
import {withTheme} from "@mui/styles";
import {TitleComponent} from "../../components/CommonComponents";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";

export const VIEWPERSONNELRECORDS_REF = "ViewPersonnelRecords";

class ViewPersonnelRecords extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      pdf: BLANK_PDF,
    };
    this.Module = VIEWPERSONNELRECORDS_REF;
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GENERATE_PERSONNEL_RECORDS_PDF,
      module: this.Module,
    });
  }

  ws_message = (message) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd === CMD_GENERATE_PERSONNEL_RECORDS_PDF) {
          this.setState({ pdf: message.data.pdf });
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  render() {
    const { title, pdf, } = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12}>
            <PdfViewer height={"800px"} source={ pdf } />
          </Grid>
        </Grid>
      </React.Fragment>
    );

  }
}

ViewPersonnelRecords.defaultProps = {
};

export default withTheme(ViewPersonnelRecords);