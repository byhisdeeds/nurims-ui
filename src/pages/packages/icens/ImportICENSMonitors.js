import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Typography
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import Box from "@mui/material/Box";
import {
  CMD_UPDATE_PERSONNEL_RECORD,
  NURIMS_ENTITY_CONTACT,
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
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../../utils/WebsocketUtils";
import {withTheme} from "@mui/styles";
import ReactJson from "react-json-view";
import {setMetadataValue} from "../../../utils/MetadataUtils";
import BusyIndicator from "../../../components/BusyIndicator";
import {enqueueErrorSnackbar} from "../../../utils/SnackbarVariants";

const MODULE = "ImportICENSMonitors";

function isPersonMonitored(status) {
  if (Array.isArray(status)) {
    return status.length === 0 ? "false" : status[0] === "" ? "false" : "true";
  }
  return status === "" ? "false" : "true";
}

class ImportICENSMonitors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      busy: 0,
      metadata_changed: false,
      messages: [],
      alert: false,
      confirm_remove: false,
      previous_selection: {},
      selection: {},
      title: props.title,
    };
    this.plref = React.createRef();
    this.pmref = React.createRef();
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_UPDATE_PERSONNEL_RECORD)) {
          const messages = this.state.messages;
          messages.push(`Monitors record for ${response.personnel[NURIMS_TITLE]} updated successfully`);
          this.setState({messages: messages});
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  saveChanges = () => {
    const persons = this.state.persons;
    for (const person of persons) {
      console.log("SAVING MONITORS WITH CHANGED METADATA ", person)
      // only save personnel with changed metadata
      this.props.send({
        cmd: CMD_UPDATE_PERSONNEL_RECORD,
        item_id: person.item_id,
        "nurims.title": person[NURIMS_TITLE],
        "nurims.withdrawn": person[NURIMS_WITHDRAWN],
        metadata: person.metadata,
        module: MODULE,
      })
    }

    this.setState({metadata_changed: false})
  }

  handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    console.log("file uploaded", selectedFile)
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      alert('Unable to read ' + selectedFile.name);
      enqueueErrorSnackbar(`Error occurred reading file: ${selectedFile.name}`)
    };
    this.setState({busy: 1});
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (event) {
      const data = JSON.parse(event.target.result);
      if (Array.isArray(data)) {
        const persons = [];
        for (const d of data) {
          const person = {
            item_id: -1,
            "nurims.title": "",
            "nurims.withdrawn": 0,
            metadata: []
          };
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
            setMetadataValue(person, NURIMS_ENTITY_CONTACT, d.contact)
          }
          if (d.hasOwnProperty("nid")) {
            setMetadataValue(person, NURIMS_ENTITY_NATIONAL_ID, d.nid)
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
        that.setState({persons: persons, busy: 0, metadata_changed: true});
      }
    };
  }

  render() {
    const {persons, busy, metadata_changed, messages, title} = this.state;
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
            <Box>
              {messages.map(msg => (
                <div>{msg}</div>
              ))}
            </Box>
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

ImportICENSMonitors.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(ImportICENSMonitors);