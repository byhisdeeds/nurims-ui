import React, {Component} from 'react';
import {withTheme} from "@mui/styles";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  getRecordMetadataValue,
  setMetadataValue,
  getDoseRecordDosimeterId,
  setDoseRecordMetadataValue,
} from "../../utils/MetadataUtils";
import {
  NURIMS_ENTITY_ADDRESS,
  NURIMS_ENTITY_CONTACT,
  NURIMS_TITLE
} from "../../utils/constants";
import PropTypes from "prop-types";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";


class OwnerMetadata extends Component {
  static contextType = UserDebugContext;
  constructor(props) {
    super(props);
    this.state = {
      owner: {},
      properties: props.properties,
    };
    this.Module = "OwnerMetadata"
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const owner = this.state.owner;
    if (e.target.id === "name") {
      owner["changed"] = true;
      owner[NURIMS_TITLE] = e.target.value;
    } else if (e.target.id === "address") {
      owner["changed"] = true;
      setMetadataValue(owner, NURIMS_ENTITY_ADDRESS, e.target.value)
    } else if (e.target.id === "contact") {
      owner["changed"] = true;
      setMetadataValue(owner, NURIMS_ENTITY_CONTACT, e.target.value)
      // } else if (e.target.id === "wrist-batchid") {
      //   const value = getDoseRecordDosimeterId(p, "Wrist", "");
      //   setDoseRecordMetadataValue(p, value, "Wrist", "nurims.dosimeter.batchid", e.target.value);
      // } else if (e.target.id === "shallowdose") {
      //   const value = getDoseRecordDosimeterId(p, "WholeBody", "");
      //   setDoseRecordMetadataValue(p, value, "WholeBody", "nurims.dosimeter.shallowdose", e.target.value);
      // } else if (e.target.id === "deepdose") {
      //   const value = getDoseRecordDosimeterId(p, "WholeBody", "");
      //   setDoseRecordMetadataValue(p, value, "WholeBody", "nurims.dosimeter.deepdose", e.target.value);
      // } else if (e.target.id === "extremitydose") {
      //   const value = getDoseRecordDosimeterId(p, "Extremity", "");
      //   setDoseRecordMetadataValue(p, value, "Extremity", "nurims.dosimeter.extremitydose", e.target.value);
      // } else if (e.target.id === "wristdose") {
      //   const value = getDoseRecordDosimeterId(p, "Wrist", "");
      //   setDoseRecordMetadataValue(p, value, "Wrist", "nurims.dosimeter.wristdose", e.target.value);
    }
    this.setState({owner: owner})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  // handleMonitorTypeChange = (e) => {
  //   const p = this.state.person;
  //   setMetadataValue(p, "nurims.dosimeter.monitortype", e.target.value);
  //   p.has_changed = true;
  //   this.setState({person: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleDoseProviderChange = (e) => {
  //   console.log("handleDoseProviderChange", e.target.value);
  //   const p = this.state.person;
  //   const id = getRecordMetadataValue(p, "nurims.entity.doseproviderid", "|").split('|');
  //   setMetadataValue(p, "nurims.entity.doseproviderid", `${e.target.value}|${id[1]}`);
  //   this.setState({person: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleDoseProviderIdChange = (e) => {
  //   console.log("handleDoseProviderIdChange", e.target.value);
  //   const p = this.state.person;
  //   const id = getRecordMetadataValue(p, "nurims.entity.doseproviderid", "|").split('|');
  //   setMetadataValue(p, "nurims.entity.doseproviderid", `${id[0]}|${e.target.value}`);
  //   this.setState({person: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }
  //
  // handleWholeBodyUnitsChange = (e) => {
  //   const p = this.state.person;
  //   setMetadataValue(p, "nurims.dosimeter.units", e.target.value);
  //   this.setState({person: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleExtremityUnitsChange = (e) => {
  //   const p = this.state.person;
  //   setMetadataValue(p, "nurims.dosimeter.units", e.target.value);
  //   this.setState({person: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }
  //
  // handleWristUnitsChange = (e) => {
  //   const p = this.state.person;
  //   setMetadataValue(p, "nurims.dosimeter.units", e.target.value);
  //   this.setState({person: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleWholeBodyDateRangeChange = (range) => {
  //   console.log("WHOLEBODY DATE-RANGE", range);
  //   const p = this.state.person;
  //   const dosimeterId = getDoseRecordDosimeterId(p, "WholeBody", "");
  //   setDoseRecordMetadataValue(p, dosimeterId, "WholeBody", "nurims.dosimeter.monitorperiod", `${range[0].toISOString().substring(0, 10)}|${range[1].toISOString().substring(0, 10)}`);
  //   this.setState({person: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }
  //
  // handleExtremityDateRangeChange = (range) => {
  //   console.log("EXTREMITY DATE-RANGE", range);
  //   const p = this.state.person;
  //   const dosimeterId = getDoseRecordDosimeterId(p, "Extremity", "");
  //   setDoseRecordMetadataValue(p, dosimeterId, "Extremity", "nurims.dosimeter.monitorperiod", `${range[0].toISOString().substring(0, 10)}|${range[1].toISOString().substring(0, 10)}`);
  //   this.setState({person: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleWristDateRangeChange = (range) => {
  //   console.log("WRIST DATE-RANGE", range);
  //   const p = this.state.person;
  //   const dosimeterId = getDoseRecordDosimeterId(p, "Wrist", "");
  //   setDoseRecordMetadataValue(p, dosimeterId, "Wrist", "nurims.dosimeter.monitorperiod", `${range[0].toISOString().substring(0, 10)}|${range[1].toISOString().substring(0, 10)}`);
  //   this.setState({person: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  set_owner_object = (owner) => {
    console.log("OwnerMetadata.set_owner_object", owner)
    this.setState({owner: owner});
  }

