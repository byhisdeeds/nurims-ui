import React from 'react';
import {withTheme} from "@mui/styles";
import {
  Fab,
  Grid,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {
  CMD_GET_GLOSSARY_TERMS,
} from "../../utils/constants";
import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import PersonnelList from "./PersonnelList";
import BusyIndicator from "../../components/BusyIndicator";
import {TitleComponent} from "../../components/CommonComponents";
import PersonnelDosimetryEvaluationDataView from "./PersonnelDosimetryEvaluationDataView";

export const PERSONNELDOSIMETRYEVALUATION_REF = "PersonnelDosimetryEvaluation";

class PersonnelDosimetryEvaluation extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      busy: 0,
      data_changed: false,
      selection: {},
    }
    this.topic = "personnel";
    this.listTitle = "Personnel";
    this.Module = PERSONNELDOSIMETRYEVALUATION_REF;
    this.listRef = React.createRef();
    this.dataRef = React.createRef();
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    this.requestGetRecords(false);
  }

  componentWillUnmount() {
  }

  requestGetRecords = (include_archived) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    this.props.send({
      cmd: this.recordCommand("get", this.topic),
      "include.withdrawn": include_archived ? "true" : "false",
      "include.metadata": "true",
      module: this.Module,
    });
    this.setState({include_archived: include_archived});
  }

  onSelection = (selection) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "onSelection", "selection", selection);
    }
    if (this.dataRef.current) {
      this.dataRef.current.setRecordMetadata(selection)
    }
    this.setState({selection: selection})
  }

  render() {
    const {data_changed, confirm_remove, include_archived, selection, title, busy} = this.state;
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "render", "data_changed", data_changed,
        "confirm_removed", confirm_remove, "include_archived", include_archived, "selection", selection);
    }
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <BusyIndicator open={busy > 0} loader={"bar"} size={40}/>
        <input
          ref={this.importFileRef}
          accept="text/csv"
          id="import-file-uploader"
          style={{display: 'none',}}
          onChange={this.handleFileUpload}
          type="file"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={3}>
            <PersonnelList
              ref={this.listRef}
              title={this.listTitle}
              properties={this.props.properties}
              onSelection={this.onSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={9}>
            <PersonnelDosimetryEvaluationDataView
              ref={this.dataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               disabled={selection === -1}>
            <RemoveCircleIcon sx={{mr: 1}}/>
            Remove SSC
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
               onClick={this.changeRecordArchivalStatus} disabled={!this.isValidSelection(selection)}>
            {this.isRecordArchived(selection) ?
              <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore SSC Record"</React.Fragment> :
              <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive SSC Record"</React.Fragment>}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!data_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add SSC
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

PersonnelDosimetryEvaluation.defaultProps = {
  send: (msg) => {
  },
  user: {},
  topic: "",
};

export default withTheme(PersonnelDosimetryEvaluation);