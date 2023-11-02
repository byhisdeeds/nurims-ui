import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog
} from "../../components/UtilityDialogs";
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_PROVENANCE_RECORDS,
  CMD_SUGGEST_ANALYSIS_JOBS,
  NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER, NURIMS_SUBMISSION_DATE, NURIMS_SUBMISSION_ENTITY,
  REACTOR_IRRADIATION_AUTHORIZATION_TOPIC, ROLE_IRRADIATION_REQUEST_DATA_ENTRY, ROLE_IRRADIATION_REQUEST_SYSADMIN,
} from "../../utils/constants";
import {
  Grid,
} from "@mui/material";
import {
  TitleComponent,
  AddRemoveArchiveSaveSubmitProvenanceButtonPanel
} from "../../components/CommonComponents";
import PropTypes from "prop-types";
import BaseRecordManager from "../../components/BaseRecordManager";
import ReactorSampleIrradiationAuthorizationRecordsList from "./ReactorSampleIrradiationAuthorizationRecordsList";
import ReactorSampleIrradiationAuthorizationMetadata from "./ReactorSampleIrradiationAuthorizationMetadata";
import {
  getRecordData, setRecordData,
} from "../../utils/MetadataUtils";
import {withTheme} from "@mui/styles";
import dayjs from 'dayjs';
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";
import {
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";

export const ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF =
  "AddEditReactorSampleIrradiationAuthorization";

class AddEditReactorSampleIrradiationAuthorization extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state["show_provenance_view"] = false;
    this.Module = ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF;
    this.recordTopic = REACTOR_IRRADIATION_AUTHORIZATION_TOPIC;
    this.provenanceRecords = [];
  }

  getNewRecordName = () => {
    // 20230112-1128
    return dayjs().format('YYYYMMDD-HHmm');
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    this.props.send({
      cmd: "get_sample_types",
      module: this.Module,
    });
    this.requestGetRecords(false, true);
  }

  ws_message = (message) => {
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" },
      { cmd: CMD_SUGGEST_ANALYSIS_JOBS, func: "updateAnalysisJobs", params: "jobs" },
      { cmd: "get_sample_types", func: "setSampleTypes", params: "sampletypes" }
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

  renderCellStyle = (row, cell, theme, selected) => {
    const unauthorized = getRecordData(row, NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER, null) === null;
    return {
      mixBlendMode: selected ? 'lighten' : 'inherit',
      color: unauthorized ? theme.palette.primary.contrastText : theme.palette.primary.light,
      backgroundColor: unauthorized ? theme.palette.warning.light : theme.components.MuiTableRow.styleOverrides.root.backgroundColor,
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

  submitAuthorizationRequest = (event, reason) => {
    const user = this.context.user;
    const selection = this.state.selection;
    if (this.context.debug) {
      ConsoleLog(this.Module, "submitAuthorizationRequest","user", user, "record", selection);
    }
    setRecordData(selection, NURIMS_SUBMISSION_ENTITY, user.profile.username);
    setRecordData(selection, NURIMS_SUBMISSION_DATE, dayjs().toISOString());

    console.log("===============")
    console.log(selection)
    console.log("===============")

    this.saveChanges();
  }

  render() {
    const {confirm_remove, include_archived, selection, show_provenance_view} = this.state;
    const {user} = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render","confirm_removed", confirm_remove, "include_archived",
        include_archived, "selection", selection);
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
          <Grid item xs={4}>
            <ReactorSampleIrradiationAuthorizationRecordsList
              ref={this.listRef}
              title={"Authorization's"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
              renderCellStyle={this.renderCellStyle}
            />
          </Grid>
          <Grid item xs={8}>
            <ReactorSampleIrradiationAuthorizationMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              user={this.props.user}
              onChange={this.onRecordMetadataChanged}
              send={this.props.send}
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
          addRecordButtonLabel={"Add Authorization"}
          removeRecordButtonLabel={"Remove Authorization"}
          addRole={ROLE_IRRADIATION_REQUEST_DATA_ENTRY}
          removeRole={ROLE_IRRADIATION_REQUEST_SYSADMIN}
          saveRole={ROLE_IRRADIATION_REQUEST_DATA_ENTRY}
          archiveRole={ROLE_IRRADIATION_REQUEST_SYSADMIN}
          submitRole={ROLE_IRRADIATION_REQUEST_DATA_ENTRY}
          submitRecordButtonLabel={"Submit Request"}
          onClickSubmitRecord={this.submitAuthorizationRequest}
        />}
      </React.Fragment>
    );
  }
}

AddEditReactorSampleIrradiationAuthorization.defaultProps = {
  send: (msg) => {},
};

AddEditReactorSampleIrradiationAuthorization.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default withTheme(AddEditReactorSampleIrradiationAuthorization);