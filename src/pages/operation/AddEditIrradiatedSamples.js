import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  AddIrradiatedSampleLogRecordDialog,
  ConfirmRemoveRecordDialog
} from "../../components/UtilityDialogs";
import {
  CMD_DELETE_ITEM_RECORD,
  CMD_DELETE_USER_RECORD,
  CMD_GET_SAMPLE_IRRADIATION_LOG_RECORD_FOR_YEAR,
  CMD_GET_SAMPLE_IRRADIATION_LOG_RECORDS,
  CMD_UPDATE_ITEM_RECORD,
  CMD_UPDATE_REACTOR_WATER_SAMPLE_RECORD,
  IRRADIATED_SAMPLE_LOG_RECORD_TYPE,
  ITEM_ID,
  METADATA,
  NURIMS_SAMPLEDATE,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
  OPERATION_TOPIC,
  ROLE_IRRADIATION_REQUEST_DATA_ENTRY,
  ROLE_IRRADIATION_REQUEST_SYSADMIN,
} from "../../utils/constants";
import {
  Box,
  Fab,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  RemoveCircle as RemoveCircleIcon, Unpublished as UnpublishedIcon, CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageHasResponseObject,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  ArchiveRecordLabel
} from "../../utils/RenderUtils";
import {
  getRecordMetadataValue,
  isRecordChanged,
  isValidSelection,
  new_record,
  record_uuid,
  recordHasRecordKey
} from "../../utils/MetadataUtils";
import {
  AddRemoveArchiveSaveSubmitProvenanceButtonPanel,
  TitleComponent
} from "../../components/CommonComponents";
import {
  enqueueErrorSnackbar,
  enqueueSuccessSnackbar
} from "../../utils/SnackbarVariants";
import IrradiatedSamplesList from "./IrradiatedSamplesList";
import IrradiatedSamplesMetadata from "./IrradiatedSamplesMetadata";
import {saveRecordChanges} from "../../utils/RecordUtils";

export const ADDEDITIRRADIATEDSAMPLES_REF = "AddEditIrradiatedSamples";

