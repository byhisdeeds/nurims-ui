// import React, {Component} from 'react';
// import {
//   Fab,
//   Grid,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   DialogContentText,
//   Typography
// } from "@mui/material";
// import SaveIcon from '@mui/icons-material/Save';
// import UploadIcon from '@mui/icons-material/Upload';
// import {toast} from "react-toastify";
// import Box from "@mui/material/Box";
// import DosimetryMetadata from "./DosimetryMetadata";
// import DosimetrySurveillanceList from "./DosimetrySurveillanceList";
// import {withTheme} from "@mui/styles";
//
// const MODULE = "AddDosimetryMeasurement";
//
// function ConfirmRemoveDialog(props) {
//   return (
//     <div>
//       <Dialog
//         open={props.open}
//         onClose={props.onCancel}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {`Delete record for ${props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""}`}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete the record
//             for {props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""} (
//             {props.person.hasOwnProperty("item_id") ? props.person["item_id"] : ""})?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={props.onCancel}>No</Button>
//           <Button onClick={props.onProceed} autoFocus>Yes</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
//
// function ConfirmSelectionChangeDialog(props) {
//   return (
//     <div>
//       <Dialog
//         open={props.open}
//         onClose={props.onCancel}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {`Save Previous Changed for ${props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""}`}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             The details for {props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""} have
//             changed without being saved. Do you want to continue without saving the details and loose the changes ?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={props.onCancel}>No</Button>
//           <Button onClick={props.onProceed} autoFocus>Yes</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
//
// class AddDosimetryMeasurement extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       metadata_changed: false,
//       alert: false,
//       previous_selection: {},
//       selection: {},
//       title: props.title,
//     };
//     this.plref = React.createRef();
//     this.pdref = React.createRef();
//   }
//
//   componentDidMount() {
//     this.props.send({
//       cmd: 'get_personnel_with_metadata',
//       module: MODULE,
//       metadata: [
//         'nurims.entity.doseproviderid',
//         'nurims.entity.iswholebodymonitored',
//         'nurims.entity.isextremitymonitored',
//         'nurims.entity.iswristmonitored',
//       ]
//     })
//   }
//
//   onRefreshSurveillanceList = () => {
//     this.props.send({
//       cmd: 'get_personnel_with_metadata',
//       module: MODULE,
//       metadata: [
//         'nurims.entity.doseproviderid',
//         'nurims.entity.iswholebodymonitored',
//         'nurims.entity.isextremitymonitored',
//         'nurims.entity.iswristmonitored',
//       ]
//     });
//   }
//
//   ws_message = (message) => {
//     console.log("ON_WS_MESSAGE", MODULE, message)
//     if (message.hasOwnProperty("response")) {
//       const response = message.response;
//       if (response.hasOwnProperty("status") && response.status === 0) {
//         if (message.hasOwnProperty("cmd") && message.cmd === "get_personnel_with_metadata") {
//           if (this.plref.current) {
//             // this.plref.current.update_personnel(response.personnel, true)
//             this.plref.current.set_personnel(response.personnel)
//           }
//         } else if (message.hasOwnProperty("cmd") && message.cmd === "get_personnel_metadata") {
//           if (this.pdref.current) {
//             this.pdref.current.update_personnel_details(response.personnel)
//           }
//         } else if (message.hasOwnProperty("cmd") && message.cmd === "update_personnel_record") {
//           // toast.success("Personnel details updated successfully")
//           // if (this.plref.current) {
//           //   this.plref.current.update_selected_person(response.personnel)
//           // }
//           // if (this.pdref.current) {
//           //   this.pdref.current.update_personnel_record(response.personnel)
//           // }
//         } else if (message.hasOwnProperty("cmd") && message.cmd === "permanently_delete_person") {
//           // toast.success("Personnel record deleted successfully")
//           // if (this.plref.current) {
//           //   this.plref.current.removePerson(this.state.selection)
//           // }
//           // // if (this.plref.current) {
//           // //   this.plref.current.update_selected_person(response.personnel)
//           // // }
//           // if (this.pdref.current) {
//           //   this.pdref.current.update_personnel_details({})
//           // }
//         }
//       } else {
//         toast.error(response.message);
//       }
//     }
//   }
//
//   on_person_selected = (previous_person, person) => {
//     console.log("-- on_person_selected (previous selection) --", previous_person)
//     console.log("-- on_person_selected (selection) --", person)
//     if (previous_person.has_changed) {
//       // toast.info("details have changed");
//       this.setState({alert: true})
//     } else {
//       if (this.pdref.current) {
//         this.pdref.current.setDoseMetadata(person)
//       }
//     }
//     this.setState({previous_selection: previous_person, selection: person})
//   }
//
//   saveChanges = () => {
//     console.log("saving changes")
//     if (this.pdref.current) {
//       const details = this.pdref.current.get_person_details()
//       console.log("DETAILS", details)
//       // prepare person object
//       const person = {
//         ...{
//           item_id: details.item_id,
//           "nurims.title": details["nurims.title"],
//           "nurims.withdrawn": details["nurims.withdrawn"],
//           metadata: [],
//         }
//       };
//       if (details.hasOwnProperty("nurims.entity.nid")) {
//         person.metadata.push({"nurims.entity.nid": details["nurims.entity.nid"]});
//       }
//       if (details.hasOwnProperty("nurims.entity.sex")) {
//         person.metadata.push({"nurims.entity.sex": details["nurims.entity.sex"]});
//       }
//       if (details.hasOwnProperty("nurims.entity.dob")) {
//         person.metadata.push({"nurims.entity.dob": details["nurims.entity.dob"].toISOString().substring(0,10)});
//       }
//       if (details.hasOwnProperty("nurims.entity.contact")) {
//         person.metadata.push({"nurims.entity.contact": details["nurims.entity.contact"]});
//       }
//       if (details.hasOwnProperty("nurims.entity.workdetails")) {
//         person.metadata.push({"nurims.entity.workdetails": details["nurims.entity.workdetails"]});
//       }
//       if (details.hasOwnProperty("nurims.entity.doseproviderid")) {
//         person.metadata.push({"nurims.entity.doseproviderid": details["nurims.entity.doseproviderid"]});
//       }
//       // this.props.send({
//       //   cmd: 'update_personnel_details',
//       //   item_id: person.item_id,
//       //   "nurims.title": person["nurims.title"],
//       //   "nurims.withdrawn": person["nurims.withdrawn"],
//       //   metadata: person.metadata,
//       //   module: MODULE,
//       // })
//     }
//
//     // this.setState({details_changed: false})
//   }
//
//   // addPerson = () => {
//   //   if (this.plref.current) {
//   //     this.plref.current.update_personnel([{
//   //       "item_id": -1,
//   //       "nurims.title": "New Person",
//   //       "nurims.withdrawn": 0
//   //     }], false)
//   //   }
//   // }
//
//   onDoseMetadataChanged = (state) => {
//     this.setState({metadata_changed: state});
//   }
//
//   proceed_with_selection_change = () => {
//     // set new selection and load details
//     // console.log("#### saving personnel details ###", this.state.previous_selection)
//     const selection = this.state.selection;
//     const previous_selection = this.state.previous_selection;
//     selection.has_changed = false;
//     previous_selection.has_changed = false;
//     this.setState({alert: false, selection: selection, previous_selection: previous_selection});
//     if (this.plref.current) {
//       this.plref.current.setSelection(selection)
//     }
//     if (this.pdref.current) {
//       this.pdref.current.setDoseMetadata(selection)
//     }
//   }
//
//   cancel_selection_change = () => {
//     this.setState({alert: false,});
//     if (this.plref.current) {
//       this.plref.current.setSelection(this.state.previous_selection)
//     }
//   }
//
//   handleFileUpload = (e) => {
//     const selectedFile = e.target.files[0];
//     console.log("file uploaded", selectedFile)
//     const plref = this.plref;
//     const state = this.setState;
//     const fileReader = new FileReader();
//     fileReader.onerror = function () {
//       toast.error(`Error occurred reading file: ${selectedFile.name}`)
//     };
//     fileReader.readAsText(selectedFile);
//     fileReader.onload = function (event) {
//       // console.log(">>>>>", event.target.result);
//       const data = JSON.parse(event.target.result);
//       console.log(data)
//       if (plref.current) {
//         plref.current.importDoseReport(data);
//       }
//     };
//   }
//
//   render() {
//     const {metadata_changed, alert, previous_selection, selection, title, } = this.state;
//     return (
//       <React.Fragment>
//         <ConfirmSelectionChangeDialog open={alert}
//                                       person={previous_selection}
//                                       onProceed={this.proceed_with_selection_change}
//                                       onCancel={this.cancel_selection_change}
//         />
//         <input
//           accept="*.csv, *.txt, text/plain"
//           // className={classes.input}
//           id="import-file-uploader"
//           style={{display: 'none',}}
//           onChange={this.handleFileUpload}
//           type="file"
//         />
//         <Grid container spacing={2}>
//           <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
//             <Typography variant="h5" component="div">{title}</Typography>
//           </Grid>
//           <Grid item xs={7} style={{border: '1px solid red'}}>
//             <DosimetrySurveillanceList
//               ref={this.plref}
//               properties={this.props.properties}
//               onChange={this.onDoseMetadataChanged}
//               onClick={this.on_person_selected}
//               onRefresh={this.onRefreshSurveillanceList}
//             />
//           </Grid>
//           <Grid item xs={5}>
//             <DosimetryMetadata
//               ref={this.pdref}
//               properties={this.props.properties}
//               onChange={this.onDoseMetadataChanged}
//             />
//           </Grid>
//         </Grid>
//         <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
//           <label htmlFor="import-file-uploader">
//             <Fab variant="extended" size="small" color="primary" aria-label="import" component={"span"}>
//               <UploadIcon sx={{mr: 1}}/>
//               Import From Dose Report
//             </Fab>
//           </label>
//           <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
//                disabled={!metadata_changed}>
//             <SaveIcon sx={{mr: 1}}/>
//             Save Changes
//           </Fab>
//         </Box>
//       </React.Fragment>
//     );
//   }
// }
//
// AddDosimetryMeasurement.defaultProps = {
//   send: (msg) => {
//   },
//   user: {},
// };
//
// export default withTheme(AddDosimetryMeasurement);
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
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../utils/UtilityDialogs";
import SSCMetadata from "./../maintenance/SSCMetadata";
import {ConsoleLog} from "../../utils/UserDebugContext";
import PersonnelAndMonitorsList from "./PersonnelAndMonitorsList";

