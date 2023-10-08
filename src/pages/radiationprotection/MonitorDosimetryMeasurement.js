import React from "react";
import {UserDebugContext} from "../../utils/UserDebugContext";
import DosimetryMeasurement from "./DosimetryMeasurement";
import {
  EMPLOYEE_RECORD,
  FIXED_LOCATION_MONITOR_RECORD,
  MONITOR_TOPIC
} from "../../utils/constants";

export const MONITORDOSIMETRYMEASUREMENT_REF = "MonitorDosimetryMeasurement";

class MonitorDosimetryMeasurement extends DosimetryMeasurement {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = MONITORDOSIMETRYMEASUREMENT_REF;
    this.recordTopic = MONITOR_TOPIC;
    this.listTitle = "Monitors";
    this.importRecordType = FIXED_LOCATION_MONITOR_RECORD;
  }
}

export default MonitorDosimetryMeasurement;