class AddEditIrradiatedSamples extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      confirm_add: false,
      selection: {},
      title: props.title,
      include_archived: false,
    };
    this.Module = ADDEDITIRRADIATEDSAMPLES_REF;
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
  }

  componentDidMount() {
    this.requestGetRecords(this.state.include_archived);
  }

  isAccesibleButton = (selection) => {
    return (selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
  }

  changeRecordArchivalStatus = () => {
    console.log("changeRecordArchivalStatus - selection", this.state.selection)
    const selection = this.state.selection;
    if (selection.hasOwnProperty(NURIMS_WITHDRAWN)) {
      selection[NURIMS_WITHDRAWN] = selection[NURIMS_WITHDRAWN] === 0 ? 1 : 0;
      selection.changed = true;
      this.setState({selection: selection, metadata_changed: selection.changed});
    }
  }

  onRecordMetadataChanged = (state) => {
    this.setState({metadata_changed: state});
  }

  removeRecord = () => {
    this.setState({confirm_remove: true,});
  }

  cancelRemove = () => {
    this.setState({confirm_remove: false,});
  }

  proceedWithRemove = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithRemove", "selection", this.state.selection);
    }

    this.setState({confirm_remove: false,});

    if (this.state.selection.item_id === -1) {
      if (this.listRef.current) {
        this.listRef.current.removeRecord(this.state.selection)
      }
    } else {
      // const records = this.listRef.current.getRecords();
      // for (const record of records) {
      //   console.log(">>>", record)
      //   this.props.send({
      //     cmd: CMD_DELETE_ITEM_RECORD,
      //     item_id: record.item_id,
      //     module: this.Module,
      //   });
      // }

    }
  }

  addRecord = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "addRecord");
    }
    this.setState({confirm_add: true,});
  }

  cancelAdd = () => {
    this.setState({confirm_add: false,});
  }

  proceedWithAdd = (year) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithAdd", "year", year);
    }

    this.props.send({
      cmd: CMD_GET_SAMPLE_IRRADIATION_LOG_RECORD_FOR_YEAR,
      "include.disabled": "true",
      "startDate": `${year}-01-01`,
      "endDate": `${year}-12-31`,
      module: this.Module,
    })
    // this.setState({include_archived: true});

    this.setState({confirm_add: false,});
  }

  requestGetRecords = (include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    this.props.send({
      cmd: CMD_GET_SAMPLE_IRRADIATION_LOG_RECORDS,
      "include.disabled": include_archived ? "true" : "false",
      module: this.Module,
    })
    this.setState({include_archived: include_archived});
  }

  saveChanges = () => {
    const record = this.state.selection;
    if (this.context.debug) {
      ConsoleLog(this.Module, "saveChanges", "record", record);
    }
    if (isRecordChanged(record)) {
      saveRecordChanges(record, OPERATION_TOPIC, IRRADIATED_SAMPLE_LOG_RECORD_TYPE, this.Module,
        null, this.props.send);
    }

    this.setState({metadata_changed: false})
  }

  ws_message(message) {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_SAMPLE_IRRADIATION_LOG_RECORDS)) {
          const selection = this.state.selection;
          if (Object.keys(selection).length === 0) {
            if (this.listRef.current) {
              this.listRef.current.setRecords(response.operation);
            }
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata();
            }
          } else {
            if (!message.hasOwnProperty("item_id") && this.listRef.current) {
              // this.listRef.current.setRecords(response[this.recordTopic], true);
              this.listRef.current.setRecords(response.operation);
            }
            if (message.hasOwnProperty("item_id")) {
              // const record = getMatchingResponseObject(message, "response." + this.recordTopic, "item_id", selection["item_id"]);
              const record = getMatchingResponseObject(message, "response.operation", "item_id", selection["item_id"]);
              selection[METADATA] = [...record[METADATA]]
              if (this.metadataRef.current) {
                this.metadataRef.current.setRecordMetadata(selection);
              }
            }
          }
        } else if (isCommandResponse(message, CMD_GET_SAMPLE_IRRADIATION_LOG_RECORD_FOR_YEAR)) {
          if (messageHasResponseObject(message, OPERATION_TOPIC)) {
            const year = message.hasOwnProperty("startDate") ? message.startDate.split("-")[0] : "0000"
            if (message.response[OPERATION_TOPIC].length === 0) {
              this.listRef.current.addRecords([new_record(
                -1,
                year,
                0,
                this.context.user.profile.username,
                this.context.user.profile.fullname,
                IRRADIATED_SAMPLE_LOG_RECORD_TYPE
              )], false);
              this.setState({metadata_changed: true});
            } else {
              enqueueErrorSnackbar(`A record for year ${year} already exists!`);
            }
          }
        } else if (isCommandResponse(message, CMD_UPDATE_ITEM_RECORD)) {
          enqueueSuccessSnackbar(`Successfully updated record for ${message[NURIMS_TITLE]}.`);
          const selection = this.state.selection;
          // const record = getMatchingResponseObject(message, "response.operation", "item_id", selection["item_id"]);
          // console.log("----->", record)
          // selection[METADATA] = [...record[METADATA]]
          if (this.listRef.current) {
            this.listRef.current.updateRecord(response.operation);
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setRecordMetadata(selection);
          }
        } else if (isCommandResponse(message, CMD_DELETE_USER_RECORD)) {
          enqueueSuccessSnackbar(`Record (id: ${response.item_id}) deleted successfully`)
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setRecordMetadata({})
          }
          this.setState({selection: {}, metadata_changed: false});
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  onRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
    }
    if (selection.hasOwnProperty("item_id") && selection.item_id === -1) {
      if (this.metadataRef.current) {
        this.metadataRef.current.setRecordMetadata(selection)
      }
    } else {
      this.setState(pstate => {
        return {selection: selection}
      });
      this.props.send({
        cmd: CMD_GET_SAMPLE_IRRADIATION_LOG_RECORDS,
        item_id: selection.item_id,
        "include.metadata": "true",
        module: this.Module,
      })
    }
    this.setState({selection: selection})
  }

  isRecordArchived = (record) => {
    return (record.hasOwnProperty(NURIMS_WITHDRAWN) && record[NURIMS_WITHDRAWN] === 1);
  }
  // onRecordSelection = (selection) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
  //   }
  //   if (selection.hasOwnProperty("item_id")) {
  //     if (this.metadataRef.current) {
  //       this.metadataRef.current.setRecordMetadata(selection)
  //     }
  //   }
  //   this.setState({selection: selection})
  // }

  render() {
    const {metadata_changed, confirm_remove, confirm_add, include_archived, selection} = this.state;
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
        <AddIrradiatedSampleLogRecordDialog open={confirm_add}
                                   selection={selection}
                                   onProceed={this.proceedWithAdd}
                                   onCancel={this.cancelAdd}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={4}>
            <IrradiatedSamplesList
              ref={this.listRef}
              title={"Irradiated Samples"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={8}>
            <IrradiatedSamplesMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
            />
          </Grid>
        </Grid>
        {<AddRemoveArchiveSaveSubmitProvenanceButtonPanel
          THIS={this}
          user={this.context.user}
          // archiveRecordButtonLabel={this.isRecordArchived(selection) ? "Restore Record" : "Archive Record"}
          // archiveRecordIcon={this.isRecordArchived(selection) ?
          //   <VisibilityIcon sx={{mr: 1}}/> : <VisibilityOffIcon sx={{mr: 1}}/>}
          onClickAddRecord={this.addRecord}
          onClickChangeRecordArchivalStatus={this.changeRecordArchivalStatus}
          onClickRemoveRecord={this.removeRecord}
          onClickSaveRecordChanges={this.saveChanges}
          onClickViewProvenanceRecords={this.showProvenanceRecordsView}
          addRole={ROLE_IRRADIATION_REQUEST_DATA_ENTRY}
          addRecordButtonLabel={"Add Irradiated Samples Log"}
          removeRecordButtonLabel={"Remove Annual Irradiated Samples Log"}
          removeRole={ROLE_IRRADIATION_REQUEST_SYSADMIN}
          saveRole={ROLE_IRRADIATION_REQUEST_DATA_ENTRY}
          archiveRole={ROLE_IRRADIATION_REQUEST_SYSADMIN}
          enableSubmitButton={false}
          enableRemoveButton={true}
          enableSaveButton={true}
        />}
        {/*<Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}*/}
        {/*       disabled={selection === -1}>*/}
        {/*    <RemoveCircleIcon sx={{mr: 1}}/>*/}
        {/*    Remove SSC*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}*/}
        {/*       onClick={this.changeRecordArchivalStatus} disabled={!this.isAccesibleButton(selection)}>*/}
        {/*    {ArchiveRecordLabel(selection, "Run")}*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}*/}
        {/*       disabled={!metadata_changed}>*/}
        {/*    <SaveIcon sx={{mr: 1}}/>*/}
        {/*    Save Changes*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>*/}
        {/*    <AddIcon sx={{mr: 1}}/>*/}
        {/*    Add Annual Irradiated Samples Log*/}
        {/*  </Fab>*/}
        {/*</Box>*/}
      </React.Fragment>
    );
  }
}

AddEditIrradiatedSamples.defaultProps = {
  send: (msg) => {},
};

export default AddEditIrradiatedSamples;