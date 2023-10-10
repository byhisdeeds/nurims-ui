import React from 'react';
import {
  ConsoleLog,
  UserDebugContext
} from "../../utils/UserDebugContext";
import {
  ConfirmRemoveRecordDialog, ShowProvenanceRecordsDialog
} from "../../components/UtilityDialogs";
import {
  CMD_GET_GLOSSARY_TERMS, CMD_GET_PROVENANCE_RECORDS,
  CMD_SUGGEST_ANALYSIS_JOBS,
  NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER,
  REACTOR_IRRADIATION_AUTHORIZATION_TOPIC,
} from "../../utils/constants";
import {
  Grid,
} from "@mui/material";
import {TitleComponent} from "../../components/CommonComponents";
import PropTypes from "prop-types";
import BaseRecordManager from "../../components/BaseRecordManager";
import ReactorSampleIrradiationAuthorizationRecordsList from "./ReactorSampleIrradiationAuthorizationRecordsList";
import ReactorSampleIrradiationAuthorizationMetadata from "./ReactorSampleIrradiationAuthorizationMetadata";
import {
  getRecordData,
} from "../../utils/MetadataUtils";
import {withTheme} from "@mui/styles";
import dayjs from 'dayjs';
import {AddEditButtonPanel} from "../../utils/UiUtils";
import {setProvenanceRecordsHelper, showProvenanceRecordsViewHelper} from "../../utils/ProvenanceUtils";
import {messageHasResponse, messageStatusOk} from "../../utils/WebsocketUtils";

export const ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF =
  "AddEditReactorSampleIrradiationAuthorization";

class AddEditReactorSampleIrradiationAuthorization extends BaseRecordManager {
  static contextType = UserDebugContext;

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
      if (messageStatusOk(message)) {
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

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection, show_provenance_view} = this.state;
    const {user} = this.props;
    const has_changed_records = this.hasChangedRecords();
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "has_changed_records", has_changed_records,
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
        {<AddEditButtonPanel
          THIS={this}
          user={user}
          onClickAddRecord={this.addRecord}
          onClickChangeRecordArchivalStatus={this.changeRecordArchivalStatus}
          onClickRemoveRecord={this.removeRecord}
          onClickSaveRecordChanges={this.saveChanges}
          onClickViewProvenanceRecords={this.showProvenanceRecordsView}
          addRecordButtonLabel={"Add Authorization"}
          removeRecordButtonLabel={"Remove Authorization"}
        />}
        {/*<Box*/}
        {/*  sx={{*/}
        {/*    display: 'flex',*/}
        {/*    flexDirection: 'row',*/}
        {/*    justifyContent: 'space-around',*/}
        {/*    m: 1,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    variant={"contained"}*/}
        {/*    endIcon={<RemoveCircleIcon />}*/}
        {/*    onClick={this.removeRecord}*/}
        {/*    disabled={!this.isSysadminButtonAccessible(selection)}*/}
        {/*    size={"small"}*/}
        {/*    color={"primary"}*/}
        {/*    aria-label={"remove"}*/}
        {/*  >*/}
        {/*    Remove Authorization*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    variant={"contained"}*/}
        {/*    endIcon={this.isRecordArchived(selection) ? <UnarchiveIcon /> : <ArchiveIcon />}*/}
        {/*    onClick={this.changeRecordArchivalStatus}*/}
        {/*    disabled={!this.isSysadminButtonAccessible(selection)}*/}
        {/*    size={"small"}*/}
        {/*    color={"primary"}*/}
        {/*    aria-label={"archive"}*/}
        {/*  >*/}
        {/*    {this.isRecordArchived(selection) ? "Restore Authorization" : "Archive Authorization"}*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    variant={"contained"}*/}
        {/*    endIcon={<SaveIcon />}*/}
        {/*    onClick={this.saveChanges}*/}
        {/*    disabled={!has_changed_records}*/}
        {/*    size={"small"}*/}
        {/*    color={"primary"}*/}
        {/*    aria-label={"save"}*/}
        {/*  >*/}
        {/*    Save Authorization*/}
        {/*  </Button>*/}
        {/*  <Button*/}
        {/*    variant={"contained"}*/}
        {/*    endIcon={<AddIcon />}*/}
        {/*    onClick={this.addRecord}*/}
        {/*    size={"small"}*/}
        {/*    color={"primary"}*/}
        {/*    aria-label={"add"}*/}
        {/*  >*/}
        {/*    Add Authorization*/}
        {/*  </Button>*/}
        {/*</Box>*/}
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