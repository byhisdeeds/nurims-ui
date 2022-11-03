import React from "react";
import {UserDebugContext} from "../../utils/UserDebugContext";
import DosimetryMeasurement from "./DosimetryMeasurement";

class MonitorDosimetryMeasurement extends DosimetryMeasurement {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = "MonitorDosimetryMeasurement";
    this.topic = "monitor";
    this.listTitle = "Monitors";
  }
}

export default MonitorDosimetryMeasurement;