import React from 'react';
import {
  Grid,
} from "@mui/material";
import {
  CMD_GET_PROVENANCE_RECORDS,
  NURIMS_DOSIMETRY_BATCH_ID,
  NURIMS_DOSIMETRY_DEEP_DOSE,
  NURIMS_DOSIMETRY_EXTREMITY_DOSE,
  NURIMS_DOSIMETRY_ID,
  NURIMS_DOSIMETRY_MEASUREMENTS,
  NURIMS_DOSIMETRY_MONITOR_PERIOD,
  NURIMS_DOSIMETRY_SHALLOW_DOSE,
  NURIMS_DOSIMETRY_TIMESTAMP,
  NURIMS_DOSIMETRY_TYPE,
  NURIMS_DOSIMETRY_UNITS,
  NURIMS_DOSIMETRY_WRIST_DOSE,
  NURIMS_ENTITY_DOSE_PROVIDER_ID, ROLE_RADIATION_PROTECTION_DATA_ENTRY,
} from "../../utils/constants";
import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import {ConsoleLog, UserContext} from "../../utils/UserContext";
import PersonnelList from "./PersonnelList";
import DosimetryMeasurementMetadata from "./DosimetryMeasurementMetadata";
import BusyIndicator from "../../components/BusyIndicator";
import {readString} from "react-papaparse";
import {
  getMatchingEntityDoseProviderRecord,
  getRecordMetadataValue,
  parseDosimetryMeasurementRecordFromLine,
  setRecordMetadataValue
} from "../../utils/MetadataUtils";
import {
  transformDose
} from "../../utils/DoseReportUtils";
import {
  TitleComponent,
  AddRemoveArchiveSaveSubmitProvenanceButtonPanel} from "../../components/CommonComponents";
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
import {
  isValidUserRole
} from "../../utils/UserUtils";
import {
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";


function assignDosimetryRecord(dosimetry, records) {
  for (const record of records) {
    // console.log("++Id", dosimetry.hasOwnProperty("Id") && dosimetry.Id)
    // console.log("++", NURIMS_ENTITY_DOSE_PROVIDER_ID, getRecordMetadataValue(record, NURIMS_ENTITY_DOSE_PROVIDER_ID, null))
    if (dosimetry.hasOwnProperty("Id") && (getRecordMetadataValue(record, NURIMS_ENTITY_DOSE_PROVIDER_ID, null) === dosimetry.Id)) {
      // get existing dosimetry metadata
      const measurements = getRecordMetadataValue(record, NURIMS_DOSIMETRY_MEASUREMENTS, []);
      let exists = false;
      for (const measurement of measurements) {
        if (measurement[NURIMS_DOSIMETRY_BATCH_ID] === dosimetry.Barcode) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        const measurement = {};
        measurement[NURIMS_ENTITY_DOSE_PROVIDER_ID] = dosimetry.Id;
        measurement[NURIMS_DOSIMETRY_BATCH_ID] = dosimetry.BatchId;
        measurement[NURIMS_DOSIMETRY_ID] = dosimetry.Barcode;
        measurement[NURIMS_DOSIMETRY_TYPE] = dosimetry.recordType;
        measurement[NURIMS_DOSIMETRY_TIMESTAMP] = dosimetry.Timestamp;
        measurement[NURIMS_DOSIMETRY_UNITS] = "msv";
        measurement[NURIMS_DOSIMETRY_MONITOR_PERIOD] = dosimetry.monitorPeriod;
        measurement["badge.date.available"] = dosimetry.dateAvailable;
        measurement["badge.return.timestamp"] = dosimetry.returnTimestamp;
        if (dosimetry.recordType === "wholebody") {
          measurement[NURIMS_DOSIMETRY_SHALLOW_DOSE] = transformDose(dosimetry.R2, dosimetry.Units.toLowerCase(), 'msv');
          measurement[NURIMS_DOSIMETRY_DEEP_DOSE] = transformDose(dosimetry.R3, dosimetry.Units.toLowerCase(), 'msv');
        } else if (dosimetry.recordType === "extremity") {
          measurement[NURIMS_DOSIMETRY_EXTREMITY_DOSE] = transformDose(dosimetry.R3, dosimetry.Units.toLowerCase(), 'msv');
        } else if (dosimetry.recordType === "wrist") {
          measurement[NURIMS_DOSIMETRY_WRIST_DOSE] = transformDose(dosimetry.R3, dosimetry.Units.toLowerCase(), 'msv');
        }
        measurements.push(measurement);
        setRecordMetadataValue(record, NURIMS_DOSIMETRY_MEASUREMENTS, measurements);
        record["changed"] = true;
      }
      return null;
    }
  }
  return `Did'nt find any entity with ${NURIMS_ENTITY_DOSE_PROVIDER_ID}=${dosimetry.hasOwnProperty("Id") ? dosimetry.Id : ""}`
}

export const DOSIMETRYMEASUREMENT_REF = "DosimetryMeasurement";

class DosimetryMeasurement extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      busy: 0,
      selection: {},
      show_provenance_view: false,
    }
    this.Module = DOSIMETRYMEASUREMENT_REF;
    this.provenanceRecords = [];
    this.importFileRef = React.createRef();
    this.importRecordType = props.importRecordType;
    console.log("%%%%%%", this.importRecordType)
  }

  componentDidMount() {
    document.addEventListener("keydown", this.ctrlKeyPress, false);
    this.requestGetRecords(false, true);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.ctrlKeyPress, false);
  }

  ctrlKeyPress = (event) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ctrlKeyPress", "key", event.key, "ctrlKey", event.ctrlKey);
    }
    if (event.key === 'i' && event.ctrlKey) {
      // Ctrl+i
      event.preventDefault();
      if (this.importFileRef.current) {
        this.importFileRef.current.click();
      }
    }
  }

  ws_message = (message) => {
    super.ws_message(message);
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (message.cmd === CMD_GET_PROVENANCE_RECORDS) {
          this.setProvenanceRecords(response.provenance)
        }
      }
    }
  }

  setProvenanceRecords = (provenance) => {
    setProvenanceRecordsHelper(this, provenance);
  }

  showProvenanceRecordsView = () => {
    showProvenanceRecordsViewHelper(this);
  }

  closeProvenanceRecordsView = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    this.setState({show_provenance_view: false,});
  }

  onSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onSelection", "selection", selection);
    }
    if (this.metadataRef.current) {
      this.metadataRef.current.setRecordMetadata(selection)
    }
    this.setState({selection: selection})
  }

  handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleFileUpload", "selectedFile", selectedFile);
    }
    const records = (this.listRef.current) ? this.listRef.current.getRecords() : [];
    const importRecordType = this.importRecordType;
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      enqueueErrorSnackbar(`Error occurred reading file: ${selectedFile.name}`)
    };
    this.setState({busy: 1});
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (e) {
      const results = readString(e.target.result, {header: true});
      // console.log("RESULT", results)
      const header = results.meta.fields;
      const ts_column = results.meta.fields;
      let parseHeader = true;
      if (results.hasOwnProperty("data")) {
        for (const row of results.data) {
          if (row.hasOwnProperty("Type") && row.Type === importRecordType) {
            const r = getMatchingEntityDoseProviderRecord(records, row);
            if (r) {
              // get existing dosimetry measurements
              const measurements = getRecordMetadataValue(r, NURIMS_DOSIMETRY_MEASUREMENTS, []);
              // check if the measurement data in the line is already recorded
              let add = true;
              for (const measurement of measurements) {
                if (measurement[NURIMS_DOSIMETRY_BATCH_ID] === row.Barcode) {
                  add = false;
                  break;
                }
              }
              if (add) {
                measurements.push(parseDosimetryMeasurementRecordFromLine(row));
                setRecordMetadataValue(r, NURIMS_DOSIMETRY_MEASUREMENTS, measurements);
                r["changed"] = true;
              }
            }
          }
        }
        // for (const row of results.data) {
        //   const msg = assignDosimetryRecord(row, records)
        //   if (msg) {
        //     console.log(">>>>", msg, row);
        //   }
        // }
        // console.log("RECORDS", records)
        // if (that.tableRef.current) {
        //   that.tableRef.current.setRecords(table_data);
        // }
      }
      that.setState({busy: 0});
    };
    this.setState({busy: 1});
  }

  render() {
    const {confirm_remove, include_archived, selection, busy, show_provenance_view} = this.state;
    const {user} = this.props;
    const isSysadmin = isValidUserRole(user, "sysadmin");
    const has_changed_records = this.hasChangedRecords();
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "has_changed_records", has_changed_records,
        "confirm_removed", confirm_remove, "include_archived", include_archived, "selection", selection);
    }
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <ShowProvenanceRecordsDialog open={show_provenance_view}
                                     selection={selection}
                                     body={this.provenanceRecords.join("\n")}
                                     onCancel={this.closeProvenanceRecordsView}
        />
        <BusyIndicator open={busy > 0} loader={"bar"} size={40}/>
        <input
          ref={this.importFileRef}
          accept="text/csv"
          id="import-file-uploader"
          style={{display: 'none',}}
          onChange={this.handleFileUpload}
          type="file"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={4}>
            <PersonnelList
              ref={this.listRef}
              title={this.listTitle}
              properties={this.props.properties}
              onSelection={this.onSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={8}>
            <DosimetryMeasurementMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              glossary={this.props.glossary}
              onChange={this.onRecordMetadataChanged}
            />
          </Grid>
        </Grid>
        {<AddRemoveArchiveSaveSubmitProvenanceButtonPanel
          THIS={this}
          user={user}
          onClickAddRecord={this.addRecord}
          onClickChangeRecordArchivalStatus={this.changeRecordArchivalStatus}
          onClickRemoveRecord={this.removeRecord}
          onClickSaveRecordChanges={this.saveChanges}
          onClickViewProvenanceRecords={this.showProvenanceRecordsView}
          addRecordButtonLabel={"Add Measurement"}
          removeRecordButtonLabel={"Remove Measurement"}
          addRole={ROLE_RADIATION_PROTECTION_DATA_ENTRY}
          removeRole={"sysadmin"}
          saveRole={ROLE_RADIATION_PROTECTION_DATA_ENTRY}
          archiveRole={ROLE_RADIATION_PROTECTION_DATA_ENTRY}
        />}
      </React.Fragment>
    );
  }
}

DosimetryMeasurement.defaultProps = {
  send: (msg) => {
  },
  user: {},
  importRecordType: "",
};

export default DosimetryMeasurement;