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
import {CMD_DELETE_PERSONNEL_RECORD, ITEM_ID, NURIMS_TITLE} from "../../utils/constants";

export const ADDEDITPERSONNEL_REF = "AddEditPersonnel";

class AddEditPersonnel extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state["open_batch_remove"] = false;
    this.state["confirm_batch_remove"] = false;
    this.state["batch_selection"] = {"nurims.title": "Personnel"};
    this.Module = ADDEDITPERSONNEL_REF;
    this.recordTopic = "personnel";
  }

  componentDidMount() {
    document.addEventListener("keydown", this.ctrlKeyPress, false);
    this.requestGetRecords();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.ctrlKeyPress, false);
  }

  ctrlKeyPress = (event) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "ctrlKeyPress", "key", event.key, "keyCode", event.keyCode);
    }
    if (event.key === 'i' && event.keyCode === 73) {
      // Ctrl+i
      event.preventDefault();
      // this.importFileRef.current.click();
    } else if (event.key === 'r' && event.keyCode === 82) {
      // Ctrl+r
      event.preventDefault();
      this.setState({
        open_batch_remove: true,
        confirm_batch_remove: true,
        batch_selection: {"nurims.title": "Personnel"}
      });
      // this.importFileRef.current.click();
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

  render() {
    const {metadata_changed, confirm_remove, selection, include_archived, confirm_batch_remove, batch_selection} = this.state;
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "render", "metadata_changed", metadata_changed,
        "confirm_removed", confirm_remove, "include_archived", include_archived, "selection", selection,
        "confirm_batch_remove", confirm_batch_remove, "batch_selection", batch_selection);
    }
    return (
      <React.Fragment>
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
               disabled={!metadata_changed}>
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