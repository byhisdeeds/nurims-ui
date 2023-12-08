import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  ConfirmOperatingRunDataExportDialog,
  ConfirmDataDiscoveryDialog, ConfirmOperatingRunStatisticsExportDialog,
  ConfirmRemoveRecordDialog
} from "../../components/UtilityDialogs";
import {
  BOOL_FALSE_STR,
  BOOL_TRUE_STR,
  CMD_DELETE_USER_RECORD,
  CMD_DISCOVER_REACTOR_OPERATION_RUNS,
  CMD_DISCOVER_ROUTINE_MAINTENANCE_DATA,
  CMD_EXPORT_REACTOR_OPERATION_RUNS_DATA,
  CMD_GET_ROUTINE_MAINTENANCE_RECORDS,
  ITEM_ID,
  METADATA,
  NURIMS_OPERATION_DATA_CONTROLRODPOSITION,
  NURIMS_OPERATION_DATA_NEUTRONFLUX,
  NURIMS_OPERATION_DATA_STATS, NURIMS_SSC_ROUTINE_MAINTENANCE_DATA_STATS,
  NURIMS_WITHDRAWN,
  ROLE_REACTOR_OPERATIONS_DATA_EXPORT, SSC_TOPIC
} from "../../utils/constants";
import {
  Box,
  Fab,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  ArchiveRecordLabel
} from "../../utils/RenderUtils";
import RoutineMaintenanceList from "./RoutineMaintenanceList";
import RoutineMaintenanceMetadata from "./RoutineMaintenanceMetadata";
import {
  TitleComponent
} from "../../components/CommonComponents";
import {
  enqueueErrorSnackbar,
  enqueueSuccessSnackbar,
  enqueueWarningSnackbar
} from "../../utils/SnackbarVariants";
import {
  getRecordMetadataValue,
  isRecordEmpty,
  record_uuid
} from "../../utils/MetadataUtils";
import {isValidUserRole} from "../../utils/UserUtils";
import {prepareExportData} from "../../utils/OperationUtils";

export const ADDEDITROUTINEMAINTENANCERECORDS_REF = "AddEditRoutineMaintenanceRecords";

