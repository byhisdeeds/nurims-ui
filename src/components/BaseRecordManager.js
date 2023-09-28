import React, {Component} from "react";
import {
  CMD_DELETE_MANUFACTURER_RECORD,
  CMD_DELETE_MATERIAL_RECORD,
  CMD_DELETE_MONITOR_RECORD,
  CMD_DELETE_PERSONNEL_RECORD,
  CMD_DELETE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD,
  CMD_DELETE_SSC_RECORD,
  CMD_DELETE_STORAGE_LOCATION_RECORD,
  CMD_GET_MANUFACTURER_RECORDS,
  CMD_GET_MATERIAL_RECORDS,
  CMD_GET_MONITOR_RECORDS,
  CMD_GET_PERSONNEL_RECORDS,
  CMD_GET_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORDS,
  CMD_GET_SSC_RECORDS,
  CMD_GET_STORAGE_LOCATION_RECORDS,
  CMD_UPDATE_MANUFACTURER_RECORD,
  CMD_UPDATE_MATERIAL_RECORD,
  CMD_UPDATE_MONITOR_RECORD,
  CMD_UPDATE_PERSONNEL_RECORD,
  CMD_UPDATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD,
  CMD_UPDATE_SSC_RECORD,
  CMD_UPDATE_STORAGE_LOCATION_RECORD,
  ITEM_ID,
  MANUFACTURER_TOPIC,
  MATERIAL_TOPIC,
  METADATA,
  MONITOR_TOPIC,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
  PERSONNEL_TOPIC,
  REACTOR_IRRADIATION_AUTHORIZATION_TOPIC,
  SSC_TOPIC,
  STORAGE_LOCATION_TOPIC
} from "../utils/constants";
// import {v4 as uuid} from "uuid";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../utils/WebsocketUtils";
import {ConsoleLog, UserDebugContext} from "../utils/UserDebugContext";
import {getNextItemId, new_record, record_uuid} from "../utils/MetadataUtils";
import {isValidUserRole} from "../utils/UserUtils";
import {enqueueErrorSnackbar, enqueueSuccessSnackbar} from "../utils/SnackbarVariants";

