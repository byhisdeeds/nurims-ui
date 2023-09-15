import React from 'react';
import {
  Fab,
  Grid,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_MANUFACTURER_RECORDS, CMD_GET_MATERIAL_RECORDS, CMD_GET_STORAGE_LOCATION_RECORDS,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import MaterialList from "./MaterialList";
import MaterialMetadata from "./MaterialMetadata";
import {TitleComponent} from "../../components/CommonComponents";
import {UserDebugContext} from "../../utils/UserDebugContext";

export const MATERIAL_REF = "Material";

class Material extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = MATERIAL_REF;
    this.recordTopic = "material";
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    this.props.send({
      cmd: CMD_GET_MANUFACTURER_RECORDS,
      module: this.Module,
    });
    this.props.send({
      cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
      module: this.Module,
    });
    this.getMaterialsRecords();
  }

  getMaterialsRecords = (include_metadata) => {
    this.props.send({
      cmd: CMD_GET_MATERIAL_RECORDS,
      "include.metadata": (include_metadata) ? ""+include_metadata : "false",
      module: this.Module,
    });
  }

  ws_message = (message) => {
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" },
      { cmd: CMD_GET_MANUFACTURER_RECORDS, func: "setManufacturers", params: "manufacturer" },
      { cmd: CMD_GET_STORAGE_LOCATION_RECORDS, func: "setStorageLocations", params: "storage_location" },
    ]);
  }

  render() {
    const {metadata_changed, confirm_remove, selection, include_archived} = this.state;
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
            <MaterialList
              ref={this.listRef}
              title={"Materials"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={false}
            />
          </Grid>
          <Grid item xs={7}>
            <MaterialMetadata
              ref={this.metadataRef}
              onChange={this.onRecordMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               disabled={!this.isSysadminButtonAccessible(selection)}>
            <RemoveCircleOutlineIcon sx={{mr: 1}}/>
            Remove Material
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add Material
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

Material.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default Material;