import React from 'react';
import {
  Fab,
  Grid,
  Typography,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {
  CMD_GET_GLOSSARY_TERMS, CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_SSC_RECORDS, ROLE_MAINTENANCE_DATA_ENTRY, SSC_TOPIC,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog, ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import SSCList from "./SSCList";
import SSCMetadata from "./SSCMetadata";
import {ConsoleLog, UserContext} from "../../utils/UserContext";
import {TitleComponent, AddRemoveArchiveSaveProvenanceButtonPanel} from "../../components/CommonComponents";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {isValidUserRole} from "../../utils/UserUtils";
import {setProvenanceRecordsHelper, showProvenanceRecordsViewHelper} from "../../utils/ProvenanceUtils";
import {messageHasResponse, messageStatusOk} from "../../utils/WebsocketUtils";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

export const ADDEDITSSC_REF = "AddEditSSC";

class AddEditSSC extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state["show_provenance_view"] = false;
    this.Module = ADDEDITSSC_REF;
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
      {cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms"}
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
    const {metadata_changed, confirm_remove, include_archived, selection, title, show_provenance_view} = this.state;
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
            <SSCList
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
            <SSCMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
            />
          </Grid>
        </Grid>
        {<AddRemoveArchiveSaveProvenanceButtonPanel
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

AddEditSSC.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default AddEditSSC;