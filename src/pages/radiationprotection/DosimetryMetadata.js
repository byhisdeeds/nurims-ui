import React, {Component} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Card, CardContent, FormControl, InputLabel, Select, Tooltip, Typography} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateRangePicker from '@mui/lab/DateRangePicker';
import {
  getRecordMetadataValue,
  setMetadataValue,
  getDoseRecordMetadataValue,
  getDoseRecordDosimeterId,
  setDoseRecordMetadataValue,
  getDateRangeFromDateString
} from "../../utils/MetadataUtils";
import {
  getPropertyValue,
} from "../../utils/PropertyUtils";


// function getMetadataValue(obj, key, missingValue) {
//   if (obj.hasOwnProperty("metadata")) {
//     const metadata = obj.metadata;
//     if (Array.isArray(metadata)) {
//       for (const m of metadata) {
//         for (const [k, v] of Object.entries(m)) {
//           if (k === key) {
//             return v;
//           }
//         }
//       }
//     }
//   }
//   return missingValue;
// }
//
// function setMetadataValue(obj, key, value) {
//   if (obj.hasOwnProperty("metadata")) {
//     const metadata = obj.metadata;
//     if (Array.isArray(metadata)) {
//       for (const m of metadata) {
//         for (const [k, v] of Object.entries(m)) {
//           // console.log(`${k}: ${v}`);
//           if (k === key) {
//             m[k] = value;
//             return;
//           }
//         }
//       }
//       const v = {};
//       v[key] = value;
//       metadata.push(v);
//     }
//   }
// }

class DosimetryMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: {},
      properties: props.properties,
    };
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const p = this.state.person;
    if (e.target.id === "wholebody-badgeid") {
      const dosimeterId = getDoseRecordDosimeterId(p, "WholeBody", "");
      setDoseRecordMetadataValue(p, dosimeterId, "WholeBody", "nurims.dosimeter.batchid", e.target.value);
    } else if (e.target.id === "wholebody-batchid") {
      const value = getDoseRecordDosimeterId(p, "WholeBody", "");
      setDoseRecordMetadataValue(p, value, "WholeBody", "nurims.dosimeter.batchid", e.target.value);
    } else if (e.target.id === "extremity-batchid") {
      const value = getDoseRecordDosimeterId(p, "Extremity", "");
      setDoseRecordMetadataValue(p, value, "Extremity", "nurims.dosimeter.batchid", e.target.value);
    } else if (e.target.id === "wrist-batchid") {
      const value = getDoseRecordDosimeterId(p, "Wrist", "");
      setDoseRecordMetadataValue(p, value, "Wrist", "nurims.dosimeter.batchid", e.target.value);
    } else if (e.target.id === "shallowdose") {
      const value = getDoseRecordDosimeterId(p, "WholeBody", "");
      setDoseRecordMetadataValue(p, value, "WholeBody", "nurims.dosimeter.shallowdose", e.target.value);
    } else if (e.target.id === "deepdose") {
      const value = getDoseRecordDosimeterId(p, "WholeBody", "");
      setDoseRecordMetadataValue(p, value, "WholeBody", "nurims.dosimeter.deepdose", e.target.value);
    } else if (e.target.id === "extremitydose") {
      const value = getDoseRecordDosimeterId(p, "Extremity", "");
      setDoseRecordMetadataValue(p, value, "Extremity", "nurims.dosimeter.extremitydose", e.target.value);
    } else if (e.target.id === "wristdose") {
      const value = getDoseRecordDosimeterId(p, "Wrist", "");
      setDoseRecordMetadataValue(p, value, "Wrist", "nurims.dosimeter.wristdose", e.target.value);
    }
    this.setState({person: p, has_changed: true})
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

  // update_metadata = (person) => {
  //   console.log("DosimetryMetadata.update_metadata", person)
  //   // initialise personnel details object
  //   // const person = {
  //   //   ...{
  //   //     item_id: details["item_id"],
  //   //     "nurims.title": details["nurims.title"],
  //   //     "nurims.withdrawn": details["nurims.withdrawn"]
  //   //   }
  //   // }
  //   if (person.hasOwnProperty("metadata")) {
  //     const metadata = person.metadata;
  //     for (const m of metadata) {
  //       if (m.hasOwnProperty("nurims.dosimeter.monitorperiod")) {
  //         const period = m["nurims.dosimeter.monitorperiod"];
  //         if (typeof period === "string") {
  //           // if (period.length <= 10) {
  //           //   let parts = period.substring(0, 10).split('-');
  //           //   if (parts.length === 3) {
  //           //     // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  //           //     // January - 0, February - 1, etc.
  //           //     person["nurims.entity.dob"] = new Date(parts[0], parts[1] - 1, parts[2]);
  //           //   } else {
  //           //     person["nurims.entity.dob"] = new Date();
  //           //   }
  //           person["nurims.dosimeter.monitorperiod"] = [new Date(), new Date()];
  //         }
  //       }
  //     }
  //   }
  //   // fixup known date fields
  //   // if (details.hasOwnProperty("nurims.entity.dob")) {
  //   //   if (details["nurims.entity.dob"].length <= 10) {
  //   //     let parts = details["nurims.entity.dob"].substring(0, 10).split('-');
  //   //     if (parts.length === 3) {
  //   //       // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  //   //       // January - 0, February - 1, etc.
  //   //       details["nurims.entity.dob"] = new Date(parts[0], parts[1] - 1, parts[2]);
  //   //     } else {
  //   //       details["nurims.entity.dob"] = new Date();
  //   //     }
  //   //   } else {
  //   //     details["nurims.entity.dob"] = new Date();
  //   //   }
  //   // }
  //   console.log("+++++++++++++++++++++++++")
  //   console.log(person)
  //   console.log("+++++++++++++++++++++++++")
  //   this.setState({person: person, has_changed: false})
  //   this.props.onChange(false);
  // }

  setDoseMetadata = (person) => {
    console.log("DosimetryMetadata.setDoseMetadata", person)
    if (person.hasOwnProperty("metadata")) {
      const metadata = person.metadata;
      for (const m of metadata) {
        if (m.hasOwnProperty("nurims.dosimeter.monitorperiod")) {
          const period = m["nurims.dosimeter.monitorperiod"];
          if (typeof period === "string") {
            // if (period.length <= 10) {
            //   let parts = period.substring(0, 10).split('-');
            //   if (parts.length === 3) {
            //     // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
            //     // January - 0, February - 1, etc.
            //     person["nurims.entity.dob"] = new Date(parts[0], parts[1] - 1, parts[2]);
            //   } else {
            //     person["nurims.entity.dob"] = new Date();
            //   }
            person["nurims.dosimeter.monitorperiod"] = [new Date(), new Date()];
          }
        }
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
    console.log("+++++++++++++++++++++++++")
    console.log(person)
    console.log("+++++++++++++++++++++++++")
    this.setState({person: person, has_changed: false})
    this.props.onChange(false);
  }

  get_person_details = () => {
    return this.state.person;
  }

  render() {
    const {person, properties} = this.state;
    console.log("DosimetryMetadata.RENDER - person", person)
    const doseProviderId = getRecordMetadataValue(person, "nurims.entity.doseproviderid", "|").split('|');
    const wholeBodyMonitor = getRecordMetadataValue(person, "nurims.entity.iswholebodymonitored", "false");
    const extremityMonitor = getRecordMetadataValue(person, "nurims.entity.isextremitymonitored", "false");
    const wristMonitor = getRecordMetadataValue(person, "nurims.entity.iswristmonitored", "false");
    const defaultUnits = getPropertyValue(properties, "nurims.dosimeter.units", "");
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
          <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
            <CardContent>
              {/*<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>*/}
              {/*  Word of the Day*/}
              {/*</Typography>*/}
              <FormControl sx={{m: 1, minWidth: 250}}>
                <InputLabel id="doseprovider">Dose Provider</InputLabel>
                <Select
                  labelId="doseprovider"
                  id="doseprovider"
                  value={doseProviderId[0]}
                  label="Dose Provider"
                  onChange={this.handleDoseProviderChange}
                >
                  <MenuItem value={doseProviderId[0]}>{doseProviderId[0]}</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{'& .MuiTextField-root': {m: 1, width: '15ch'}}}>
                <TextField
                  id="doseproviderid"
                  label="Dose Provider ID"
                  value={doseProviderId[1]}
                  onChange={this.handleDoseProviderIdChange}
                />
              </Box>
            </CardContent>
          </Card>
          {wholeBodyMonitor === "true" &&
          <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
            <CardContent>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Whole Body Data
              </Typography>
              <TextField
                id="wholebody-batchid"
                label="Batch ID"
                value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "WholeBody", ""), "WholeBody", "nurims.dosimeter.batchid", "")}
                onChange={this.handleChange}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                  <DateRangePicker
                    startText="Wear Start"
                    endText="Wear End"
                    value={getDateRangeFromDateString(getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "WholeBody", ""), "WholeBody", "nurims.dosimeter.monitorperiod", ""), [null, null])}
                    inputFormat={'yyyy-MM-dd'}
                    onChange={this.handleWholeBodyDateRangeChange}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField {...startProps}/>
                        <Box sx={{mx: 1}}>to</Box>
                        <TextField {...endProps}/>
                      </React.Fragment>
                    )}
                  />
                </Box>
              </LocalizationProvider>
              <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                <TextField
                  required
                  id="wholebody-badgeid"
                  label="Badge ID"
                  value={getDoseRecordDosimeterId(person, "WholeBody", "")}
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  id="shallowdose"
                  label="Shallow Dose"
                  value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "WholeBody", ""), "WholeBody", "nurims.dosimeter.shallowdose", "")}
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  id="deepdose"
                  label="Deep Dose"
                  value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "WholeBody", ""), "WholeBody", "nurims.dosimeter.deepdose", "")}
                  onChange={this.handleChange}
                />
              </Box>
              <FormControl sx={{m: 1, minWidth: 250}}>
                <InputLabel id="wholebody-doseunits">Dose Units</InputLabel>
                <Select
                  labelId="wholebody-doseunits"
                  id="wholebody-doseunits"
                  value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "WholeBody", ""), "WholeBody", "nurims.dosimeter.units", defaultUnits)}
                  label="Dose Units"
                  onChange={this.handleWholeBodyUnitsChange}
                >
                  <MenuItem value={"mr"}>Milli Rems</MenuItem>
                  <MenuItem value={"msv"}>Milli Sieverts</MenuItem>
                  <MenuItem value={"usv"}>Micro Sieverts</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          }
          {extremityMonitor === "true" &&
          <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
            <CardContent>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Extremity Data
              </Typography>
              <TextField
                id="extremity-batchid"
                label="Batch ID"
                value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "Extremity", ""), "Extremity", "nurims.dosimeter.batchid", "")}
                onChange={this.handleChange}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                  <DateRangePicker
                    startText="Wear Start"
                    endText="Wear End"
                    value={getDateRangeFromDateString(getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "Extremity", ""), "Extremity", "nurims.dosimeter.monitorperiod", ""), [null, null])}
                    inputFormat={'yyyy-MM-dd'}
                    onChange={this.handleExtremityDateRangeChange}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx={{mx: 2}}> to </Box>
                        <TextField {...endProps} />
                      </React.Fragment>
                    )}
                  />
                </Box>
              </LocalizationProvider>
              <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                <TextField
                  required
                  id="extremity-badgeid"
                  label="Badge ID"
                  value={getDoseRecordDosimeterId(person, "Extremity", "")}
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  id="extremitydose"
                  label="Extremity Dose"
                  value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "Extremity", ""), "Extremity", "nurims.dosimeter.extremitydose", "")}
                  onChange={this.handleChange}
                />
              </Box>
              <FormControl sx={{m: 1, minWidth: 250}}>
                <InputLabel id="extremity-doseunits">Dose Units</InputLabel>
                <Select
                  labelId="extremity-doseunits"
                  id="extremity-doseunits"
                  value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "Extremity", ""), "Extremity", "nurims.dosimeter.units", defaultUnits)}
                  label="Dose Units"
                  onChange={this.handleExtremityUnitsChange}
                >
                  <MenuItem value={"mr"}>Milli Rems</MenuItem>
                  <MenuItem value={"msv"}>Milli Sieverts</MenuItem>
                  <MenuItem value={"usv"}>Micro Sieverts</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          }
          {wristMonitor === "true" &&
          <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
            <CardContent>
              <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                Wrist Data
              </Typography>
              <TextField
                id="wrist-batchid"
                label="Batch ID"
                value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "Wrist", ""), "Wrist", "nurims.dosimeter.batchid", "")}
                onChange={this.handleChange}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                  <DateRangePicker
                    startText="Wear Start"
                    endText="Wear End"
                    value={getDateRangeFromDateString(getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "Wrist", ""), "Wrist", "nurims.dosimeter.monitorperiod", ""), [null, null])}
                    inputFormat={'yyyy-MM-dd'}
                    onChange={this.handleWristDateRangeChange}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx={{mx: 2}}> to </Box>
                        <TextField {...endProps} />
                      </React.Fragment>
                    )}
                  />
                </Box>
              </LocalizationProvider>
              <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                <TextField
                  required
                  id="wrist-badgeid"
                  label="Badge ID"
                  value={getDoseRecordDosimeterId(person, "Wrist", "")}
                  onChange={this.handleChange}
                />
                <TextField
                  required
                  id="wristdose"
                  label="Wrist Dose"
                  value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "Wrist", ""), "Wrist", "nurims.dosimeter.wristdose", "")}
                  onChange={this.handleChange}
                />
              </Box>
              <FormControl sx={{m: 1, minWidth: 250}}>
                <InputLabel id="wrist-doseunits">Dose Units</InputLabel>
                <Select
                  labelId="wrist-doseunits"
                  id="wrist-doseunits"
                  value={getDoseRecordMetadataValue(person, getDoseRecordDosimeterId(person, "Wrist", ""), "Wrist", "nurims.dosimeter.units", defaultUnits)}
                  label="Dose Units"
                  onChange={this.handleWristUnitsChange}
                >
                  <MenuItem value={"mr"}>Milli Rems</MenuItem>
                  <MenuItem value={"msv"}>Milli Sieverts</MenuItem>
                  <MenuItem value={"usv"}>Micro Sieverts</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          }
        </div>
      </Box>
    );
  }
}

DosimetryMetadata.defaultProps = {
  onCHange: (msg) => {
  },
};

export default DosimetryMetadata;