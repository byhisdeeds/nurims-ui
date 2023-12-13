import React from 'react';
import {
  Grid,
} from "@mui/material";
import {
  CMD_DELETE_ITEM_RECORD,
  CMD_GET_ITEM_RECORDS,
  CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_REFERRED_TO_ITEM_RECORDS,
  CMD_UPDATE_ITEM_RECORD, NURIMS_CREATION_DATE,
  SSC_MODIFICATION_RECORD,
  SSC_RECORD_TYPE,
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
import SSCModificationRecords from "./SSCModificationRecords";
import {
  isCommandResponse,
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
import {
  isRecordType,
  record_uuid
} from "../../utils/MetadataUtils";
import {
  deleteRecord,
  getRecords,
  onRecordSelectionRetrieveRecord,
  onRecordSelectionRetrieveReferredToRecords,
  saveRecordChanges
} from "../../utils/RecordUtils";

export const ADDEDITMODIFICATIONRECORD_REF = "AddEditModificationRecord";

class AddEditModificationRecord extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.Module = ADDEDITMODIFICATIONRECORD_REF;
    this.recordTopic = SSC_TOPIC;
    this.recordType = SSC_MODIFICATION_RECORD;
    this.modificationRecordsRef = React.createRef();
  }

  componentDidMount() {
    getRecords(this.recordTopic, SSC_RECORD_TYPE, this.Module, this.props.send, true);
    // this.props.send({
    //   cmd: CMD_GET_ITEM_RECORDS,
    //   topic: SSC_TOPIC,
    //   record_type: SSC_RECORD_TYPE,
    //   module: this.Module,
    // }, true);
  }

  onSSCRecordSelection = (selection, include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
    }
    onRecordSelectionRetrieveReferredToRecords (selection, include_archived, this.recordTopic, this.recordType,
      this.Module, this.props.send);
    this.setState({selection: selection});

    if (this.modificationRecordsRef.current) {
      this.modificationRecordsRef.current.setReferredToRecord(selection);
    }
  }

  onModificationRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onModificationRecordSelection", "selection", selection);
    }
    onRecordSelectionRetrieveRecord(selection, this.recordTopic, this.recordType, this.Module, this.props.send);
  }

  saveChanges = (record) => {
    // only save record with changed metadata
    if (record.changed) {
      if (this.context.debug) {
        ConsoleLog(this.Module, "saveChanges", record);
      }
      saveRecordChanges(record, this.recordTopic, this.recordType, this.Module, NURIMS_CREATION_DATE, this.props.send);
    }

    this.setState({metadata_changed: false})
  }

  deleteModificationRecord = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "deleteModificationRecord", record);
    }
    deleteRecord(record, this.Module, this.props.send)
  }

  ws_message = (message) => {
    if (messageHasResponse(message)) {
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message,
          [CMD_GET_ITEM_RECORDS, CMD_UPDATE_ITEM_RECORD, CMD_GET_PROVENANCE_RECORDS,
            CMD_GET_REFERRED_TO_ITEM_RECORDS, CMD_DELETE_ITEM_RECORD])) {
          if (isRecordType(message, SSC_RECORD_TYPE)) {
            if (this.listRef.current) {
              this.listRef.current.addRecords(message.response.structures_systems_components, false);
            }
          } else if (this.modificationRecordsRef.current) {
            this.modificationRecordsRef.current.ws_message(message);
          }
        }
      }
    } else {
      if (messageHasResponse(message)) {
        enqueueErrorSnackbar(message.response.message);
      }
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
              onSelection={this.onSSCRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
              enableRowFilter={true}
            />
          </Grid>
          <Grid item xs={9}>
            <SSCModificationRecords
              ref={this.modificationRecordsRef}
              properties={this.props.properties}
              glossary={this.props.glossary}
              onChange={this.onRecordMetadataChanged}
              saveChanges={this.saveChanges}
              deleteRecord={this.deleteModificationRecord}
              send={this.props.send}
              getModificationRecords={this.onSSCRecordSelection}
              getModificationRecord={this.onModificationRecordSelection}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

AddEditModificationRecord.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(AddEditModificationRecord);