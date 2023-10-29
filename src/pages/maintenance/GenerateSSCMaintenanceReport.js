import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_GENERATE_SSC_MAINTENANCE_REPORT_PDF,
} from "../../utils/constants";
import {
  Button,
  Grid,
  Stack,
} from "@mui/material";
import PdfViewer from "../../components/PdfViewer";
import {withTheme} from "@mui/styles";
import {
  isCommandResponse,
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  SameYearDateRangePicker,
  SelectFormControlWithTooltip,
  TitleComponent
} from "../../components/CommonComponents";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {ConsoleLog} from "../../utils/UserContext";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";
import dayjs from 'dayjs';

export const GENERATESSCMAINTENANCEREPORT_REF = "GenerateSSCMaintenanceReport";

class GenerateSSCMaintenanceReport extends Component {
  constructor(props) {
    super(props);
    const currentYear = dayjs().year();
    this.state = {
      pdf: BLANK_PDF,
      startDate: dayjs(`${currentYear}-01-01`),
      endDate: dayjs(`${currentYear}-12-01`),
      year: dayjs(`${currentYear}-01-01`),
      reportType: "summary",
    };
    this.Module = GENERATESSCMAINTENANCEREPORT_REF;
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", this.Module, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_GENERATE_SSC_MAINTENANCE_REPORT_PDF)) {
          this.setState({ pdf: message.data.pdf });
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  handleChange = (e) => {
    this.setState({ reportType: e.target.value });
  }

  handleToDateRangeChange = (range) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleToDateRangeChange", range);
    }
    this.setState({endDate: range});
  }

  handleFromDateRangeChange = (range) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleFromDateRangeChange", range);
    }
    this.setState({startDate: range});
  }

  handleYearDateRangeChange = (range) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleYearDateRangeChange", range);
    }
    this.setState({year: range});
  }

  onGenerateMaintenanceReportPdf = () => {
    this.props.send({
      cmd: CMD_GENERATE_SSC_MAINTENANCE_REPORT_PDF,
      startDate: `${this.state.year.year()}-${String(this.state.startDate.month() + 1).padStart(2, "0")}`,
      endDate: `${this.state.year.year()}-${String(this.state.endDate.month() + 1).padStart(2, "0")}`,
      type: this.state.reportType,
      module: this.Module,
    });
  }

  render() {
    const {pdf, reportType, startDate, endDate, year,} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", this.state);
    }
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title}/>
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
                disabled={false}
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