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
  CMD_GET_STORAGE_LOCATION_RECORDS,
  CMD_UPDATE_STORAGE_LOCATION_RECORD, ITEM_ID,
  NURIMS_DESCRIPTION,
  NURIMS_MATERIAL_STORAGE_IMAGE,
  NURIMS_MATERIAL_STORAGE_LOCATION,
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
import {BlobObject, setMetadataValue} from "../../../utils/MetadataUtils";
import BusyIndicator from "../../../components/BusyIndicator";
import PagedCsvTable from "../../../components/PagedCsvTable";

const MODULE = "AddEditIrradiatedSamples";

function isPersonMonitored(status) {
  if (Array.isArray(status)) {
    return status.length === 0 ? "false" : status[0] === "" ? "false" : "true";
  }
  return status === "" ? "false" : "true";
}

class AddEditIrradiatedSamples extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storage_locations: [],
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
    this.tableRef = React.createRef();
    this.pmref = React.createRef();
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
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
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  saveChanges = () => {
    const storage_locations = this.state.storage_locations;
    for (const location of storage_locations) {
      console.log("SAVING STORAGE LOCATION CHANGED METADATA ", location)
      // only save storage_locations with changed metadata
      this.props.send({
        cmd: CMD_UPDATE_STORAGE_LOCATION_RECORD,
        item_id: location.item_id,
        "nurims.title": location[NURIMS_TITLE],
        "nurims.withdrawn": location[NURIMS_WITHDRAWN],
        metadata: location.metadata,
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
        const storage_locations = [];
        for (const d of data) {
          const storage_location = {
            item_id: -1,
            "nurims.title": "",
            "nurims.wihdrawn": 0,
            metadata: []
          };
          if (d.hasOwnProperty("name")) {
            storage_location[NURIMS_TITLE] = d.name;
            for (const l of that.storage_locations_list) {
              if (l[NURIMS_TITLE] === d.name) {
                storage_location.item_id = l.item_id;
              }
            }
          }
          if (d.hasOwnProperty("dc.description")) {
            setMetadataValue(storage_location, NURIMS_DESCRIPTION, d["dc.description"])
          }
          if (d.hasOwnProperty("dc.coverage.spatial")) {
            // "dc.coverage.spatial": "{'projection':'EPSG:32663','coordinates':[231,188],'marker':'/images/marker/nuclear-store-circle.png'}",
            // {'marker':'/images/markers/nuclear-store-circle.png#64#32#32','easting':1,'northing':1}"
            const coverage = JSON.parse(d["dc.coverage.spatial"].replaceAll("'", "\""));
            console.log(">>>", coverage)
            const c = {marker: "/images/markers/nuclear-store-circle.png#64#32#32", easting: 0, northing: 0};
            if (coverage.hasOwnProperty("coordinates") && Array.isArray(coverage.coordinates)) {
              c.easting = coverage.coordinates[0];
              c.northing = coverage.coordinates[1];
            }
            setMetadataValue(storage_location, NURIMS_MATERIAL_STORAGE_LOCATION, c);
          }
          if (d.hasOwnProperty("dc.identifier.uri")) {
            setMetadataValue(storage_location, NURIMS_SOURCE, d["dc.identifier.uri"])
          }
          if (d.hasOwnProperty("image")) {
            const blob = JSON.parse(d["image"].replaceAll("'", "\""));
            setMetadataValue(storage_location, NURIMS_MATERIAL_STORAGE_IMAGE, BlobObject(blob.file, blob.url))
          }
          storage_locations.push(storage_location);
        }
        that.setState({storage_locations: storage_locations, busy: 0, metadata_changed: true});
      }
    };
  }

  render() {
    const {storage_locations, busy, metadata_changed, messages, title} = this.state;
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
            <PagedCsvTable
              ref={this.listRef}
              title={"Irradiated Samples"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              // includeArchived={include_archived}
              // requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={false}
              cells={[
                {
                  id: ITEM_ID,
                  align: 'center',
                  disablePadding: true,
                  label: 'ID',
                  width: '10%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.timestampin",
                  align: 'left',
                  disablePadding: true,
                  label: 'Timestamp In',
                  width: '90%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.timestampout",
                  align: 'left',
                  disablePadding: true,
                  label: 'Timestamp Out',
                  width: '90%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.id",
                  align: 'left',
                  disablePadding: true,
                  label: 'ID',
                  width: '90%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.label",
                  align: 'left',
                  disablePadding: true,
                  label: 'Label',
                  width: '90%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.type",
                  align: 'left',
                  disablePadding: true,
                  label: 'Type',
                  width: '90%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.site",
                  align: 'left',
                  disablePadding: true,
                  label: 'Type',
                  width: '90%',
                  sortField: true,
                },
              ]}
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
              Import Irradiated Samples From .csv File
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

AddEditIrradiatedSamples.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(AddEditIrradiatedSamples);