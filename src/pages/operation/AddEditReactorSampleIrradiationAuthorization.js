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
  CMD_SUBMIT_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD,
  CMD_SUGGEST_ANALYSIS_JOBS,
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB,
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST,
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVER,
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_DATE,
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_ENTITY,
  NURIMS_OPERATION_DATA_IRRADIATIONDURATION,
  NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES,
  NURIMS_OPERATION_DATA_NEUTRONFLUX,
  NURIMS_OPERATION_DATA_PROPOSED_IRRADIATION_DATE,
  NURIMS_TITLE, NURIMS_WITHDRAWN,
  REACTOR_IRRADIATION_AUTHORIZATION_TOPIC,
  ROLE_IRRADIATION_REQUEST_DATA_ENTRY,
  ROLE_IRRADIATION_REQUEST_SYSADMIN,
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
  getRecordData, record_uuid, setRecordData,
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
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";

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
      {cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms"},
      {cmd: CMD_SUGGEST_ANALYSIS_JOBS, func: "updateAnalysisJobs", params: "jobs"},
      {cmd: "get_sample_types", func: "setSampleTypes", params: "sampletypes"}
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
    const submission_date =
      getRecordData(row, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_DATE, "")
    const approvedby =
      getRecordData(row, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVER, "")
    return {
      mixBlendMode: selected ? 'lighten' : 'inherit',
      color: approvedby === "" ? submission_date === "" ? "inherit" : theme.palette.primary.contrastText : theme.palette.primary.contrastText,
      backgroundColor: approvedby === "" ? submission_date === "" ? "inherit" : theme.palette.warning.light : theme.palette.success.light,
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
      ConsoleLog(this.Module, "submitAuthorizationRequest", "user", user, "record", selection);
    }
    if (getRecordData(selection, NURIMS_OPERATION_DATA_NEUTRONFLUX, "") === "") {
      enqueueErrorSnackbar("Cannot submit request with a blank neutron flux field.");
      return;
    }
    if (getRecordData(selection, NURIMS_OPERATION_DATA_IRRADIATIONDURATION, "") === "") {
      enqueueErrorSnackbar("Cannot submit request with a blank irradiation duration field.");
      return;
    }
    if (getRecordData(selection, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, "") === "") {
      enqueueErrorSnackbar("Cannot submit request with a blank list of samples to be irradiated.");
      return;
    }
    if (getRecordData(selection, NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES,"") === "") {
      enqueueErrorSnackbar("Cannot submit request with a blank sample types list.");
      return;
    }
    const job = getRecordData(selection, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB,"");
    if (job === "") {
      enqueueErrorSnackbar("Cannot submit request with no sample analysis job selected.");
      return;
    }
    if (getRecordData(selection, NURIMS_OPERATION_DATA_PROPOSED_IRRADIATION_DATE, "") === "") {
      enqueueErrorSnackbar("Cannot submit request with no proposed irradiation date.");
      return;
    }

    setRecordData(selection, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_ENTITY, user.profile.username);
    setRecordData(selection, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_DATE, dayjs().toISOString());

    if (selection.item_id === -1 && !selection.hasOwnProperty("record_key")) {
      selection["record_key"] = record_uuid();
    }
    this.props.send({
      cmd: CMD_SUBMIT_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD,
      item_id: selection.item_id,
      "nurims.title": selection[NURIMS_TITLE],
      "nurims.withdrawn": selection[NURIMS_WITHDRAWN],
      metadata: selection.metadata,
      record_key: selection.record_key,
      module: this.Module,
    })
  }

  render() {
    const {confirm_remove, include_archived, selection, show_provenance_view} = this.state;
    const {user} = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "confirm_removed", confirm_remove, "include_archived",
        include_archived, "selection", selection);
    }
    const submission_date =
      getRecordData(selection, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_DATE, "");
    const approvedby =
      getRecordData(selection, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVER, "");
    const submit_disabled = (approvedby !== "" || submission_date !== "") && !selection.changed;
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
            <TitleComponent title={this.props.title}/>
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
          submitDisabled={submit_disabled}
        />}
      </React.Fragment>
    );
  }
}

AddEditReactorSampleIrradiationAuthorization.defaultProps = {
  send: (msg) => {
  },
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