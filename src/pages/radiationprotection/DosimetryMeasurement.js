import React from 'react';
import {
  Fab,
  Grid,
  Box, Button
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {
  CMD_GET_GLOSSARY_TERMS, EMPLOYEE_RECORD_TYPE,
  NURIMS_DOSIMETRY_BATCH_ID, NURIMS_DOSIMETRY_DEEP_DOSE, NURIMS_DOSIMETRY_EXTREMITY_DOSE,
  NURIMS_DOSIMETRY_ID,
  NURIMS_DOSIMETRY_MEASUREMENTS,
  NURIMS_DOSIMETRY_MONITOR_PERIOD, NURIMS_DOSIMETRY_SHALLOW_DOSE,
  NURIMS_DOSIMETRY_TIMESTAMP,
  NURIMS_DOSIMETRY_TYPE,
  NURIMS_DOSIMETRY_UNITS, NURIMS_DOSIMETRY_WRIST_DOSE,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
} from "../../utils/constants";
import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import PersonnelList from "./PersonnelList";
import DosimetryMeasurementMetadata from "./DosimetryMeasurementMetadata";
import BusyIndicator from "../../components/BusyIndicator";
import {readString} from "react-papaparse";
import {
  getMatchingEntityDoseProviderRecord,
  getRecordMetadataValue, parseDosimetryMeasurementRecordFromLine,
  parsePersonnelRecordFromLine,
  setRecordMetadataValue
} from "../../utils/MetadataUtils";
import {transformDose} from "../../utils/DoseReportUtils";
import PropTypes from "prop-types";
import {TitleComponent} from "../../components/CommonComponents";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";


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
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      busy: 0,
      selection: {},
    }
    this.Module = DOSIMETRYMEASUREMENT_REF;
    this.importFileRef = React.createRef();
    this.importRecordType = props.importRecordType;
    console.log("%%%%%%", this.importRecordType)
  }

  componentDidMount() {
    document.addEventListener("keydown", this.ctrlKeyPress, false);
    this.requestGetRecords(false, true);
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
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
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
    ]);
  }

  // requestGetRecords = (include_archived) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
  //   }
  //   this.props.send({
  //     cmd: this.recordCommand("get", this.topic),
  //     "include.withdrawn": include_archived ? "true" : "false",
  //     "include.metadata": "true",
  //     module: this.Module,
  //   });
  //   this.setState({include_archived: include_archived});
  // }

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
    const {confirm_remove, include_archived, selection, busy} = this.state;
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
              onChange={this.onRecordMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            m: 1,
          }}
        >
          <Button
            variant={"contained"}
            endIcon={<RemoveCircleIcon />}
            onClick={this.removeRecord}
            disabled={!this.isSysadminButtonAccessible(selection)}
            size={"small"}color={"primary"}
            aria-label={"remove"}
          >
            Remove Measurement
          </Button>
          <Button
            variant={"contained"}
            endIcon={this.isRecordArchived(selection) ? <UnarchiveIcon /> : <ArchiveIcon />}
            onClick={this.changeRecordArchivalStatus}
            disabled={!this.isSysadminButtonAccessible(selection)}
            size={"small"}color={"primary"}
            aria-label={"archive"}
          >
            {this.isRecordArchived(selection) ? "Restore SSC Record" : "Archive SSC Record"}
          </Button>
          <Button
            variant={"contained"}
            endIcon={<SaveIcon />}
            onClick={this.saveChanges}
            disabled={!has_changed_records}
            size={"small"}color={"primary"}
            aria-label={"save"}
          >
            Save Changes
          </Button>
          <Button
            variant={"contained"}
            endIcon={<AddIcon />}
            onClick={this.addRecord}
            size={"small"}color={"primary"}
            aria-label={"add"}
          >
            Add Measurement
          </Button>
        </Box>
        {/*<Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}*/}
        {/*       disabled={selection === -1}>*/}
        {/*    <RemoveCircleIcon sx={{mr: 1}}/>*/}
        {/*    Remove SSC*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}*/}
        {/*       onClick={this.changeRecordArchivalStatus} disabled={!this.isValidSelection(selection)}>*/}
        {/*    {this.isRecordArchived(selection) ?*/}
        {/*      <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore SSC Record"</React.Fragment> :*/}
        {/*      <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive SSC Record"</React.Fragment>}*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}*/}
        {/*       disabled={!has_changed_records}>*/}
        {/*    <SaveIcon sx={{mr: 1}}/>*/}
        {/*    Save Changes*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>*/}
        {/*    <AddIcon sx={{mr: 1}}/>*/}
        {/*    Add SSC*/}
        {/*  </Fab>*/}
        {/*</Box>*/}
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