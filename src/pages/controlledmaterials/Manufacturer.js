import React from 'react';
import {
  Grid,
} from "@mui/material";
import {
  CMD_GET_MANUFACTURER_RECORDS,
  CMD_GET_PROVENANCE_RECORDS, CMD_GET_STORAGE_LOCATION_RECORDS,
  ROLE_CONTROLLED_MATERIAL_DATA_ENTRY,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import ManufacturerList from "./ManufacturerList";
import ManufacturerMetadata from "./ManufacturerMetadata";
import {
  TitleComponent,
  AddRemoveArchiveSaveSubmitProvenanceButtonPanel
} from "../../components/CommonComponents";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";

export const MANUFACTURER_REF = "Manufacturer";

class Manufacturer extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state["show_provenance_view"] = false;
    this.Module = MANUFACTURER_REF;
    this.recordTopic = "manufacturer";
    this.recordType = "manufacturer_record";
    this.provenanceRecords = [];
  }

  componentDidMount() {
    // this.getManufacturerRecords();
    this.requestGetRecords(false, true);
  }

  getManufacturerRecords = () => {
    this.props.send({
      cmd: CMD_GET_MANUFACTURER_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "false",
      module: this.Module,
    });
  }

  ws_message = (message) => {
    super.ws_message(message);
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
    // console.log("render - RECORD_TYPE", this.recordTopic);
    const {user} = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "recordTopic", this.recordTopic, "selection", selection);
    }
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
            <ManufacturerList
              ref={this.listRef}
              title={"Manufacturers"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
              includeArchived={include_archived}
              enableRecordArchiveSwitch={true}
              requestGetRecords={this.requestGetRecords}
            />
          </Grid>
          <Grid item xs={7}>
            <ManufacturerMetadata
              ref={this.metadataRef}
              onChange={this.onRecordMetadataChanged}
              properties={this.props.properties}
              glossary={this.props.glossary}
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
          addRecordButtonLabel={"Add Manufacturer"}
          removeRecordButtonLabel={"Remove Manufacturer"}
          addRole={ROLE_CONTROLLED_MATERIAL_DATA_ENTRY}
          removeRole={"sysadmin"}
          saveRole={ROLE_CONTROLLED_MATERIAL_DATA_ENTRY}
          archiveRole={ROLE_CONTROLLED_MATERIAL_DATA_ENTRY}
          ignoreSaveDisabledIfNotCreator={true}
        />}
      </React.Fragment>
    );
  }
}

Manufacturer.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default Manufacturer;