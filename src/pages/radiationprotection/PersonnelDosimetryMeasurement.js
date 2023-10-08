import React from "react";
import {UserDebugContext} from "../../utils/UserDebugContext";
import DosimetryMeasurement from "./DosimetryMeasurement";
import {
  EMPLOYEE_RECORD,
  EMPLOYEE_RECORD_TYPE,
  PERSONNEL_TOPIC
} from "../../utils/constants";

export const PERSONNELDOSIMETRYMEASUREMENT_REF = "PersonnelDosimetryMeasurement";

class PersonnelDosimetryMeasurement extends DosimetryMeasurement {
  static contextType = UserDebugContext;

  constructor(props) {
    props.importRecordType = EMPLOYEE_RECORD;
    super(props);
    this.Module = PERSONNELDOSIMETRYMEASUREMENT_REF;
    this.recordTopic = PERSONNEL_TOPIC;
    this.listTitle = "Personnel";
  }
}

export default PersonnelDosimetryMeasurement;