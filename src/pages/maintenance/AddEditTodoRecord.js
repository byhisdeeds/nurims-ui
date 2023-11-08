import React from 'react';
import {
  Grid,
} from "@mui/material";
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_SSC_RECORDS,
  SSC_TOPIC,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import SSCList from "./SSCList";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  TitleComponent
} from "../../components/CommonComponents";
import {
  withTheme
} from "@mui/styles";
import SSCTodoRecords from "./SSCTodoRecords";

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
            <SSCTodoRecords
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
              saveChanges={this.saveChanges}
            />
          </Grid>
        </Grid>
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