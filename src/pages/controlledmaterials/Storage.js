import React from 'react';
import {
  Fab,
  Grid,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_STORAGE_LOCATION_RECORDS,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import StorageList from "./StorageList";
import StorageMetadata from "./StorageMetadata";
import {UserDebugContext} from "../../utils/UserDebugContext";
import {TitleComponent} from "../../components/CommonComponents";

export const STORAGE_REF = "Storage";

class Storage extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = STORAGE_REF;
    this.recordTopic = "storage_location";
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    this.getStorageLocationRecords();
  }

  getStorageLocationRecords = () => {
    this.props.send({
      cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "true",
      module: this.Module,
    });
  }

  ws_message = (message) => {
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
    ]);
  }

  render() {
    const {metadata_changed, confirm_remove, selection} = this.state;
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
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={5}>
            <StorageList
              ref={this.listRef}
              title={"Storage Locations"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
            />
          </Grid>
          <Grid item xs={7}>
            <StorageMetadata
              ref={this.metadataRef}
              onChange={this.onRecordMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
            // disabled={!((selection["nurims.withdrawn"] === 1) || selection["item_id"] === -1)}>
               disabled={!this.isSysadminButtonAccessible(selection)}>
            <PersonRemoveIcon sx={{mr: 1}}/>
            Remove Storage
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add Storage
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

Storage.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default Storage;