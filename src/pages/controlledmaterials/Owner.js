import React from 'react';
import {
  Grid,
} from "@mui/material";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog, ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import OwnerList from "./OwnerList";
import OwnerMetadata from "./OwnerMetadata";
import {
  TitleComponent,
  AddRemoveArchiveSaveSubmitProvenanceButtonPanel
} from "../../components/CommonComponents";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import PropTypes from "prop-types";
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_OWNER_RECORDS,
  CMD_GET_PROVENANCE_RECORDS,
  ROLE_CONTROLLED_MATERIAL_DATA_ENTRY
} from "../../utils/constants";
import {
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";

export const OWNER_REF = "Owner";

class Owner extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state["show_provenance_view"] = false;
    this.Module = OWNER_REF;
    this.recordTopic = "owner";
    this.provenanceRecords = [];
  }

  componentDidMount() {
    // this.getOwnerRecords();
    this.requestGetRecords(false, true);
  }

  getOwnerRecords = () => {
    this.props.send({
      cmd: CMD_GET_OWNER_RECORDS,
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
            <OwnerList
              ref={this.listRef}
              title={"Owners"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
              includeArchived={include_archived}
              enableRecordArchiveSwitch={true}
              requestGetRecords={this.requestGetRecords}
            />
          </Grid>
          <Grid item xs={7}>
            <OwnerMetadata
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
          addRecordButtonLabel={"Add Owner"}
          removeRecordButtonLabel={"Remove Owner"}
          addRole={ROLE_CONTROLLED_MATERIAL_DATA_ENTRY}
          removeRole={"sysadmin"}
          saveRole={ROLE_CONTROLLED_MATERIAL_DATA_ENTRY}
          archiveRole={ROLE_CONTROLLED_MATERIAL_DATA_ENTRY}
        />}
      </React.Fragment>
    );
  }
}

Owner.propTypes = {
  send: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

Owner.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default Owner;