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
  CMD_GET_MANUFACTURER_RECORDS,
  CMD_GET_MATERIAL_RECORDS,
  CMD_GET_OWNER_RECORDS,
  CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_STORAGE_LOCATION_RECORDS,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog, ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import MaterialList from "./MaterialList";
import MaterialMetadata from "./MaterialMetadata";
import {TitleComponent} from "../../components/CommonComponents";
import {UserDebugContext} from "../../utils/UserDebugContext";
import {messageHasResponse, messageStatusOk} from "../../utils/WebsocketUtils";
import {setProvenanceRecordsHelper, showProvenanceRecordsViewHelper} from "../../utils/ProvenanceUtils";
import {AddEditButtonPanel} from "../../utils/UiUtils";

export const MATERIAL_REF = "Material";

class Material extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state["show_provenance_view"] = false;
    this.Module = MATERIAL_REF;
    this.recordTopic = "material";
    this.provenanceRecords = [];
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
      cmd: CMD_GET_OWNER_RECORDS,
      module: this.Module,
    });
    this.props.send({
      cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
      module: this.Module,
    });
    // this.getMaterialsRecords();
    this.requestGetRecords(false, true);
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
      { cmd: CMD_GET_OWNER_RECORDS, func: "setOwners", params: "owner" },
      { cmd: CMD_GET_STORAGE_LOCATION_RECORDS, func: "setStorageLocations", params: "storage_location" },
    ]);
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (message.cmd === CMD_GET_PROVENANCE_RECORDS) {
          this.setProvenanceRecords(response.provenance)
        }
      }
    }
  }

  setProvenanceRecords = (provenance) => {
    setProvenanceRecordsHelper(this, provenance);
  }

  showProvenanceRecordsView = () => {
    showProvenanceRecordsViewHelper(this);
  }

  closeProvenanceRecordsView = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    this.setState({show_provenance_view: false,});
  }

  render() {
    const {metadata_changed, confirm_remove, selection, show_provenance_view, include_archived} = this.state;
    const {user} = this.props;
    console.log("render - RECORD_TYPE", this.recordTopic);
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <ShowProvenanceRecordsDialog open={show_provenance_view}
                                     selection={selection}
                                     body={this.provenanceRecords.join("\n")}
                                     onCancel={this.closeProvenanceRecordsView}
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
              enableRecordArchiveSwitch={true}
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
        {<AddEditButtonPanel
          THIS={this}
          user={user}
          onClickAddRecord={this.addRecord}
          onClickChangeRecordArchivalStatus={this.changeRecordArchivalStatus}
          onClickRemoveRecord={this.removeRecord}
          onClickSaveRecordChanges={this.saveChanges}
          onClickViewProvenanceRecords={this.showProvenanceRecordsView}
          addRecordButtonLabel={"Add Material"}
          removeRecordButtonLabel={"Remove Material"}
        />}
        {/*<Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}*/}
        {/*       disabled={!this.isSysadminButtonAccessible(selection)}>*/}
        {/*    <RemoveCircleOutlineIcon sx={{mr: 1}}/>*/}
        {/*    Remove Material*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}*/}
        {/*       disabled={!metadata_changed}>*/}
        {/*    <SaveIcon sx={{mr: 1}}/>*/}
        {/*    Save Changes*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>*/}
        {/*    <AddIcon sx={{mr: 1}}/>*/}
        {/*    Add Material*/}
        {/*  </Fab>*/}
        {/*</Box>*/}
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