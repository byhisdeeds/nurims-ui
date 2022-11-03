import React from "react";
import {UserDebugContext} from "../../utils/UserDebugContext";
import DosimetryMeasurement from "./DosimetryMeasurement";

class PersonnelDosimetryMeasurement extends DosimetryMeasurement {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = "PersonnelDosimetryMeasurement";
    this.topic = "personnel";
    this.listTitle = "Personnel";
  }
}

export default PersonnelDosimetryMeasurement;