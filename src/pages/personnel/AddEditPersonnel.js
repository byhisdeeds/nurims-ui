import React from 'react';
import {
  Fab,
  Grid,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmBatchRemoveRecordDialog,
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import PersonList from "./PersonList";
import PersonMetadata from "./PersonMetadata";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import {TitleComponent} from "../../components/CommonComponents";
import {
  CMD_DELETE_PERSONNEL_RECORD, EMPLOYEE_RECORD_TYPE,
  ITEM_ID,
  NURIMS_ENTITY_DATE_OF_BIRTH,
  NURIMS_ENTITY_DOSE_PROVIDER_ID, NURIMS_ENTITY_IS_EXTREMITY_MONITORED,
  NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED, NURIMS_ENTITY_IS_WRIST_MONITORED,
  NURIMS_ENTITY_NATIONAL_ID,
  NURIMS_ENTITY_SEX,
  NURIMS_ENTITY_WORK_DETAILS,
  NURIMS_TITLE, PERSONNEL_TOPIC
} from "../../utils/constants";
import {toast} from "react-toastify";
import {readString} from "react-papaparse";
import {getRecordMetadataValue, new_record, parsePersonnelRecordFromLine, setMetadataValue} from "../../utils/MetadataUtils";
import BusyIndicator from "../../components/BusyIndicator";

export const ADDEDITPERSONNEL_REF = "AddEditPersonnel";

class AddEditPersonnel extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state["busy"] = false;
    this.state["open_batch_remove"] = false;
    this.state["confirm_batch_remove"] = false;
    this.state["batch_selection"] = {"nurims.title": "Personnel"};
    this.Module = ADDEDITPERSONNEL_REF;
    this.recordTopic = PERSONNEL_TOPIC;
    this.importFileRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.ctrlKeyPress, false);
    this.requestGetRecords(false, true);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.ctrlKeyPress, false);
  }

  ctrlKeyPress = (event) => {
    if (this.context.debug > 5) {
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
    if (this.context.debug > 5) {
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

  handleImportPersonnel = (e) => {
    const selectedFile = e.target.files[0];
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "handleImportPersonnel", "selectedFile", selectedFile);
    }
    const records = (this.listRef.current) ? this.listRef.current.getRecords() : [];
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      alert('Unable to read ' + selectedFile.name);
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
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
    const {confirm_remove, selection, include_archived, confirm_batch_remove, batch_selection, busy} = this.state;
    const has_changed_records = this.hasChangedRecords();
    if (this.context.debug > 5) {
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
        <input
          ref={this.importFileRef}
          accept="*.json"
          // className={classes.input}
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
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               disabled={!this.isValidSelection(selection)}>
            <PersonRemoveIcon sx={{mr: 1}}/>
            Remove Personnel
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
               onClick={this.changeRecordArchivalStatus} disabled={!this.isValidSelection(selection)}>
            {this.isRecordArchived(selection) ?
              <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore Personnel Record"</React.Fragment> :
              <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive Personnel Record"</React.Fragment>}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!has_changed_records}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add Personnel
          </Fab>
        </Box>
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