  setRecordMetadata = (owner) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "owner", owner);
    }
    // if (owner.hasOwnProperty("metadata")) {
    //   const metadata = owner.metadata;
    //   for (const m of metadata) {
    //     // if (m.hasOwnProperty("nurims.dosimeter.monitorperiod")) {
    //     //   const period = m["nurims.dosimeter.monitorperiod"];
    //     //   if (typeof period === "string") {
    //     //     // if (period.length <= 10) {
    //     //     //   let parts = period.substring(0, 10).split('-');
    //     //     //   if (parts.length === 3) {
    //     //     //     // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    //     //     //     // January - 0, February - 1, etc.
    //     //     //     person["nurims.entity.dob"] = new Date(parts[0], parts[1] - 1, parts[2]);
    //     //     //   } else {
    //     //     //     person["nurims.entity.dob"] = new Date();
    //     //     //   }
    //     //     owner["nurims.dosimeter.monitorperiod"] = [new Date(), new Date()];
    //     //   }
    //     // }
    //   }
    // }

    this.setState({owner: owner})
    this.props.onChange(false);
  }

  getOwnerMetadata = () => {
    return this.state.owner;
  }

  render() {
    const {owner, properties} = this.state;
    // const doseProviderId = getMetadataValue(person, "nurims.entity.doseproviderid", "|").split('|');
    // const wholeBodyMonitor = getMetadataValue(person, "nurims.entity.iswholebodymonitored", "false");
    // const extremityMonitor = getMetadataValue(person, "nurims.entity.isextremitymonitored", "false");
    // const wristMonitor = getMetadataValue(person, "nurims.entity.iswristmonitored", "false");
    // const defaultUnits = getPropertyValue(properties, "nurims.property.doseunits", "");
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "owner", owner);
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
          <TextField
            required
            id="name"
            label="Name"
            style={{minWidth: 400}}
            value={owner.hasOwnProperty(NURIMS_TITLE) ? owner[NURIMS_TITLE] : ""}
            onChange={this.handleChange}
          />
          <TextField
            id="address"
            label="Address"
            multiline
            style={{minWidth: 400}}
            maxRows={5}
            minRows={5}
            value={getRecordMetadataValue(owner, NURIMS_ENTITY_ADDRESS, "")}
            onChange={this.handleChange}
          />
          <TextField
            id="contact"
            label="Contact"
            multiline
            style={{minWidth: 400}}
            maxRows={5}
            minRows={5}
            value={getRecordMetadataValue(owner, NURIMS_ENTITY_CONTACT, "")}
            onChange={this.handleChange}
          />
        </div>
      </Box>
    );
  }
}

OwnerMetadata.propTypes = {
  ref: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
}

export default withTheme(OwnerMetadata);