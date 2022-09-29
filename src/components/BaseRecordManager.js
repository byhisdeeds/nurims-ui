import React, {Component} from "react";
import {
  CMD_DELETE_MANUFACTURER_RECORD,
  CMD_DELETE_MATERIAL_RECORD,
  CMD_DELETE_MONITOR_RECORD,
  CMD_DELETE_PERSONNEL_RECORD,
  CMD_DELETE_SSC_RECORD,
  CMD_DELETE_STORAGE_LOCATION_RECORD,
  CMD_GET_MANUFACTURER_RECORDS,
  CMD_GET_MATERIAL_RECORDS,
  CMD_GET_MONITOR_RECORDS,
  CMD_GET_PERSONNEL_RECORDS,
  CMD_GET_SSC_RECORDS,
  CMD_GET_STORAGE_LOCATION_RECORDS,
  CMD_UPDATE_MANUFACTURER_RECORD,
  CMD_UPDATE_MATERIAL_RECORD,
  CMD_UPDATE_MONITOR_RECORD,
  CMD_UPDATE_PERSONNEL_RECORD,
  CMD_UPDATE_SSC_RECORD,
  CMD_UPDATE_STORAGE_LOCATION_RECORD,
  ITEM_ID, METADATA,
  NURIMS_TITLE, NURIMS_WITHDRAWN
} from "../utils/constants";
import {v4 as uuid} from "uuid";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../utils/WebsocketUtils";
import {toast} from "react-toastify";

class BaseRecordManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      selection: {},
      title: props.title,
      include_archived: false,
    };
    this.recordType = "";
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
    this.ws_message = this.ws_message.bind(this);
  }

  recordCommand = (mode) => {
    if (this.recordType === "personnel") {
      if (mode === "update") {
        return CMD_UPDATE_PERSONNEL_RECORD;
      } else if (mode === "get") {
        return CMD_GET_PERSONNEL_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_PERSONNEL_RECORD;
      }
    } else if (this.recordType === "monitor") {
      if (mode === "update") {
        return CMD_UPDATE_MONITOR_RECORD;
      } else if (mode === "get") {
        return CMD_GET_MONITOR_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_MONITOR_RECORD;
      }
    } else if (this.recordType === "manufacturer") {
      if (mode === "update") {
        return CMD_UPDATE_MANUFACTURER_RECORD;
      } else if (mode === "get") {
        return CMD_GET_MANUFACTURER_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_MANUFACTURER_RECORD;
      }
    } else if (this.recordType === "storage_location") {
      if (mode === "update") {
        return CMD_UPDATE_STORAGE_LOCATION_RECORD;
      } else if (mode === "get") {
        return CMD_GET_STORAGE_LOCATION_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_STORAGE_LOCATION_RECORD;
      }
    } else if (this.recordType === "material") {
      if (mode === "update") {
        return CMD_UPDATE_MATERIAL_RECORD;
      } else if (mode === "get") {
        return CMD_GET_MATERIAL_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_MATERIAL_RECORD;
      }
    } else if (this.recordType === "structures_systems_components") {
      if (mode === "update") {
        return CMD_UPDATE_SSC_RECORD;
      } else if (mode === "get") {
        return CMD_GET_SSC_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_SSC_RECORD;
      }
    }
    return "";
  }

  onRecordSelection = (selection) => {
    // console.log("-- onMonitorSelected (previous selection) --", previous_selection)
    console.log("onRecordSelection (selection) --", selection)
    if (selection.hasOwnProperty("item_id") && selection.item_id === -1) {
      if (this.metadataRef.current) {
        this.metadataRef.current.setRecordMetadata(selection)
      }
    } else {
      this.setState(pstate => {
        return {selection: selection}
      });
      this.props.send({
        cmd: this.recordCommand("get"),
        item_id: selection.item_id,
        "include.metadata": "true",
        module: this.Module,
      })
    }
    this.setState({selection: selection})
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

  removeRecord = () => {
    console.log("REMOVE RECORD")
    this.setState({confirm_remove: true,});
  }

  cancelRemove = () => {
    this.setState({confirm_remove: false,});
  }

  proceedWithRemove = () => {
    this.setState({confirm_remove: false,});
    console.log("REMOVE RECORD", this.state.selection);
    if (this.state.selection.item_id === -1) {
      if (this.listRef.current) {
        this.listRef.current.removeMonitor(this.state.selection)
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
    if (this.listRef.current) {
      this.listRef.current.addRecords([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Record",
        "nurims.withdrawn": 0,
        "metadata": []
      }], false);
      this.setState({metadata_changed: true});
    }
  }

  requestGetRecords = (include_archived) => {
    this.props.send({
      cmd: this.recordCommand("get"),
      "include.withdrawn": include_archived ? "true" : "false",
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
          console.log("SAVING RECORD WITH CHANGED METADATA ", record)
          if (record.item_id === -1 && !record.hasOwnProperty("record_key")) {
            record["record_key"] = uuid();
          }
          this.props.send({
            cmd: this.recordCommand("update"),
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
    console.log("++++++++ON_WS_MESSAGE", this.Module, message)
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
          CMD_GET_MATERIAL_RECORDS, CMD_GET_MANUFACTURER_RECORDS])) {
          // Branch if GET_XXXXX_RECORDS request included a request for metadata
          const selection = this.state.selection;
          if (Object.keys(selection).length === 0) {
            if (this.listRef.current) {
              this.listRef.current.setRecords(response[this.recordType], false);
            }
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata(selection);
            }
          } else {
            console.log("BaseRecordManager.ws_message - selection", selection)
            const record = getMatchingResponseObject(message, "response." + this.recordType, "item_id", selection["item_id"]);
            selection[METADATA] = [...record[METADATA]]
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata(selection);
            }
          }
        } else if (this.isCommand(message, [
          CMD_UPDATE_MONITOR_RECORD, CMD_UPDATE_PERSONNEL_RECORD, CMD_UPDATE_SSC_RECORD, CMD_UPDATE_STORAGE_LOCATION_RECORD,
          CMD_UPDATE_MATERIAL_RECORD, CMD_UPDATE_MANUFACTURER_RECORD])) {
          toast.success(`Successfully updated record for ${message[NURIMS_TITLE]}.`);
          if (this.listRef.current) {
            this.listRef.current.updateRecord(response[this.recordType]);
          }
        } else if (this.isCommand(message, [
          CMD_DELETE_MONITOR_RECORD, CMD_DELETE_PERSONNEL_RECORD, CMD_DELETE_SSC_RECORD, CMD_DELETE_STORAGE_LOCATION_RECORD,
          CMD_DELETE_MATERIAL_RECORD, CMD_DELETE_MANUFACTURER_RECORD])) {
          toast.success(`Record (id: ${response.item_id}) deleted successfully`)
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setMaterialMetadata({})
          }
          this.setState({selection: {}, metadata_changed: false});
        }
      } else {
        toast.error(response.message);
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