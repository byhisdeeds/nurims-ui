// import React, {Component} from 'react';
// import {
//   Fab,
//   Grid,
// } from "@mui/material";
// import SaveIcon from '@mui/icons-material/Save';
// import UploadIcon from '@mui/icons-material/Upload';
// import Box from "@mui/material/Box";
// import {
//   CMD_UPDATE_SAMPLE_IRRADIATION_LOG_RECORD,
//   ITEM_ID,
// } from "../../utils/constants";
// import {
//   isCommandResponse,
//   messageHasResponse,
//   messageResponseStatusOk
// } from "../../utils/WebsocketUtils";
// import {
//   withTheme
// } from "@mui/styles";
// import BusyIndicator from "../../components/BusyIndicator";
// import PagedCsvTable from "../../components/PagedCsvTable";
// import {readString} from "react-papaparse";
// import {
//   ConsoleLog,
//   UserContext
// } from "../../utils/UserContext";
// import {
//   TitleComponent
// } from "../../components/CommonComponents";
// import {
//   enqueueErrorSnackbar
// } from "../../utils/SnackbarVariants";
//
// export const ADDEDITIRRADIATEDSAMPLES_REF = "AddEditIrradiatedSamples";
//
// class AddEditIrradiatedSamples extends Component {
//   static contextType = UserContext;
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       busy: 0,
//       data_changed: false,
//       messages: [],
//       title: props.title,
//     };
//     this.Module = ADDEDITIRRADIATEDSAMPLES_REF;
//     this.tableRef = React.createRef();
//     this.recordsToSave = [];
//   }
//
//   componentDidMount() {
//   }
//
//   ws_message = (message) => {
//     if (this.context.debug) {
//       ConsoleLog(this.Module, "ws_message", message);
//     }
//     if (messageHasResponse(message)) {
//       const response = message.response;
//       if (messageResponseStatusOk(message)) {
//         if (isCommandResponse(message, CMD_UPDATE_SAMPLE_IRRADIATION_LOG_RECORD)) {
//           const messages = this.state.messages;
//           if (response.message !== "") {
//             messages.push(response.message);
//           } else if (response.hasOwnProperty("operation") && response.operation.hasOwnProperty("irradiated_sample_log_record")) {
//             messages.push(`Irradiated sample record for ${response.operation.irradiated_sample_log_record["metadata"]["nurims.operation.data.irradiatedsample.id"]} updated successfully`);
//           }
//           this.setState({messages: messages});
//           this.saveNextRecord();
//         }
//       } else {
//         enqueueErrorSnackbar(response.message);
//       }
//     }
//   }
//
//   saveNextRecord = () => {
//     const record = this.recordsToSave.pop();
//     if (record) {
//       this.props.send({
//         cmd: CMD_UPDATE_SAMPLE_IRRADIATION_LOG_RECORD,
//         record: record,
//         module: this.Module,
//       })
//     }
//   }
//
//   saveChanges = () => {
//     if (this.context.debug) {
//       ConsoleLog(this.Module, "saveChanges");
//     }
//     if (this.tableRef.current) {
//       this.recordsToSave = [...this.tableRef.current.getRecords()];
//       console.log(".....recordsToSave....", this.recordsToSave)
//       this.saveNextRecord();
//     }
//     this.setState({data_changed: false})
//   }
//
//   handleFileUpload = (event) => {
//     const selectedFile = event.target.files[0];
//     if (this.context.debug) {
//       ConsoleLog(this.Module, "handleFileUpload", "selectedFile", selectedFile);
//     }
//     const that = this;
//     const fileReader = new FileReader();
//     fileReader.onerror = function () {
//       enqueueErrorSnackbar(`Error occurred reading file: ${selectedFile.name}`)
//     };
//     this.setState({busy: 1});
//     fileReader.readAsText(selectedFile);
//     fileReader.onload = function (event) {
//       const csvData = event.target.result;
//       // const data = JSON.parse(event.target.result);
//       const results = readString(csvData);
//       const header = {};
//       const ts_column = [];
//       let parseHeader = true;
//       console.log("RESULT", results)
//       if (results.hasOwnProperty("data")) {
//         const table_data = [];
//         for (const row of results.data) {
//           if (row.length > 5) {
//             if (parseHeader) {
//               parseHeader = false;
//               for (const index in row) {
//                 const column = row[index].trim().toLowerCase();
//                 if (column === "timestamp_in") {
//                   header[index] = "nurims.operation.data.irradiatedsample.timestampin";
//                   ts_column[index] = true;
//                 } else if (column === "timestamp_out") {
//                   header[index] = "nurims.operation.data.irradiatedsample.timestampout";
//                   ts_column[index] = true;
//                 } else if (column === "id") {
//                   header[index] = "nurims.operation.data.irradiatedsample.id";
//                   ts_column[index] = false;
//                 } else if (column === "sample_type") {
//                   header[index] = "nurims.operation.data.irradiatedsample.type";
//                   ts_column[index] = false;
//                 } else if (column === "label") {
//                   header[index] = "nurims.operation.data.irradiatedsample.label";
//                   ts_column[index] = false;
//                 } else if (column === "site") {
//                   header[index] = "nurims.operation.data.irradiatedsample.site";
//                   ts_column[index] = false;
//                 }
//               }
//             } else {
//               const cell_data = {item_id: -1};
//               for (const index in row) {
//                 if (ts_column[index]) {
//                   cell_data[header[index]] = row[index].trim().substring(0,19);
//                 } else {
//                   cell_data[header[index]] = row[index].trim();
//                 }
//               }
//               table_data.push(cell_data);
//             }
//           }
//         }
//         if (that.tableRef.current) {
//           that.tableRef.current.setRecords(table_data);
//         }
//       }
//       that.setState({busy: 0, data_changed: true});
//     };
//   }
//
//   render() {
//     const {busy, data_changed, messages} = this.state;
//     if (this.context.debug) {
//       ConsoleLog(this.Module, "render", "data_changed", data_changed);
//     }    return (
//       <React.Fragment>
//         <BusyIndicator open={busy > 0} loader={"pulse"} size={40}/>
//         <input
//           accept="text/csv"
//           // className={classes.input}
//           id="import-file-uploader"
//           style={{display: 'none',}}
//           onChange={this.handleFileUpload}
//           type="file"
//         />
//         <Grid container spacing={2}>
//           <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
//             <TitleComponent title={this.props.title} />
//           </Grid>
//           <Grid item xs={12} sx={{height: 300, overflowY: 'auto', paddingTop: 10}}>
//             <PagedCsvTable
//               ref={this.tableRef}
//               title={"Irradiated Samples"}
//               properties={this.props.properties}
//               onSelection={this.onRecordSelection}
//               // includeArchived={include_archived}
//               // requestGetRecords={this.requestGetRecords}
//               enableRecordArchiveSwitch={false}
//               cells={[
//                 {
//                   id: ITEM_ID,
//                   align: 'center',
//                   disablePadding: true,
//                   label: 'ID',
//                   width: '10%',
//                   sortField: true,
//                 },
//                 {
//                   id: "nurims.operation.data.irradiatedsample.timestampin",
//                   align: 'left',
//                   disablePadding: true,
//                   label: 'Timestamp In',
//                   width: '15%',
//                   sortField: true,
//                 },
//                 {
//                   id: "nurims.operation.data.irradiatedsample.timestampout",
//                   align: 'left',
//                   disablePadding: true,
//                   label: 'Timestamp Out',
//                   width: '15%',
//                   sortField: true,
//                 },
//                 {
//                   id: "nurims.operation.data.irradiatedsample.id",
//                   align: 'left',
//                   disablePadding: true,
//                   label: 'ID',
//                   width: '15%',
//                   sortField: true,
//                 },
//                 {
//                   id: "nurims.operation.data.irradiatedsample.label",
//                   align: 'left',
//                   disablePadding: true,
//                   label: 'Label',
//                   width: '25%',
//                   sortField: true,
//                 },
//                 {
//                   id: "nurims.operation.data.irradiatedsample.type",
//                   align: 'left',
//                   disablePadding: true,
//                   label: 'Type',
//                   width: '10%',
//                   sortField: true,
//                 },
//                 {
//                   id: "nurims.operation.data.irradiatedsample.site",
//                   align: 'left',
//                   disablePadding: true,
//                   label: 'Type',
//                   width: '10%',
//                   sortField: true,
//                 },
//               ]}
//             />
//           </Grid>
//           <Grid item xs={12} sx={{height: 'calc(100vh - 520px)', overflowY: 'auto', paddingTop: 0}}>
//             <Box>
//               {messages.map(msg => (
//                 <div>{msg}</div>
//               ))}
//             </Box>
//           </Grid>
//         </Grid>
//         <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
//           <label htmlFor="import-file-uploader">
//             <Fab variant="extended" size="small" color="primary" aria-label="import" component={"span"}>
//               <UploadIcon sx={{mr: 1}}/>
//               Import Irradiated Samples From .csv File
//             </Fab>
//           </label>
//           <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
//                disabled={!data_changed}>
//             <SaveIcon sx={{mr: 1}}/>
//             Save Changes
//           </Fab>
//         </Box>
//       </React.Fragment>
//     );
//   }
// }
//
// AddEditIrradiatedSamples.defaultProps = {
//   send: (msg) => {
//   },
//   user: {},
// };
//
// export default withTheme(AddEditIrradiatedSamples);
import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  ConfirmRemoveRecordDialog
} from "../../components/UtilityDialogs";
import {
  CMD_DELETE_USER_RECORD,
  CMD_GET_REACTOR_WATER_SAMPLE_RECORDS, CMD_GET_SAMPLE_IRRADIATION_LOG_RECORD_FOR_YEAR,
  CMD_GET_SAMPLE_IRRADIATION_LOG_RECORDS,
  CMD_UPDATE_REACTOR_WATER_SAMPLE_RECORD,
  ITEM_ID,
  METADATA,
  NURIMS_SAMPLEDATE,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";
import {
  Box,
  Fab,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Save as SaveIcon,
  RemoveCircle as RemoveCircleIcon,
} from "@mui/icons-material";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  ArchiveRecordLabel
} from "../../utils/RenderUtils";
import {
  getRecordMetadataValue,
  record_uuid
} from "../../utils/MetadataUtils";
import {
  TitleComponent
} from "../../components/CommonComponents";
import {
  enqueueErrorSnackbar,
  enqueueSuccessSnackbar
} from "../../utils/SnackbarVariants";
import IrradiatedSamplesList from "./IrradiatedSamplesList";
import IrradiatedSamplesMetadata from "./IrradiatedSamplesMetadata";

