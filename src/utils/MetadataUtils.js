import {
  CURRENT_USER,
  ITEM_ID, METADATA,
  NURIMS_CREATED_BY,
  NURIMS_DOSIMETRY_BATCH_ID,
  NURIMS_DOSIMETRY_DEEP_DOSE,
  NURIMS_DOSIMETRY_EXTREMITY_DOSE,
  NURIMS_DOSIMETRY_ID,
  NURIMS_DOSIMETRY_MONITOR_PERIOD,
  NURIMS_DOSIMETRY_SHALLOW_DOSE,
  NURIMS_DOSIMETRY_TIMESTAMP,
  NURIMS_DOSIMETRY_TYPE,
  NURIMS_DOSIMETRY_UNITS,
  NURIMS_DOSIMETRY_WRIST_DOSE,
  NURIMS_ENTITY_DATE_OF_BIRTH,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
  NURIMS_ENTITY_IS_EXTREMITY_MONITORED,
  NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED,
  NURIMS_ENTITY_IS_WRIST_MONITORED,
  NURIMS_ENTITY_NATIONAL_ID,
  NURIMS_ENTITY_SEX,
  NURIMS_ENTITY_WORK_DETAILS,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
  RECORD_KEY, RECORD_TYPE
} from "./constants";
import {
  transformDose
} from "./DoseReportUtils";
import {
  nanoid
} from 'nanoid';
import dayjs from 'dayjs';

export function record_uuid() {
  return nanoid();
}

