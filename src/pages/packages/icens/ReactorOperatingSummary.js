import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_REACTOR_OPERATING_SUMMARY_PDF,
} from "../../../utils/constants";
import {
  Fab,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
  Typography
} from "@mui/material";
import {toast} from "react-toastify";
import PdfViewer from "../../../components/PdfViewer";
import MenuItem from "@mui/material/MenuItem";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from "@mui/material/IconButton";
import {withTheme} from "@mui/styles";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../../utils/WebsocketUtils";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Box from "@mui/material/Box";
import {
  getDateRangeFromDateString,
  getDoseRecordDosimeterId,
  getDoseRecordMetadataValue, setDoseRecordMetadataValue
} from "../../../utils/MetadataUtils";
import TextField from "@mui/material/TextField";
import {SameYearDateRangePicker} from "../../../components/CommonComponents";
import {ConsoleLog, UserDebugContext} from "../../../utils/UserDebugContext";
import AddIcon from "@mui/icons-material/Add";

class ReactorOperatingSummary extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      pdf: BLANK_PDF,
      access: 'restricted',
      startDate: null,
      endDate: null,
      year: null,
    };
    this.Module = "ReactorOperatingSummary";
  }

  ws_message = (message) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "ws_message", message);
    }
    console.log("ON_WS_MESSAGE", this.Module, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GENERATE_REACTOR_OPERATING_SUMMARY_PDF)) {
          if (response.message !== "") {
            toast.info(response.message);
          }
          // this.setState({pdf: message.data.pdf});
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  handleChange = (e) => {
    this.setState({access: e.target.value});
  }

  onSubmit = () => {
    this.props.send({
      cmd: CMD_GENERATE_REACTOR_OPERATING_SUMMARY_PDF,
      startDate: `${this.state.year.getFullYear()}-${String(this.state.startDate.getMonth()+1).padStart(2, "0")}`,
      endDate: `${this.state.year.getFullYear()}-${String(this.state.endDate.getMonth()+1).padStart(2, "0")}`,
      module: this.Module,
    });
  }

  handleToDateRangeChange = (range) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "handleToDateRangeChange", range);
    }
    this.setState({endDate: range});
  }

  handleFromDateRangeChange = (range) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "handleFromDateRangeChange", range);
    }
    this.setState({startDate: range});
  }

  handleYearDateRangeChange = (range) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "handleYearDateRangeChange", range);
    }
    this.setState({year: range});
  }

  render() {
    const {title, pdf, year, startDate, endDate} = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <SameYearDateRangePicker
                startText="Start Date"
                endText="End Date"
                from={startDate}
                to={endDate}
                year={year}
                disabled={false}
                onYearChange={this.handleYearDateRangeChange}
                onToChange={this.handleToDateRangeChange}
                onFromChange={this.handleFromDateRangeChange}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField {...startProps}/>
                    <Box sx={{mx: 1}}>to</Box>
                    <TextField {...endProps}/>
                  </React.Fragment>
                )}
              />
              <div style={{flexGrow: 1}}/>
              <Fab variant="extended" size="medium" color="primary" aria-label="submit" onClick={this.onSubmit}
                   style={{marginTop: 16}}>
                <AddIcon sx={{mr: 1}}/>
                Generate Report
              </Fab>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <PdfViewer height={"800px"} source={pdf}/>
          </Grid>
        </Grid>
      </React.Fragment>
    );

  }
}

ReactorOperatingSummary.defaultProps = {};

export default withTheme(ReactorOperatingSummary);