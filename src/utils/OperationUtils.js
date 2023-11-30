import dayjs from 'dayjs';
import {
  getRecordMetadataValue
} from "./MetadataUtils";
import {
  NURIMS_OPERATION_DATA_CONTROLRODPOSITION,
  NURIMS_OPERATION_DATA_NEUTRONFLUX,
  NURIMS_OPERATION_DATA_STATS
} from "./constants";
import {json2csv} from 'json-2-csv';


export function runidAsTitle(runid) {
  if (runid) {
    try {
      const year = Number.parseInt(runid.substring(0,4));
      const month = Number.parseInt(runid.substring(4,6));
      const day = Number.parseInt(runid.substring(6,8));
      const hour = runid.substring(9,11);
      const minute = runid.substring(11,13);
      const date = dayjs(`${year}-${month}-${day}`);
      return `${date.format("dddd, MMMM D YYYY")} at ${hour}:${minute}`;
    } catch (error) {
      return runid
    }
  }
  return "";
}

export function prepareExportData(message) {
  const f = {
    fileName: "",
    fileType: "",
    blobData: "",
  }
  const data = message.response.operation;
  const datasetFormat = message.hasOwnProperty("datasetFormat") ? message.datasetFormat : "json"
  const date = message.hasOwnProperty("startDate") && message.hasOwnProperty("endDate") ?
    `-${message.startDate}-${message.endDate.substring(5,7)}` : ""
  const dataset = message.hasOwnProperty("dataset") ? message.dataset : ""
  const excludeKeys = [];
  let data_array = [];
  if (dataset === "stats") {
    excludeKeys.push("rod_events");
    for (const record of data) {
      data_array.push(getRecordMetadataValue(record, NURIMS_OPERATION_DATA_STATS, {}))
    }
  } else if (dataset === "rodevents") {
    for (const record of data) {
      const _stats = getRecordMetadataValue(record, NURIMS_OPERATION_DATA_STATS, {});
      if (_stats.hasOwnProperty("rod_events")) {
        data_array = _stats["rod_events"];
      }
    }
  } else if (dataset === "neutronflux") {
    excludeKeys.push("id");
    for (const record of data) {
      // const.push(getRecordMetadataValue(record, NURIMS_OPERATION_DATA_NEUTRONFLUX, ""))
      data_array = getRecordMetadataValue(record, NURIMS_OPERATION_DATA_NEUTRONFLUX, [])
    }
  } else if (dataset === "controlrodposition") {
    excludeKeys.push("id");
    for (const record of data) {
      data_array = getRecordMetadataValue(record, NURIMS_OPERATION_DATA_CONTROLRODPOSITION, [])
    }
  }
  if (datasetFormat === "json") {
    f.fileName = `operating-run-${dataset}${date}.json`;
    f.fileType = "application/json";
    f.blobData = JSON.stringify(data_array,null, 2);
  } else if (datasetFormat === "csv") {
    f.fileName = `operating-run-${dataset}${date}.csv`;
    f.fileType = "text/csv";
    f.blobData = json2csv(data_array,
      {
        emptyFieldValue: "-",
        excelBOM: true,
        excludeKeys: excludeKeys,
        prependHeader: true,
        sortHeader: false,
        expandNestedObjects: true,
        wrapHeaderFields: true,
        unwindArrays: true,
      }
    );
  }
  return f;
}
