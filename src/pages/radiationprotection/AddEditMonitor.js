import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Typography,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MonitorList from "./MonitorList";
import MonitorMetadata from "./MonitorMetadata";
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_MONITOR_RECORDS,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../utils/UtilityDialogs";


class AddEditMonitor extends BaseRecordManager {
  constructor(props) {
    super(props);
    this.Module = "AddEditMonitors";
    this.recordType = "monitor";
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

  // ws_message = (message) => {
  //   super.ws_message(message, [
  //     { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
  //   ]);
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
              onChange={this.onRecordMetadataChanged}
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