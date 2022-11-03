import React from 'react';
import {
  Fab,
  Grid,
  Typography,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MonitorList from "./MonitorList";
import MonitorMetadata from "./MonitorMetadata";
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_MONITOR_RECORDS,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {ConsoleLog} from "../../utils/UserDebugContext";
import {TitleComponent} from "../../components/CommonComponents";


class AddEditMonitors extends BaseRecordManager {
  constructor(props) {
    super(props);
    this.Module = "AddEditMonitors";
    this.recordTopic = "monitor";
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_MONITOR_RECORDS,
      module: this.Module,
    });
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
  }

  ws_message = (message) => {
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
    ]);
  }

  render() {
    const {metadata_changed, confirm_remove, selection, title, include_archived} = this.state;
    if (this.context.debug > 5) {
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
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               // disabled={!((selection["nurims.withdrawn"] === 1) || selection["item_id"] === -1)}>
               disabled={!this.isValidSelection(selection)}>
            <PersonRemoveIcon sx={{mr: 1}}/>
            Remove Monitor
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
               onClick={this.changeRecordArchivalStatus} disabled={!this.isValidSelection(selection)}>
            {this.isRecordArchived(selection) ?
              <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore Monitor Record"</React.Fragment> :
              <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive Monitor Record"</React.Fragment>}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add Monitor
          </Fab>
        </Box>
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