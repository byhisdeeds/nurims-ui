import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Typography
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
// import PersonList from "./PersonList";
import {toast} from "react-toastify";
// import PersonMetadata from "./PersonMetadata";
import Box from "@mui/material/Box";
import {
  CMD_GET_PERSONNEL_RECORDS,
  CMD_UPDATE_PERSONNEL_RECORD,
  INCLUDE_METADATA,
  METADATA,
  NURIMS_ENTITY_DATE_OF_BIRTH,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
  NURIMS_ENTITY_IS_EXTREMITY_MONITORED,
  NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED,
  NURIMS_ENTITY_IS_WRIST_MONITORED,
  NURIMS_ENTITY_NATIONAL_ID,
  NURIMS_ENTITY_SEX,
  NURIMS_ENTITY_WORK_DETAILS,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../../utils/constants";
import {
  getMatchingResponseObject
} from "../../../utils/WebsocketUtils";
import {withTheme} from "@mui/styles";
import ReactJson from "react-json-view";
import {setMetadataValue} from "../../../utils/MetadataUtils";
import BusyIndicator from "../../../components/BusyIndicator";

const MODULE = "ImportICENSPersonnel";

function isPersonMonitored(status) {
  if (Array.isArray(status)) {
    return status.length === 0 ? "false" : status[0] === "" ? "false" : "true";
  }
  return status === "" ? "false" : "true";
}

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

class ImportICENSPersonnel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      busy: 0,
      metadata_changed: false,
      alert: false,
      confirm_remove: false,
      previous_selection: {},
      selection: {},
      title: props.title,
    };
    this.plref = React.createRef();
    this.pmref = React.createRef();
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_PERSONNEL_RECORDS,
      module: MODULE,
    })
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd ===CMD_GET_PERSONNEL_RECORDS) {
          if (message.hasOwnProperty(INCLUDE_METADATA)) {
            const selection = this.state.selection;
            const personnel = getMatchingResponseObject(message, "response.personnel", "item_id", selection["item_id"]);
            selection[NURIMS_TITLE] = personnel[NURIMS_TITLE];
            selection[NURIMS_WITHDRAWN] = personnel[NURIMS_WITHDRAWN];
            selection[METADATA] = [...personnel[METADATA]]
            if (this.pmref.current) {
              this.pmref.current.set_person_object(selection);
            }
          } else {
            if (this.plref.current) {
              this.plref.current.add(response.personnel, true);
            }
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_UPDATE_PERSONNEL_RECORD) {
          toast.success(`Personnel record for ${response.personnel[NURIMS_TITLE]} updated successfully`)
          if (this.plref.current) {
            this.plref.current.update(response.personnel);
          }
          // if (this.pmref.current) {
          //   this.pmref.current.set_metadata(response.personnel);
          // }
        } else if (message.hasOwnProperty("cmd") && message.cmd === "permanently_delete_person") {
          toast.success("Personnel record deleted successfully")
          if (this.plref.current) {
            this.plref.current.removePerson(this.state.selection)
          }
          // if (this.plref.current) {
          //   this.plref.current.update_selected_person(response.personnel)
          // }
          if (this.pmref.current) {
            this.pmref.current.update_personnel_details({})
          }
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  onPersonSelected = (selection) => {
    // console.log("-- onPersonSelected (previous selection) --", previous_selection)
    console.log("-- onPersonSelected (selection) --", selection)
    if (selection.hasOwnProperty("item_id") && selection.item_id === -1) {
      if (this.pmref.current) {
        this.pmref.current.set_person_object(selection)
      }
    } else {
      this.setState(pstate => {
        return { selection: selection }
      });
      this.props.send({
        cmd: CMD_GET_PERSONNEL_RECORDS,
        item_id: selection.item_id,
        "include.metadata": "true",
        module: MODULE,
      });
    }
    this.setState({ selection: selection })
  }

  saveChanges = () => {
    if (this.plref.current) {
      const persons = this.plref.current.getPersons();
      for (const person of persons) {
        // // get metadata
        // if (this.pmref.current) {
        //   persons[index] = this.pmref.current.getMetadata();
        // }
        // const person = persons[index];
        console.log("SAVING PERSONS WITH CHANGED METADATA ", person)
        // only save personnel with changed metadata
        if (person.changed) {
          this.props.send({
            cmd: CMD_UPDATE_PERSONNEL_RECORD,
            item_id: person.item_id,
            "nurims.title": person["nurims.title"],
            "nurims.withdrawn": person["nurims.withdrawn"],
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
      }], false);
      this.setState({ changed: true });
    }
  }

  onMetadataChanged = (state) => {
    this.setState({metadata_changed: state});
  }

  proceed_with_selection_change = () => {
    // set new selection and load details
    // console.log("#### saving personnel details ###", this.state.previous_selection)
    this.setState({alert: false, metadata_changed: false});
    if (this.plref.current) {
      this.plref.current.setSelection(this.state.selection)
    }
    if (this.state.selection.hasOwnProperty("item_id") && this.state.selection.item_id === -1) {
      if (this.pmref.current) {
        this.pmref.current.set_metadata(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: 'get_personnel_metadata',
        item_id: this.state.selection.item_id,
        module: MODULE,
      });
    }
  }

  cancel_selection_change = () => {
    this.setState({alert: false,});
    if (this.plref.current) {
      this.plref.current.setSelection(this.state.previous_selection)
    }
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
        cmd: 'permanently_delete_person',
        item_id: this.state.selection.item_id,
        "nurims.title": this.state.selection["nurims.title"],
        "nurims.withdrawn": this.state.selection["nurims.withdrawn"],
        module: MODULE,
      });
    }
  }

  handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    console.log("file uploaded", selectedFile)
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      alert('Unable to read ' + selectedFile.name);
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
    };
    this.setState({busy: 1});
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (event) {
      const data = JSON.parse(event.target.result);
      if (Array.isArray(data)) {
        const persons = [];
        for (const d of data) {
          const person = {item_id: -1, "nurims.title": "", "nurims.withdrawn": 0, metadata: []};
          if (d.hasOwnProperty("name")) {
            person[NURIMS_TITLE] = d.name;
          }
          if (d.hasOwnProperty("dob")) {
            setMetadataValue(person, NURIMS_ENTITY_DATE_OF_BIRTH, d.dob)
          }
          if (d.hasOwnProperty("work")) {
            setMetadataValue(person, NURIMS_ENTITY_WORK_DETAILS, d.work)
          }
          if (d.hasOwnProperty("sex")) {
            setMetadataValue(person, NURIMS_ENTITY_SEX, d.sex)
          }
          if (d.hasOwnProperty("contact")) {
            setMetadataValue(person, NURIMS_ENTITY_NATIONAL_ID, d.contact)
          }
          if (d.hasOwnProperty("nid")) {
            setMetadataValue(person, NURIMS_ENTITY_DATE_OF_BIRTH, d.nid)
          }
          if (d.hasOwnProperty("handle")) {
            setMetadataValue(person, NURIMS_ENTITY_DOSE_PROVIDER_ID, d.handle)
          }
          if (d.hasOwnProperty("iswholebodymonitored")) {
            setMetadataValue(person, NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED, isPersonMonitored(d.iswholebodymonitored))
          }
          if (d.hasOwnProperty("isextremitymonitored")) {
            setMetadataValue(person, NURIMS_ENTITY_IS_EXTREMITY_MONITORED, isPersonMonitored(d.isextremitymonitored))
          }
          if (d.hasOwnProperty("iswristmonitored")) {
            setMetadataValue(person, NURIMS_ENTITY_IS_WRIST_MONITORED, isPersonMonitored(d.iswristmonitored))
          }
          persons.push(person);
        }
        that.setState({persons: persons, busy: 0});
      }
    };
  }

  render() {
    const {persons, busy, metadata_changed, title} = this.state;
    return (
      <React.Fragment>
        <BusyIndicator open={busy > 0} loader={"pulse"} size={40}/>
        <input
          accept="*.json"
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
          <Grid item xs={12} sx={{height: 300, overflowY: 'auto', paddingTop: 10}}>
            <ReactJson
              theme={"bright"}
              collapsed={2}
              src={persons}
            />
          </Grid>
          <Grid item xs={12} sx={{height: 'calc(100vh - 520px)', overflowY: 'auto', paddingTop: 0}}>
            <ReactJson
              theme={"bright:inverted"}
              src={[
                {
                  "employers": [
                    "tld/20"
                  ],
                  "isextremitymonitored": [
                    ""
                  ],
                  "dob": "",
                  "work": "Previously monitored at ICENS in 1999",
                  "sex": "f",
                  "contact": "",
                  "name": "Tamara Thompson",
                  "nid": "",
                  "handle": "tld/42702",
                  "iswholebodymonitored": [
                    ""
                  ],
                  "id": "CNS68"
                },
                {
                  "employers": [
                    "tld/20"
                  ],
                  "isextremitymonitored": [
                    ""
                  ],
                  "dob": "",
                  "work": "Previously monitored at ICENS in 2001",
                  "sex": "m",
                  "contact": "",
                  "name": "Lorenzo Dougharty",
                  "nid": "",
                  "handle": "tld/57561",
                  "iswholebodymonitored": [
                    ""
                  ],
                  "id": "CNS69"
                },
              ]}
            />
            {/*<PersonMetadata*/}
            {/*  ref={this.pmref}*/}
            {/*  onChange={this.onMetadataChanged}*/}
            {/*  properties={this.props.properties}*/}
            {/*/>*/}
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <label htmlFor="import-file-uploader">
            <Fab variant="extended" size="small" color="primary" aria-label="import" component={"span"}>
              <UploadIcon sx={{mr: 1}}/>
              Import ICENS Personnel From .json File
            </Fab>
          </label>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

ImportICENSPersonnel.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(ImportICENSPersonnel);