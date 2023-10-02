import React, {Component} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
// import {DatePicker, LocalizationProvider} from "@mui/lab";
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Avatar from "@mui/material/Avatar";
import PersonIcon from '@mui/icons-material/Person';
import {
  BlobObject, getDateFromDateString,
  getRecordMetadataValue,
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
  UNDEFINED_DATE_STRING,
} from "../../utils/constants";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
// import {dateFromDateString} from "../../utils/DateUtils";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";
import {getGlossaryValue} from "../../utils/GlossaryUtils";
import {DatePickerWithTooltip} from "../../components/CommonComponents";
import dayjs from "dayjs";

const UNDEFINED_DATE = dayjs(UNDEFINED_DATE_STRING)

export const PERSONMETADATA_REF = "PersonMetadata";

class PersonMetadata extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      properties: props.properties,
    };
    this.Module = PERSONMETADATA_REF;
    this.person = {};
    this.glossary = {};
  }

  componentDidMount() {
  }

  setGlossaryTerms = (terms) => {
    // console.log("SSCMetadata.setGlossaryTerms", terms)
    for (const term of terms) {
      this.glossary[term.name] = term.value;
    }
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const p = this.person;
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

  handleSexChange = (e) => {
    console.log(">>>sex", e.target.id)
    const p = this.person;
    p["changed"] = true;
    setMetadataValue(p, NURIMS_ENTITY_SEX, e.target.value)
    this.forceUpdate()
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleRoleChange = (e) => {
    console.log(">>>role", e.target.value)
    const p = this.person;
    p["changed"] = true;
    setMetadataValue(p, NURIMS_ENTITY_ASSIGNED_ROLE, e.target.value)
    this.forceUpdate()
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleDobChange = (dob) => {
    const p = this.person;
    setMetadataValue(p, NURIMS_ENTITY_DATE_OF_BIRTH, dob.format("YYYY-MM-DD"))
    p["changed"] = true;
    this.forceUpdate()
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  set_person_object = (person) => {
    // person["changed"] = false;
    console.log("PersonMetadata.set_person_object", person)
    this.person = person;
    // signal to parent that metadata has changed
    this.props.onChange(false);
  }

  setRecordMetadata = (record) => {
    record["changed"] = false;
    console.log("PersonMetadata.setRecordMetadata", record)
    this.person = record;
    // signal to parent that metadata has changed
    this.props.onChange(false);
  }

  getMetadata = () => {
    return this.person;
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
      const person = that.person;
      person["changed"] = true;
      // setMetadataValue(person, NURIMS_ENTITY_AVATAR, {file: selectedFile.name, url: event.target.result});
      setMetadataValue(person, NURIMS_ENTITY_AVATAR, BlobObject(selectedFile.name, event.target.result));
      that.forceUpdate();
      // signal to parent that metadata has changed
      that.props.onChange(true);
    };
  }

  render() {
    const {properties} = this.state;
    const person = this.person;
    const assignedRole = getPropertyValue(properties, NURIMS_ENTITY_ASSIGNED_ROLE, "none,None").split('|');
    const avatar = getRecordMetadataValue(person, NURIMS_ENTITY_AVATAR, BLANK_IMAGE_OBJECT);
    const disabled = Object.keys(person).length === 0;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "personnel", person, "assignedRole", assignedRole);
      console.log("%%%%", getDateFromDateString(getRecordMetadataValue(
        person, NURIMS_ENTITY_DATE_OF_BIRTH, UNDEFINED_DATE_STRING), UNDEFINED_DATE))
    }
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
            accept="*.jpg, *.jpeg, image/*"
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
            style={{minWidth: 400}}
            value={person.hasOwnProperty(NURIMS_TITLE) ? person[NURIMS_TITLE] : ""}
            onChange={this.handleChange}
          />
          <TextField
            id="nid"
            label="National ID"
            value={getRecordMetadataValue(person, NURIMS_ENTITY_NATIONAL_ID, "")}
            onChange={this.handleChange}
          />
          <DatePickerWithTooltip
            width={"17ch"}
            label="Date Of Birth"
            inputFormat={"yyyy-MM-dd"}
            value={getDateFromDateString(getRecordMetadataValue(
              person, NURIMS_ENTITY_DATE_OF_BIRTH, UNDEFINED_DATE_STRING), UNDEFINED_DATE)}
            onChange={this.handleDobChange}
            disabled={disabled}
            tooltip={getGlossaryValue(this.glossary, NURIMS_ENTITY_DATE_OF_BIRTH, "")}
          />
          <FormControl sx={{m: 1, minWidth: 180}}>
            <InputLabel id="sex">Sex</InputLabel>
            <Select
              labelId="sex"
              id="sex"
              value={getRecordMetadataValue(person, NURIMS_ENTITY_SEX, "")}
              label="Sex"
              onChange={this.handleSexChange}
            >
              <MenuItem value={"m"}>Male</MenuItem>
              <MenuItem value={"f"}>Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{m: 1, minWidth: 450}}>
            <InputLabel id="roles">Assigned Roles</InputLabel>
            <Select
              labelId="roles"
              id="roles"
              value={getRecordMetadataValue(person, NURIMS_ENTITY_ASSIGNED_ROLE, [])}
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
            style={{minWidth: 400}}
            multiline
            maxRows={4}
            minRows={4}
            value={getRecordMetadataValue(person, NURIMS_ENTITY_CONTACT, "")}
            onChange={this.handleChange}
          />
          <TextField
            id="work-details"
            label="Work Details"
            style={{minWidth: 400}}
            multiline
            maxRows={4}
            minRows={4}
            value={getRecordMetadataValue(person, NURIMS_ENTITY_WORK_DETAILS, "")}
            onChange={this.handleChange}
          />
          <TextField
            id="dose-provider-id"
            label="Dose Provider ID"
            style={{minWidth: 150}}
            multiline
            maxRows={2}
            minRows={2}
            value={getRecordMetadataValue(person, NURIMS_ENTITY_DOSE_PROVIDER_ID, "")}
            onChange={this.handleChange}
          />
        </div>
      </Box>
    );
  }
}

PersonMetadata.defaultProps = {
  onChange: (msg) => {},
  properties: {},
};

export default PersonMetadata;