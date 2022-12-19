import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_SSC_MAINTENANCE_REPORT_PDF, NURIMS_SSC_MAINTENANCE_RECORD_PERSONNEL,
} from "../../utils/constants";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
} from "@mui/material";
import {toast} from "react-toastify";
import PdfViewer from "../../components/PdfViewer";
import MenuItem from "@mui/material/MenuItem";
import {withTheme} from "@mui/styles";
import {isCommandResponse, messageHasResponse, messageStatusOk} from "../../utils/WebsocketUtils";
import {SameYearDateRangePicker, SelectFormControlWithTooltip, TitleComponent} from "../../components/CommonComponents";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {ConsoleLog} from "../../utils/UserDebugContext";
import {getRecordMetadataValue} from "../../utils/MetadataUtils";
import {getGlossaryValue} from "../../utils/GlossaryUtils";


export const GENERATESSCMAINTENANCEREPORT_REF = "GenerateSSCMaintenanceReport";

class GenerateSSCMaintenanceReport extends Component {
  constructor(props) {
    super(props);
    const currentYear = new Date().getFullYear();
    this.state = {
      pdf: BLANK_PDF,
      startDate: new Date(`January 1, ${currentYear}`),
      endDate: new Date(`December 1, ${currentYear}`),
      year: new Date(`January 1, ${currentYear}`),
      reportType: "summary",
    };
    this.Module = GENERATESSCMAINTENANCEREPORT_REF;
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", this.Module, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GENERATE_SSC_MAINTENANCE_REPORT_PDF)) {
          this.setState({ pdf: message.data.pdf });
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  handleChange = (e) => {
    this.setState({ reportType: e.target.value });
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

  onGenerateMaintenanceReportPdf = () => {
    this.props.send({
      cmd: CMD_GENERATE_SSC_MAINTENANCE_REPORT_PDF,
      startDate: `${this.state.year.getFullYear()}-${String(this.state.startDate.getMonth()+1).padStart(2, "0")}`,
      endDate: `${this.state.year.getFullYear()}-${String(this.state.endDate.getMonth()+1).padStart(2, "0")}`,
      type: this.state.reportType,
      module: this.Module,
    });
  }

  render() {
    const { pdf, reportType, startDate, endDate, year, } = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
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
              <SelectFormControlWithTooltip
                id={"report-type"}
                label="Report Type"
                required={true}
                value={reportType}
                onChange={this.handleChange}
                options={[
                  {id:"summary", title: "Summary Report"},
                  {id:"detailed", title: "Detailed Report"},
                  ]}
                tooltip={"report type"}
              />
              <Button
                sx={{width: 300}}
                variant={"contained"}
                endIcon={<PictureAsPdfIcon />}
                onClick={this.onGenerateMaintenanceReportPdf}
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

GenerateSSCMaintenanceReport.defaultProps = {
};

export default withTheme(GenerateSSCMaintenanceReport);