export const ADDEDITIRRADIATEDSAMPLES_REF = "AddEditIrradiatedSamples";

class AddEditIrradiatedSamples extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      selection: {},
      title: props.title,
      include_archived: false,
    };
    this.Module = ADDEDITIRRADIATEDSAMPLES_REF;
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
  }

  componentDidMount() {
    this.requestGetRecords(this.state.include_archived);
  }

  isAccesibleButton = (selection) => {
    return (selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
  }

  changeRecordArchivalStatus = () => {
    console.log("changeRecordArchivalStatus - selection", this.state.selection)
    const selection = this.state.selection;
    if (selection.hasOwnProperty(NURIMS_WITHDRAWN)) {
      selection[NURIMS_WITHDRAWN] = selection[NURIMS_WITHDRAWN] === 0 ? 1 : 0;
      selection.changed = true;
      this.setState({selection: selection, metadata_changed: selection.changed});
    }
  }

  onRecordMetadataChanged = (state) => {
    this.setState({metadata_changed: state});
  }

  removeRecord = () => {
    console.log("REMOVE RECORD")
    this.setState({confirm_remove: true,});
  }

  cancelRemove = () => {
    this.setState({confirm_remove: false,});
  }

  proceedWithRemove = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithRemove", "selection", this.state.selection);
    }
    this.setState({confirm_remove: false,});
    if (this.state.selection.item_id === -1) {
      if (this.listRef.current) {
        this.listRef.current.removeRecord(this.state.selection)
      }
    } else {
      const records = this.listRef.current.getRecords();
      for (const record in records) {
        this.props.send({
          cmd: this.recordCommand("delete"),
          item_id: record.item_id,
          module: this.Module,
        });
      }

    }
  }

  addRecord = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "addRecord");
    }
    this.props.send({
      cmd: CMD_GET_SAMPLE_IRRADIATION_LOG_RECORD_FOR_YEAR,
      "include.disabled": "true",
      "startDate": "2022-01-01",
      "endDate": "2022-12-31",
      module: this.Module,
    })
    this.setState({include_archived: true});



    // if (this.listRef.current) {
    //   this.listRef.current.addRecords([{
    //     "changed": true,
    //     "item_id": -1,
    //     "nurims.title": "New Log Record",
    //     "nurims.withdrawn": 0,
    //     "metadata": {
    //       username: "New Record",
    //       password: "",
    //       authorized_module_level: "",
    //       role: "",
    //     }
    //   }], false);
    //   this.setState({metadata_changed: true});
    // }
  }

  requestGetRecords = (include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    this.props.send({
      cmd: CMD_GET_SAMPLE_IRRADIATION_LOG_RECORDS,
      "include.disabled": include_archived ? "true" : "false",
      "include.metadata": "true",
      module: this.Module,
    })
    this.setState({include_archived: include_archived});
  }

  saveChanges = () => {
    if (this.listRef.current) {
      const records = this.listRef.current.getRecords();
      for (const record of records) {
        // only save monitor record with changed metadata
        if (record.changed) {
          if (this.context.debug) {
            ConsoleLog(this.Module, "saveChanges", record);
          }
          if (record.item_id === -1 && !record.hasOwnProperty("record_key")) {
            record["record_key"] = record_uuid();
          }
          // Only update then changed metadata fields
          console.log("CHANGED METADATA", record["changed.metadata"])
          const metadata_entries = [];
          for (const md of record["changed.metadata"]) {
            const entry = {};
            entry[md] = getRecordMetadataValue(record, md, "");
            metadata_entries.push(entry)
          }
          record["metadata"] = metadata_entries;
          console.log("SAVING RECORD", record)
          this.props.send({
            cmd: CMD_UPDATE_REACTOR_WATER_SAMPLE_RECORD,
            item_id: record.item_id,
            "nurims.title": record[NURIMS_TITLE],
            "nurims.withdrawn": record[NURIMS_WITHDRAWN],
            metadata: record.metadata,
            record_key: record.record_key,
            module: this.Module,
          })
        }
      }
    }

    // this.setState({metadata_changed: false})
  }

  ws_message(message) {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_SAMPLE_IRRADIATION_LOG_RECORDS)) {
          const selection = this.state.selection;
          if (Object.keys(selection).length === 0) {
            if (this.listRef.current) {
              this.listRef.current.setRecords(response.operation);
            }
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata();
            }
          } else {
            if (!message.hasOwnProperty("item_id") && this.listRef.current) {
              // this.listRef.current.setRecords(response[this.recordTopic], true);
              this.listRef.current.setRecords(response.operation);
            }
            if (message.hasOwnProperty("item_id")) {
              // const record = getMatchingResponseObject(message, "response." + this.recordTopic, "item_id", selection["item_id"]);
              const record = getMatchingResponseObject(message, "response.operation", "item_id", selection["item_id"]);
              selection[METADATA] = [...record[METADATA]]
              if (this.metadataRef.current) {
                this.metadataRef.current.setRecordMetadata(selection);
              }
            }
          }
        } else if (isCommandResponse(message, CMD_GET_SAMPLE_IRRADIATION_LOG_RECORD_FOR_YEAR)) {
          // const selection = this.state.selection;
          // const record = getMatchingResponseObject(message, "response.operation", "item_id", selection["item_id"]);
          // selection[METADATA] = [...record[METADATA]]
          // if (this.listRef.current) {
          //   this.listRef.current.updateRecord(response.operation);
          // }
          // if (this.metadataRef.current) {
          //   this.metadataRef.current.setRecordMetadata(selection);
          // }
        } else if (isCommandResponse(message, CMD_UPDATE_REACTOR_WATER_SAMPLE_RECORD)) {
          enqueueSuccessSnackbar(`Successfully updated record for ${message[NURIMS_TITLE]}.`);
          const selection = this.state.selection;
          const record = getMatchingResponseObject(message, "response.operation", "item_id", selection["item_id"]);
          selection[METADATA] = [...record[METADATA]]
          if (this.listRef.current) {
            this.listRef.current.updateRecord(response.operation);
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setRecordMetadata(selection);
          }
          // if (this.listRef.current) {
          //   // this.listRef.current.updateRecord(response[this.recordTopic]);
          //   this.listRef.current.updateRecord(response.operation);
          // }
        } else if (isCommandResponse(message, CMD_DELETE_USER_RECORD)) {
          enqueueSuccessSnackbar(`Record (id: ${response.item_id}) deleted successfully`)
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setRecordMetadata({})
          }
          this.setState({selection: {}, metadata_changed: false});
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  onRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
    }
    if (selection.hasOwnProperty("item_id") && selection.item_id === -1) {
      if (this.metadataRef.current) {
        this.metadataRef.current.setRecordMetadata(selection)
      }
    } else {
      this.setState(pstate => {
        return {selection: selection}
      });
      this.props.send({
        cmd: CMD_GET_REACTOR_WATER_SAMPLE_RECORDS,
        item_id: selection.item_id,
        "include.metadata": "true",
        "include.metadata.subtitle": NURIMS_SAMPLEDATE,
        module: this.Module,
      })
    }
    this.setState({selection: selection})
  }

  // onRecordSelection = (selection) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
  //   }
  //   if (selection.hasOwnProperty("item_id")) {
  //     if (this.metadataRef.current) {
  //       this.metadataRef.current.setRecordMetadata(selection)
  //     }
  //   }
  //   this.setState({selection: selection})
  // }

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "metadata_changed", metadata_changed,
        "confirm_removed", confirm_remove, "include_archived", include_archived, "selection", selection);
    }
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={4}>
            <IrradiatedSamplesList
              ref={this.listRef}
              title={"Irradiated Samples"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={8}>
            <IrradiatedSamplesMetadata
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
               onClick={this.changeRecordArchivalStatus} disabled={!this.isAccesibleButton(selection)}>
            {ArchiveRecordLabel(selection, "Run")}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add Irradiated Samples Log
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

AddEditIrradiatedSamples.defaultProps = {
  send: (msg) => {},
};

export default AddEditIrradiatedSamples;