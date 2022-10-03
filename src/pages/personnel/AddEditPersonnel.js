// import React, {Component} from 'react';
// import {
//   Fab,
//   Grid,
//   Typography
// } from "@mui/material";
// import AddIcon from '@mui/icons-material/Add';
// import SaveIcon from '@mui/icons-material/Save';
// import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
// import ArchiveIcon from '@mui/icons-material/Archive';
// import UnarchiveIcon from '@mui/icons-material/Unarchive';
// import PersonList from "./PersonList";
// import {toast} from "react-toastify";
// import PersonMetadata from "./PersonMetadata";
// import Box from "@mui/material/Box";
// import {
//   CMD_DELETE_PERSONNEL_RECORD,
//   CMD_GET_PERSONNEL_RECORDS,
//   CMD_UPDATE_PERSONNEL_RECORD,
//   INCLUDE_METADATA,
//   ITEM_ID,
//   METADATA,
//   NURIMS_TITLE,
//   NURIMS_WITHDRAWN
// } from "../../utils/constants";
// import {
//   getMatchingResponseObject,
//   isCommandResponse,
//   messageHasResponse,
//   messageStatusOk
// } from "../../utils/WebsocketUtils";
// import {withTheme} from "@mui/styles";
// import {
//   ConfirmRemoveDialog,
//   isValidSelection
// } from "../../utils/UtilityDialogs";
// import {isRecordArchived} from "../../utils/MetadataUtils";
//
// const MODULE = "AddEditPersonnel";
//
// class AddEditPersonnel extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       metadata_changed: false,
//       alert: false,
//       confirm_remove: false,
//       include_archived: false,
//       // previous_selection: {},
//       selection: {},
//       title: props.title,
//     };
//     this.plref = React.createRef();
//     this.pmref = React.createRef();
//   }
//
//   componentDidMount() {
//     this.requestPersonnelList(this.state.include_archived);
//   }
//
//   ws_message = (message) => {
//     console.log("ON_WS_MESSAGE", MODULE, message)
//     if (messageHasResponse(message)) {
//       const response = message.response;
//       if (messageStatusOk(message)) {
//         if (isCommandResponse(message, CMD_GET_PERSONNEL_RECORDS)) {
//           if (message.hasOwnProperty(INCLUDE_METADATA)) {
//             const selection = this.state.selection;
//             const personnel = getMatchingResponseObject(message, "response.personnel", "item_id", selection["item_id"]);
//             selection[METADATA] = [...personnel[METADATA]]
//             if (this.pmref.current) {
//               this.pmref.current.set_person_object(selection);
//             }
//           } else {
//             if (this.plref.current) {
//               this.plref.current.add(response.personnel, true, false);
//             }
//           }
//         } else if (isCommandResponse(message, CMD_UPDATE_PERSONNEL_RECORD)) {
//           toast.success(`Personnel record for ${response.personnel[NURIMS_TITLE]} updated successfully`)
//           if (this.plref.current) {
//             this.plref.current.update(response.personnel);
//           }
//         } else if (isCommandResponse(message, CMD_DELETE_PERSONNEL_RECORD)) {
//           toast.success(`Personnel record (id: ${response.item_id}) deleted successfully`)
//           if (this.plref.current) {
//             this.plref.current.removePerson(this.state.selection)
//           }
//           if (this.pmref.current) {
//             this.pmref.current.set_person_object({})
//           }
//           this.setState({selection: {}, metadata_changed: false})
//         }
//       } else {
//         toast.error(response.message);
//       }
//     }
//   }
//
//   requestPersonnelList = (include_archived) => {
//     console.log("requestPersonnelList switch func", include_archived)
//     this.props.send({
//       cmd: CMD_GET_PERSONNEL_RECORDS,
//       "include.withdrawn": include_archived ? "true" : "false",
//       module: MODULE,
//     })
//     this.setState({include_archived: include_archived});
//   }
//
//   onPersonSelected = (selection) => {
//     // console.log("-- onPersonSelected (selection) --", selection)
//     if (selection.hasOwnProperty(ITEM_ID) && selection.item_id === -1) {
//       if (this.pmref.current) {
//         this.pmref.current.set_person_object(selection)
//       }
//     } else {
//       this.props.send({
//         cmd: CMD_GET_PERSONNEL_RECORDS,
//         item_id: selection.item_id,
//         "include.metadata": "true",
//         "include.withdrawn": this.state.include_archived ? "true" : "false",
//         module: MODULE,
//       });
//     }
//     this.setState({ selection: selection, metadata_changed: selection.changed })
//   }
//
//   saveChanges = () => {
//     if (this.plref.current) {
//       const persons = this.plref.current.getPersons();
//       for (const person of persons) {
//         console.log("SAVING PERSONS WITH CHANGED METADATA ", person)
//         // only save personnel with changed metadata
//         if (person.changed) {
//           this.props.send({
//             cmd: CMD_UPDATE_PERSONNEL_RECORD,
//             item_id: person.item_id,
//             "nurims.title": person[NURIMS_TITLE],
//             "nurims.withdrawn": person[NURIMS_WITHDRAWN],
//             metadata: person.metadata,
//             module: MODULE,
//           })
//         }
//       }
//     }
//
//     this.setState({metadata_changed: false})
//   }
//
//   addPerson = () => {
//     if (this.plref.current) {
//       this.plref.current.add([{
//         "changed": true,
//         "item_id": -1,
//         "nurims.title": "New Person",
//         "nurims.withdrawn": 0,
//         "metadata": []
//       }], false, false);
//       this.setState({ changed: true });
//     }
//   }
//
//   onRecordMetadataChanged = (state) => {
//     this.setState({metadata_changed: state});
//   }
//
//   removePerson = () => {
//     this.setState({confirm_remove: true,});
//   }
//
//   cancel_remove = () => {
//     this.setState({confirm_remove: false,});
//   }
//
//   proceed_with_remove = () => {
//     this.setState({confirm_remove: false,});
//     console.log("REMOVE PERSON", this.state.selection);
//     if (this.state.selection.item_id === -1) {
//       if (this.plref.current) {
//         this.plref.current.removePerson(this.state.selection)
//       }
//     } else {
//       this.props.send({
//         cmd: CMD_DELETE_PERSONNEL_RECORD,
//         item_id: this.state.selection.item_id,
//         module: MODULE,
//       });
//     }
//   }
//
//   changeRecordArchivalStatus = () => {
//     console.log("changeRecordArchivalStatus", this.state.selection)
//     const selection = this.state.selection;
//     if (selection.hasOwnProperty(NURIMS_WITHDRAWN)) {
//       selection[NURIMS_WITHDRAWN] = selection[NURIMS_WITHDRAWN] === 0 ? 1 : 0;
//       selection.changed = true;
//       this.setState({selection: selection, metadata_changed: selection.changed});
//     }
//   }
//
//   render() {
//     const {metadata_changed, confirm_remove, include_archived, selection, title} = this.state;
//     return (
//       <React.Fragment>
//         <ConfirmRemoveDialog open={confirm_remove}
//                              selection={selection}
//                              onProceed={this.proceed_with_remove}
//                              onCancel={this.cancel_remove}
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
//           <Grid item xs={4}>
//             <PersonList
//               ref={this.plref}
//               onSelection={this.onPersonSelected}
//               requestGetRecords={this.requestPersonnelList}
//               includeArchived={include_archived}
//               properties={this.props.properties}
//             />
//           </Grid>
//           <Grid item xs={8}>
//             <PersonMetadata
//               ref={this.pmref}
//               onChange={this.onRecordMetadataChanged}
//               properties={this.props.properties}
//             />
//           </Grid>
//         </Grid>
//         <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
//           <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removePerson}
//                disabled={!isValidSelection(selection)}>
//             <PersonRemoveIcon sx={{mr: 1}}/>
//             Remove Person
//           </Fab>
//           <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
//                onClick={this.changeRecordArchivalStatus} disabled={!isValidSelection(selection)}>
//             {isRecordArchived(selection) ?
//               <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore Personnel Record"</React.Fragment> :
//               <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive Personnel Record"</React.Fragment>}
//           </Fab>
//           <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
//                disabled={!metadata_changed}>
//             <SaveIcon sx={{mr: 1}}/>
//             Save Changes
//           </Fab>
//           <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addPerson}>
//             <AddIcon sx={{mr: 1}}/>
//             Add Person
//           </Fab>
//         </Box>
//       </React.Fragment>
//     );
//   }
// }
//
// AddEditPersonnel.defaultProps = {
//   send: (msg) => {
//   },
//   user: {},
// };
//
// export default withTheme(AddEditPersonnel);
import React from 'react';
import {
  Fab,
  Grid,
  Typography,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../utils/UtilityDialogs";
import PersonList from "./PersonList";
import PersonMetadata from "./PersonMetadata";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import {ConsoleLog} from "../../utils/UserDebugContext";


class AddEditPersonnel extends BaseRecordManager {
  constructor(props) {
    super(props);
    this.Module = "AddEditPersonnel";
    this.recordTopic = "personnel";
  }

  componentDidMount() {
    this.requestGetRecords();
  }

  // getMaterialsRecords = (include_metadata) => {
  //   this.props.send({
  //     cmd: CMD_GET_MATERIAL_RECORDS,
  //     "include.metadata": (include_metadata) ? ""+include_metadata : "false",
  //     module: this.Module,
  //   });
  // }

  // ws_message = (message) => {
  //   super.ws_message(message, [
  //     { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" },
  //     { cmd: CMD_GET_MANUFACTURER_RECORDS, func: "setManufacturers", params: "manufacturer" },
  //     { cmd: CMD_GET_STORAGE_LOCATION_RECORDS, func: "setStorageLocations", params: "storage_location" },
  //   ]);
  // }

  render() {
    const {metadata_changed, confirm_remove, selection, title, include_archived} = this.state;
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
          <Grid item xs={5}>
            <PersonList
              ref={this.listRef}
              title={"Personnel"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={7}>
            <PersonMetadata
              ref={this.metadataRef}
              onChange={this.onRecordMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               disabled={!this.isValidSelection(selection)}>
            <PersonRemoveIcon sx={{mr: 1}}/>
            Remove Monitor
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
               onClick={this.changeRecordArchivalStatus} disabled={!this.isValidSelection(selection)}>
            {this.isRecordArchived(selection) ?
              <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore Personnel Record"</React.Fragment> :
              <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive Personnel Record"</React.Fragment>}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add Monitor
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

AddEditPersonnel.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default AddEditPersonnel;