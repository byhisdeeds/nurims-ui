import React from 'react';
import {
  ConsoleLog,
  UserDebugContext
} from "../../../utils/UserDebugContext";
import {
  ConfirmRemoveRecordDialog
} from "../../../utils/UtilityDialogs";
import {
  CMD_DELETE_USER_RECORD,
  CMD_GET_REACTOR_OPERATION_RUN_RECORDS,
  CMD_GET_USER_RECORDS,
  CMD_UPDATE_USER_RECORD,
  ITEM_ID,
  METADATA,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../../utils/constants";
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

import {v4 as uuid} from "uuid";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../../utils/WebsocketUtils";
import {
  ArchiveRecordLabel
} from "../../../utils/RenderUtils";
import {toast} from "react-toastify";
import OperatingRunList from "./OperatingRunList";
import OperatingRunMetadata from "./OperatingRunMetadata";

class AddEditReactorOperatingRuns extends React.Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      selection: {},
      title: props.title,
      include_archived: false,
    };
    this.Module = "AddEditReactorOperatingRuns";
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
    if (this.context.debug > 5) {
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

  addRecord = () => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "addRecord");
    }
    if (this.listRef.current) {
      this.listRef.current.addRecords([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Record",
        "nurims.withdrawn": 0,
        "metadata": {
          username: "New Record",
          password: "",
          authorized_module_level: "",
          role: "",
        }
      }], false);
      this.setState({metadata_changed: true});
    }
  }

  requestGetRecords = (include_archived) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    this.props.send({
      cmd: CMD_GET_REACTOR_OPERATION_RUN_RECORDS,
      "include.disabled": include_archived ? "true" : "false",
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
          if (this.context.debug > 5) {
            ConsoleLog(this.Module, "saveChanges", record);
          }
          if (record.item_id === -1 && !record.hasOwnProperty("record_key")) {
            record["record_key"] = uuid();
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
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_REACTOR_OPERATION_RUN_RECORDS)) {
          const selection = this.state.selection;
          if (Object.keys(selection).length === 0) {
            if (this.listRef.current) {
              this.listRef.current.setRecords(response.users);
            }
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata(selection);
            }
          } else {
            if (!message.hasOwnProperty("item_id") && this.listRef.current) {
              // this.listRef.current.setRecords(response[this.recordTopic], true);
              this.listRef.current.setRecords(response.users);
            }
            if (message.hasOwnProperty("item_id")) {
              // const record = getMatchingResponseObject(message, "response." + this.recordTopic, "item_id", selection["item_id"]);
              const record = getMatchingResponseObject(message, "response.users", "item_id", selection["item_id"]);
              selection[METADATA] = [...record[METADATA]]
              if (this.metadataRef.current) {
                this.metadataRef.current.setRecordMetadata(selection);
              }
            }
          }
        } else if (isCommandResponse(message, CMD_UPDATE_USER_RECORD)) {
          toast.success(`Successfully updated record for ${message[NURIMS_TITLE]}.`);
          if (this.listRef.current) {
            // this.listRef.current.updateRecord(response[this.recordTopic]);
            this.listRef.current.updateRecord(response.users);
          }
        } else if (isCommandResponse(message, CMD_DELETE_USER_RECORD)) {
          toast.success(`Record (id: ${response.item_id}) deleted successfully`)
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
        toast.error(response.message);
      }
    }
  }

  onRecordSelection = (selection) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
    }
    if (selection.hasOwnProperty("item_id")) {
      if (this.metadataRef.current) {
        this.metadataRef.current.setRecordMetadata(selection)
      }
    }
    this.setState({selection: selection})
  }

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection, title} = this.state;
    if (this.context.debug > 5) {
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
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
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
            Remove SSC
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
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add SSC
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