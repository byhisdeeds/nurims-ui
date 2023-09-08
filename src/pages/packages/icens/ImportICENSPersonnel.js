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
  CMD_UPDATE_MONITOR_RECORD,
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
import {getRecordMetadataValue, setMetadataValue} from "../../../utils/MetadataUtils";
import BusyIndicator from "../../../components/BusyIndicator";
import {readString} from "react-papaparse";
import {enqueueErrorSnackbar} from "../../../utils/SnackbarVariants";

const MODULE = "ImportICENSPersonnel";

function isPersonMonitored(status) {
  // if (Array.isArray(status)) {
  //   return status.length === 0 ? "false" : status[0] === "" ? "false" : "true";
  // }
  return status === "" ? "false" : "true";
}

class ImportICENSPersonnel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      busy: 0,
      data_changed: false,
      messages: [],
      alert: false,
      confirm_remove: false,
      previous_selection: {},
      selection: {},
      title: props.title,
    };
    this.plref = React.createRef();
    this.pmref = React.createRef();
    this.persons = [];
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_UPDATE_PERSONNEL_RECORD)) {
          const messages = this.state.messages;
          messages.push(`Personnel record for ${response.personnel[NURIMS_TITLE]} updated successfully`);
          this.setState({messages: messages});
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  saveChanges = () => {
    const persons = this.persons;
    for (const person of persons) {
      console.log("SAVING PERSONS WITH CHANGED METADATA ", person)
      // only save personnel with changed metadata
      if (person.record_type === "employee_record") {
        this.props.send({
          cmd: CMD_UPDATE_PERSONNEL_RECORD,
          item_id: person.item_id,
          "nurims.title": person[NURIMS_TITLE],
          "nurims.withdrawn": person[NURIMS_WITHDRAWN],
          metadata: person.metadata,
          module: MODULE,
        })
      } else if (person.record_type === "monitor_record") {
        this.props.send({
          cmd: CMD_UPDATE_MONITOR_RECORD,
          item_id: person.item_id,
          "nurims.title": person[NURIMS_TITLE],
          "nurims.withdrawn": person[NURIMS_WITHDRAWN],
          metadata: person.metadata,
          module: MODULE,
        })
      }
    }

    this.setState({data_changed: false})
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
    fileReader.onload = function (e) {
      const results = readString(e.target.result, {header: true});
      console.log("RECORDS", that.persons)
      console.log("RESULT", results)
      const header = results.meta.fields;
      const ts_column = results.meta.fields;
      let parseHeader = true;
      if (results.hasOwnProperty("data")) {
        const table_data = [];
        for (const row of results.data) {
          let found = false;
          for (const person of that.persons) {
            if (row.hasOwnProperty("Id") && row.Id === getRecordMetadataValue(person, NURIMS_ENTITY_DOSE_PROVIDER_ID, null)) {
              found = true;
              break;
            }
          }
          if (!found) {
            const p = {
              item_id: -1,
              "nurims.title": row.Name,
              "nurims.withdrawn": 0,
              "record_type": row.Type === "employee_record" ? "employee_record" : row.Type === "fixed_location_monitor_record" ? "monitor_record" : "",
              metadata: []
            };
            if (row.hasOwnProperty("DateOfBirth")) {
              setMetadataValue(p, NURIMS_ENTITY_DATE_OF_BIRTH, row.DateOfBirth)
            }
            if (row.hasOwnProperty("WorkDetails")) {
              setMetadataValue(p, NURIMS_ENTITY_WORK_DETAILS, row.WorkDetails)
            }
            if (row.hasOwnProperty("Sex")) {
              setMetadataValue(p, NURIMS_ENTITY_SEX, row.Sex)
            }
            if (row.hasOwnProperty("NID")) {
              setMetadataValue(p, NURIMS_ENTITY_NATIONAL_ID, row.NID)
            }
            if (row.hasOwnProperty("Id")) {
              setMetadataValue(p, NURIMS_ENTITY_DOSE_PROVIDER_ID, row.Id)
            }
            if (row.hasOwnProperty("IsWholeBodyMonitored")) {
              setMetadataValue(p, NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED, isPersonMonitored(row.IsWholeBodyMonitored))
            }
            if (row.hasOwnProperty("IsExtremityMonitored")) {
              setMetadataValue(p, NURIMS_ENTITY_IS_EXTREMITY_MONITORED, isPersonMonitored(row.IsExtremityMonitored))
            }
            if (row.hasOwnProperty("IsWristMonitored")) {
              setMetadataValue(p, NURIMS_ENTITY_IS_WRIST_MONITORED, isPersonMonitored(row.IsWristMonitored))
            }
            that.persons.push(p);
          }
        }
      }
      console.log("PERSONS", that.persons)
      that.setState({busy: 0, data_changed: true});
    };
  }

  render() {
    const {persons, busy, data_changed, messages, title} = this.state;
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
              Import ICENS Personnel From .csv File
            </Fab>
          </label>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!data_changed}>
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