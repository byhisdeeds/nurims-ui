import React from 'react';
import {
  Grid,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_SSC_RECORDS, SSC_TOPIC,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import SSCList from "./SSCList";
import {ConsoleLog, UserContext} from "../../utils/UserContext";
import {TitleComponent} from "../../components/CommonComponents";
import SSCCorrectiveMaintenanceRecords from "./SSCCorrectiveMaintenanceRecords";
import {withTheme} from "@mui/styles";

export const ADDEDITTODORECORD_REF = "AddEditTodoRecord";

class AddEditTodoRecord extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.Module = ADDEDITTODORECORD_REF;
    this.recordTopic = SSC_TOPIC;
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
  }

  addMaintenanceRecord = () => {
    if (this.metadataRef.current) {
      this.metadataRef.current.addMaintenanceRecord();
    }
  }

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection, title} = this.state;
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
              enableRowFilter={true}
            />
          </Grid>
          <Grid item xs={9}>
            <SSCCorrectiveMaintenanceRecords
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
              saveChanges={this.saveChanges}
            />
          </Grid>
        </Grid>
        {/*<Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}*/}
        {/*       disabled={selection === -1}>*/}
        {/*    <RemoveCircleIcon sx={{mr: 1}}/>*/}
        {/*    Remove SSC*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}*/}
        {/*       onClick={this.changeRecordArchivalStatus} disabled={!this.isValidSelection(selection)}>*/}
        {/*    {this.isRecordArchived(selection) ?*/}
        {/*      <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore SSC Record"</React.Fragment> :*/}
        {/*      <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive SSC Record"</React.Fragment>}*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}*/}
        {/*       disabled={!metadata_changed}>*/}
        {/*    <SaveIcon sx={{mr: 1}}/>*/}
        {/*    Save Changes*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addMaintenanceRecord}>*/}
        {/*    <AddIcon sx={{mr: 1}}/>*/}
        {/*    Add SSC*/}
        {/*  </Fab>*/}
        {/*</Box>*/}
      </React.Fragment>
    );
  }
}

AddEditTodoRecord.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(AddEditTodoRecord);