class BaseRecordManager extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      selection: {},
      include_archived: false,
    };
    this.Module = "BaseRecordManager";
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
    this.ws_message = this.ws_message.bind(this);
  }

  cmdRecordTopic = (cmd) => {
    switch (cmd) {
      case CMD_GET_MONITOR_RECORDS:
      case CMD_UPDATE_MONITOR_RECORD:
      case CMD_DELETE_MONITOR_RECORD:
        return MONITOR_TOPIC;
      case CMD_GET_PERSONNEL_RECORDS:
      case CMD_UPDATE_PERSONNEL_RECORD:
      case CMD_DELETE_PERSONNEL_RECORD:
        return PERSONNEL_TOPIC;
      case CMD_GET_SSC_RECORDS:
      case CMD_UPDATE_SSC_RECORD:
      case CMD_DELETE_SSC_RECORD:
        return SSC_TOPIC;
      case CMD_GET_STORAGE_LOCATION_RECORDS:
      case CMD_UPDATE_STORAGE_LOCATION_RECORD:
      case CMD_DELETE_STORAGE_LOCATION_RECORD:
        return STORAGE_LOCATION_TOPIC;
      case CMD_GET_MATERIAL_RECORDS:
      case CMD_UPDATE_MATERIAL_RECORD:
      case CMD_DELETE_MATERIAL_RECORD:
        return MATERIAL_TOPIC;
      case CMD_GET_MANUFACTURER_RECORDS:
      case CMD_UPDATE_MANUFACTURER_RECORD:
      case CMD_DELETE_MANUFACTURER_RECORD:
        return MANUFACTURER_TOPIC;
      case CMD_GET_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORDS:
      case CMD_UPDATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD:
      case CMD_DELETE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD:
        return REACTOR_IRRADIATION_AUTHORIZATION_TOPIC;
      default:
        return "";
    }
  }

  recordCommand = (mode, recordTopic) => {
    const topic = recordTopic ? recordTopic : this.recordTopic;
    if (topic === PERSONNEL_TOPIC) {
      if (mode === "update") {
        return CMD_UPDATE_PERSONNEL_RECORD;
      } else if (mode === "get") {
        return CMD_GET_PERSONNEL_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_PERSONNEL_RECORD;
      }
    } else if (topic === MONITOR_TOPIC) {
      if (mode === "update") {
        return CMD_UPDATE_MONITOR_RECORD;
      } else if (mode === "get") {
        return CMD_GET_MONITOR_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_MONITOR_RECORD;
      }
    } else if (topic === MANUFACTURER_TOPIC) {
      if (mode === "update") {
        return CMD_UPDATE_MANUFACTURER_RECORD;
      } else if (mode === "get") {
        return CMD_GET_MANUFACTURER_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_MANUFACTURER_RECORD;
      }
    } else if (topic === STORAGE_LOCATION_TOPIC) {
      if (mode === "update") {
        return CMD_UPDATE_STORAGE_LOCATION_RECORD;
      } else if (mode === "get") {
        return CMD_GET_STORAGE_LOCATION_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_STORAGE_LOCATION_RECORD;
      }
    } else if (topic === MATERIAL_TOPIC) {
      if (mode === "update") {
        return CMD_UPDATE_MATERIAL_RECORD;
      } else if (mode === "get") {
        return CMD_GET_MATERIAL_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_MATERIAL_RECORD;
      }
    } else if (topic === SSC_TOPIC) {
      if (mode === "update") {
        return CMD_UPDATE_SSC_RECORD;
      } else if (mode === "get") {
        return CMD_GET_SSC_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_SSC_RECORD;
      }
    } else if (topic === REACTOR_IRRADIATION_AUTHORIZATION_TOPIC) {
      if (mode === "update") {
        return CMD_UPDATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD;
      } else if (mode === "get") {
        return CMD_GET_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD;
      }
    }
    return "";
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
      // this.setState(pstate => {
      //   return {selection: selection}
      // });
      this.props.send({
        cmd: this.recordCommand("get"),
        item_id: selection.item_id,
        "include.metadata": "true",
        module: this.Module,
      })
    }
    this.setState({selection: selection})
  }

  isSysadminButtonAccessible = (selection) => {
    return (isValidUserRole(this.context.user, "sysadmin") && selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
  }

  isSelectableByRole = (selection, role) => {
    console.log("+++++++ isSelectableByRole", selection, role)
    return (isValidUserRole(this.context.user, role) && selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
  }

  isValidSelection = (selection) => {
    return (selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
  }

  isRecordArchived = (record) => {
    return (record.hasOwnProperty(NURIMS_WITHDRAWN) && record[NURIMS_WITHDRAWN] === 1);
  }

  onRecordMetadataChanged = (state) => {
    this.setState({metadata_changed: state});
  }

  hasChangedRecords = () => {
    if (this.listRef.current) {
      for (const record of this.listRef.current.getRecords()) {
        if (record.hasOwnProperty("changed") && record.changed) {
          return true;
        }
      }
    }
    return false;
  }

  removeRecord = () => {
    console.log("REMOVE RECORD - USER", this.context.user)
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

  getNewRecordName = () => {
    return "New Record";
  }

  addRecord = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "addRecord");
    }
    if (this.listRef.current) {
      this.listRef.current.addRecords([new_record(
        -1,
        this.getNewRecordName(),
        0,
        this.context.user.profile.username,
        this.context.user.profile.fullname
      )], false);
      this.setState({metadata_changed: true});
    }
  }

  requestGetRecords = (include_archived, include_metadata) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived,
        "include_metadata", include_metadata, "recordTopic", this.recordTopic, this.recordCommand("get"));
    }
    this.props.send({
      cmd: this.recordCommand("get"),
      "include.withdrawn": include_archived ? "true" : "false",
      "include.metadata": include_metadata ? "true" : "false",
      module: this.Module,
    })
    this.setState({include_archived: include_archived});
  }

  saveChanges = () => {
    if (this.listRef.current) {
      const records = this.listRef.current.getRecords();
      for (const record of records) {
        // only save record with changed metadata
        if (record.changed) {
          if (this.context.debug) {
            ConsoleLog(this.Module, "saveChanges", record);
          }
          if (record.item_id === -1 && !record.hasOwnProperty("record_key")) {
            record["record_key"] = record_uuid();
          }
          this.props.send({
            cmd: this.recordCommand("update", this.topic),
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

  isCommand = (message, commands) => {
    if (message.hasOwnProperty("cmd")) {
      if (Array.isArray(commands)) {
        for (const c of commands) {
          if (message.cmd === c) {
            return true;
          }
        }
      } else {
        return message.cmd === commands;
      }
    }
    return false;
  }

  recordHasMetadata = (message) => {
    return message.hasOwnProperty("include.metadata") && message["include.metadata"] === "true";
  }

  ws_message(message, commandHandlers) {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
      ConsoleLog(this.Module, "ws_message", "commandHandlers", commandHandlers);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (commandHandlers) {
          if (Array.isArray(commandHandlers)) {
            for (const handler of commandHandlers) {
              if (handler.hasOwnProperty("cmd") && handler.hasOwnProperty("func") && handler.hasOwnProperty("params")) {
                if (isCommandResponse(message, handler.cmd)) {
                  if (this.metadataRef.current && this.metadataRef.current.hasOwnProperty(handler.func)) {
                    this.metadataRef.current[handler.func](response[handler.params]);
                  }
                }
              }
            }
          }
        }
        if (this.isCommand(message, [
          CMD_GET_MONITOR_RECORDS, CMD_GET_PERSONNEL_RECORDS, CMD_GET_SSC_RECORDS, CMD_GET_STORAGE_LOCATION_RECORDS,
          CMD_GET_MATERIAL_RECORDS, CMD_GET_MANUFACTURER_RECORDS,
          CMD_GET_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORDS])) {
          // Branch if GET_XXXXX_RECORDS request included a request for metadata
          const selection = this.state.selection;
          if (Object.keys(selection).length === 0) {
            if (this.listRef.current) {
              // this.listRef.current.setRecords(response[this.recordTopic], false);
              if (message.hasOwnProperty("append.records")) {
                this.listRef.current.addRecords(response[this.cmdRecordTopic(message.cmd)], false);
              } else {
                this.listRef.current.setRecords(response[this.cmdRecordTopic(message.cmd)]);
              }
            }
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata(selection);
            }
          } else {
            if (!message.hasOwnProperty("item_id") && this.listRef.current) {
              // this.listRef.current.setRecords(response[this.recordTopic], true);
              this.listRef.current.setRecords(response[this.cmdRecordTopic(message.cmd)]);
            }
            if (message.hasOwnProperty("item_id")) {
              // const record = getMatchingResponseObject(message, "response." + this.recordTopic, "item_id", selection["item_id"]);
              const record = getMatchingResponseObject(message, "response." + this.cmdRecordTopic(message.cmd), "item_id", selection["item_id"]);
              selection[METADATA] = [...record[METADATA]]
              if (this.metadataRef.current) {
                this.metadataRef.current.setRecordMetadata(selection);
              }
            }
          }
        } else if (this.isCommand(message, [
          CMD_UPDATE_MONITOR_RECORD, CMD_UPDATE_PERSONNEL_RECORD, CMD_UPDATE_SSC_RECORD, CMD_UPDATE_STORAGE_LOCATION_RECORD,
          CMD_UPDATE_MATERIAL_RECORD, CMD_UPDATE_MANUFACTURER_RECORD,
          CMD_UPDATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD])) {
          enqueueSuccessSnackbar(`Successfully updated record for ${message[NURIMS_TITLE]}.`);
          if (this.listRef.current) {
            // this.listRef.current.updateRecord(response[this.recordTopic]);
            this.listRef.current.updateRecord(response[this.cmdRecordTopic(message.cmd)]);
          }
        } else if (this.isCommand(message, [
          CMD_DELETE_MONITOR_RECORD, CMD_DELETE_PERSONNEL_RECORD, CMD_DELETE_SSC_RECORD,
          CMD_DELETE_STORAGE_LOCATION_RECORD, CMD_DELETE_MATERIAL_RECORD,
          CMD_DELETE_MANUFACTURER_RECORD, CMD_DELETE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD])) {
          enqueueSuccessSnackbar(`Record (id: ${response.item_id}) deleted successfully`)
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          // if (this.listRef.current) {
          //   this.listRef.current.removeRecord(this.state.selection)
          // }
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

  changeRecordArchivalStatus = () => {
    console.log("changeRecordArchivalStatus - selection", this.state.selection)
    const selection = this.state.selection;
    if (selection.hasOwnProperty(NURIMS_WITHDRAWN)) {
      selection[NURIMS_WITHDRAWN] = selection[NURIMS_WITHDRAWN] === 0 ? 1 : 0;
      selection.changed = true;
      this.setState({selection: selection, metadata_changed: selection.changed});
    }
  }

}

export default BaseRecordManager