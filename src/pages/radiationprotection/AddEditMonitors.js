import React from 'react';
import {
  Fab,
  Grid,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MonitorList from "./MonitorList";
import MonitorMetadata from "./MonitorMetadata";
import {
  CMD_DELETE_PERSONNEL_RECORD,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_PROVENANCE_RECORDS,
  FIXED_LOCATION_MONITOR_RECORD,
  ITEM_ID,
  MONITOR_RECORD_TYPE,
  MONITOR_TOPIC,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmBatchRemoveRecordDialog,
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {ConsoleLog} from "../../utils/UserContext";
import {TitleComponent, AddEditButtonPanel} from "../../components/CommonComponents";
import BusyIndicator from "../../components/BusyIndicator";
import {readString} from "react-papaparse";
import {
  getRecordMetadataValue,
  parseMonitorRecordFromLine,
  parsePersonnelRecordFromLine
} from "../../utils/MetadataUtils";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {isValidUserRole} from "../../utils/UserUtils";
import {
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";


export const ADDEDITMONITORS_REF = "AddEditMonitors";

class AddEditMonitors extends BaseRecordManager {
  constructor(props) {
    super(props);
    this.state["busy"] = false;
    this.state["open_batch_remove"] = false;
    this.state["confirm_batch_remove"] = false;
    this.state["batch_selection"] = {"nurims.title": "Monitor"};
    this.state["show_provenance_view"] = false;
    this.Module = ADDEDITMONITORS_REF;
    this.recordTopic = MONITOR_TOPIC;
    this.provenanceRecords = [];
    this.importFileRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.ctrlKeyPress, false);
    this.requestGetRecords(false, true);
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.ctrlKeyPress, false);
  }

  ctrlKeyPress = (event) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ctrlKeyPress", "key", event.key, "ctrlKey", event.ctrlKey);
    }
    if (event.key === 'i' && event.ctrlKey) {
      // Ctrl+i
      event.preventDefault();
      if (this.importFileRef.current) {
        this.importFileRef.current.click();
      }
    } else if (event.key === 'r' && event.ctrlKey) {
      // Ctrl+r
      event.preventDefault();
      this.setState({
        open_batch_remove: true,
        confirm_batch_remove: true,
        batch_selection: {"nurims.title": "Personnel"}
      });
    }
  }

  proceedWithBatchRemove = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithBatchRemove", "batch_selection", this.state.batch_selection);
    }

    if (this.listRef.current) {
      const records = this.listRef.current.getRecords();
      for (const record of records) {
        const item_id = record[ITEM_ID];
        if (item_id === -1) {
          if (this.listRef.current) {
            this.listRef.current.removeRecord(record);
          }
        } else {
          this.props.send({
            cmd: CMD_DELETE_PERSONNEL_RECORD,
            item_id: item_id,
            "include.withdrawn": "true",
            module: this.Module,
          });
        }

      }
    };

    this.setState({confirm_batch_remove: false,});
  }

  cancelBatchRemove = () => {
    this.setState({confirm_batch_remove: false,});
  }

  ws_message = (message) => {
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
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

  handleImportMonitors = (e) => {
    const selectedFile = e.target.files[0];
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleImportMonitors", "selectedFile", selectedFile);
    }
    const records = (this.listRef.current) ? this.listRef.current.getRecords() : [];
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      alert('Unable to read ' + selectedFile.name);
      enqueueErrorSnackbar(`Error occurred reading file: ${selectedFile.name}`)
    };
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (e) {
      const results = readString(e.target.result, {header: true});
      const header = results.meta.fields;
      const ts_column = results.meta.fields;
      let parseHeader = true;
      if (results.hasOwnProperty("data")) {
        for (const row of results.data) {
          if (row.hasOwnProperty("Type") && row.Type === FIXED_LOCATION_MONITOR_RECORD) {
            let add = true;
            for (const monitor of records) {
              if (row.hasOwnProperty("Id") && row.Id === getRecordMetadataValue(monitor, NURIMS_ENTITY_DOSE_PROVIDER_ID, "-")) {
                add = false;
                break;
              }
            }
            if (add) {
              const p = parseMonitorRecordFromLine(row, MONITOR_RECORD_TYPE, that.context.user.profile.username);
              if (p) {
                p["changed"] = true;
                records.push(p);
              }
            }
          }
        }
      }
      that.setState({busy: 0});
    };
    this.setState({busy: 1});
  }

  render() {
    const {confirm_remove, selection, include_archived, confirm_batch_remove, batch_selection, busy,
      show_provenance_view} = this.state;
    const {user} = this.props;
    const has_changed_records = this.hasChangedRecords();
    const isSysadmin = isValidUserRole(user, "sysadmin");
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "has_changed_records", has_changed_records,
        "confirm_removed", confirm_remove, "include_archived", include_archived, "selection", selection,
        "confirm_batch_remove", confirm_batch_remove, "batch_selection", batch_selection);
    }
    return (
      <React.Fragment>
        <BusyIndicator open={busy > 0} loader={"bar"} size={40}/>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <ConfirmBatchRemoveRecordDialog open={confirm_batch_remove}
                                        selection={batch_selection}
                                        onProceed={this.proceedWithBatchRemove}
                                        onCancel={this.cancelBatchRemove}
        />
        <ShowProvenanceRecordsDialog open={show_provenance_view}
                                     selection={selection}
                                     body={this.provenanceRecords.join("\n")}
                                     onCancel={this.closeProvenanceRecordsView}
        />
        <input
          ref={this.importFileRef}
          accept="*.json"
          id="import-file-uploader"
          style={{display: 'none',}}
          onChange={this.handleImportMonitors}
          type="file"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={5}>
            <MonitorList
              ref={this.listRef}
              title={"Monitors"}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              properties={this.props.properties}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={7}>
            <MonitorMetadata
              ref={this.metadataRef}
              onChange={this.onRecordMetadataChanged}
              properties={this.props.properties}
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
          addRecordButtonLabel={"Add Monitor"}
          removeRecordButtonLabel={"Remove Monitor"}
          addRole={"radiation_protection_data_entry"}
          removeRole={"sysadmin"}
          saveRole={"radiation_protection_data_entry"}
          archiveRole={"radiation_protection_data_entry"}
        />}
        {/*<Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>*/}
        {/*  <Fab*/}
        {/*    variant="extended"*/}
        {/*    size="small"*/}
        {/*    color="primary"*/}
        {/*    aria-label="remove"*/}
        {/*    onClick={this.removeRecord}*/}
        {/*    // disabled={!((selection["nurims.withdrawn"] === 1) || selection["item_id"] === -1)}>*/}
        {/*    disabled={!this.isSysadminButtonAccessible(selection)}*/}
        {/*  >*/}
        {/*    <RemoveCircleOutlineIcon sx={{mr: 1}}/>*/}
        {/*    Remove Monitor*/}
        {/*  </Fab>*/}
        {/*  { isSysadmin &&*/}
        {/*    <Fab*/}
        {/*      variant="extended"*/}
        {/*      size="small"*/}
        {/*      color="primary"*/}
        {/*      aria-label="save"*/}
        {/*      onClick={this.showProvenanceRecordsView}*/}
        {/*      disabled={!selection.hasOwnProperty("item_id")}*/}
        {/*    >*/}
        {/*      <VisibilityIcon sx={{mr: 1}}/>*/}
        {/*      View Provenance Records*/}
        {/*    </Fab>*/}
        {/*  }*/}
        {/*  <Fab*/}
        {/*    variant="extended"*/}
        {/*    size="small"*/}
        {/*    color="primary"*/}
        {/*    aria-label="archive"*/}
        {/*    component={"span"}*/}
        {/*    onClick={this.changeRecordArchivalStatus}*/}
        {/*    disabled={!this.isSysadminButtonAccessible(selection)}*/}
        {/*  >*/}
        {/*    {this.isRecordArchived(selection) ?*/}
        {/*      <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore Monitor Record"</React.Fragment> :*/}
        {/*      <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive Monitor Record"</React.Fragment>}*/}
        {/*  </Fab>*/}
        {/*  <Fab*/}
        {/*    variant="extended"*/}
        {/*    size="small"*/}
        {/*    color="primary"*/}
        {/*    aria-label="save"*/}
        {/*    onClick={this.saveChanges}*/}
        {/*    disabled={!has_changed_records}*/}
        {/*  >*/}
        {/*    <SaveIcon sx={{mr: 1}}/>*/}
        {/*    Save Changes*/}
        {/*  </Fab>*/}
        {/*  <Fab*/}
        {/*    variant="extended"*/}
        {/*    size="small"*/}
        {/*    color="primary"*/}
        {/*    aria-label="add"*/}
        {/*    onClick={this.addRecord}*/}
        {/*  >*/}
        {/*    <AddCircleOutlineIcon sx={{mr: 1}}/>*/}
        {/*    Add Monitor*/}
        {/*  </Fab>*/}
        {/*</Box>*/}
      </React.Fragment>
    );
  }
}

AddEditMonitors.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default AddEditMonitors;