import React from 'react';
import {
  Grid,
} from "@mui/material";
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_SSC_MODIFICATION_RECORDS,
  CMD_GET_SSC_RECORDS,
  CMD_UPDATE_SSC_MODIFICATION_RECORD,
  NURIMS_CREATION_DATE,
  NURIMS_RELATED_ITEM_ID,
  NURIMS_TITLE, NURIMS_WITHDRAWN,
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
import {isCommandResponse, messageHasResponse, messageResponseStatusOk} from "../../utils/WebsocketUtils";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";
import {record_uuid} from "../../utils/MetadataUtils";

export const ADDEDITMODIFICATIONRECORD_REF = "AddEditModificationRecord";

class AddEditModificationRecord extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.Module = ADDEDITMODIFICATIONRECORD_REF;
    this.recordTopic = SSC_TOPIC;
    this.modificationRecordsRef = React.createRef();
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
    if (messageHasResponse(message)) {
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message,
          [CMD_GET_SSC_MODIFICATION_RECORDS, CMD_UPDATE_SSC_MODIFICATION_RECORD,
            CMD_GET_PROVENANCE_RECORDS, CMD_GET_GLOSSARY_TERMS])) {
          if (this.modificationRecordsRef.current) {
            this.modificationRecordsRef.current.ws_message(message);
          }
        } else if (isCommandResponse(message,CMD_GET_SSC_RECORDS)) {
          if (this.listRef.current) {
            this.listRef.current.addRecords(message.response.structures_systems_components, false);
          }
        }
      }
    } else {
      if (messageHasResponse(message)) {
        enqueueErrorSnackbar(message.response.message);
      }
    }
  }

  // addMaintenanceRecord = () => {
  //   if (this.metadataRef.current) {
  //     this.metadataRef.current.addMaintenanceRecord();
  //   }
  // }

  onSSCRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
    }
    this.props.send({
      cmd: CMD_GET_SSC_MODIFICATION_RECORDS,
      referred_to_item_id: selection.item_id,
      referred_to_metadata: NURIMS_RELATED_ITEM_ID,
      "include.metadata": "false",
      "include.metadata.subtitle": NURIMS_CREATION_DATE,
      module: this.Module,
    })
    this.setState({selection: selection});

    if (this.modificationRecordsRef.current) {
      this.modificationRecordsRef.current.setReferredToRecord(selection);
    }
  }

  saveChanges = (record) => {
    // only save record with changed metadata
    if (record.changed) {
      if (this.context.debug) {
        ConsoleLog(this.Module, "saveChanges", record);
      }
      if (record.item_id === -1 && !record.hasOwnProperty("record_key")) {
        record["record_key"] = record_uuid();
      }
      this.props.send({
        cmd: CMD_UPDATE_SSC_MODIFICATION_RECORD,
        item_id: record.item_id,
        "nurims.title": record[NURIMS_TITLE],
        "nurims.withdrawn": record[NURIMS_WITHDRAWN],
        "include.metadata.subtitle": NURIMS_CREATION_DATE,
        metadata: record.metadata,
        record_key: record.record_key,
        module: this.Module,
      })
    }

    this.setState({metadata_changed: false})
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
              onChange={this.onRecordMetadataChanged}
              saveChanges={this.saveChanges}
              send={this.props.send}
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