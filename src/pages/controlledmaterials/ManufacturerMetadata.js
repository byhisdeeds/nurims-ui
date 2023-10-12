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


class ManufacturerMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manufacturer: {},
      properties: props.properties,
    };
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const manufacturer = this.state.manufacturer;
    if (e.target.id === "name") {
      manufacturer["changed"] = true;
      manufacturer[NURIMS_TITLE] = e.target.value;
    } else if (e.target.id === "address") {
      manufacturer["changed"] = true;
      setMetadataValue(manufacturer, NURIMS_ENTITY_ADDRESS, e.target.value)
    } else if (e.target.id === "contact") {
      manufacturer["changed"] = true;
      setMetadataValue(manufacturer, NURIMS_ENTITY_CONTACT, e.target.value)
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
    this.setState({manufacturer: manufacturer})
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

  handleDoseProviderChange = (e) => {
    console.log("handleDoseProviderChange", e.target.value);
    const p = this.state.person;
    const id = getRecordMetadataValue(p, "nurims.entity.doseproviderid", "|").split('|');
    setMetadataValue(p, "nurims.entity.doseproviderid", `${e.target.value}|${id[1]}`);
    this.setState({person: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleDoseProviderIdChange = (e) => {
    console.log("handleDoseProviderIdChange", e.target.value);
    const p = this.state.person;
    const id = getRecordMetadataValue(p, "nurims.entity.doseproviderid", "|").split('|');
    setMetadataValue(p, "nurims.entity.doseproviderid", `${id[0]}|${e.target.value}`);
    this.setState({person: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleWholeBodyUnitsChange = (e) => {
    const p = this.state.person;
    setMetadataValue(p, "nurims.dosimeter.units", e.target.value);
    this.setState({person: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleExtremityUnitsChange = (e) => {
    const p = this.state.person;
    setMetadataValue(p, "nurims.dosimeter.units", e.target.value);
    this.setState({person: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleWristUnitsChange = (e) => {
    const p = this.state.person;
    setMetadataValue(p, "nurims.dosimeter.units", e.target.value);
    this.setState({person: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleWholeBodyDateRangeChange = (range) => {
    console.log("WHOLEBODY DATE-RANGE", range);
    const p = this.state.person;
    const dosimeterId = getDoseRecordDosimeterId(p, "WholeBody", "");
    setDoseRecordMetadataValue(p, dosimeterId, "WholeBody", "nurims.dosimeter.monitorperiod", `${range[0].toISOString().substring(0, 10)}|${range[1].toISOString().substring(0, 10)}`);
    this.setState({person: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleExtremityDateRangeChange = (range) => {
    console.log("EXTREMITY DATE-RANGE", range);
    const p = this.state.person;
    const dosimeterId = getDoseRecordDosimeterId(p, "Extremity", "");
    setDoseRecordMetadataValue(p, dosimeterId, "Extremity", "nurims.dosimeter.monitorperiod", `${range[0].toISOString().substring(0, 10)}|${range[1].toISOString().substring(0, 10)}`);
    this.setState({person: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleWristDateRangeChange = (range) => {
    console.log("WRIST DATE-RANGE", range);
    const p = this.state.person;
    const dosimeterId = getDoseRecordDosimeterId(p, "Wrist", "");
    setDoseRecordMetadataValue(p, dosimeterId, "Wrist", "nurims.dosimeter.monitorperiod", `${range[0].toISOString().substring(0, 10)}|${range[1].toISOString().substring(0, 10)}`);
    this.setState({person: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  set_manufacturer_object = (manufacturer) => {
    console.log("ManufacturerMetadata.set_manufacturer_object", manufacturer)
    this.setState({manufacturer: manufacturer});
  }

  setRecordMetadata = (manufacturer) => {
    console.log("ManufacturerMetadata.setManufacturerMetadata", manufacturer)
    if (manufacturer.hasOwnProperty("metadata")) {
      const metadata = manufacturer.metadata;
      for (const m of metadata) {
        // if (m.hasOwnProperty("nurims.dosimeter.monitorperiod")) {
        //   const period = m["nurims.dosimeter.monitorperiod"];
        //   if (typeof period === "string") {
        //     // if (period.length <= 10) {
        //     //   let parts = period.substring(0, 10).split('-');
        //     //   if (parts.length === 3) {
        //     //     // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
        //     //     // January - 0, February - 1, etc.
        //     //     person["nurims.entity.dob"] = new Date(parts[0], parts[1] - 1, parts[2]);
        //     //   } else {
        //     //     person["nurims.entity.dob"] = new Date();
        //     //   }
        //     manufacturer["nurims.dosimeter.monitorperiod"] = [new Date(), new Date()];
        //   }
        // }
      }
    }

    // fixup known date fields
    // if (details.hasOwnProperty("nurims.entity.dob")) {
    //   if (details["nurims.entity.dob"].length <= 10) {
    //     let parts = details["nurims.entity.dob"].substring(0, 10).split('-');
    //     if (parts.length === 3) {
    //       // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    //       // January - 0, February - 1, etc.
    //       details["nurims.entity.dob"] = new Date(parts[0], parts[1] - 1, parts[2]);
    //     } else {
    //       details["nurims.entity.dob"] = new Date();
    //     }
    //   } else {
    //     details["nurims.entity.dob"] = new Date();
    //   }
    // }
    this.setState({manufacturer: manufacturer})
    this.props.onChange(false);
  }

  getManufacturerMetadata = () => {
    return this.state.manufacturer;
  }

  render() {
    const {manufacturer, properties} = this.state;
    console.log("ManufacturerMetadata.RENDER - manufacturer", manufacturer)
    // const doseProviderId = getMetadataValue(person, "nurims.entity.doseproviderid", "|").split('|');
    // const wholeBodyMonitor = getMetadataValue(person, "nurims.entity.iswholebodymonitored", "false");
    // const extremityMonitor = getMetadataValue(person, "nurims.entity.isextremitymonitored", "false");
    // const wristMonitor = getMetadataValue(person, "nurims.entity.iswristmonitored", "false");
    // const defaultUnits = getPropertyValue(properties, "nurims.property.doseunits", "");
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
            value={manufacturer.hasOwnProperty(NURIMS_TITLE) ? manufacturer[NURIMS_TITLE] : ""}
            onChange={this.handleChange}
          />
          <TextField
            id="address"
            label="Address"
            multiline
            style={{minWidth: 400}}
            maxRows={5}
            minRows={5}
            value={getRecordMetadataValue(manufacturer, NURIMS_ENTITY_ADDRESS, "")}
            onChange={this.handleChange}
          />
          <TextField
            id="contact"
            label="Contact"
            multiline
            style={{minWidth: 400}}
            maxRows={5}
            minRows={5}
            value={getRecordMetadataValue(manufacturer, NURIMS_ENTITY_CONTACT, "")}
            onChange={this.handleChange}
          />
        </div>
      </Box>
    );
  }
}

ManufacturerMetadata.propTypes = {
  ref: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
}

ManufacturerMetadata.defaultProps = {
  onCHange: (msg) => {
  },
};

export default withTheme(ManufacturerMetadata);