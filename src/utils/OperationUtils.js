import dayjs from 'dayjs';
import {
  getRecordMetadataValue
} from "./MetadataUtils";
import {
  NURIMS_OPERATION_DATA_STATS
} from "./constants";


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
  const startDate = message.hasOwnProperty("startDate") ? message.startDate : "0000-00"
  const endDate = message.hasOwnProperty("endDate") ? message.endDate.substring(5,7) : "00"
  const dataset = message.hasOwnProperty("dataset") ? message.dataset : ""
  if (dataset === "stats") {
    f.fileName = `operating-run-${dataset}-${startDate}-${endDate}.json`;
    f.fileType = "application/json";
    const records = [];
    for (const record of data) {
      const _d = getRecordMetadataValue(record, NURIMS_OPERATION_DATA_STATS, "");
      records.push(_d)
    }
    f.blobData = JSON.stringify(records,null, 2);
  } else if (dataset === "flux") {

  }
  return f;
}