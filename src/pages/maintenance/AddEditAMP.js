import React from 'react';
import {withTheme} from "@mui/styles";
import {
  Grid,
} from "@mui/material";
import {
  CMD_GET_GLOSSARY_TERMS, CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_SSC_RECORDS, ROLE_MAINTENANCE_DATA_ENTRY, SSC_TOPIC,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import AMPList from "./AMPList";
import AMPMetadata from "./AMPMetadata";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  TitleComponent,
  AddRemoveArchiveSaveSubmitProvenanceButtonPanel
} from "../../components/CommonComponents";
import {isValidUserRole} from "../../utils/UserUtils";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";
import {
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";

export const ADDEDITAMP_REF = "AddEditAMP";

class AddEditAMP extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state["show_provenance_view"] = false;
    this.Module = ADDEDITAMP_REF;
    this.recordTopic = SSC_TOPIC;
    this.provenanceRecords = [];
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    this.props.send({
      cmd: CMD_GET_SSC_RECORDS,
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
    const {metadata_changed, confirm_remove, include_archived, selection, show_provenance_view} = this.state;
    const {user} = this.props;
    const isSysadmin = isValidUserRole(user, "sysadmin");
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "metadata_changed", metadata_changed,
        "confirm_removed", confirm_remove, "include_archived", include_archived, "selection", selection);
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
          <Grid item xs={3}>
            <AMPList
              ref={this.listRef}
              title={"SSC's"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={9}>
            <AMPMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
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
          addRecordButtonLabel={"Add SSC"}
          removeRecordButtonLabel={"Remove SSC"}
          addRole={ROLE_MAINTENANCE_DATA_ENTRY}
          removeRole={"sysadmin"}
          saveRole={ROLE_MAINTENANCE_DATA_ENTRY}
          archiveRole={ROLE_MAINTENANCE_DATA_ENTRY}
        />}
      </React.Fragment>
    );
  }
}

AddEditAMP.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(AddEditAMP);