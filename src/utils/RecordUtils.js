import {
  CMD_DELETE_ITEM_RECORD,
  CMD_GET_ITEM_RECORDS, CMD_GET_REFERRED_TO_ITEM_RECORDS,
  CMD_UPDATE_ITEM_RECORD,
  ITEM_ID,
  NURIMS_CREATION_DATE, NURIMS_RELATED_ITEM_ID,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
  RECORD_KEY,
} from "./constants";
import {
  record_uuid
} from "./MetadataUtils";


export function onRecordSelectionRetrieveRecord(selection, recordTopic, recordType, module, send){
  if (selection.item_id !== -1) {
    send({
      cmd: CMD_GET_ITEM_RECORDS,
      item_id: selection[ITEM_ID],
      topic: recordTopic,
      record_type: recordType,
      "include.metadata": "true",
      module: module,
    });
  }
}

export function saveRecordChanges(record, recordTopic, recordType, module, subtitleMetadata, send) {
  if (record.changed) {
    if (record.item_id === -1 && !record.hasOwnProperty(RECORD_KEY)) {
      record[RECORD_KEY] = record_uuid();
    }
    const msg = {
      cmd: CMD_UPDATE_ITEM_RECORD,
      item_id: record.item_id,
      "nurims.title": record[NURIMS_TITLE],
      "nurims.withdrawn": record[NURIMS_WITHDRAWN],
      return_record: "true",
      metadata: record.metadata,
      record_key: record[RECORD_KEY],
      topic: recordTopic,
      record_type: recordType,
      module: module,
    }
    if (subtitleMetadata !== null) {
      msg["nurims.withdrawn"] = subtitleMetadata
    }
    send(msg);
  }
}

export function deleteRecord(record, module, send){
  if (record.item_id === -1 && !record.hasOwnProperty(RECORD_KEY)) {
    record[RECORD_KEY] = record_uuid();
  }
  send({
    cmd: CMD_DELETE_ITEM_RECORD,
    item_id: record.item_id,
    module: module,
  });
}

export function onRecordSelectionRetrieveReferredToRecords (selection, include_archived, recordTopic, recordType,
                                                            module, send){
  send({
    cmd: CMD_GET_REFERRED_TO_ITEM_RECORDS,
    referred_to_item_id: selection.item_id,
    referred_to_metadata: NURIMS_RELATED_ITEM_ID,
    "include.withdrawn": include_archived ? "true" : "false",
    "include.metadata.subtitle": NURIMS_CREATION_DATE,
    topic: recordTopic,
    record_type: recordType,
    module: module,
  });
}

export function getRecords(recordTopic, recordType, module, send, show_busy){
  send({
    cmd: CMD_GET_ITEM_RECORDS,
    topic: recordTopic,
    record_type: recordType,
    module: module,
  }, show_busy);
}
