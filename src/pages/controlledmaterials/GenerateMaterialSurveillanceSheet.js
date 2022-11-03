import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_CONTROLLED_MATERIALS_SURVEILLANCE_SHEET_PDF,
} from "../../utils/constants";
import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
  Typography
} from "@mui/material";
import {toast} from "react-toastify";
import PdfViewer from "../../components/PdfViewer";
import MenuItem from "@mui/material/MenuItem";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from "@mui/material/IconButton";
import {withTheme} from "@mui/styles";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {TitleComponent} from "../../components/CommonComponents";

const MODULE = "GenerateMaterialSurveillanceSheet";

class GenerateMaterialSurveillanceSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: BLANK_PDF,
      access: 'restricted',
    };
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GENERATE_CONTROLLED_MATERIALS_SURVEILLANCE_SHEET_PDF)) {
          this.setState({ pdf: message.data.pdf });
        }
      } else {
        toast.error(response.message);
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
      module: MODULE,
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
              <IconButton onClick={this.onGenerateMaterialsListPdf}>
                <FileDownloadIcon/>
              </IconButton>
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