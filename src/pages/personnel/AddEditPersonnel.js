import React from 'react';
import {
  Grid,
} from "@mui/material";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmBatchRemoveRecordDialog,
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import PersonList from "./PersonList";
import PersonMetadata from "./PersonMetadata";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  TitleComponent,
  AddRemoveArchiveSaveSubmitProvenanceButtonPanel
} from "../../components/CommonComponents";
import {
  CMD_DELETE_PERSONNEL_RECORD,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_PROVENANCE_RECORDS,
  EMPLOYEE_RECORD_TYPE,
  ITEM_ID,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
  PERSONNEL_TOPIC,
  ROLE_PERSONNEL_DATA_ENTRY,
  ROLE_SYSADMIN
} from "../../utils/constants";
import {readString} from "react-papaparse";
import {
  getRecordMetadataValue,
  parsePersonnelRecordFromLine,
} from "../../utils/MetadataUtils";
import BusyIndicator from "../../components/BusyIndicator";
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
import {
  isValidUserRole
} from "../../utils/UserUtils";
import {
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";

export const ADDEDITPERSONNEL_REF = "AddEditPersonnel";

class AddEditPersonnel extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state["busy"] = false;
    this.state["open_batch_remove"] = false;
    this.state["confirm_batch_remove"] = false;
    this.state["show_provenance_view"] = false;
    this.state["batch_selection"] = {"nurims.title": "Personnel"};
    this.Module = ADDEDITPERSONNEL_REF;
    this.recordTopic = PERSONNEL_TOPIC;
    this.provenanceRecords = [];
    this.importFileRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.ctrlKeyPress, false);
    this.requestGetRecords(false, true);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.ctrlKeyPress, false);
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

  handleImportPersonnel = (e) => {
    const selectedFile = e.target.files[0];
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleImportPersonnel", "selectedFile", selectedFile);
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
          if (row.hasOwnProperty("Type") && row.Type === EMPLOYEE_RECORD_TYPE) {
            let add = true;
            for (const person of records) {
              if (row.hasOwnProperty("Id") && row.Id === getRecordMetadataValue(person, NURIMS_ENTITY_DOSE_PROVIDER_ID, "-")) {
                add = false;
                break;
              }
            }
            if (add) {
              const p = parsePersonnelRecordFromLine(row, EMPLOYEE_RECORD_TYPE, that.context.user.profile.username);
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
          onChange={this.handleImportPersonnel}
          type="file"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={5}>
            <PersonList
              ref={this.listRef}
              title={"Personnel"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={7}>
            <PersonMetadata
              ref={this.metadataRef}
              onChange={this.onRecordMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        <AddRemoveArchiveSaveSubmitProvenanceButtonPanel
          THIS={this}
          user={user}
          onClickAddRecord={this.addRecord}
          onClickChangeRecordArchivalStatus={this.changeRecordArchivalStatus}
          onClickRemoveRecord={this.removeRecord}
          onClickSaveRecordChanges={this.saveChanges}
          onClickViewProvenanceRecords={this.showProvenanceRecordsView}
          addRecordIcon={<PersonAddIcon sx={{mr: 1}}/>}
          addRecordButtonLabel={"Add Personnel"}
          removeRecordIcon={<PersonRemoveIcon sx={{mr: 1}}/>}
          removeRecordButtonLabel={"Remove Personnel"}
          addRole={ROLE_PERSONNEL_DATA_ENTRY}
          removeRole={ROLE_SYSADMIN}
          saveRole={ROLE_PERSONNEL_DATA_ENTRY}
          archiveRole={ROLE_PERSONNEL_DATA_ENTRY}
        />
      </React.Fragment>
    );
  }
}

AddEditPersonnel.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default AddEditPersonnel;