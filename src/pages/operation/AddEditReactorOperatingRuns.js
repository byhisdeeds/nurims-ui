import React from 'react';
import {
  ConsoleLog,
  UserDebugContext
} from "../../utils/UserDebugContext";
import {
  ConfirmOperatingRunDiscoveryDialog,
  ConfirmRemoveRecordDialog
} from "../../components/UtilityDialogs";
import {
  CMD_DELETE_USER_RECORD,
  CMD_DISCOVER_REACTOR_OPERATION_RUNS,
  CMD_GET_REACTOR_OPERATION_RUN_RECORDS,
  CMD_UPDATE_USER_RECORD,
  ITEM_ID,
  METADATA,
  NURIMS_OPERATION_DATA_STATS,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";
import {
  Box,
  Fab,
  Grid,
  Typography
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";

// import {v4 as uuid} from "uuid";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {
  ArchiveRecordLabel
} from "../../utils/RenderUtils";
import OperatingRunList from "./OperatingRunList";
import OperatingRunMetadata from "./OperatingRunMetadata";
import {TitleComponent} from "../../components/CommonComponents";
import {
  enqueueErrorSnackbar,
  enqueueSuccessSnackbar,
  enqueueWarningSnackbar
} from "../../utils/SnackbarVariants";
import {record_uuid} from "../../utils/MetadataUtils";

export const ADDEDITREACTOROPERATINGRUNS_REF = "AddEditReactorOperatingRuns";

class AddEditReactorOperatingRuns extends React.Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      confirm_discovery: false,
      selection: {},
      title: props.title,
      include_archived: false,
    };
    this.Module = ADDEDITREACTOROPERATINGRUNS_REF;
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
    if (this.context.debug) {
      ConsoleLog(this.Module, "discoverOperatingRuns");
    }
    this.setState({confirm_discovery: true,});
  }

  cancelDiscovery = () => {
    this.setState({confirm_discovery: false,});
  }

  proceedWithDiscovery = (year, startMonth, endMonth, forceOverwrite) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithDiscovery", "year", year, "startMonth", startMonth,
        "endMonth", endMonth, "forceOverwrite", forceOverwrite);
    }
    this.setState({confirm_discovery: false,});

    this.props.send({
      cmd: CMD_DISCOVER_REACTOR_OPERATION_RUNS,
      year: year.year(),
      startMonth: startMonth.month() + 1,
      endMonth: endMonth.month() + 1,
      forceOverwrite: forceOverwrite,
      "run_in_background": "true",
      module: this.Module,
    });
  }

  requestGetRecords = (include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    this.props.send({
      cmd: CMD_GET_REACTOR_OPERATION_RUN_RECORDS,
      "include.disabled": include_archived ? "true" : "false",
      "include.metadata.subtitle": NURIMS_OPERATION_DATA_STATS + "|" + "start",
      module: this.Module,
    })
    this.setState({include_archived: include_archived});
  }

  saveChanges = () => {
    if (this.listRef.current) {
      const records = this.listRef.current.getRecords();
      for (const record of records) {
        // only save monitor record with changed metadata
        if (record.changed) {
          if (this.context.debug) {
            ConsoleLog(this.Module, "saveChanges", record);
          }
          if (record.item_id === -1 && !record.hasOwnProperty("record_key")) {
            record["record_key"] = record_uuid();
          }
          this.props.send({
            cmd: CMD_UPDATE_USER_RECORD,
            item_id: record.item_id,
            "nurims.title": record[NURIMS_TITLE],
            "nurims.withdrawn": record[NURIMS_WITHDRAWN],
            metadata: record.metadata,
            record_key: record.record_key,
            module: this.Module,
          })
        }
      }
    }

    this.setState({metadata_changed: false})
  }

  ws_message(message) {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_REACTOR_OPERATION_RUN_RECORDS)) {
          const selection = this.state.selection;
          if (Object.keys(selection).length === 0) {
            if (this.listRef.current) {
              this.listRef.current.setRecords(response.operation);
            }
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata(selection);
            }
          } else {
            if (!message.hasOwnProperty("item_id") && this.listRef.current) {
              this.listRef.current.setRecords(response.operation);
            }
            if (message.hasOwnProperty("item_id")) {
              const record = getMatchingResponseObject(message, "response.operation", "item_id", selection["item_id"]);
              selection[METADATA] = [...record[METADATA]]
              if (this.metadataRef.current) {
                this.metadataRef.current.setRecordMetadata(selection);
              }
            }
          }
        } else if (isCommandResponse(message, CMD_DISCOVER_REACTOR_OPERATION_RUNS)) {
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
        cmd: CMD_GET_REACTOR_OPERATION_RUN_RECORDS,
        item_id: selection.item_id,
        "include.metadata": "true",
        "include.metadata.subtitle": NURIMS_OPERATION_DATA_STATS + "|" + "start",
        module: this.Module,
      })
    }
    this.setState({selection: selection})
  }

  render() {
    const {metadata_changed, confirm_remove, confirm_discovery, include_archived, selection} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "metadata_changed", metadata_changed,
        "confirm_removed", confirm_remove, "include_archived", include_archived, "selection", selection);
    }
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <ConfirmOperatingRunDiscoveryDialog open={confirm_discovery}
                                            onProceed={this.proceedWithDiscovery}
                                            onCancel={this.cancelDiscovery}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={4}>
            <OperatingRunList
              ref={this.listRef}
              title={"Reactor Operation Runs"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={8}>
            <OperatingRunMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               disabled={selection === -1}>
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
            Update Operating Runs
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

AddEditReactorOperatingRuns.defaultProps = {
  send: (msg) => {},
};

export default AddEditReactorOperatingRuns;