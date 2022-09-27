import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Typography,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import UploadIcon from '@mui/icons-material/Upload';
import MonitorList from "./MonitorList";
import {toast} from "react-toastify";
import MonitorMetadata from "./MonitorMetadata";
import {
  CMD_DELETE_MONITOR_RECORD,
  CMD_DISABLE_MONITOR_RECORD,
  CMD_DISABLE_PERSONNEL_RECORD, CMD_GET_GLOSSARY_TERMS,
  CMD_GET_MONITOR_RECORDS,
  CMD_GET_PERSONNEL_RECORDS,
  CMD_UPDATE_MONITOR_RECORD,
  CMD_UPDATE_PERSONNEL_RECORD,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";

import {
  isCommandResponse,
  messageHasMetadata,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {v4 as uuid} from "uuid";
import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../utils/UtilityDialogs";


class AddEditMonitor extends BaseRecordManager {
  constructor(props) {
    super(props);
    this.Module = "AddEditMonitors";
    this.recordType = "monitor_record";
    // this.state = {
    //   metadata_changed: false,
    //   alert: false,
    //   confirm_remove: false,
    //   previous_selection: {},
    //   selection: {},
    //   title: props.title,
    // };
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_MONITOR_RECORDS,
      module: this.Module,
    });
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
  }

  ws_message = (message) => {
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
    ]);
    console.log("ON_WS_MESSAGE", this.Module, message)
    // if (messageHasResponse(message)) {
    //   const response = message.response;
    //   if (messageStatusOk(message)) {
    //     if (isCommandResponse(message, CMD_GET_MONITOR_RECORDS)) {
    //       // console.log("UPDATE SELECTED PERSONNEL METADATA", messageHasMetadata(message))
    //       if (messageHasMetadata(message)) {
    //         console.log("UPDATE SELECTED MONITOR METADATA", Array.isArray(response.monitor))
    //         const selection = this.state.selection;
    //         console.log("SELECTED MONITOR", selection)
    //         if (response.monitor[0].item_id === selection["item_id"]) {
    //           selection[NURIMS_TITLE] = response.monitor[0][NURIMS_TITLE];
    //           selection[NURIMS_WITHDRAWN] = response.monitor[0][NURIMS_WITHDRAWN];
    //           selection["metadata"] = [...response.monitor[0]["metadata"]]
    //         }
    //         if (this.metadataRef.current) {
    //           this.metadataRef.current.set_monitor_object(selection);
    //         }
    //       } else {
    //         // update monitor list (no metadata included)
    //         console.log("UPDATE MONITOR LIST (NO METADATA INCLUDED)", Array.isArray(response.monitor))
    //         if (this.listRef.current) {
    //           // We don't need to skip records with duplicate names here because
    //           // these records have already been vetted and given an item_id
    //           this.listRef.current.add(response.monitor, false);
    //         }
    //       }
    //     } else if (isCommandResponse(message, CMD_UPDATE_MONITOR_RECORD)) {
    //       toast.success(`Monitor record for ${response.monitor[NURIMS_TITLE]} updated successfully`)
    //       if (this.listRef.current) {
    //         this.listRef.current.update(response.monitor);
    //       }
    //     } else if (isCommandResponse(message, CMD_DISABLE_MONITOR_RECORD)) {
    //       toast.success("Monitor record disabled successfully")
    //       if (this.listRef.current) {
    //         this.listRef.current.removeMonitor(this.state.selection)
    //       }
    //       if (this.metadataRef.current) {
    //         this.metadataRef.current.set_monitor_object({})
    //       }
    //       this.setState( {selection: {}})
    //     }
    //   } else {
    //     toast.error(response.message);
    //   }
    // }
  }
  //
  // onMonitorSelected = (selection) => {
  //   // console.log("-- onMonitorSelected (previous selection) --", previous_selection)
  //   console.log("-- onMonitorSelected (selection) --", selection)
  //   if (selection.hasOwnProperty("item_id") && selection.item_id === -1) {
  //     if (this.metadataRef.current) {
  //       this.metadataRef.current.set_monitor_object(selection)
  //     }
  //   } else {
  //     this.setState(pstate => {
  //       return { selection: selection }
  //     });
  //     this.props.send({
  //       cmd: CMD_GET_MONITOR_RECORDS,
  //       item_id: selection.item_id,
  //       "include.metadata": "true",
  //       module: this.Module,
  //     })
  //   }
  //   this.setState({ selection: selection })
  // }

  render() {
    const {metadata_changed, confirm_remove, selection, title, include_archived} = this.state;
    console.log("render - RECORD_TYPE", this.recordType);
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   recordType={"MONITOR_RECORD"}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={5}>
            <MonitorList
              ref={this.listRef}
              onPersonSelection={this.onRecordSelection}
              properties={this.props.properties}
            />
          </Grid>
          <Grid item xs={7}>
            <MonitorMetadata
              ref={this.metadataRef}
              onChange={this.onMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               // disabled={!((selection["nurims.withdrawn"] === 1) || selection["item_id"] === -1)}>
               disabled={!this.isValidSelection(selection)}>
            <PersonRemoveIcon sx={{mr: 1}}/>
            Remove Monitor
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add Monitor
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

AddEditMonitor.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default AddEditMonitor;