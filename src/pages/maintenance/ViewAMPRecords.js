import React, {Component} from 'react';
import {
  BLANK_PDF,
} from "../../utils/constants";
import {Grid, Typography} from "@mui/material";
import PdfViewer from "../../components/PdfViewer";
import PropTypes from "prop-types";
import {TitleComponent} from "../../components/CommonComponents";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";

const MODULE = "ViewAMPRecords";

class ViewAMPRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: BLANK_PDF,
    };
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GENERATE_AMP_RECORDS_PDF,
      module: MODULE,
    });
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd === CMD_GENERATE_AMP_RECORDS_PDF) {
          this.setState({ pdf: message.data.pdf });
        }
      } else {
        enqueueErrorSnackbar(response.message);
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

ViewAMPRecords.propTypes = {
  title: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  properties: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
};

ViewAMPRecords.defaultProps = {
  send: () => {},
  onClick: () => {},
};

export default ViewAMPRecords;