class AddDosimetryMeasurement extends BaseRecordManager {
  constructor(props) {
    super(props);
    this.Module = "AddDosimetryMeasurement";
    this.recordTopic = "measurement";
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    // this.props.send({
    //   cmd: CMD_GET_PERSONNEL_RECORDS,
    //   module: this.Module,
    // });
    this.requestGetRecords(false, ["personnel", "monitor"]);
  }

  // ws_message = (message) => {
  //   super.ws_message(message, [
  //     {cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms"}
  //   ]);
  // }

  requestGetRecords = (include_archived, recordTopic) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "requestGetRecords", "recordTopic", recordTopic,
        "include_archived", include_archived);
    }
    if (Array.isArray(recordTopic)) {
      let add = false;
      for (const topic of recordTopic) {
        const props = {
          cmd: this.recordCommand("get", topic),
          "include.withdrawn": include_archived ? "true" : "false",
          module: this.Module,
        };
        if (add) {
          props["append.records"] = "true"
        }
        add = true;
        this.props.send(props);
        // this.props.send({
        //   cmd: this.recordCommand("get", topic),
        //   "include.withdrawn": include_archived ? "true" : "false",
        //   ""
        //   module: this.Module,
        // })
      }
    } else {
      this.props.send({
        cmd: this.recordCommand("get", recordTopic),
        "include.withdrawn": include_archived ? "true" : "false",
        module: this.Module,
      })
    }
    this.setState({include_archived: include_archived});
  }

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection, title} = this.state;
    if (this.context.debug > 5) {
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
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={4}>
            <PersonnelAndMonitorsList
              ref={this.listRef}
              title={"Personnel and Monitors"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={false}
            />
          </Grid>
          <Grid item xs={8}>
            <SSCMetadata
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
               disabled={!metadata_changed}>
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

AddDosimetryMeasurement.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default AddDosimetryMeasurement;