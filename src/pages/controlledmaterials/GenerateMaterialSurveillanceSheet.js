import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_CONTROLLED_MATERIALS_SURVEILLANCE_SHEET_PDF,
} from "../../utils/constants";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
} from "@mui/material";
import PdfViewer from "../../components/PdfViewer";
import MenuItem from "@mui/material/MenuItem";
import {
  withTheme
} from "@mui/styles";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {
  TitleComponent
} from "../../components/CommonComponents";
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export const GENERATEMATERIALSURVEILLANCESHEET_REF = "GenerateMaterialSurveillanceSheet";

class GenerateMaterialSurveillanceSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: BLANK_PDF,
      access: 'restricted',
    };
    this.Module = GENERATEMATERIALSURVEILLANCESHEET_REF;
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", this.Module, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GENERATE_CONTROLLED_MATERIALS_SURVEILLANCE_SHEET_PDF)) {
          this.setState({ pdf: message.data.pdf });
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  handleChange = (e) => {
    this.setState({ access: e.target.value });
  }

  onGenerateMaterialsListPdf = () => {
    this.props.send({
      cmd: CMD_GENERATE_CONTROLLED_MATERIALS_SURVEILLANCE_SHEET_PDF,
      access: this.state.access,
      module: this.Module,
    });
  }

  render() {
    const { pdf, access, } = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <FormControl fullWidth>
                <InputLabel id="report-access-select-label">Report Access</InputLabel>
                <Select
                  labelId="report-access-select-label"
                  id="report-access"
                  value={access}
                  label="Report Access"
                  onChange={this.handleChange}
                >
                  <MenuItem value={'restricted'}>Restricted Access</MenuItem>
                  <MenuItem value={'unrestricted'}>Unrestricted Access</MenuItem>
                </Select>
              </FormControl>
              <Button
                sx={{width: 300}}
                variant={"contained"}
                endIcon={<PictureAsPdfIcon />}
                onClick={this.onGenerateMaterialsListPdf}
              >
                Generate PDF
              </Button>
              {/*<IconButton onClick={this.onGenerateMaterialsListPdf}>*/}
              {/*  <FileDownloadIcon/>*/}
              {/*</IconButton>*/}
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

GenerateMaterialSurveillanceSheet.defaultProps = {
};

export default withTheme(GenerateMaterialSurveillanceSheet);