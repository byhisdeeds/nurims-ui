import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_SSC_RECORDS_PDF,
} from "../../utils/constants";
import {Box, Button, Grid, Stack} from "@mui/material";
import PdfViewer from "../../components/PdfViewer";
import PropTypes from "prop-types";
import {withTheme} from "@mui/styles";
import {SwitchComponent, TitleComponent} from "../../components/CommonComponents";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";

export const VIEWSSCRECORDS_REF = "ViewSSCRecords";

class ViewSSCRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: BLANK_PDF,
      include_archived: "false",
    };
    this.Module = VIEWSSCRECORDS_REF;
  }

  generateSSCReportPdf = () => {
    this.props.send({
      cmd: CMD_GENERATE_SSC_RECORDS_PDF,
      module: this.Module,
      "include.withdrawn": this.state.include_archived,
    });
  }

  includeArchived = (e) => {
    this.setState({ include_archived: ""+e.target.checked })
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", this.Module, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd === CMD_GENERATE_SSC_RECORDS_PDF) {
          this.setState({ pdf: message.data.pdf });
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  render() {
    const { pdf, include_archived } = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <SwitchComponent
                id={"id"}
                label={"Include Archived SSC's"}
                onChange={this.includeArchived}
                value={include_archived}
              />
              <Box sx={{flexGrow: 1}} />
              <Button
                sx={{width: 300}}
                variant={"contained"}
                endIcon={<PictureAsPdfIcon />}
                onClick={this.generateSSCReportPdf}
              >
                Generate PDF
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <PdfViewer height={"800px"} source={ pdf } />
          </Grid>
        </Grid>
      </React.Fragment>
    );

  }
}

ViewSSCRecords.propTypes = {
  title: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  properties: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
};

ViewSSCRecords.defaultProps = {
  send: () => {},
  onClick: () => {},
};

export default withTheme(ViewSSCRecords);