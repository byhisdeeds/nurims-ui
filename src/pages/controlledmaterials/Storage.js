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
  CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_STORAGE_LOCATION_RECORDS,
  ROLE_CONTROLLED_MATERIAL_DATA_ENTRY,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import StorageList from "./StorageList";
import StorageMetadata from "./StorageMetadata";
import {UserContext} from "../../utils/UserContext";
import {TitleComponent, AddRemoveArchiveSaveSubmitProvenanceButtonPanel} from "../../components/CommonComponents";
import {
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export const STORAGE_REF = "Storage";

class Storage extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state["show_provenance_view"] = false;
    this.Module = STORAGE_REF;
    this.recordTopic = "storage_location";
    this.provenanceRecords = [];
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    // this.getStorageLocationRecords();
    this.requestGetRecords(false, true);
  }

  getStorageLocationRecords = () => {
    this.props.send({
      cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "false",
      module: this.Module,
    });
  }

  ws_message = (message) => {
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
    ]);
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
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
            <StorageList
              ref={this.listRef}
              title={"Storage Locations"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
              includeArchived={include_archived}
              enableRecordArchiveSwitch={true}
              requestGetRecords={this.requestGetRecords}
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
        {<AddRemoveArchiveSaveSubmitProvenanceButtonPanel
          THIS={this}
          user={user}
          onClickAddRecord={this.addRecord}
          onClickChangeRecordArchivalStatus={this.changeRecordArchivalStatus}
          onClickRemoveRecord={this.removeRecord}
          onClickSaveRecordChanges={this.saveChanges}
          onClickViewProvenanceRecords={this.showProvenanceRecordsView}
          addRecordButtonLabel={"Add Storage"}
          removeRecordButtonLabel={"Remove Storage"}
          addRole={ROLE_CONTROLLED_MATERIAL_DATA_ENTRY}
          removeRole={"sysadmin"}
          saveRole={ROLE_CONTROLLED_MATERIAL_DATA_ENTRY}
          archiveRole={ROLE_CONTROLLED_MATERIAL_DATA_ENTRY}
        />}
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