export function getMetadataValue(obj, key, missingValue) {
  if (obj.hasOwnProperty("metadata")) {
    const metadata = obj.metadata;
    if (Array.isArray(metadata)) {
      for (const m of metadata) {
        for (const [k, v] of Object.entries(m)) {
          if (k === key) {
            return (typeof v === "number") ? v : (v.charAt(0) === "[" || v.charAt(0) === "{") ? JSON.parse(v.replaceAll("'", "\"")) : v;
          }
        }
      }
    }
  }
  return missingValue;
}


export function setMetadataValue(obj, key, value) {
  if (obj.hasOwnProperty("metadata")) {
    const metadata = obj.metadata;
    if (Array.isArray(metadata)) {
      for (const m of metadata) {
        for (const [k, v] of Object.entries(m)) {
          console.log(`${k}: ${v}`);
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
      for (let i=0; i<2; i++) {
        let d = parts[i].substring(0, 10).split('-');
        if (d.length === 3) {
          // Please pay attention to the month (d[1]); JavaScript counts months from 0:
          // January - 0, February - 1, etc.
          data.push(new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2])));
        } else {
          data.push(new Date());
        }
      }
      return data;
    }
  }
  return (missingValue) ? missingValue : [null, null];
}

export function getDateFromDateString(dateString, missingValue) {
  if (dateString.includes('-')) {
    let d = dateString.substring(0, 10).split('-');
    if (d.length === 3) {
      // Please pay attention to the month (d[1]); JavaScript counts months from 0:
      // January - 0, February - 1, etc.
      return new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]));
    }
  }
  return (missingValue) ? missingValue : null;
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
                  // console.log(`${k}: ${v}`);
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

export function BlobObject(name, blob) {
  return {file: name, url: blob};
}
