import React from 'react';
import {
  Fab,
  Grid,
  Typography,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {
  CMD_GET_GLOSSARY_TERMS,
  NURIMS_DOSIMETRY_BATCH_ID, NURIMS_DOSIMETRY_DEEP_DOSE,
  NURIMS_DOSIMETRY_ID,
  NURIMS_DOSIMETRY_MEASUREMENTS,
  NURIMS_DOSIMETRY_MONITOR_PERIOD, NURIMS_DOSIMETRY_SHALLOW_DOSE,
  NURIMS_DOSIMETRY_TIMESTAMP,
  NURIMS_DOSIMETRY_TYPE,
  NURIMS_DOSIMETRY_UNITS,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import PersonnelAndMonitorsList from "./PersonnelAndMonitorsList";
import DosimetryMeasurementMetadata from "./DosimetryMeasurementMetadata";
import BusyIndicator from "../../components/BusyIndicator";
import {toast} from "react-toastify";
import {readString} from "react-papaparse";
import {getRecordMetadataValue, setDosimetryDataValue, setRecordMetadataValue} from "../../utils/MetadataUtils";
import {transformDose} from "../../utils/DoseReportUtils";
import PropTypes from "prop-types";
import {TitleComponent} from "../../components/CommonComponents";


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
        measurement[NURIMS_DOSIMETRY_BATCH_ID] = dosimetry.BatchId;
        measurement[NURIMS_DOSIMETRY_ID] = dosimetry.Barcode;
        measurement[NURIMS_DOSIMETRY_TYPE] = "WholeBody";
        measurement[NURIMS_DOSIMETRY_TIMESTAMP] = dosimetry.Timestamp;
        measurement[NURIMS_DOSIMETRY_UNITS] = "msv";
        measurement[NURIMS_DOSIMETRY_MONITOR_PERIOD] = dosimetry.monitorPeriod;
        measurement[NURIMS_DOSIMETRY_SHALLOW_DOSE] = transformDose(dosimetry.R2, dosimetry.Units.toLowerCase(), 'msv');
        measurement[NURIMS_DOSIMETRY_DEEP_DOSE] = transformDose(dosimetry.R3, dosimetry.Units.toLowerCase(), 'msv');
        measurements.push(measurement);
        setRecordMetadataValue(record, NURIMS_DOSIMETRY_MEASUREMENTS, measurements);
      }
      return null;
    }
  }
  return `Did'nt find any entity with ${NURIMS_ENTITY_DOSE_PROVIDER_ID}=${dosimetry.hasOwnProperty("Id") ? dosimetry.Id : ""}`
}

class DosimetryMeasurement extends BaseRecordManager {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      busy: 0,
      data_changed: false,
      selection: {},
    }
    this.Module = "DosimetryMeasurement";
    this.recordTopic = "measurement";
    this.importFileRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.ctrlIKeyPress, false);
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    this.requestGetRecords(false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.ctrlIKeyPress, false);
  }

  ctrlIKeyPress = (event) => {
    console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`)
    if (event.key === 'i' && event.keyCode === 73) {
      console.log("==>", "CTRL I KEY PRESSED");
      event.preventDefault();
      this.importFileRef.current.click();
    }
  }

  requestGetRecords = (include_archived) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    this.props.send({
      cmd: this.recordCommand("get", this.topic),
      "include.withdrawn": include_archived ? "true" : "false",
      "include.metadata": "true",
      module: this.Module,
    });
    this.setState({include_archived: include_archived});
  }

  onSelection = (selection) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "onSelection", "selection", selection);
    }
    if (this.metadataRef.current) {
      this.metadataRef.current.setRecordMetadata(selection)
    }
    this.setState({selection: selection})
  }

  handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "handleFileUpload", "selectedFile", selectedFile);
    }
    const records = (this.listRef.current) ? this.listRef.current.getRecords() : [];
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
    };
    this.setState({busy: 1});
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (e) {
      // const data = JSON.parse(event.target.result);
      const results = readString(e.target.result, {header: true});
      console.log("RESULT", results)
      const header = results.meta.fields;
      const ts_column = results.meta.fields;
      let parseHeader = true;
      if (results.hasOwnProperty("data")) {
        const table_data = [];
        for (const row of results.data) {
          const msg = assignDosimetryRecord(row, records)
          if (msg) {
            console.log(">>>>", msg, row);
          }
        }
        console.log("RECORDS", records)
        // if (that.tableRef.current) {
        //   that.tableRef.current.setRecords(table_data);
        // }
      }
      that.setState({busy: 0, data_changed: true});
    };
  }

  render() {
    const {data_changed, confirm_remove, include_archived, selection, title, busy} = this.state;
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "render", "data_changed", data_changed,
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
          <Grid item xs={3}>
            <PersonnelAndMonitorsList
              ref={this.listRef}
              title={this.listTitle}
              properties={this.props.properties}
              onSelection={this.onSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={9}>
            <DosimetryMeasurementMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               disabled={selection === -1}>
            <RemoveCircleIcon sx={{mr: 1}}/>
            Remove SSC
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
               onClick={this.changeRecordArchivalStatus} disabled={!this.isValidSelection(selection)}>
            {this.isRecordArchived(selection) ?
              <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore SSC Record"</React.Fragment> :
              <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive SSC Record"</React.Fragment>}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!data_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add SSC
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

// ref={crefs["DosimetryMeasurement"]}
//       title={menuTitle}
//       user={user}
//       onClick={handleMenuAction}
//       send={send}
//       properties={properties}
//       topic={"personnel"}
// DosimetryMeasurement.propTypes = {
//   title: PropTypes.string.isRequired,
//   user: PropTypes.object.isRequired,
//   onClick: PropTypes.func.isRequired,
//   send: PropTypes.func.isRequired,
//   properties: PropTypes.object.isRequired,
//   topic: PropTypes.string.isRequired,
// }

DosimetryMeasurement.defaultProps = {
  send: (msg) => {
  },
  user: {},
  topic: "",
};

export default DosimetryMeasurement;