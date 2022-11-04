import React from "react";
import {UserDebugContext} from "../../utils/UserDebugContext";
import DosimetryMeasurement from "./DosimetryMeasurement";

export const MONITORDOSIMETRYMEASUREMENT_REF = "MonitorDosimetryMeasurement";

class MonitorDosimetryMeasurement extends DosimetryMeasurement {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = MONITORDOSIMETRYMEASUREMENT_REF;
    this.topic = "monitor";
    this.listTitle = "Monitors";
  }
}

export default MonitorDosimetryMeasurement;