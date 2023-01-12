
import React from 'react';
import {
  ConsoleLog,
  UserDebugContext
} from "../../../utils/UserDebugContext";
import {
  ConfirmRemoveRecordDialog
} from "../../../components/UtilityDialogs";
import {
  CMD_DELETE_USER_RECORD,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORDS,
  CMD_GET_REACTOR_WATER_SAMPLE_RECORDS,
  CMD_GET_SSC_RECORDS,
  CMD_SUGGEST_ANALYSIS_JOBS,
  CMD_UPDATE_REACTOR_WATER_SAMPLE_RECORD,
  ITEM_ID,
  METADATA, NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER,
  NURIMS_SAMPLEDATE, NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
  OPERATION_TOPIC,
  REACTOR_IRRADIATION_AUTHORIZATION_TOPIC,
  SSC_TOPIC
} from "../../../utils/constants";
import {
  Box, Button,
  Fab,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import {v4 as uuid} from "uuid";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../../utils/WebsocketUtils";
import {
  ArchiveRecordLabel
} from "../../../utils/RenderUtils";
import {toast} from "react-toastify";
import WaterSamplesList from "./WaterSamplesList";
import WaterSampleMetadata from "./WaterSampleMetadata";
// import {
//   getRecordMetadataValue
// } from "../../../utils/MetadataUtils";
import {TitleComponent} from "../../../components/CommonComponents";
import PropTypes from "prop-types";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {ADDEDITAMP_REF} from "../../maintenance/AddEditAMP";
import BaseRecordManager from "../../../components/BaseRecordManager";
import ReactorSampleIrradiationAuthorizationRecordsList from "./ReactorSampleIrradiationAuthorizationRecordsList";
import ReactorSampleIrradiationAuthorizationMetadata from "./ReactorSampleIrradiationAuthorizationMetadata";
import {format} from "date-fns";
import {getRecordData, getRecordMetadataValue} from "../../../utils/MetadataUtils";
import {withTheme} from "@mui/styles";

export const ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF = "AddEditReactorSampleIrradiationAuthorization";

class AddEditReactorSampleIrradiationAuthorization extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF;
    this.recordTopic = REACTOR_IRRADIATION_AUTHORIZATION_TOPIC;
  }

  getNewRecordName = () => {
    return format(new Date(), 'yyyyMMdd-HHmm');
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
  }

  renderCellStyle = (row, cell, theme, selected) => {
    const unauthorized = getRecordData(row, NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER, null) === null;
    return {
      mixBlendMode: selected ? 'lighten' : 'inherit',
      color: unauthorized ? theme.palette.primary.contrastText : theme.palette.primary.light,
      backgroundColor: unauthorized ? theme.palette.warning.dark : theme.components.MuiTableRow.styleOverrides.root.backgroundColor,
    }
  }

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection} = this.state;
    const has_changed_records = this.hasChangedRecords();
    if (this.context.debug > 5) {
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
              onChange={this.onRecordMetadataChanged}
              send={this.props.send}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            m: 1,
          }}
        >
          <Button
            variant={"contained"}
            endIcon={<RemoveCircleIcon />}
            onClick={this.removeRecord}
            disabled={!this.isValidSelection(selection)}
            size={"small"}
            color={"primary"}
            aria-label={"remove"}
          >
            Remove Authorization
          </Button>
          <Button
            variant={"contained"}
            endIcon={this.isRecordArchived(selection) ? <UnarchiveIcon /> : <ArchiveIcon />}
            onClick={this.changeRecordArchivalStatus}
            disabled={!this.isValidSelection(selection)}
            size={"small"}
            color={"primary"}
            aria-label={"archive"}
          >
            {this.isRecordArchived(selection) ? "Restore Authorization" : "Archive Authorization"}
          </Button>
          <Button
            variant={"contained"}
            endIcon={<SaveIcon />}
            onClick={this.saveChanges}
            disabled={!has_changed_records}
            size={"small"}
            color={"primary"}
            aria-label={"save"}
          >
            Save Authorization
          </Button>
          <Button
            variant={"contained"}
            endIcon={<AddIcon />}
            onClick={this.addRecord}
            size={"small"}
            color={"primary"}
            aria-label={"add"}
          >
            Add Authorization
          </Button>
        </Box>
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
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default withTheme(AddEditReactorSampleIrradiationAuthorization);