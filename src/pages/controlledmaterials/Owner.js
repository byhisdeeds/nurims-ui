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

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import OwnerList from "./OwnerList";
import OwnerMetadata from "./OwnerMetadata";
import {TitleComponent} from "../../components/CommonComponents";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import PropTypes from "prop-types";
import {CMD_GET_GLOSSARY_TERMS, CMD_GET_OWNER_RECORDS} from "../../utils/constants";

export const OWNER_REF = "Owner";

class Owner extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = OWNER_REF;
    this.recordTopic = "owner";
  }

  componentDidMount() {
    this.getOwnerRecords();
  }

  getOwnerRecords = () => {
    this.props.send({
      cmd: CMD_GET_OWNER_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "false",
      module: this.Module,
    });
  }

  // ws_message = (message) => {
  //   super.ws_message(message, [
  //     { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
  //   ]);
  // }

  render() {
    const {metadata_changed, confirm_remove, selection} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "recordTopic", this.recordTopic, "selection", selection);
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
            <OwnerList
              ref={this.listRef}
              title={"Owners"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
              includeArchived={true}
            />
          </Grid>
          <Grid item xs={7}>
            <OwnerMetadata
              ref={this.metadataRef}
              onChange={this.onRecordMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
            // disabled={!((selection["nurims.withdrawn"] === 1) || selection["item_id"] === -1)}>
               disabled={!this.isSysadminButtonAccessible(selection)}>
            <PersonRemoveIcon sx={{mr: 1}}/>
            Remove Owner
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add Owner
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

Owner.propTypes = {
  send: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

Owner.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default Owner;