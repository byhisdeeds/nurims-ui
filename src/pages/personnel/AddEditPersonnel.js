import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import PersonList from "./PersonList";
import {toast} from "react-toastify";
import PersonMetadata from "./PersonMetadata";
import Box from "@mui/material/Box";
import {
  CMD_DELETE_PERSONNEL_RECORD,
  CMD_GET_PERSONNEL_RECORDS,
  CMD_UPDATE_PERSONNEL_RECORD,
  INCLUDE_METADATA,
  ITEM_ID,
  METADATA,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {withTheme} from "@mui/styles";
import {
  ConfirmRemoveDialog,
  isValidSelection
} from "../../utils/UtilityDialogs";

const MODULE = "AddEditPersonnel";

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
//           {`Delete record for ${props.person.hasOwnProperty(NURIMS_TITLE) ? props.person[NURIMS_TITLE] : ""}`}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete the record
//             for {props.person.hasOwnProperty(NURIMS_TITLE) ? props.person[NURIMS_TITLE] : ""} (
//             {props.person.hasOwnProperty(ITEM_ID) ? props.person[ITEM_ID] : ""})?
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

// function isPerson(person) {
//   return (person.hasOwnProperty(ITEM_ID) && person.item_id !== -1);
// }

function isPersonArchived(person) {
  return (person.hasOwnProperty(NURIMS_WITHDRAWN) && person[NURIMS_WITHDRAWN] === 1);
}

class AddEditPersonnel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      alert: false,
      confirm_remove: false,
      include_archived: false,
      // previous_selection: {},
      selection: {},
      title: props.title,
    };
    this.plref = React.createRef();
    this.pmref = React.createRef();
  }

  componentDidMount() {
    this.requestPersonnelList(this.state.include_archived);
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_PERSONNEL_RECORDS)) {
          if (message.hasOwnProperty(INCLUDE_METADATA)) {
            const selection = this.state.selection;
            const personnel = getMatchingResponseObject(message, "response.personnel", "item_id", selection["item_id"]);
            // selection[NURIMS_TITLE] = personnel[NURIMS_TITLE];
            // selection[NURIMS_WITHDRAWN] = personnel[NURIMS_WITHDRAWN];
            selection[METADATA] = [...personnel[METADATA]]
            if (this.pmref.current) {
              this.pmref.current.set_person_object(selection);
            }
          } else {
            if (this.plref.current) {
              this.plref.current.add(response.personnel, true, false);
            }
          }
        } else if (isCommandResponse(message, CMD_UPDATE_PERSONNEL_RECORD)) {
          toast.success(`Personnel record for ${response.personnel[NURIMS_TITLE]} updated successfully`)
          if (this.plref.current) {
            this.plref.current.update(response.personnel);
          }
        } else if (isCommandResponse(message, CMD_DELETE_PERSONNEL_RECORD)) {
          toast.success(`Personnel record (id: ${response.item_id}) deleted successfully`)
          if (this.plref.current) {
            this.plref.current.removePerson(this.state.selection)
          }
          if (this.pmref.current) {
            this.pmref.current.set_person_object({})
          }
          this.setState({selection: {}, metadata_changed: false})
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  requestPersonnelList = (include_archived) => {
    console.log("requestPersonnelList switch func", include_archived)
    this.props.send({
      cmd: CMD_GET_PERSONNEL_RECORDS,
      "include.withdrawn": include_archived ? "true" : "false",
      module: MODULE,
    })
    this.setState({include_archived: include_archived});
  }

  onPersonSelected = (selection) => {
    // console.log("-- onPersonSelected (selection) --", selection)
    if (selection.hasOwnProperty(ITEM_ID) && selection.item_id === -1) {
      if (this.pmref.current) {
        this.pmref.current.set_person_object(selection)
      }
    } else {
      // this.setState(pstate => {
      //   return { selection: selection }
      // });
      this.props.send({
        cmd: CMD_GET_PERSONNEL_RECORDS,
        item_id: selection.item_id,
        "include.metadata": "true",
        "include.withdrawn": this.state.include_archived ? "true" : "false",
        module: MODULE,
      });
    }
    this.setState({ selection: selection, metadata_changed: selection.changed })
  }

  saveChanges = () => {
    if (this.plref.current) {
      const persons = this.plref.current.getPersons();
      for (const person of persons) {
        console.log("SAVING PERSONS WITH CHANGED METADATA ", person)
        // only save personnel with changed metadata
        if (person.changed) {
          this.props.send({
            cmd: CMD_UPDATE_PERSONNEL_RECORD,
            item_id: person.item_id,
            "nurims.title": person[NURIMS_TITLE],
            "nurims.withdrawn": person[NURIMS_WITHDRAWN],
            metadata: person.metadata,
            module: MODULE,
          })
        }
      }
    }

    this.setState({metadata_changed: false})
  }

  addPerson = () => {
    if (this.plref.current) {
      this.plref.current.add([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Person",
        "nurims.withdrawn": 0,
        "metadata": []
      }], false, false);
      this.setState({ changed: true });
    }
  }

  onMetadataChanged = (state) => {
    this.setState({metadata_changed: state});
  }

  removePerson = () => {
    this.setState({confirm_remove: true,});
  }

  cancel_remove = () => {
    this.setState({confirm_remove: false,});
  }

  proceed_with_remove = () => {
    this.setState({confirm_remove: false,});
    console.log("REMOVE PERSON", this.state.selection);
    if (this.state.selection.item_id === -1) {
      if (this.plref.current) {
        this.plref.current.removePerson(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: CMD_DELETE_PERSONNEL_RECORD,
        item_id: this.state.selection.item_id,
        module: MODULE,
      });
    }
  }
  //
  // handleFileUpload = (e) => {
  //   const selectedFile = e.target.files[0];
  //   console.log("file uploaded", selectedFile)
  //   const that = this;
  //   const fileReader = new FileReader();
  //   fileReader.onerror = function () {
  //     alert('Unable to read ' + selectedFile.name);
  //     toast.error(`Error occurred reading file: ${selectedFile.name}`)
  //   };
  //   fileReader.readAsText(selectedFile);
  //   fileReader.onload = function (event) {
  //     // console.log(">>>>>", event.target.result);
  //     const data = JSON.parse(event.target.result);
  //     console.log(data)
  //     if (data.hasOwnProperty("dosereport")) {
  //       const dr = data.dosereport;
  //       if (dr.hasOwnProperty("badges")) {
  //         const badges = dr.badges;
  //         if (typeof badges === "object") {
  //           if (badges.hasOwnProperty("badge")) {
  //             const badge = badges.badge;
  //             if (Array.isArray(badge)) {
  //               const persons = []
  //               for (const b of badge) {
  //                 const name = b["tld.employee.name"];
  //                 const id = b["tld.dosimeter.employee"].split("/")[1];
  //                 console.log("EMPLOYEE", name, b["tld.dosimeter.employee"], id);
  //                 if (!name.toLowerCase().includes("area monitor")) {
  //                   persons.push({
  //                     "changed": true,
  //                     "item_id": -1,
  //                     "nurims.title": name,
  //                     "nurims.withdrawn": 0,
  //                     "metadata": [
  //                       {"nurims.entity.doseproviderid": `icens|${id}`}
  //                     ]
  //                   });
  //                   that.setState({ changed: true });
  //                 }
  //               }
  //               if (that.plref.current) {
  //                 that.plref.current.add(persons, true)
  //               }
  //             } else {
  //               toast.warn(`Incorrect dosereport.badges.badge type in dose report data file. Expecting an array but found ${typeof badge}`)
  //             }
  //           }
  //         } else {
  //           toast.warn(`Incorrect dosereport.badges type in dose report data file. Expecting an object but found ${typeof badges}`)
  //         }
  //       } else {
  //         toast.warn('Missing dosereport.badges field in dose report data file')
  //       }
  //     } else {
  //       toast.warn('Unknown file format')
  //     }
  //   };
  // }

  changeRecordArchivalStatus = () => {
    console.log("changeRecordArchivalStatus", this.state.selection)
    const selection = this.state.selection;
    if (selection.hasOwnProperty(NURIMS_WITHDRAWN)) {
      selection[NURIMS_WITHDRAWN] = selection[NURIMS_WITHDRAWN] === 0 ? 1 : 0;
      selection.changed = true;
      this.setState({selection: selection, metadata_changed: selection.changed});
    }
  }

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection, title} = this.state;
    return (
      <React.Fragment>
        <ConfirmRemoveDialog open={confirm_remove}
                             selection={selection}
                             onProceed={this.proceed_with_remove}
                             onCancel={this.cancel_remove}
        />
        <input
          accept="*.csv, *.txt, text/plain"
          // className={classes.input}
          id="import-file-uploader"
          style={{display: 'none',}}
          onChange={this.handleFileUpload}
          type="file"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={4}>
            <PersonList
              ref={this.plref}
              onPersonSelection={this.onPersonSelected}
              requestPersonsList={this.requestPersonnelList}
              includeArchived={include_archived}
              properties={this.props.properties}
            />
          </Grid>
          <Grid item xs={8}>
            <PersonMetadata
              ref={this.pmref}
              onChange={this.onMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removePerson}
               disabled={!isValidSelection(selection)}>
            <PersonRemoveIcon sx={{mr: 1}}/>
            Remove Person
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
               onClick={this.changeRecordArchivalStatus} disabled={!isValidSelection(selection)}>
            {isPersonArchived(selection) ?
              <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore Personnel Record"</React.Fragment> :
              <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive Personnel Record"</React.Fragment>}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addPerson}>
            <AddIcon sx={{mr: 1}}/>
            Add Person
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

export default withTheme(AddEditPersonnel);