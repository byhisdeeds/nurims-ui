import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_PERSONNEL_RECORDS_PDF,
} from "../../utils/constants";
import {Box, Button, Grid, Stack} from "@mui/material";
import {toast} from "react-toastify";
import PdfViewer from "../../components/PdfViewer";
import {withTheme} from "@mui/styles";
import {SwitchComponent, TitleComponent} from "../../components/CommonComponents";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export const PERSONNELDOSIMETRYREPORT_REF = "PersonnelDosimetryReport";

class PersonnelDosimetryReport extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      pdf: BLANK_PDF,
      include_archived: "false",
    };
    this.Module = PERSONNELDOSIMETRYREPORT_REF;
  }

  generateSSCPersonnelPdf = () => {
    console.log("@@@@@@@@@@@@@@@@@@@@")
    console.log(this.state.include_archived)
    console.log("@@@@@@@@@@@@@@@@@@@@")
    this.props.send({
      cmd: CMD_GENERATE_PERSONNEL_RECORDS_PDF,
      module: this.Module,
      "include.withdrawn": this.state.include_archived,
    });
  }

  includeArchived = (e) => {
    this.setState({ include_archived: ""+e.target.checked })
  }

  ws_message = (message) => {
    if (this.context.debug) {
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
    const { pdf, include_archived} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "include_archived", include_archived, "pdf", pdf);
    }
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
                label={"Include Archived Personnel"}
                onChange={this.includeArchived}
                value={include_archived}
              />
              <Box sx={{flexGrow: 1}} />
              <Button
                sx={{width: 300}}
                variant={"contained"}
                endIcon={<PictureAsPdfIcon />}
                onClick={this.generateSSCPersonnelPdf}
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

PersonnelDosimetryReport.defaultProps = {
};

export default withTheme(PersonnelDosimetryReport);