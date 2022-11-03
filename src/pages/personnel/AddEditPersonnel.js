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
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import PersonList from "./PersonList";
import PersonMetadata from "./PersonMetadata";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import {TitleComponent} from "../../components/CommonComponents";


class AddEditPersonnel extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = "AddEditPersonnel";
    this.recordTopic = "personnel";
  }

  componentDidMount() {
    this.requestGetRecords();
  }

  render() {
    const {metadata_changed, confirm_remove, selection, include_archived} = this.state;
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
            Remove Monitor
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
            Add Monitor
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