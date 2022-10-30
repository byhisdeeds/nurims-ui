import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Typography,
  Box
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import {toast} from "react-toastify";
import {
  CMD_GET_MANUFACTURER_RECORDS,
  CMD_GET_MATERIAL_RECORDS,
  CMD_GET_STORAGE_LOCATION_RECORDS,
  CMD_UPDATE_MATERIAL_RECORD,
  CMD_UPDATE_STORAGE_LOCATION_RECORD, NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY,
  NURIMS_DESCRIPTION, NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY, NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY,
  NURIMS_MATERIAL_CLASSIFICATION,
  NURIMS_MATERIAL_ID, NURIMS_MATERIAL_IMAGE, NURIMS_MATERIAL_INVENTORY_STATUS,
  NURIMS_MATERIAL_MANUFACTURER_RECORD, NURIMS_MATERIAL_NUCLIDES, NURIMS_MATERIAL_PHYSICAL_FORM,
  NURIMS_MATERIAL_REGISTRATION_DATE,
  NURIMS_MATERIAL_STORAGE_LOCATION_RECORD,
  NURIMS_MATERIAL_TYPE,
  NURIMS_SOURCE,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
} from "../../../utils/constants";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../../utils/WebsocketUtils";
import {withTheme} from "@mui/styles";
import ReactJson from "react-json-view";
import {
  BlobObject, getRecordMetadataValue,
  setMetadataValue
} from "../../../utils/MetadataUtils";
import BusyIndicator from "../../../components/BusyIndicator";

const MODULE = "ImportICENSControlledMaterials";