export function isValidSelection(selection){
  return (selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
}

export function isRecordArchived(record) {
  return (record.hasOwnProperty(NURIMS_WITHDRAWN) && record[NURIMS_WITHDRAWN] === 1);
}

export function isRecordType(record, type) {
  return (record.hasOwnProperty("record_type") && record.record_type === type);
}

export function isRecordEmpty(record) {
  return (Object.keys(record).length === 0);
}

export function isRecordChanged(record) {
  return record.hasOwnProperty("changed") && record.changed;
}

export function recordHasRecordKey(record) {
  return record.hasOwnProperty("record_key");
}

export function setRecordChanged(record) {
  record["changed"] = true;
}

export function removeMetadataField(obj, key) {
  if (obj.hasOwnProperty("metadata")) {
    const metadata = obj.metadata;
    if (Array.isArray(metadata)) {
      for (const m of metadata) {
        for (const [k, v] of Object.entries(m)) {
          if (k === key) {
            delete m[k];
            return;
          }
        }
      }
    }
  }
}

export function setRecordMetadataValue(obj, key, value) {
  if (obj.hasOwnProperty("metadata")) {
    const metadata = obj.metadata;
    if (Array.isArray(metadata)) {
      for (const m of metadata) {
        for (const [k, v] of Object.entries(m)) {
          if (k === key) {
            m[k] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
            return;
          }
        }
      }
      const v = {};
      v[key] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
      metadata.push(v);
    }
  } else {
    const v = {};
    v[key] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
    obj["metadata"] = [v];
    // obj.metadata.push(v);
  }
}

export function setRecordData(record, key, value) {
  if (key === NURIMS_TITLE) {
    record[NURIMS_TITLE] = (value) ? value : "";
    record["changed"] = true;
  } else if (key === NURIMS_WITHDRAWN) {
    record[NURIMS_WITHDRAWN] = (value) ? value : 0;
    record["changed"] = true;
  } else if (record.hasOwnProperty("metadata")) {
    if (Array.isArray(record.metadata)) {
      for (const m of record.metadata) {
        for (const [k, v] of Object.entries(m)) {
          if (k === key) {
            if (value) {
              m[k] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
            } else {
              delete m[k]
            }
            record["changed"] = true;
            return;
          }
        }
      }
      if (value) {
        const v = {};
        v[key] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
        record.metadata.push(v);
        record["changed"] = true;
      }
    }
  } else {
    if (value) {
      const v = {};
      v[key] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
      record["metadata"] = [v];
      record["changed"] = true;
    }
  }
}

export function getRecordTitle(record) {
  return record.hasOwnProperty(NURIMS_TITLE) ? record[NURIMS_TITLE] : "";
}

export function getRecordMetadataValue(obj, key, missingValue) {
  if (obj.hasOwnProperty("metadata")) {
    const metadata = obj.metadata;
    if (Array.isArray(metadata)) {
      for (const m of metadata) {
        for (const [k, v] of Object.entries(m)) {
          if (k === key) {
            if (typeof v === "number") {
              return v;
            } else if (typeof v === "string") {
              return (v.charAt(0) === "[" || v.charAt(0) === "{") ?
                JSON.parse(v.replaceAll("'", "\"").replaceAll("NaN", "0")) : v;
            }
            return v;
          }
        }
      }
    }
  }
  return missingValue;
}

export function recordHasMetadataField(obj, key) {
  if (obj.hasOwnProperty("metadata")) {
    const metadata = obj.metadata;
    if (Array.isArray(metadata)) {
      for (const m of metadata) {
        for (const [k, v] of Object.entries(m)) {
          if (k === key) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

export function recordHasIncludeMetadataField(record){
  return record.hasOwnProperty("include.metadata") && record["include.metadata"] === "true";
}

export function getRecordData(record, key, missingValue) {
  if (key === NURIMS_TITLE) {
    return record[NURIMS_TITLE];
  } else if (key === NURIMS_WITHDRAWN) {
    return record[NURIMS_WITHDRAWN];
  } else if (record.hasOwnProperty("metadata")) {
    const metadata = record.metadata;
    if (Array.isArray(metadata)) {
      for (const m of metadata) {
        for (const [k, v] of Object.entries(m)) {
          if (k === key) {
            return (typeof v === "number") ? v : (v.charAt(0) === "[" || v.charAt(0) === "{") ?
              JSON.parse(v.replaceAll("'", "\"").replaceAll("NaN", "0")) : v;
          }
        }
      }
    }
  }
  return missingValue;
}

export function getUserRecordMetadataValue(obj, key, missingValue) {
  if (obj.hasOwnProperty("metadata")) {
    const metadata = obj.metadata;
    if (metadata.hasOwnProperty(key)) {
      return metadata[key];
    }
  }
  return missingValue;
}

export function getUserRecordData(record, key, missingValue) {
  if (key === NURIMS_TITLE) {
    return record[NURIMS_TITLE];
  } else if (key === NURIMS_WITHDRAWN) {
    return record[NURIMS_WITHDRAWN];
  } else if (record.hasOwnProperty("metadata")) {
    const metadata = record.metadata;
    if (metadata.hasOwnProperty(key)) {
      const v = metadata[key];
      return (typeof v === "number") ? v : (v.charAt(0) === "[" || v.charAt(0) === "{") ?
        JSON.parse(v.replaceAll("'", "\"").replaceAll("NaN", "0")) : v;
    }
  }
  return missingValue;
}

export function setUserRecordData(record, key, value) {
  if (key === NURIMS_TITLE) {
    record[NURIMS_TITLE] = value;
    record["changed"] = true;
  } else if (key === NURIMS_WITHDRAWN) {
    record[NURIMS_WITHDRAWN] = value;
    record["changed"] = true;
  } else if (record.hasOwnProperty("metadata")) {
    record.metadata[key] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
    record["changed"] = true;
    return;
  }
}

export function getMetadataValueAsISODateString(obj, key, missingValue) {
  const value = getRecordMetadataValue(obj, key, missingValue);
  if (missingValue) {
    if (value.length < 11) {
      return value + "T00:00:00";
    }
    return value;
  }
  return (value.length < 11) ? value + "T00:00:00" : value;
}

export function setMetadataValue(obj, key, value) {
  if (obj.hasOwnProperty("metadata")) {
    const metadata = obj.metadata;
    if (Array.isArray(metadata)) {
      for (const m of metadata) {
        for (const [k, v] of Object.entries(m)) {
          if (k === key) {
            m[k] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
            return;
          }
        }
      }
      const v = {};
      v[key] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
      metadata.push(v);
    }
  } else {
    const v = {};
    v[key] = (typeof value === "object") ? JSON.stringify(value).replaceAll("\"", "'") : value;
    obj["metadata"] = [v];
    // obj.metadata.push(v);
  }
}

export function getDateRangeFromDateString(range, missingValue) {
  if (range.includes('|')) {
    const parts = range.split("|");
    if (parts.length === 2) {
      const data = [];
      for (let i = 0; i < 2; i++) {
        data.push(getDateFromDateString(parts[i], missingValue))
        // let d = parts[i].substring(0, 10).split('-');
        // if (d.length === 3) {
        //   // Please pay attention to the month (d[1]); JavaScript counts months from 0:
        //   // January - 0, February - 1, etc.
        //   // data.push(dayjs(new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]))));
        //   data.push(dayjs(`${parseInt(d[2])}-${parseInt(d[1])}-${parseInt(d[0])}`));
        // } else {
        //   // data.push(dayjs(new Date()));
        //   data.push(dayjs());
        // }
      }
      return data;
    }
  }
  return (missingValue) ? missingValue : [null, null];
}

export function getDateFromDateString(dateString, missingValue) {
  const d = dayjs(dateString.substring(0, 10), 'YYYY-MM-DD', true)
  if (d.isValid()) {
    return d;
  }
  return (missingValue) ? missingValue : null;

  // if (dateString && dateString.includes('-')) {
  //   let d = dateString.substring(0, 10).split('-');
  //   if (d.length === 3) {
  //     // Please pay attention to the month (d[1]); JavaScript counts months from 0:
  //     // January - 0, February - 1, etc.
  //     // return new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]));
  //     return dayjs(`${parseInt(d[2])}-${parseInt(d[1])}-${parseInt(d[0])}`)
  //   }
  // }
  // return (missingValue) ? missingValue : null;
}

export function getDateRangeAsDays(range, missingValue) {
  if (range.includes('|')) {
    const parts = range.split("|");
    if (parts.length === 2) {
      const data = [];
      for (let i = 0; i < 2; i++) {
        data.push(getDateFromDateString(parts[i], dayjs()))
        // let d = parts[i].substring(0, 10).split('-');
        // if (d.length === 3) {
        //   // Please pay attention to the month (d[1]); JavaScript counts months from 0:
        //   // January - 0, February - 1, etc.
        //   // data.push(dayjs(new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]))));
        //   data.push(dayjs(`${parseInt(d[2])}-${parseInt(d[1])}-${parseInt(d[0])}`));
        // } else {
        //   // data.push(dayjs(new Date()));
        //   data.push(dayjs());
        // }
      }
      // return differenceInDays(data[1], data[0]);
      return data[1].diff(data[0], 'day');
    }
  }
  return (missingValue) ? missingValue : 0;
}

export function setDoseRecordMetadataValue(person_record, dosimeter, dosimeterType, key, value) {
  if (person_record.hasOwnProperty("dose_record")) {
    const dose_records = person_record.dose_record;
    if (Array.isArray(dose_records)) {
      for (const dose_record of dose_records) {
        if (dose_record.hasOwnProperty("dosimeter") && dose_record.dosimeter === dosimeter) {
          if (dose_record.hasOwnProperty("type") && dose_record.type === dosimeterType) {
            if (dose_record.hasOwnProperty("metadata")) {
              for (const metadata of dose_record.metadata) {
                for (const [k, v] of Object.entries(metadata)) {
                  if (k === key) {
                    metadata[k] = value;
                    return;
                  }
                }
              }
              // add metadata
              const v = {};
              v[key] = value;
              dose_record.metadata.push(v);
              return;
            }
          }
        }
      }
      const v = {};
      v[key] = value;
      const dose_record = {};
      dose_record["dosimeter"] = dosimeter;
      dose_record["type"] = dosimeterType;
      dose_record["metadata"] = [];
      dose_record.metadata.push(v);
      dose_records.push(dose_record);
      return;
    }
  }
  const v = {};
  v[key] = value;
  const dose_record = {};
  dose_record["dosimeter"] = dosimeter;
  dose_record["type"] = dosimeterType;
  dose_record["metadata"] = [];
  dose_record.metadata.push(v);
  person_record["dose_record"] = [];
  person_record.dose_record.push(dose_record);
}

export function getDoseRecordDosimeterId(person_record, dosimeterType, missingValue) {
  if (person_record.hasOwnProperty("dose_record")) {
    const dose_records = person_record.dose_record;
    if (Array.isArray(dose_records)) {
      for (const dose_record of dose_records) {
        if (dose_record.hasOwnProperty("type") && dose_record.type === dosimeterType) {
          return dose_record.hasOwnProperty("dosimeter") ? dose_record.dosimeter : missingValue;
        }
      }
    }
  }
  return missingValue;
}

export function getDoseRecordMetadataValue(person_record, dosimeter, dosimeterType, key, missingValue) {
  if (person_record.hasOwnProperty("dose_record")) {
    const dose_records = person_record.dose_record;
    if (Array.isArray(dose_records)) {
      for (const dose_record of dose_records) {
        if (dose_record.hasOwnProperty("dosimeter") && dose_record.dosimeter === dosimeter) {
          if (dose_record.hasOwnProperty("type") && dose_record.type === dosimeterType) {
            if (dose_record.hasOwnProperty("metadata")) {
              for (const metadata of dose_record.metadata) {
                for (const [k, v] of Object.entries(metadata)) {
                  if (k === key) {
                    return v;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return missingValue;
}

export function BlobPath(blobpath, image) {
  if (image && image.uri !== "") {
    return image.uri.startsWith("data:") ? image.uri : `${blobpath}/${image.uri}`;
  }
  return "";
}

export function BlobObject(name, blob) {
  // let index = blob.indexOf(",")
  // let content_type = blob.substring(0, index)
  //   .replace("data:", "")
  //   .replace(";base64", "")
  return {file: name, uri: blob};
}

export function markerBounds(location) {
  const fac = .025;
  // [ll corner[lat,lng], ur corner[lat,lng]]
  return (location) ?
    [[location.northing - fac, location.easting - fac], [location.northing + fac, location.easting + fac]] :
    [[-fac, -fac], [fac, fac]];
}

export function getMarkerImageUrl(location, prefix) {
  return location.hasOwnProperty("marker") ? (prefix || "") + location.marker.split("#")[0] : "";
}

export function appendMetadataChangedField(obj, field) {
  for (const f of obj) {
    if (f === field) {
      return;
    }
  }
  obj.push(field);
}

export function formatISODateString(dateString) {
  return dateString.replaceAll("T", " ").substring(0, 19);
}

export function getNextItemId(records) {
  let item_id = 0;
  for (const r of records) {
    item_id = Math.max(item_id, r.item_id);
  }
  return item_id + 1;
}

/*
 * Converts a string to a bool.
 *
 * This conversion will:
 *
 *  - match 'true', 'on', or '1' as true.
 *  - ignore all white-space padding
 *  - ignore capitalization (case).
 *
 * '  tRue  ','ON', and '1   ' will all evaluate as true.
 *
 */
export function toBoolean(s) {
  // will match one and only one of the string 'true','1', or 'on' regardless
  // of capitalization and regardless off surrounding white-space.
  //
  const regex = new RegExp(/^\s*(true|1|on)\s*$/i);
  return regex.test(s);
}

export function new_record(item_id, title, withdrawn, createdby, fullname, record_type) {
  const record = {};
  record["changed"] = true;
  record[ITEM_ID] = (item_id) ? item_id : -1;
  record[NURIMS_TITLE] = (title) ? title : "New Record";
  record[NURIMS_WITHDRAWN] = (withdrawn) ? withdrawn : 0;
  record[RECORD_KEY] = record_uuid();
  record[RECORD_TYPE] = record_type;
  record[METADATA] = [
    {"nurims.createdby": (createdby) ? (fullname) ? `${fullname} (${createdby})` : createdby : ""},
    {"nurims.creationdate": dayjs().toISOString()}
  ];
  return record;
}

export function parsePersonnelRecordFromLine(line, recordType, username) {
  const p = {
    item_id: -1,
    "nurims.title": line.Name,
    "nurims.withdrawn": 0,
    "record_type": recordType,
    "metadata": [
      {"nurims.createdby": username},
      {"nurims.creationdate": dayjs.toISOString()}
    ]
  };
  if (line.hasOwnProperty("DateOfBirth")) {
    setMetadataValue(p, NURIMS_ENTITY_DATE_OF_BIRTH, line.DateOfBirth)
  }
  if (line.hasOwnProperty("WorkDetails")) {
    setMetadataValue(p, NURIMS_ENTITY_WORK_DETAILS, line.WorkDetails)
  }
  if (line.hasOwnProperty("Sex")) {
    setMetadataValue(p, NURIMS_ENTITY_SEX, line.Sex)
  }
  if (line.hasOwnProperty("NID")) {
    setMetadataValue(p, NURIMS_ENTITY_NATIONAL_ID, line.NID)
  }
  if (line.hasOwnProperty("Id")) {
    setMetadataValue(p, NURIMS_ENTITY_DOSE_PROVIDER_ID, line.Id)
  }
  if (line.hasOwnProperty("IsWholeBodyMonitored")) {
    setMetadataValue(p, NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED, line.IsWholeBodyMonitored === "" ? "false" : "true")
  }
  if (line.hasOwnProperty("IsExtremityMonitored")) {
    setMetadataValue(p, NURIMS_ENTITY_IS_EXTREMITY_MONITORED, line.IsExtremityMonitored === "" ? "false" : "true")
  }
  if (line.hasOwnProperty("IsWristMonitored")) {
    setMetadataValue(p, NURIMS_ENTITY_IS_WRIST_MONITORED, line.IsWristMonitored === "" ? "false" : "true")
  }

  return p;
}

export function parseMonitorRecordFromLine(line, recordType, username) {
  const p = {
    item_id: -1,
    "nurims.title": line.Name,
    "nurims.withdrawn": 0,
    "record_type": recordType,
    "metadata": [
      {"nurims.createdby": username},
      {"nurims.creationdate": dayjs.toISOString()}
    ]
  };
  if (line.hasOwnProperty("DateOfBirth")) {
    setMetadataValue(p, NURIMS_ENTITY_DATE_OF_BIRTH, line.DateOfBirth)
  }
  if (line.hasOwnProperty("WorkDetails")) {
    setMetadataValue(p, NURIMS_ENTITY_WORK_DETAILS, line.WorkDetails)
  }
  if (line.hasOwnProperty("Sex")) {
    setMetadataValue(p, NURIMS_ENTITY_SEX, line.Sex)
  }
  if (line.hasOwnProperty("NID")) {
    setMetadataValue(p, NURIMS_ENTITY_NATIONAL_ID, line.NID)
  }
  if (line.hasOwnProperty("Id")) {
    setMetadataValue(p, NURIMS_ENTITY_DOSE_PROVIDER_ID, line.Id)
  }
  if (line.hasOwnProperty("IsWholeBodyMonitored")) {
    setMetadataValue(p, NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED, line.IsWholeBodyMonitored === "" ? "false" : "true")
  }
  if (line.hasOwnProperty("IsExtremityMonitored")) {
    setMetadataValue(p, NURIMS_ENTITY_IS_EXTREMITY_MONITORED, line.IsExtremityMonitored === "" ? "false" : "true")
  }
  if (line.hasOwnProperty("IsWristMonitored")) {
    setMetadataValue(p, NURIMS_ENTITY_IS_WRIST_MONITORED, line.IsWristMonitored === "" ? "false" : "true")
  }

  return p;
}

export function parseDosimetryMeasurementRecordFromLine(line) {
  const measurement = {};
  measurement[NURIMS_ENTITY_DOSE_PROVIDER_ID] = line.Id;
  measurement[NURIMS_DOSIMETRY_BATCH_ID] = line.BatchId;
  measurement[NURIMS_DOSIMETRY_ID] = line.Barcode;
  measurement[NURIMS_DOSIMETRY_TYPE] = line.recordType;
  measurement[NURIMS_DOSIMETRY_TIMESTAMP] = line.Timestamp;
  measurement[NURIMS_DOSIMETRY_UNITS] = "msv";
  measurement[NURIMS_DOSIMETRY_MONITOR_PERIOD] = line.monitorPeriod;
  measurement["badge.date.available"] = line.dateAvailable;
  measurement["badge.return.timestamp"] = line.returnTimestamp;
  if (line.recordType === "wholebody") {
    measurement[NURIMS_DOSIMETRY_SHALLOW_DOSE] = transformDose(line.R2, line.Units.toLowerCase(), 'msv');
    measurement[NURIMS_DOSIMETRY_DEEP_DOSE] = transformDose(line.R3, line.Units.toLowerCase(), 'msv');
  } else if (line.recordType === "extremity") {
    measurement[NURIMS_DOSIMETRY_EXTREMITY_DOSE] = transformDose(line.R3, line.Units.toLowerCase(), 'msv');
  } else if (line.recordType === "wrist") {
    measurement[NURIMS_DOSIMETRY_WRIST_DOSE] = transformDose(line.R3, line.Units.toLowerCase(), 'msv');
  }

  return measurement;
}

export function getMatchingEntityDoseProviderRecord(records, line) {
  for (const record of records) {
    if (line.hasOwnProperty("Id") && line.Id === getRecordMetadataValue(record, NURIMS_ENTITY_DOSE_PROVIDER_ID, "-")) {
      return record;
    }
  }
  return null;
}

export function analysisJobAsObject(name) {
  return {
    "jobid": 0,
    "info": "",
    "clientid": 0,
    "contact": "",
    "name": name,
    "created": dayjs().format('YYYY-MM-DD'),
    "jtype": "",
    "lastmodification": "",
    "info1": "",
    "kml": ""
  };
}

export function isRecordCreatedBy(record, user) {
  const created_by = getRecordData(record, NURIMS_CREATED_BY, "");
  const p = [...created_by.matchAll(/\((.*?)\)/g)].map(m => m[1]);
  if (p.length === 0) {
    return created_by === user.profile.username;
  }
  return p[0] === user.profile.username;
}

export function changeRecordArchivalStatus(record, status) {
  console.log("*** archive modification record", record)
  if (record.hasOwnProperty(NURIMS_WITHDRAWN)) {
    record[NURIMS_WITHDRAWN] = record[NURIMS_WITHDRAWN] === 0 ? 1 : 0;
    record.changed = true;
    return true;
  }
  return false;
}

export function isSelectableByRoles(user, selection, roles, valid_selection){
  for (const r of roles) {
    // if role is **current_user** then a match between the current user and the selection user returns true
    if (r === CURRENT_USER && selection.hasOwnProperty(NURIMS_TITLE) &&
      selection[NURIMS_TITLE] === this.context.user.profile.username) {
      return true
    } else if (user.hasOwnProperty("profile") && (user.profile["role"].includes(`'${r}'`))) {
      // We have at least one match, now we check for a valid item_id boolean parameter has been specified
      if (valid_selection) {
        return selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1;
      }
      return true;
    }
  }
  return false;
}

export function getGlossaryValue(obj, key, missingValue) {
  return obj.hasOwnProperty(key) ? obj[key] : missingValue;
}
