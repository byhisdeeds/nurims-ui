import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_PERSONNEL_RECORDS_PDF,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_MANUFACTURER_RECORDS, CMD_GET_MATERIAL_RECORDS,
  CMD_GET_STORAGE_RECORDS, CMD_SAVE_MATERIAL_RECORD, NURIMS_TITLE
} from "../../utils/constants";
import {Fab, Grid, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import {toast} from "react-toastify";
import PdfViewer from "../../components/PdfViewer";
import {withTheme} from "@mui/styles";

const MODULE = "ViewPersonnelRecords";

class ViewPersonnelRecords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      pdf: BLANK_PDF,
    };
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GENERATE_PERSONNEL_RECORDS_PDF,
      module: MODULE,
    });
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
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
            <Typography variant="h5" component="div">{title}</Typography>
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