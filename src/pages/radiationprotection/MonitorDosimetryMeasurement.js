import React from "react";
import {UserContext} from "../../utils/UserContext";
import DosimetryMeasurement from "./DosimetryMeasurement";
import {
  EMPLOYEE_RECORD,
  FIXED_LOCATION_MONITOR_RECORD, MONITOR_RECORD_TYPE,
  MONITOR_TOPIC
} from "../../utils/constants";

export const MONITORDOSIMETRYMEASUREMENT_REF = "MonitorDosimetryMeasurement";

class MonitorDosimetryMeasurement extends DosimetryMeasurement {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.Module = MONITORDOSIMETRYMEASUREMENT_REF;
    this.recordTopic = MONITOR_TOPIC;
    this.recordType = MONITOR_RECORD_TYPE;
    this.listTitle = "Monitors";
    this.importRecordType = FIXED_LOCATION_MONITOR_RECORD;
  }
}

export default MonitorDosimetryMeasurement;