import React from "react";
import {UserDebugContext} from "../../utils/UserDebugContext";
import DosimetryMeasurement from "./DosimetryMeasurement";

export const PERSONNELDOSIMETRYMEASUREMENT_REF = "PersonnelDosimetryMeasurement";

class PersonnelDosimetryMeasurement extends DosimetryMeasurement {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.Module = PERSONNELDOSIMETRYMEASUREMENT_REF;
    this.topic = "personnel";
    this.listTitle = "Personnel";
  }
}

export default PersonnelDosimetryMeasurement;