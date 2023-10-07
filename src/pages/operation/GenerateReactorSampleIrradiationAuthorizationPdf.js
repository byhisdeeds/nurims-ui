
import React, {Component} from 'react';
import {
  ConsoleLog,
  UserDebugContext
} from "../../utils/UserDebugContext";
import {
  BLANK_PDF,
  CMD_GENERATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_PDF,
  REACTOR_IRRADIATION_AUTHORIZATION_TOPIC,
} from "../../utils/constants";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
  MenuItem,
} from "@mui/material";
import {
  PictureAsPdf,
} from "@mui/icons-material";
import {
  DateRangePicker,
  TitleComponent
} from "../../components/CommonComponents";
import PropTypes from "prop-types";
import {withTheme} from "@mui/styles";
import dayjs from 'dayjs';
import PdfViewer from "../../components/PdfViewer";
import {isCommandResponse, messageHasResponse, messageStatusOk} from "../../utils/WebsocketUtils";
import {enqueueErrorSnackbar, enqueueInfoSnackbar} from "../../utils/SnackbarVariants";

export const GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF =
  "GenerateReactorSampleIrradiationAuthorizationPdf";

class GenerateReactorSampleIrradiationAuthorizationPdf extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      pdf: BLANK_PDF,
      startDate: dayjs(),
      endDate: dayjs().add(1, "month"),
      reportType: "reactor_sample_irradiation_authorization",
    };
    this.Module = GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF;
    this.recordTopic = REACTOR_IRRADIATION_AUTHORIZATION_TOPIC;
  }

  componentDidMount() {
  }

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GENERATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_PDF)) {
          if (response.message !== "") {
            enqueueInfoSnackbar(response.message);
          }
          if (message.hasOwnProperty("data") && message.data.hasOwnProperty("pdf")) {
            this.setState({pdf: message.data.pdf});
          }
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  handleReportTypeChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleReportTypeChange", e.target.value);
    }
    this.setState({reportType: e.target.value});
  }

  handleToDateChange = (date) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleToDateChange", date);
    }
    this.setState({endDate: date});
  }

  handleFromDateChange = (date) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleFromDateChange", date);
    }
    this.setState({startDate: date});
  }

  submit = () => {
    this.props.send({
      cmd: CMD_GENERATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_PDF,
      startDate: this.state.startDate.toISOString(),
      endDate: this.state.endDate.toISOString(),
      reportType: this.state.reportType,
      module: this.Module,
    });
  }

  render() {
    const {pdf, reportType, startDate, endDate} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "startDate", startDate, "endDate", endDate);
    }
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <FormControl style={{paddingRight: 16, marginTop: 8,}} variant="outlined">
                <InputLabel id="report-type-select-label">Authorization Type</InputLabel>
                <Select
                  fullWidth
                  labelId="report-type-select-label"
                  id="report-type"
                  value={reportType}
                  label="Authorization Type"
                  onChange={this.handleReportTypeChange}
                >
                  <MenuItem value={'reactor_sample_irradiation_authorization'}>Reactor Sample Irradiation Authorizations</MenuItem>
                </Select>
              </FormControl>
              <DateRangePicker
                fromLabel="Records From"
                toLabel="Records To"
                from={startDate}
                to={endDate}
                disabled={false}
                onFromChange={this.handleFromDateChange}
                onToChange={this.handleToDateChange}
              />
              <div style={{flexGrow: 1}}/>
              <Button
                variant={"contained"}
                endIcon={<PictureAsPdf />}
                onClick={this.submit}
                size={"small"}
                color={"primary"}
                aria-label={"generate"}
              >
                Generate Pdf
              </Button>
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

GenerateReactorSampleIrradiationAuthorizationPdf.defaultProps = {
  send: (msg) => {},
};

GenerateReactorSampleIrradiationAuthorizationPdf.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default withTheme(GenerateReactorSampleIrradiationAuthorizationPdf);