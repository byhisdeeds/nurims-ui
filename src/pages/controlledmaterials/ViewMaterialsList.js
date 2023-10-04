import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_CONTROLLED_MATERIALS_LIST_PDF,
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from "@mui/material/IconButton";
import {withTheme} from "@mui/styles";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {TitleComponent} from "../../components/CommonComponents";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";

export const VIEWMATERIALSLIST_REF = "ViewMaterialsList";

class ViewMaterialsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: BLANK_PDF,
      access: 'restricted',
    };
    this.Module = VIEWMATERIALSLIST_REF;
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", this.Module, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GENERATE_CONTROLLED_MATERIALS_LIST_PDF)) {
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
      cmd: CMD_GENERATE_CONTROLLED_MATERIALS_LIST_PDF,
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

ViewMaterialsList.defaultProps = {
};

export default withTheme(ViewMaterialsList);