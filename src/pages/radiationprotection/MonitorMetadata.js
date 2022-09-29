import React, {Component} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Card, CardContent, FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {toast} from "react-toastify";
import Avatar from "@mui/material/Avatar";
import PersonIcon from '@mui/icons-material/Person';
import {
  BlobObject,
  getMetadataValue,
  setMetadataValue
} from "../../utils/MetadataUtils";
import {getPropertyValue} from "../../utils/PropertyUtils";
import {
  NURIMS_ENTITY_ASSIGNED_ROLE,
  NURIMS_ENTITY_AVATAR,
  NURIMS_ENTITY_CONTACT,
  NURIMS_ENTITY_DATE_OF_BIRTH,
  NURIMS_ENTITY_NATIONAL_ID,
  NURIMS_ENTITY_SEX,
  NURIMS_TITLE,
  NURIMS_ENTITY_WORK_DETAILS,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
  BLANK_IMAGE_OBJECT,
} from "../../utils/constants";
import {MonitorTypeSelect} from "../../components/CommonComponents";

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
    } else if (e.target.id === "nid") {
      setMetadataValue(p, NURIMS_ENTITY_NATIONAL_ID, e.target.value)
    } else if (e.target.id === "contact") {
      setMetadataValue(p, NURIMS_ENTITY_CONTACT, e.target.value)
    } else if (e.target.id === "work-details") {
      setMetadataValue(p, NURIMS_ENTITY_WORK_DETAILS, e.target.value)
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
    setMetadataValue(p, NURIMS_ENTITY_SEX, e.target.value)
    this.forceUpdate()
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  // handleDisabledChange = (e) => {
  //   console.log(">>>disabled", e.target.value)
  //   const p = this.monitor;
  //   p["changed"] = true;
  //   p[NURIMS_WITHDRAWN] = e.target.value;
  //   this.forceUpdate()
  //   // signal to parent that metadata has changed
  //   this.props.onChange(true);
  // }

  handleRoleChange = (e) => {
    console.log(">>>role", e.target.value)
    const p = this.monitor;
    p["changed"] = true;
    setMetadataValue(p, NURIMS_ENTITY_ASSIGNED_ROLE, e.target.value)
    this.forceUpdate()
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleDobChange = (dob) => {
    const p = this.monitor;
    setMetadataValue(p, NURIMS_ENTITY_DATE_OF_BIRTH, dob.toISOString().substring(0,10))
    p["changed"] = true;
    this.forceUpdate()
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

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
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
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
    const assignedRole = getPropertyValue(properties, NURIMS_ENTITY_ASSIGNED_ROLE, "none,None").split('|');
    const monitorTypes = getPropertyValue(properties, NURIMS_ENTITY_ASSIGNED_ROLE, "none,None").split('|');
    const avatar = getMetadataValue(monitor, NURIMS_ENTITY_AVATAR, BLANK_IMAGE_OBJECT);
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
            value={monitor.hasOwnProperty(NURIMS_TITLE) ? monitor[NURIMS_TITLE] : ""}
            onChange={this.handleChange}
          />
          <TextField
            id="nid"
            label="National ID"
            value={getMetadataValue(monitor, NURIMS_ENTITY_NATIONAL_ID, "")}
            onChange={this.handleChange}
          />
          {/*<LocalizationProvider dateAdapter={AdapterDateFns}>*/}
          {/*  <DatePicker*/}
          {/*    label="Date Of Birth"*/}
          {/*    inputFormat={"yyyy-MM-dd"}*/}
          {/*    value={getDateFromDateString(getMetadataValue(monitor, NURIMS_ENTITY_DATE_OF_BIRTH, "1970-01-01"), null)}*/}
          {/*    onChange={this.handleDobChange}*/}
          {/*    renderInput={(params) => <TextField {...params} />}*/}
          {/*  />*/}
          {/*</LocalizationProvider>*/}
          <FormControl sx={{m: 1, minWidth: 250}}>
            <InputLabel id="mtype">Monitor Type</InputLabel>
            <Select
              labelId="mtype"
              id="mtype"
              value={getMetadataValue(monitor, NURIMS_ENTITY_SEX, "")}
              label="Monitor Type"
              onChange={this.handleMonitorTypeChange}
            >
              <MenuItem value={"m"}>Male</MenuItem>
              <MenuItem value={"f"}>Female</MenuItem>
            </Select>
          </FormControl>
          {/*<FormControl sx={{m: 1, minWidth: 250}}>*/}
          {/*  <InputLabel id="disabled">Disabled</InputLabel>*/}
          {/*  <Select*/}
          {/*    labelId="disabled"*/}
          {/*    id="disabled"*/}
          {/*    value={monitor.hasOwnProperty(NURIMS_WITHDRAWN) ? monitor[NURIMS_WITHDRAWN] : 0}*/}
          {/*    label="Disabled"*/}
          {/*    onChange={this.handleDisabledChange}*/}
          {/*  >*/}
          {/*    <MenuItem value={0}>False</MenuItem>*/}
          {/*    <MenuItem value={1}>True</MenuItem>*/}
          {/*  </Select>*/}
          {/*</FormControl>*/}
          <MonitorTypeSelect
            value={getMetadataValue(monitor, NURIMS_ENTITY_NATIONAL_ID, "")}
            // value={Object.keys(selectedAnalysisSystem).length === 0 ? '' : selectedAnalysisSystem}
            onChange={this.handleMonitorTypeChange}
            monitorTypes={monitorTypes}
          />
          <FormControl sx={{m: 1, minWidth: 250}}>
            <InputLabel id="roles">Assigned Roles</InputLabel>
            <Select
              labelId="roles"
              id="roles"
              value={getMetadataValue(monitor, NURIMS_ENTITY_ASSIGNED_ROLE, [])}
              label="Assigned Roles"
              multiple
              onChange={this.handleRoleChange}
            >
              {assignedRole.map((role) => {
                const t = role.split(',');
                if (t.length === 2) {
                  return (
                    <MenuItem value={t[0]}>{t[1]}</MenuItem>
                  )
                }
              })}
            </Select>
          </FormControl>
          <TextField
            id="contact"
            label="Contact"
            multiline
            maxRows={4}
            minRows={4}
            value={getMetadataValue(monitor, NURIMS_ENTITY_CONTACT, "")}
            onChange={this.handleChange}
          />
          <TextField
            id="work-details"
            label="Work Details"
            multiline
            maxRows={4}
            minRows={4}
            value={getMetadataValue(monitor, NURIMS_ENTITY_WORK_DETAILS, "")}
            onChange={this.handleChange}
          />
          <TextField
            id="dose-provider-id"
            label="Dose Provider ID"
            multiline
            maxRows={2}
            minRows={2}
            value={getMetadataValue(monitor, NURIMS_ENTITY_DOSE_PROVIDER_ID, "")}
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