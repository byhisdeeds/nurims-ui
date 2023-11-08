import React, {Component} from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  TextField
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {
  BlobObject,
  getRecordMetadataValue,
  setMetadataValue
} from "../../utils/MetadataUtils";
import {getPropertyValue} from "../../utils/PropertyUtils";
import {
  NURIMS_ENTITY_AVATAR,
  NURIMS_TITLE,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
  BLANK_IMAGE_OBJECT,
  NURIMS_DOSIMETRY_DEVICE_TYPE,
} from "../../utils/constants";
import {
  MonitorTypeSelect
} from "../../components/CommonComponents";
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";

class MonitorMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: props.properties,
    };
    this.monitor = {};
  }

  setGlossaryTerms = (params) => {
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const p = this.monitor;
    if (e.target.id === "name") {
      p[NURIMS_TITLE] = e.target.value;
    } else if (e.target.id === "dose-provider-id") {
      setMetadataValue(p, NURIMS_ENTITY_DOSE_PROVIDER_ID, e.target.value)
    }
    p["changed"] = true;
    this.forceUpdate()
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleMonitorTypeChange = (e) => {
    console.log(">>>monitor type", e.target.id)
    const p = this.monitor;
    p["changed"] = true;
    setMetadataValue(p, NURIMS_DOSIMETRY_DEVICE_TYPE, e.target.value)
    this.forceUpdate()
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  // handleRoleChange = (e) => {
  //   console.log(">>>role", e.target.value)
  //   const p = this.monitor;
  //   p["changed"] = true;
  //   setMetadataValue(p, NURIMS_ENTITY_ASSIGNED_ROLE, e.target.value)
  //   this.forceUpdate()
  //   // signal to parent that metadata has changed
  //   this.props.onChange(true);
  // }
  //
  // handleDobChange = (dob) => {
  //   const p = this.monitor;
  //   setMetadataValue(p, NURIMS_ENTITY_DATE_OF_BIRTH, dob.toISOString().substring(0,10))
  //   p["changed"] = true;
  //   this.forceUpdate()
  //   // signal to parent that metadata has changed
  //   this.props.onChange(true);
  // }

  setRecordMetadata = (monitor) => {
    monitor["changed"] = false;
    console.log("MonitorMetadata.set_monitor_object", monitor)
    this.monitor = monitor;
    // signal to parent that metadata has changed
    this.props.onChange(false);
  }

  getMetadata = () => {
    return this.monitor;
  }

  handleAvatarUpload = (e) => {
    const selectedFile = e.target.files[0];
    // console.log("file uploaded", selectedFile)
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      enqueueErrorSnackbar(`Error occurred reading file: ${selectedFile.name}`)
    };
    fileReader.readAsDataURL(selectedFile);
    // fileReader.readAsText(selectedFile);
    fileReader.onload = function (event) {
      // console.log(">>>>>", event.target.result);
      const monitor = that.monitor;
      monitor["changed"] = true;
      setMetadataValue(monitor, NURIMS_ENTITY_AVATAR, BlobObject(selectedFile.name, event.target.result));
      that.forceUpdate();
      // signal to parent that metadata has changed
      that.props.onChange(true);
    };
  }

  render() {
    const {properties} = this.state;
    const monitor = this.monitor;
    // const assignedRole = getPropertyValue(properties, NURIMS_ENTITY_ASSIGNED_ROLE, "none,None").split('|');
    const monitorTypes = getPropertyValue(properties, NURIMS_DOSIMETRY_DEVICE_TYPE, "none,None").split('|');
    const avatar = getRecordMetadataValue(monitor, NURIMS_ENTITY_AVATAR, BLANK_IMAGE_OBJECT);
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '25ch'},
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <input
            accept="*.csv, *.txt, text/plain"
            // className={classes.input}
            id="load-avatar"
            style={{display: 'none',}}
            onChange={this.handleAvatarUpload}
            type="file"
          />
          <Card variant="outlined" sx={{ mb:1, ml:1, width: '25ch' }}>
            <CardContent>
              <label htmlFor="load-avatar">
                <Avatar sx={{ width: 128, height: 128, margin: 2 }} src={avatar.url}>
                  {avatar.url === "" && <PersonIcon/>}
                </Avatar>
              </label>
            </CardContent>
          </Card>
          <TextField
            required
            id="name"
            label="Fullname"
            style={{minWidth: 600}}
            value={monitor.hasOwnProperty(NURIMS_TITLE) ? monitor[NURIMS_TITLE] : ""}
            onChange={this.handleChange}
          />
          <MonitorTypeSelect
            value={getRecordMetadataValue(monitor, NURIMS_DOSIMETRY_DEVICE_TYPE, "")}
            onChange={this.handleMonitorTypeChange}
            monitorTypes={monitorTypes}
            width={"40ch"}
          />
          <TextField
            id="dose-provider-id"
            label="Dose Provider ID"
            multiline
            maxRows={2}
            minRows={2}
            value={getRecordMetadataValue(monitor, NURIMS_ENTITY_DOSE_PROVIDER_ID, "")}
            onChange={this.handleChange}
          />
        </div>
      </Box>
    );
  }
}

MonitorMetadata.defaultProps = {
  onChange: (msg) => {},
  properties: {},
};

export default MonitorMetadata;