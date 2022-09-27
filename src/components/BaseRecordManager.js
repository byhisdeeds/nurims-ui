import React, {Component} from "react";
import {ConfirmRemoveDialog, isValidSelection} from "../utils/UtilityDialogs";
import {Fab, Grid, Typography} from "@mui/material";
import MaterialList from "../pages/controlledmaterials/MaterialList";
import MaterialMetadata from "../pages/controlledmaterials/MaterialMetadata";
import Box from "@mui/material/Box";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import {
  CMD_DELETE_MANUFACTURER_RECORD,
  CMD_DELETE_MATERIAL_RECORD,
  CMD_DELETE_MONITOR_RECORD,
  CMD_DELETE_PERSONNEL_RECORD,
  CMD_DELETE_SSC_RECORD,
  CMD_DELETE_STORAGE_LOCATION_RECORD, CMD_DISABLE_MONITOR_RECORD,
  CMD_GET_MANUFACTURER_RECORDS, CMD_GET_MATERIAL_RECORDS,
  CMD_GET_MONITOR_RECORDS,
  CMD_GET_PERSONNEL_RECORDS, CMD_GET_SSC_RECORDS,
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
  _isCommandResponse, getMatchingResponseObject,
  isCommandResponse,
  messageHasMetadata,
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
    } else if (this.recordType === "storage") {
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
    } else if (this.recordType === "ssc") {
      if (mode === "update") {
        return CMD_UPDATE_SSC_RECORD;
      } else if (mode === "delete") {
        return CMD_GET_SSC_RECORDS;
      } else if (mode === "delete") {
        return CMD_DELETE_SSC_RECORD;
      }
    }
    return "";
  }

  onRecordSelection = (selection) => {
    // console.log("-- onMonitorSelected (previous selection) --", previous_selection)
    console.log("onRecordSelected (selection) --", selection)
    if (selection.hasOwnProperty("item_id") && selection.item_id === -1) {
      if (this.metadataRef.current) {
        this.metadataRef.current.set_monitor_object(selection)
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

  onMetadataChanged = (state) => {
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
      this.listRef.current.add([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Record",
        "nurims.withdrawn": 0,
        "metadata": []
      }], false);
      this.setState({metadata_changed: true});
    }
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
    console.log("ON_WS_MESSAGE", this.Module, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (commandHandlers) {
          if (Array.isArray(commandHandlers)) {
            for (const handler of commandHandlers) {
              if (handler.hasOwnProperty("cmd") && handler.hasOwnProperty("func") && handler.hasOwnProperty("params")) {
                console.log("%%%%%%%", handler)
                console.log("%%%%%%%", this.metadataRef.current)
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
          if (this.recordHasMetadata(message)) {
            const selection = this.state.selection;
            const record = getMatchingResponseObject(message, "response." + this.recordType, "item_id", selection["item_id"]);
            selection[METADATA] = [...record[METADATA]]
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata(selection);
            }
          } else {
            if (this.listRef.current) {
              this.listRef.current.setRecords(response[this.recordType], false);
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
        } else if (isCommandResponse(message, CMD_DISABLE_MONITOR_RECORD)) {
          toast.success("Monitor record disabled successfully")
          if (this.listRef.current) {
            this.listRef.current.removeMonitor(this.state.selection)
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.set_monitor_object({})
          }
          this.setState({selection: {}})
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  // overide:
  // [
  //   { cmd: CMD_GET_GLOSSARY_TERMS, func: setGlossaryTerms, params: terms },
  // ]
  // ws_message = (message, overide) => {
  //   console.log("ON_WS_MESSAGE", this.Module, message)
  //   if (messageHasResponse(message)) {
  //     const response = message.response;
  //     if (messageStatusOk(message)) {
  //       // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$DD
  //       if (overide) {
  //         if (Array.isArray(overide)) {
  //           for (const f of overide) {
  //             if (f.hasOwnProperty("cmd") && f.hasOwnProperty("func") && f.hasOwnProperty("params")) {
  //               console.log("%%%%%%%", f)
  //               if (isCommandResponse(message, f.cmd)) {
  //                 if (this.metadataRef.current) {
  //                   this.metadataRef.current[f.func](response[f.params]);
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       // if (_isCommandResponse(message, [CMD_GET_MONITOR_RECORDS])) {
  //       //
  //       // }
  //       // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$DD
  //       if (isCommandResponse(message, CMD_GET_MONITOR_RECORDS)) {
  //         // console.log("UPDATE SELECTED PERSONNEL METADATA", messageHasMetadata(message))
  //         if (messageHasMetadata(message)) {
  //           console.log("UPDATE SELECTED MONITOR METADATA", Array.isArray(response.monitor))
  //           const selection = this.state.selection;
  //           console.log("SELECTED MONITOR", selection)
  //           if (response.monitor[0].item_id === selection["item_id"]) {
  //             selection[NURIMS_TITLE] = response.monitor[0][NURIMS_TITLE];
  //             selection[NURIMS_WITHDRAWN] = response.monitor[0][NURIMS_WITHDRAWN];
  //             selection["metadata"] = [...response.monitor[0]["metadata"]]
  //           }
  //           if (this.metadataRef.current) {
  //             this.metadataRef.current.set_monitor_object(selection);
  //           }
  //         } else {
  //           // update monitor list (no metadata included)
  //           console.log("UPDATE MONITOR LIST (NO METADATA INCLUDED)", Array.isArray(response.monitor))
  //           if (this.listRef.current) {
  //             // We don't need to skip records with duplicate names here because
  //             // these records have already been vetted and given an item_id
  //             this.listRef.current.add(response.monitor, false);
  //           }
  //         }
  //       } else if (isCommandResponse(message, CMD_UPDATE_MONITOR_RECORD)) {
  //         toast.success(`Monitor record for ${response.monitor[NURIMS_TITLE]} updated successfully`)
  //         if (this.listRef.current) {
  //           this.listRef.current.update(response.monitor);
  //         }
  //       } else if (isCommandResponse(message, CMD_DISABLE_MONITOR_RECORD)) {
  //         toast.success("Monitor record disabled successfully")
  //         if (this.listRef.current) {
  //           this.listRef.current.removeMonitor(this.state.selection)
  //         }
  //         if (this.metadataRef.current) {
  //           this.metadataRef.current.set_monitor_object({})
  //         }
  //         this.setState( {selection: {}})
  //       }
  //     } else {
  //       toast.error(response.message);
  //     }
  //   }
  // }
}

export default BaseRecordManager