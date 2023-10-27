import React, {Component} from 'react';
import {
  BLANK_PDF,
  CMD_DELETE_REACTOR_OPERATING_REPORT_RECORD,
  CMD_GENERATE_REACTOR_OPERATION_REPORT_PDF,
  CMD_GET_PROVENANCE_RECORDS, CMD_GET_REACTOR_OPERATING_REPORT_RECORDS,
  ITEM_ID,
  NURIMS_OPERATION_REPORT,
  OPERATION_TOPIC,
} from "../../utils/constants";
import {
  Box,
  Fab,
  Grid,
  Typography
} from "@mui/material";
import PdfViewer from "../../components/PdfViewer";
import {withTheme} from "@mui/styles";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  enqueueErrorSnackbar,
  enqueueInfoSnackbar, enqueueSuccessSnackbar
} from "../../utils/SnackbarVariants";
import dayjs from 'dayjs';
import {
  ConfirmGenerateReactorOperationReportDialog,
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
// import OperatingRunReportsList from "./OperatingReportsList";
// import BaseRecordManager from "../../components/BaseRecordManager";
// import {e} from "caniuse-lite/data/browserVersions";
// import {title} from "process";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import SaveIcon from "@mui/icons-material/Save";
import {
  isValidUserRole
} from "../../utils/UserUtils";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";
import OperatingReportsList from "./OperatingReportsList";
import {getRecordMetadataValue} from "../../utils/MetadataUtils";

export const REACTOROPERATIONSREPORT_REF = "ReactorOperationsReport";

class ReactorOperationsReport extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    // const currentYear = new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    this.state = {
      title: props.title,
      pdf: BLANK_PDF,
      startDate: dayjs(`${currentYear}-01-01`),
      endDate: dayjs(`${currentYear}-12-01`),
      year: dayjs(`${currentYear}-01-01`),
      reportType: "summary",
      confirm_generate_report: false,
      confirm_remove: false,
      selection: {},
      show_provenance_view: false,
    };
    this.Module = REACTOROPERATIONSREPORT_REF;
    this.listRef = React.createRef();
    this.recordTopic = OPERATION_TOPIC;
    this.provenanceRecords = [];
  }

  componentDidMount() {
    this.requestGetRecords(false, true);
  }

  requestGetRecords = (include_archived, include_metadata) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    this.props.send({
      cmd: CMD_GET_REACTOR_OPERATING_REPORT_RECORDS,
      "include.disabled": include_archived ? "true" : "false",
      "include.metadata": include_metadata ? "true" : "false",
      module: this.Module,
    })
    this.setState({include_archived: include_archived});
  }

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (message.cmd === CMD_GET_PROVENANCE_RECORDS) {
          this.setProvenanceRecords(response.provenance)
        } else if (isCommandResponse(message, CMD_GENERATE_REACTOR_OPERATION_REPORT_PDF)) {
          if (response.message !== "") {
            enqueueInfoSnackbar(response.message);
          }
          this.requestGetRecords(false, true);
        } else if (isCommandResponse(message, CMD_GET_REACTOR_OPERATING_REPORT_RECORDS)) {
          if (this.listRef.current) {
            // this.listRef.current.setRecords(response[this.recordTopic], false);
            if (message.hasOwnProperty("append.records")) {
              this.listRef.current.addRecords(response["operation"], false);
            } else {
              this.listRef.current.setRecords(response["operation"]);
            }
          }
        } else if (isCommandResponse(message, CMD_DELETE_REACTOR_OPERATING_REPORT_RECORD)) {
          enqueueSuccessSnackbar(`Record (id: ${response.item_id}) deleted successfully`)
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          this.setState({selection: {}, pdf: BLANK_PDF})
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  isSelectableByRoles = (selection, roles, valid_item_id) => {
    for (const r of roles) {
      if (isValidUserRole(this.context.user, r)) {
        // We have at least one match, now we check for a valid item_id boolean parameter has been specified
        if (valid_item_id) {
          return selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1;
        }
        return true;
      }
    }
    return false;
  }

  generateReport = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "generateReport");
    }
    this.setState({confirm_generate_report: true,});
  }

  cancelReportGeneration = () => {
    this.setState({confirm_generate_report: false,});
  }

  proceedWithReportGeneration = (year, startMonth, endMonth, reportType, forceOverwrite) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithReportGeneration", "year", year, "startMonth", startMonth,
        "endMonth", endMonth, "reportType", reportType, "forceOverwrite", forceOverwrite);
    }
    this.setState({confirm_generate_report: false,});

    this.props.send({
      cmd: CMD_GENERATE_REACTOR_OPERATION_REPORT_PDF,
      startDate: `${year.year()}-${String(startMonth.month() + 1).padStart(2, "0")}`,
      endDate: `${year.year()}-${String(endMonth.month() + 1).padStart(2, "0")}`,
      reportType: reportType,
      forceOverwrite: forceOverwrite,
      "run_in_background": "true",
      module: this.Module,
    });
  }

  onRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
    }
    if (selection.hasOwnProperty("item_id") && selection.item_id !== -1) {
      const report = getRecordMetadataValue(selection, NURIMS_OPERATION_REPORT, "");
      this.setState({selection: selection, pdf: report.length === "" ? BLANK_PDF : "/nubs/" + report["uri"]});
    }
  }

  removeRecord = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "removeRecord", "selection", this.state.selection);
    }
    this.setState({confirm_remove: true,});
  }

  cancelRemove = () => {
    this.setState({confirm_remove: false,});
  }

  proceedWithRemove = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithRemove", "selection", this.state.selection);
    }
    this.setState({confirm_remove: false,});
    this.props.send({
      cmd: CMD_DELETE_REACTOR_OPERATING_REPORT_RECORD,
      item_id: this.state.selection.item_id,
      module: this.Module,
    });
  }

  setProvenanceRecords = (provenance) => {
    setProvenanceRecordsHelper(this, provenance);
  }

  showProvenanceRecordsView = () => {
    showProvenanceRecordsViewHelper(this);
  }

  closeProvenanceRecordsView = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    this.setState({show_provenance_view: false,});
  }

  render() {
    const {
      title,
      pdf,
      confirm_remove,
      selection,
      include_archived,
      confirm_batch_remove,
      batch_selection,
      confirm_generate_report,
      show_provenance_view
    } = this.state;
    const {user} = this.props;
    const isSysadmin = isValidUserRole(user, "sysadmin");
    ConsoleLog(this.Module, "render", this.state);
    if (this.context.debug) {
      ConsoleLog(this.Module, "render","confirm_removed", confirm_remove, "include_archived",
        include_archived, "selection", selection, "confirm_batch_remove", confirm_batch_remove, "batch_selection",
        batch_selection);
    }
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <ConfirmGenerateReactorOperationReportDialog open={confirm_generate_report}
                                                     onProceed={this.proceedWithReportGeneration}
                                                     onCancel={this.cancelReportGeneration}
        />
        <ShowProvenanceRecordsDialog open={show_provenance_view}
                                     selection={selection}
                                     body={this.provenanceRecords.join("\n")}
                                     onCancel={this.closeProvenanceRecordsView}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={4}>
            <OperatingReportsList
              ref={this.listRef}
              title={"Reactor Operation Reports"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={8}>
            <PdfViewer height={"700px"} source={pdf}/>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
              <Fab
                variant="extended"
                size="small"
                color="primary"
                aria-label="remove"
                onClick={this.removeRecord}
                disabled={!this.isSelectableByRoles(selection, ["sysadmin"], true)}
              >
                <RemoveCircleIcon/>
                {" Remove Report "}
              </Fab>
              {isSysadmin &&
                <Fab
                  variant="extended"
                  size="small"
                  color="primary"
                  aria-label="view-provenance"
                  onClick={this.showProvenanceRecordsView}
                  disabled={!selection.hasOwnProperty("item_id")}
                >
                  <VisibilityIcon sx={{mr: 1}}/>
                  {" View Provenance Records "}
                </Fab>
              }
              <Fab
                variant="extended"
                size="small"
                color="primary"
                aria-label="generate-report"
                onClick={this.generateReport}
                disabled={false}
              >
                <PictureAsPdfIcon/>
                {" Generate Report "}
              </Fab>
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );

  }
}

ReactorOperationsReport.defaultProps = {

};

export default withTheme(ReactorOperationsReport);