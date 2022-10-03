import React from 'react';
import {
  Fab,
  Grid,
  Typography,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  CMD_GET_MANUFACTURER_RECORDS,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../utils/UtilityDialogs";
import ManufacturerList from "./ManufacturerList";
import ManufacturerMetadata from "./ManufacturerMetadata";


class AddEditMonitor extends BaseRecordManager {
  constructor(props) {
    super(props);
    this.Module = "Manufacturer";
    this.recordTopic = "manufacturer";
  }

  componentDidMount() {
    this.getManufacturerRecords();
  }

  getManufacturerRecords = () => {
    this.props.send({
      cmd: CMD_GET_MANUFACTURER_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "true",
      module: this.Module,
    });
  }

  // ws_message = (message) => {
  //   super.ws_message(message, [
  //     { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
  //   ]);
  // }

  render() {
    const {metadata_changed, confirm_remove, selection, title} = this.state;
    console.log("render - RECORD_TYPE", this.recordTopic);
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
          <Grid item xs={5}>
            <ManufacturerList
              ref={this.listRef}
              title={"Manufacturers"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
            />
          </Grid>
          <Grid item xs={7}>
            <ManufacturerMetadata
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