class AddEditRoutineMaintenanceRecords extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      confirm_export_data: false,
      confirm_export_statistics: false,
      confirm_discovery: false,
      selection: {},
      title: props.title,
      include_archived: false,
    };
    this.Module = ADDEDITROUTINEMAINTENANCERECORDS_REF;
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
  }

  componentDidMount() {
    this.requestGetRecords(this.state.include_archived);
  }

  isValidSelection = (selection) => {
    return (selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
  }

  changeRecordArchivalStatus = () => {
    console.log("changeRecordArchivalStatus - selection", this.state.selection)
    const selection = this.state.selection;
    if (selection.hasOwnProperty(NURIMS_WITHDRAWN)) {
      selection[NURIMS_WITHDRAWN] = selection[NURIMS_WITHDRAWN] === 0 ? 1 : 0;
      selection.changed = true;
      this.setState({selection: selection, metadata_changed: selection.changed});
    }
  }

  onRecordMetadataChanged = (state) => {
    this.setState({metadata_changed: state});
  }

  removeRecord = () => {
    console.log("REMOVE RECORD")
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
    if (this.state.selection.item_id === -1) {
      if (this.listRef.current) {
        this.listRef.current.removeRecord(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: this.recordCommand("delete"),
        item_id: this.state.selection.item_id,
        module: this.Module,
      });
    }
  }

  discoverOperatingRuns = () => {
    this.setState(pstate => {
      return {confirm_discovery: true}
    });
  }

  cancelDiscovery = () => {
    this.setState(pstate => {
      return {confirm_discovery: false}
    });
  }

  proceedWithDiscovery = (startYear, startMonth, endYear, endMonth, forceOverwrite) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithDiscovery", "startYear", startYear, "startMonth", startMonth,
        "endYear", endYear, "endMonth", endMonth, "forceOverwrite", forceOverwrite);
    }
    this.setState(pstate => {
      return {confirm_discovery: false}
    });

    this.props.send({
      cmd: CMD_DISCOVER_ROUTINE_MAINTENANCE_DATA,
      startYear: startYear.year(),
      endYear: endYear.year(),
      startMonth: startMonth.month() + 1,
      endMonth: endMonth.month() + 1,
      forceOverwrite: forceOverwrite,
      "run_in_background": "true",
      module: this.Module,
    });
  }

  exportOperatingRunStatistics = () => {
    this.setState({confirm_export_statistics: true,});
  }

  exportOperatingRunData = () => {
    this.setState({confirm_export_data: true,});
  }

  cancelExport = () => {
    this.setState({confirm_export_data: false, confirm_export_statistics: false});
  }

  proceedWithOperatingRunDataExport = (dataset, datasetFormat) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithOperatingRunDataExport", "dataset", dataset, "datasetFormat",
        datasetFormat);
    }
    this.setState({confirm_export_data: false,});

    const metadata =
      dataset === "rodevents" ? NURIMS_OPERATION_DATA_STATS :
        dataset === "neutronflux" ? NURIMS_OPERATION_DATA_NEUTRONFLUX :
          dataset === "controlrodposition" ? NURIMS_OPERATION_DATA_CONTROLRODPOSITION : null;
    if (metadata) {
      this.props.send({
        cmd: CMD_EXPORT_REACTOR_OPERATION_RUNS_DATA,
        "include.metadata": BOOL_TRUE_STR,
        "load.metadata.from.store": [metadata],
        // startDate: `${startYear.year()}-${String(startMonth.month() + 1).padStart(2, "0")}`,
        // endDate: `${endYear.year()}-${String(endMonth.month() + 1).padStart(2, "0")}`,
        "item_id": this.state.selection[ITEM_ID],
        dataset: dataset,
        datasetFormat: datasetFormat,
        module: this.Module,
        // cmd: CMD_EXPORT_REACTOR_OPERATION_RUNS_DATA,
        // year: year.year(),
        // startMonth: startMonth.month() + 1,
        // endMonth: endMonth.month() + 1,
        // forceOverwrite: forceOverwrite,
        // module: this.Module,
      });
    }
  }

  proceedWithOperatingRunStatisticsExport = (startYear, startMonth, endYear, endMonth, dataset, datasetFormat) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithOperatingRunStatisticsExport", "startYear", startYear,
        "startMonth", startMonth, "endYear", endYear, "endMonth", endMonth, "dataset", dataset,
        "datasetFormat", datasetFormat);
    }
    this.setState({confirm_export_data: false,});

    // const metadata =
    //   dataset === "stats" ? NURIMS_OPERATION_DATA_STATS :
    //     dataset === "neutronflux" ? NURIMS_OPERATION_DATA_NEUTRONFLUX :
    //       dataset === "controlrodposition" ? NURIMS_OPERATION_DATA_CONTROLRODPOSITION : null;
    this.props.send({
      cmd: CMD_EXPORT_REACTOR_OPERATION_RUNS_DATA,
      "include.metadata": BOOL_TRUE_STR,
      "load.metadata.from.store": [NURIMS_OPERATION_DATA_STATS],
      startDate: `${startYear.year()}-${String(startMonth.month() + 1).padStart(2, "0")}`,
      endDate: `${endYear.year()}-${String(endMonth.month() + 1).padStart(2, "0")}`,
      dataset: dataset,
      datasetFormat: datasetFormat,
      module: this.Module,
      // cmd: CMD_EXPORT_REACTOR_OPERATION_RUNS_DATA,
      // year: year.year(),
      // startMonth: startMonth.month() + 1,
      // endMonth: endMonth.month() + 1,
      // forceOverwrite: forceOverwrite,
      // module: this.Module,
    });
  }

  requestGetRecords = (include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    this.props.send({
      cmd: CMD_GET_ROUTINE_MAINTENANCE_RECORDS,
      "include.disabled": include_archived ? BOOL_TRUE_STR : BOOL_FALSE_STR,
      "include.metadata.subtitle": NURIMS_SSC_ROUTINE_MAINTENANCE_DATA_STATS + "|" + "start",
      module: this.Module,
    })
    this.setState({include_archived: include_archived});
  }

  saveChanges = () => {
    // save selected record if changed
    console.log("-- SAVING RECORD --", this.state.selection)


    // if (this.listRef.current) {
    //   const records = this.listRef.current.getRecords();
    //   for (const record of records) {
    //     // only save monitor record with changed metadata
    //     if (record.changed) {
    //       if (this.context.debug) {
    //         ConsoleLog(this.Module, "saveChanges", record);
    //       }
    //       if (record.item_id === -1 && !record.hasOwnProperty("record_key")) {
    //         record["record_key"] = record_uuid();
    //       }
    //       console.log("-- SAVING RECORD --", record)
    //       // this.props.send({
    //       //   cmd: CMD_UPDATE_USER_RECORD,
    //       //   item_id: record.item_id,
    //       //   "nurims.title": record[NURIMS_TITLE],
    //       //   "nurims.withdrawn": record[NURIMS_WITHDRAWN],
    //       //   metadata: record.metadata,
    //       //   record_key: record.record_key,
    //       //   module: this.Module,
    //       // })
    //     }
    //   }
    // }

    this.setState({metadata_changed: false})
  }

  ws_message(message) {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_ROUTINE_MAINTENANCE_RECORDS)) {
          const selection = this.state.selection;
          if (Object.keys(selection).length === 0) {
            if (this.listRef.current) {
              this.listRef.current.setRecords(response[SSC_TOPIC]);
            }
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata(selection);
            }
          } else {
            if (!message.hasOwnProperty("item_id") && this.listRef.current) {
              this.listRef.current.setRecords(response[SSC_TOPIC]);
            }
            if (message.hasOwnProperty("item_id")) {
              const record = getMatchingResponseObject(message, `response.${[SSC_TOPIC]}`,
                "item_id", selection["item_id"]);
              selection[METADATA] = [...record[METADATA]]
              if (this.metadataRef.current) {
                this.metadataRef.current.setRecordMetadata(selection);
              }
            }
          }
        } else if (isCommandResponse(message, CMD_EXPORT_REACTOR_OPERATION_RUNS_DATA)) {
          if (Array.isArray(message.response[SSC_TOPIC])) {
            const data = prepareExportData(message);
            // Create an anchor element and dispatch a click event on it to trigger a download
            const a = document.createElement('a')
            a.download = data.fileName;
            a.href = window.URL.createObjectURL(new Blob([data.blobData], {type: data.fileType}));
            const clickEvt = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true,
            });
            a.dispatchEvent(clickEvt);
            a.remove();
          } else {
            enqueueWarningSnackbar("Export data not an array", 3000, !response.hasOwnProperty("persist_message"));
          }
        } else if (isCommandResponse(message, CMD_DISCOVER_ROUTINE_MAINTENANCE_DATA)) {
          // enqueueSuccessSnackbar(response.message);
          if (response.hasOwnProperty("warning_message")) {
            enqueueWarningSnackbar(response.message, 3000, !response.hasOwnProperty("persist_message"));
          } else {
            enqueueSuccessSnackbar(response.message, 3000, !response.hasOwnProperty("persist_message"));
          }
          // if (this.listRef.current) {
          //   // this.listRef.current.updateRecord(response[this.recordTopic]);
          //   this.listRef.current.updateRecord(response.users);
          // }
        } else if (isCommandResponse(message, CMD_DELETE_USER_RECORD)) {
          enqueueSuccessSnackbar(`Record (id: ${response.item_id}) deleted successfully`)
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setRecordMetadata({})
          }
          this.setState({selection: {}, metadata_changed: false});
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  onRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
    }
    if (selection.hasOwnProperty("item_id") && selection.item_id === -1) {
      if (this.metadataRef.current) {
        this.metadataRef.current.setRecordMetadata(selection)
      }
    } else {
      this.setState(pstate => {
        return {selection: selection}
      });
      this.props.send({
        cmd: CMD_GET_ROUTINE_MAINTENANCE_RECORDS,
        item_id: selection.item_id,
        "include.metadata": BOOL_TRUE_STR,
        "include.metadata.subtitle": NURIMS_SSC_ROUTINE_MAINTENANCE_DATA_STATS + "|" + "start",
        "load.metadata.from.store": [NURIMS_SSC_ROUTINE_MAINTENANCE_DATA_STATS],
        module: this.Module,
      }, true)
    }
    this.setState({selection: selection})
  }

  render() {
    const {
      metadata_changed, confirm_remove, confirm_discovery, confirm_export_data, confirm_export_statistics,
      include_archived, selection
    } = this.state;
    const is_valid_role = isValidUserRole(this.props.user, [ROLE_REACTOR_OPERATIONS_DATA_EXPORT]);
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "metadata_changed", metadata_changed,
        "confirm_removed", confirm_remove, "confirm_export_data", confirm_export_data, "confirm_export_statistics",
        confirm_export_statistics, "include_archived", include_archived, "is_valid_role", is_valid_role,
        "selection", selection);
    }
    const no_selection = isRecordEmpty(selection);
    const disabled = !is_valid_role;
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <ConfirmDataDiscoveryDialog title={"Discover routine maintenance data"}
                                    content={
                                      <div>Reactor routine maintenance parameters are available via the YOKOGAWA
                                        digital chart recorder.<p/>Select the start year, start month, end year,
                                        end month, and whether  previously stored data should be overwritten.<p/>
                                      </div>
                                    }
                                    open={confirm_discovery}
                                    onProceed={this.proceedWithDiscovery}
                                    onCancel={this.cancelDiscovery}
        />
        <ConfirmOperatingRunDataExportDialog open={confirm_export_data}
                                             run={{selection}}
                                             onProceed={this.proceedWithOperatingRunDataExport}
                                             onCancel={this.cancelExport}
        />
        <ConfirmOperatingRunStatisticsExportDialog open={confirm_export_statistics}
                                                   onProceed={this.proceedWithOperatingRunStatisticsExport}
                                                   onCancel={this.cancelExport}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title}/>
          </Grid>
          <Grid item xs={4}>
            <RoutineMaintenanceList
              ref={this.listRef}
              title={"Routine Maintenance Records"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={8}>
            <RoutineMaintenanceMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               disabled={disabled}>
            <RemoveCircleIcon sx={{mr: 1}}/>
            Remove Operating Run
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
               onClick={this.changeRecordArchivalStatus} disabled={!this.isValidSelection(selection)}>
            {ArchiveRecordLabel(selection, "Run")}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.discoverOperatingRuns}>
            <AddIcon sx={{mr: 1}}/>
            Update Routine Maintenance Data
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" disabled={disabled || no_selection}
               onClick={this.exportOperatingRunData}>
            <AddIcon sx={{mr: 1}}/>
            Export Operating Run Data
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" disabled={disabled}
               onClick={this.exportOperatingRunStatistics}>
            <AddIcon sx={{mr: 1}}/>
            Export Operating Run Statistics
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

AddEditRoutineMaintenanceRecords.defaultProps = {
  send: (msg) => {
  },
};

export default AddEditRoutineMaintenanceRecords;