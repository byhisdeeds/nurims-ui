import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Typography
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import {toast} from "react-toastify";
import Box from "@mui/material/Box";
import {
  CMD_GET_MANUFACTURER_RECORDS,
  CMD_UPDATE_ITEM_RECORD, CMD_UPDATE_MANUFACTURER_RECORD,
  CMD_UPDATE_PERSONNEL_RECORD, ITEM_ID, NURIMS_ENTITY_ADDRESS,
  NURIMS_ENTITY_CONTACT,
  NURIMS_ENTITY_DATE_OF_BIRTH,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
  NURIMS_ENTITY_IS_EXTREMITY_MONITORED,
  NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED,
  NURIMS_ENTITY_IS_WRIST_MONITORED,
  NURIMS_ENTITY_NATIONAL_ID,
  NURIMS_ENTITY_SEX,
  NURIMS_ENTITY_WORK_DETAILS, NURIMS_SOURCE,
  NURIMS_TITLE, NURIMS_WITHDRAWN,
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

const MODULE = "ImportICENSControlledMaterialManufacturers";

function isPersonMonitored(status) {
  if (Array.isArray(status)) {
    return status.length === 0 ? "false" : status[0] === "" ? "false" : "true";
  }
  return status === "" ? "false" : "true";
}

class ImportICENSControlledMaterialManufacturers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manufacturers: [],
      busy: 0,
      metadata_changed: false,
      messages: [],
      alert: false,
      confirm_remove: false,
      previous_selection: {},
      selection: {},
      title: props.title,
    };
    this.manufacturers_list = [];
    this.plref = React.createRef();
    this.pmref = React.createRef();
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_MANUFACTURER_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "true",
      module: MODULE,
    })
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_UPDATE_MANUFACTURER_RECORD)) {
          const messages = this.state.messages;
          messages.push(`Manufacturer record for ${response.manufacturer[NURIMS_TITLE]} updated successfully`);
          this.setState({messages: messages});
        } else if (isCommandResponse(message, CMD_GET_MANUFACTURER_RECORDS)) {
          if (Array.isArray(response.manufacturer)) {
            this.manufacturers_list.length = 0;
            for (const manufacturer of response.manufacturer) {
              manufacturer.changed = false;
              this.manufacturers_list.push(manufacturer);
            }
          }
          console.log("CMD_GET_MANUFACTURER_RECORDS", this.manufacturers_list)
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  saveChanges = () => {
    const manufacturers = this.state.manufacturers;
    for (const manufacturer of manufacturers) {
      console.log("SAVING MANUFACTURER WITH CHANGED METADATA ", manufacturer)
      // only save manufacturers with changed metadata
      this.props.send({
        cmd: CMD_UPDATE_MANUFACTURER_RECORD,
        item_id: manufacturer.item_id,
        "nurims.title": manufacturer[NURIMS_TITLE],
        "nurims.withdrawn": manufacturer[NURIMS_WITHDRAWN],
        metadata: manufacturer.metadata,
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
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
    };
    this.setState({busy: 1});
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (event) {
      const data = JSON.parse(event.target.result);
      if (Array.isArray(data)) {
        const manufacturers = [];
        for (const d of data) {
          const manufacturer = {
            item_id: -1,
            "nurims.title": "",
            "nurims.wihdrawn": 0,
            metadata: []
          };
          if (d.hasOwnProperty("name")) {
            manufacturer[NURIMS_TITLE] = d.name;
            for (const m of that.manufacturers_list) {
              if (m[NURIMS_TITLE] === d.name) {
                manufacturer.item_id = m.item_id;
              }
            }
          }
          if (d.hasOwnProperty("nrims.manufacturer.address")) {
            setMetadataValue(manufacturer, NURIMS_ENTITY_ADDRESS, d["nrims.manufacturer.address"])
          }
          if (d.hasOwnProperty("nrims.manufacturer.contact")) {
            setMetadataValue(manufacturer, NURIMS_ENTITY_CONTACT, d["nrims.manufacturer.contact"])
          }
          if (d.hasOwnProperty("dc.identifier.uri")) {
            setMetadataValue(manufacturer, NURIMS_SOURCE, d["dc.identifier.uri"])
          }
          manufacturers.push(manufacturer);
        }
        that.setState({manufacturers: manufacturers, busy: 0, metadata_changed: true});
      }
    };
  }

  render() {
    const {manufacturers, busy, metadata_changed, messages, title} = this.state;
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
              src={manufacturers}
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

ImportICENSControlledMaterialManufacturers.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(ImportICENSControlledMaterialManufacturers);