class ImportICENSControlledMaterials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      materials: [],
      busy: 0,
      metadata_changed: false,
      messages: [],
      alert: false,
      confirm_remove: false,
      previous_selection: {},
      selection: {},
      title: props.title,
    };
    this.storage_locations_list = [];
    this.manufacturers_list = [];
    this.materials_list = [];
    this.plref = React.createRef();
    this.pmref = React.createRef();
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "true",
      module: MODULE,
    })
    this.props.send({
      cmd: CMD_GET_MANUFACTURER_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "true",
      module: MODULE,
    })
    this.props.send({
      cmd: CMD_GET_MATERIAL_RECORDS,
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
        if (isCommandResponse(message, CMD_UPDATE_STORAGE_LOCATION_RECORD)) {
          const messages = this.state.messages;
          messages.push(`Storage location record for ${response.storage_location[NURIMS_TITLE]} updated successfully`);
          this.setState({messages: messages});
        } else if (isCommandResponse(message, CMD_GET_STORAGE_LOCATION_RECORDS)) {
          if (Array.isArray(response.storage_location)) {
            this.storage_locations_list.length = 0;
            for (const location of response.storage_location) {
              location.changed = false;
              this.storage_locations_list.push(location);
            }
          }
        } else if (isCommandResponse(message, CMD_GET_MANUFACTURER_RECORDS)) {
          if (Array.isArray(response.manufacturer)) {
            this.manufacturers_list.length = 0;
            for (const manufacturer of response.manufacturer) {
              manufacturer.changed = false;
              this.manufacturers_list.push(manufacturer);
            }
          }
        } else if (isCommandResponse(message, CMD_GET_MATERIAL_RECORDS)) {
          if (Array.isArray(response.material)) {
            this.materials_list.length = 0;
            for (const material of response.material) {
              material.changed = false;
              this.materials_list.push(material);
            }
          }
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  saveChanges = () => {
    const materials = this.state.materials;
    for (const material of materials) {
      console.log("SAVING MATERIALS CHANGED METADATA ", material)
      // only save materials with changed metadata
      this.props.send({
        cmd: CMD_UPDATE_MATERIAL_RECORD,
        item_id: material.item_id,
        "nurims.title": material[NURIMS_TITLE],
        "nurims.withdrawn": material[NURIMS_WITHDRAWN],
        metadata: material.metadata,
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
        const materials = [];
        for (const d of data) {
          const material = {
            item_id: -1,
            "nurims.title": "",
            "nurims.wihdrawn": 0,
            metadata: []
          };
          if (d.hasOwnProperty("name")) {
            material[NURIMS_TITLE] = d.name;
          }
          if (d.hasOwnProperty("dc.identifier.uri")) {
            setMetadataValue(material, NURIMS_SOURCE, d["dc.identifier.uri"])
            for (const m of that.materials_list) {
              if (getRecordMetadataValue(m, NURIMS_SOURCE, "-") === d["dc.identifier.uri"]) {
                material.item_id = m.item_id;
                material[NURIMS_TITLE] = m[NURIMS_TITLE];
                break;
              }
            }
          }
          if (d.hasOwnProperty("dc.description")) {
            setMetadataValue(material, NURIMS_DESCRIPTION, d["dc.description"])
          }
          // match storage location records
          if (d.hasOwnProperty("nrims.material.storagelocation")) {
            for (const s of that.storage_locations_list) {
              if (getRecordMetadataValue(s, NURIMS_SOURCE, "-") === d["nrims.material.storagelocation"]) {
                setMetadataValue(material, NURIMS_MATERIAL_STORAGE_LOCATION_RECORD, s.item_id);
                break;
              }
            }
          }
          // match manufacturers records
          if (d.hasOwnProperty("nrims.material.manufacturer")) {
            for (const m of that.manufacturers_list) {
              if (getRecordMetadataValue(m, NURIMS_SOURCE, "-") === d["nrims.material.manufacturer"]) {
                setMetadataValue(material, NURIMS_MATERIAL_MANUFACTURER_RECORD, m.item_id);
                break;
              }
            }
          }
          if (d.hasOwnProperty("nrims.material.nuclide")) {
            setMetadataValue(material, NURIMS_MATERIAL_NUCLIDES, "["+d["nrims.material.nuclide"]+"]")
          }
          if (d.hasOwnProperty("nrims.material.id")) {
            setMetadataValue(material, NURIMS_MATERIAL_ID, d["nrims.material.id"])
          }
          if (d.hasOwnProperty("nrims.material.type")) {
            setMetadataValue(material, NURIMS_MATERIAL_TYPE, d["nrims.material.type"])
          }
          if (d.hasOwnProperty("nrims.material.classification")) {
            setMetadataValue(material, NURIMS_MATERIAL_CLASSIFICATION, d["nrims.material.classification"])
          }
          if (d.hasOwnProperty("nrims.material.registrationdate")) {
            setMetadataValue(material, NURIMS_MATERIAL_REGISTRATION_DATE, d["nrims.material.registrationdate"])
          }
          if (d.hasOwnProperty("nrims.material.inventorystatus")) {
            setMetadataValue(material, NURIMS_MATERIAL_INVENTORY_STATUS, d["nrims.material.inventorystatus"])
          }
          if (d.hasOwnProperty("nrims.material.physicalform")) {
            setMetadataValue(material, NURIMS_MATERIAL_PHYSICAL_FORM, d["nrims.material.physicalform"])
          }
          if (d.hasOwnProperty("nrims.material.actsurveillancefrequency")) {
            setMetadataValue(material, NURIMS_ACTIVITY_SURVEILLANCE_FREQUENCY, d["nrims.material.actsurveillancefrequency"])
          }
          if (d.hasOwnProperty("nrims.material.ltsurveillancefrequency")) {
            setMetadataValue(material, NURIMS_LEAK_TEST_SURVEILLANCE_FREQUENCY, d["nrims.material.ltsurveillancefrequency"])
          }
          if (d.hasOwnProperty("nrims.material.invsurveillancefrequency")) {
            setMetadataValue(material, NURIMS_INVENTORY_SURVEILLANCE_FREQUENCY, d["nrims.material.invsurveillancefrequency"])
          }
          if (d.hasOwnProperty("image")) {
            const blob = JSON.parse(d["image"].replaceAll("'", "\""));
            setMetadataValue(material, NURIMS_MATERIAL_IMAGE, BlobObject(blob.file, blob.url))
          }
          materials.push(material);
        }
        that.setState({materials: materials, busy: 0, metadata_changed: true});
      }
    };
  }

  render() {
    const {materials, busy, metadata_changed, messages, title} = this.state;
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
              src={materials}
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
              Import ICENS Controlled Materials .json File
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

ImportICENSControlledMaterials.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(ImportICENSControlledMaterials);