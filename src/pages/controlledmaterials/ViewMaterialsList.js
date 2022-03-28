import React, {Component} from 'react';
import {
  BLANK_PDF, CMD_GENERATE_CONTROLLED_MATERIALS_LIST_PDF,
  CMD_GENERATE_PERSONNEL_RECORDS_PDF,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_MANUFACTURER_RECORDS, CMD_GET_MATERIAL_RECORDS,
  CMD_GET_STORAGE_RECORDS, CMD_SAVE_MATERIAL_RECORD, NURIMS_TITLE
} from "../../utils/constants";
import {Fab, FormControl, Grid, InputLabel, Select, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {toast} from "react-toastify";
import PdfViewer from "../../components/PdfViewer";
import MenuItem from "@mui/material/MenuItem";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from "@mui/material/IconButton";

const MODULE = "ViewMaterialsList";

class ViewMaterialsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      pdf: BLANK_PDF,
      access: 'restricted',
    };
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd === CMD_GENERATE_CONTROLLED_MATERIALS_LIST_PDF) {
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
      cmd: CMD_GENERATE_CONTROLLED_MATERIALS_LIST_PDF,
      access: this.state.access,
      module: MODULE,
    });
  }

  render() {
    const { title, pdf, access, } = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
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

ViewMaterialsList.defaultProps = {
};

export default ViewMaterialsList;