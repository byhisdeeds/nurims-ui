import React from 'react';
import {
  Grid,
} from "@mui/material";
import {
  CMD_DELETE_ITEM_RECORD,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_ITEM_RECORDS,
  CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_REFERRED_TO_ITEM_RECORDS,
  CMD_UPDATE_ITEM_RECORD,
  ITEM_ID,
  NURIMS_CREATION_DATE,
  NURIMS_RELATED_ITEM_ID,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
  RECORD_KEY,
  SSC_MAINTENANCE_RECORD,
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
import SSCMaintenanceRecords from "./SSCMaintenanceRecords";

export const ADDEDITMAINTENANCERECORD_REF = "AddEditMaintenanceRecord";

class AddEditMaintenanceRecord extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.Module = ADDEDITMAINTENANCERECORD_REF;
    this.recordTopic = SSC_TOPIC;
    this.maintenanceRecordsRef = React.createRef();
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    this.props.send({
      cmd: CMD_GET_ITEM_RECORDS,
      topic: SSC_TOPIC,
      record_type: SSC_RECORD_TYPE,
      module: this.Module,
    });
  }

  onSSCRecordSelection = (selection, include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
    }
    this.props.send({
      cmd: CMD_GET_REFERRED_TO_ITEM_RECORDS,
      referred_to_item_id: selection.item_id,
      referred_to_metadata: NURIMS_RELATED_ITEM_ID,
      "include.withdrawn": include_archived ? "true" : "false",
      "include.metadata.subtitle": NURIMS_CREATION_DATE,
      topic: SSC_TOPIC,
      record_type: SSC_MAINTENANCE_RECORD,
      module: this.Module,
    })
    this.setState({selection: selection});

    if (this.maintenanceRecordsRef.current) {
      this.maintenanceRecordsRef.current.setReferredToRecord(selection);
    }
  }

  onMaintenanceRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onMaintenanceRecordSelection", "selection", selection);
    }
    this.props.send({
      cmd: CMD_GET_ITEM_RECORDS,
      item_id: selection[ITEM_ID],
      topic: SSC_TOPIC,
      record_type: SSC_MAINTENANCE_RECORD,
      "include.metadata": "true",
      module: this.Module,
    })
  }

  saveChanges = (record) => {
    // only save record with changed metadata
    if (record.changed) {
      if (this.context.debug) {
        ConsoleLog(this.Module, "saveChanges", record);
      }
      if (record.item_id === -1 && !record.hasOwnProperty(RECORD_KEY)) {
        record[RECORD_KEY] = record_uuid();
      }
      this.props.send({
        cmd: CMD_UPDATE_ITEM_RECORD,
        item_id: record.item_id,
        "nurims.title": record[NURIMS_TITLE],
        "nurims.withdrawn": record[NURIMS_WITHDRAWN],
        "include.metadata.subtitle": NURIMS_CREATION_DATE,
        metadata: record.metadata,
        record_key: record[RECORD_KEY],
        topic: SSC_TOPIC,
        record_type: record[NURIMS_WITHDRAWN],
        module: this.Module,
      })
    }

    this.setState({metadata_changed: false})
  }

  deleteRecord = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "deleteRecord", record);
    }
    if (record.item_id === -1 && !record.hasOwnProperty(RECORD_KEY)) {
      record[RECORD_KEY] = record_uuid();
    }
    this.props.send({
      cmd: CMD_DELETE_ITEM_RECORD,
      item_id: record.item_id,
      module: this.Module,
    })
    // this.setState({metadata_changed: false})
  }

  ws_message = (message) => {
    if (messageHasResponse(message)) {
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message,
          [CMD_GET_ITEM_RECORDS, CMD_UPDATE_ITEM_RECORD, CMD_GET_PROVENANCE_RECORDS,
            CMD_GET_GLOSSARY_TERMS, CMD_GET_REFERRED_TO_ITEM_RECORDS, CMD_DELETE_ITEM_RECORD])) {
          if (isRecordType(message, SSC_RECORD_TYPE)) {
            if (this.listRef.current) {
              this.listRef.current.addRecords(message.response.structures_systems_components, false);
            }
          } else if (this.maintenanceRecordsRef.current) {
            this.maintenanceRecordsRef.current.ws_message(message);
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
            <SSCMaintenanceRecords
              ref={this.maintenanceRecordsRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
              saveChanges={this.saveChanges}
              deleteRecord={this.deleteRecord}
              send={this.props.send}
              getMaintenanceRecords={this.onSSCRecordSelection}
              getMaintenanceRecord={this.onMaintenanceRecordSelection}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

AddEditMaintenanceRecord.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(AddEditMaintenanceRecord);