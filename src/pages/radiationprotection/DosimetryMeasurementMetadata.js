import React, {Component} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Select,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import dayjs from 'dayjs';
import {
  getRecordMetadataValue,
  setMetadataValue,
  getDateRangeFromDateString
} from "../../utils/MetadataUtils";
import {
  getPropertyValue,
} from "../../utils/PropertyUtils";
import {ConsoleLog, UserContext} from "../../utils/UserContext";
import {
  NURIMS_DOSIMETRY_BATCH_ID,
  NURIMS_DOSIMETRY_DEEP_DOSE,
  NURIMS_DOSIMETRY_EXTREMITY_DOSE,
  NURIMS_DOSIMETRY_ID,
  NURIMS_DOSIMETRY_MEASUREMENTS,
  NURIMS_DOSIMETRY_MONITOR_PERIOD,
  NURIMS_DOSIMETRY_SHALLOW_DOSE,
  NURIMS_DOSIMETRY_TYPE,
  NURIMS_DOSIMETRY_UNITS,
  NURIMS_DOSIMETRY_WRIST_DOSE,
} from "../../utils/constants";
import DosimetryMeasurementsList from "./DosimetryMeasurementsList";
import Checkbox from "@mui/material/Checkbox";
import {DateRangePicker} from "../../components/CommonComponents";


function getMonitorPeriod(selection, field, missingValue) {
  const period = selection.hasOwnProperty(field) ? selection[field] : "1900-01-01 to 1900-01-01";
  return getDateRangeFromDateString(period.replaceAll(" to ", "|"), missingValue);
}

class DosimetryMeasurementMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      measurements: {},
      properties: props.properties,
      busy: 0,
      data_changed: false,
      selection: {},
      readonly: true,
    };
    this.ref = React.createRef();
    this.Module = "DosimetryMeasurementMetadata";
  }

  handleChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleChange", "target.id", e.target.id, "target.value", e.target.value);
    }
    const selection = this.state.selection;
    if (e.target.id === "card-id") {
      selection[NURIMS_DOSIMETRY_ID] = e.target.value;
    } else if (e.target.id === "batch-id") {
      selection[NURIMS_DOSIMETRY_BATCH_ID] = e.target.value;
    } else if (e.target.id === "whole-body-record") {
      if (e.target.checked) {
        selection[NURIMS_DOSIMETRY_TYPE] =  "wholebody";
      }
    } else if (e.target.id === "extremity-record") {
      if (e.target.checked) {
        selection[NURIMS_DOSIMETRY_TYPE] =  "extremity";
      }
    } else if (e.target.id === "wrist-record") {
      if (e.target.checked) {
        selection[NURIMS_DOSIMETRY_TYPE] =  "wrist";
      }
    } else if (e.target.id === "shallow-dose") {
      selection[NURIMS_DOSIMETRY_SHALLOW_DOSE] = e.target.value;
    } else if (e.target.id === "deep-dose") {
      selection[NURIMS_DOSIMETRY_DEEP_DOSE] = e.target.value;
    } else if (e.target.id === "extremity-dose") {
      selection[NURIMS_DOSIMETRY_EXTREMITY_DOSE] = e.target.value;
    } else if (e.target.id === "wrist-dose") {
      selection[NURIMS_DOSIMETRY_WRIST_DOSE] = e.target.value;
    }
    this.setState({selection: selection, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleDoseProviderChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleDoseProviderChange", "target.value", e.target.value);
    }
    const p = this.state.measurements;
    const id = getRecordMetadataValue(p, "nurims.entity.doseproviderid", "|").split('|');
    setMetadataValue(p, "nurims.entity.doseproviderid", `${e.target.value}|${id[1]}`);
    this.setState({measurements: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  // handleDoseProviderIdChange = (e) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.Module, "handleDateRangeChange", "range", range);
  //   }
  //   console.log("handleDoseProviderIdChange", e.target.value);
  //   const p = this.state.measurements;
  //   const id = getRecordMetadataValue(p, "nurims.entity.doseproviderid", "|").split('|');
  //   setMetadataValue(p, "nurims.entity.doseproviderid", `${id[0]}|${e.target.value}`);
  //   this.setState({measurements: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  handleDosimeterIdChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleDosimeterIdChange", "target.value", e.target.value);
    }
    const p = this.state.measurements;
    const id = getRecordMetadataValue(p, "nurims.entity.doseproviderid", "|").split('|');
    setMetadataValue(p, "nurims.entity.doseproviderid", `${id[0]}|${e.target.value}`);
    this.setState({measurements: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleDoseUnitsChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleDoseUnitsChange", "target.value", e.target.value);
    }
    const selection = this.state.selection;
    selection[NURIMS_DOSIMETRY_UNITS] = e.target.value;
    this.setState({selection: selection, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  // handleExtremityUnitsChange = (e) => {
  //   const p = this.state.measurements;
  //   setMetadataValue(p, "nurims.dosimeter.units", e.target.value);
  //   this.setState({measurements: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleWristUnitsChange = (e) => {
  //   const p = this.state.measurements;
  //   setMetadataValue(p, "nurims.dosimeter.units", e.target.value);
  //   this.setState({measurements: p, has_changed: true})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  handleDateRangeChange = (range) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleDateRangeChange", "range", range);
    }
    const p = this.state.measurements;
    // const dosimeterId = getDoseRecordDosimeterId(p, "WholeBody", "");
    // setDoseRecordMetadataValue(p, dosimeterId, "WholeBody", "nurims.dosimeter.monitorperiod", `${range[0].toISOString().substring(0, 10)}|${range[1].toISOString().substring(0, 10)}`);
    // this.setState({measurements: p, has_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    if (this.ref.current) {
      this.ref.current.setRecords(getRecordMetadataValue(record, NURIMS_DOSIMETRY_MEASUREMENTS, []));
    }
    this.setState({measurements: record, selection: {}});
    this.props.onChange(false);
  }

  onMeasurementSelection = (item) => {
    this.setState({selection: item, readonly: true})
  }

  render() {
    const {properties, busy, data_changed, selection, readonly} = this.state;
    const monitorPeriod = getMonitorPeriod(selection, NURIMS_DOSIMETRY_MONITOR_PERIOD, [null, null]);
    // const doseProviderId = getRecordMetadataValue(measurements, "nurims.entity.doseproviderid", "|").split('|');
    // const wholeBodyMonitor = getRecordMetadataValue(measurements, "nurims.entity.iswholebodymonitored", "false");
    // const extremityMonitor = getRecordMetadataValue(measurements, "nurims.entity.isextremitymonitored", "false");
    // const wristMonitor = getRecordMetadataValue(measurements, "nurims.entity.iswristmonitored", "false");
    const defaultUnits = getPropertyValue(properties, "nurims.dosimetry.units", "");
    const dosimetryType = selection.hasOwnProperty(NURIMS_DOSIMETRY_TYPE) ? selection[NURIMS_DOSIMETRY_TYPE] : "";
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "dosimetryType", dosimetryType);
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
        <Grid container spacing={2}>
          <Grid item xs={3} style={{paddingRight: 0}}>
            <DosimetryMeasurementsList
              ref={this.ref}
              rowsPerPage={15}
              onListItemSelection={this.onMeasurementSelection}
              title={"Measurements"}
              enableRecordArchiveSwitch={false}
              cells={[
              {
                id: NURIMS_DOSIMETRY_BATCH_ID,
                align: 'left',
                disablePadding: true,
                label: 'Name',
                width: '90%',
                sortField: true,
              }]}
            />
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={3} style={{paddingTop: 0}}>
                        <Box sx={{'& .MuiTextField-root': {m: 1, width: '100%'}}}>
                          <TextField
                            id="batch-id"
                            label="Batch ID"
                            value={selection.hasOwnProperty(NURIMS_DOSIMETRY_BATCH_ID) ? selection[NURIMS_DOSIMETRY_BATCH_ID] : ""}
                            onChange={this.handleChange}
                            disabled={readonly}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={2} style={{paddingTop: 0}}>
                        <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                          <TextField
                            id="dose-provider-id"
                            label="Dose Provider ID"
                            value={"123"}
                            onChange={this.handleDoseProviderIdChange}
                            disabled={readonly}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={2} style={{paddingTop: 0}}>
                        <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                          <TextField
                            id="card-id"
                            label="Dosimeter ID"
                            value={selection.hasOwnProperty(NURIMS_DOSIMETRY_ID) ? selection[NURIMS_DOSIMETRY_ID] : ""}
                            onChange={this.handleDosimeterIdChange}
                            disabled={readonly}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={5} style={{paddingTop: 0}}>
                        <DateRangePicker
                          startText="Wear Start"
                          endText="Wear End"
                          from={dayjs()}
                          to={dayjs().add(1, "month")}
                          value={monitorPeriod}
                          inputFormat={'yyyy-MM-dd'}
                          disabled={readonly}
                          onChange={this.handleDateRangeChange}
                          renderInput={(startProps, endProps) => (
                            <React.Fragment>
                              <TextField {...startProps}/>
                              <Box sx={{mx: 1}}>to</Box>
                              <TextField {...endProps}/>
                            </React.Fragment>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4} style={{paddingRight: 0}}>
                <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
                  <CardContent>
                    <FormControlLabel
                      control={
                      <Checkbox
                        id={"whole-body-record"}
                        checked={dosimetryType === "wholebody"}
                        onChange={this.handleChange}
                      />
                    }
                      label="Whole Body Data"
                    />
                    <Box sx={{'& .MuiTextField-root': {m: 1, width: '15ch'}}}>
                      <TextField
                        required
                        disabled={dosimetryType !== "wholebody"}
                        id="shallow-dose"
                        label="Shallow Dose"
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_SHALLOW_DOSE) ? selection[NURIMS_DOSIMETRY_SHALLOW_DOSE] : "0"}
                        onChange={this.handleChange}
                      />
                      <TextField
                        required
                        disabled={dosimetryType !== "wholebody"}
                        id="deep-dose"
                        label="Deep Dose"
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_DEEP_DOSE) ? selection[NURIMS_DOSIMETRY_DEEP_DOSE] : "0"}
                        onChange={this.handleChange}
                      />
                      <FormControl sx={{m: 1, minWidth: 250}}>
                        <InputLabel id="dose-units">Dose Units</InputLabel>
                        <Select
                          labelId="dose-units"
                          id="dose-units"
                          disabled={dosimetryType !== "wholebody"}
                          value={selection.hasOwnProperty(NURIMS_DOSIMETRY_UNITS) ? selection[NURIMS_DOSIMETRY_UNITS] : defaultUnits}
                          label="Dose Units"
                          onChange={this.handleDoseUnitsChange}
                        >
                          <MenuItem value={"mr"}>Milli Rems</MenuItem>
                          <MenuItem value={"msv"}>Milli Sieverts</MenuItem>
                          <MenuItem value={"usv"}>Micro Sieverts</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4} style={{paddingRight: 0}}>
                <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id={"extremity-record"}
                          checked={dosimetryType === "extremity"}
                          onChange={this.handleChange}
                        />
                      }
                      label="Extremity Data"
                    />
                    <Box sx={{'& .MuiTextField-root': {m: 1, width: '15ch'}}}>
                      <TextField
                        required
                        disabled={dosimetryType !== "extremity"}
                        id="extremity-dose"
                        label="Extremity Dose"
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_EXTREMITY_DOSE) ? selection[NURIMS_DOSIMETRY_EXTREMITY_DOSE] : "0"}
                        onChange={this.handleChange}
                      />
                    </Box>
                    <FormControl sx={{m: 1, minWidth: 250}}>
                      <InputLabel id="extremity-doseunits">Dose Units</InputLabel>
                      <Select
                        labelId="extremity-doseunits"
                        id="extremity-doseunits"
                        disabled={dosimetryType !== "extremity"}
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_UNITS) ? selection[NURIMS_DOSIMETRY_UNITS] : defaultUnits}
                        label="Dose Units"
                        onChange={this.handleDoseUnitsChange}
                      >
                        <MenuItem value={"mr"}>Milli Rems</MenuItem>
                        <MenuItem value={"msv"}>Milli Sieverts</MenuItem>
                        <MenuItem value={"usv"}>Micro Sieverts</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4} style={{paddingRight: 0}}>
                <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id={"wrist-record"}
                          checked={dosimetryType === "wrist"}
                          onChange={this.handleChange}
                        />
                      }
                      label="Wrist Data"
                    />
                    <Box sx={{'& .MuiTextField-root': {m: 1, width: '15ch'}}}>
                      <TextField
                        required
                        disabled={dosimetryType !== "wrist"}
                        id="wrist-dose"
                        label="Wrist Dose"
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_WRIST_DOSE) ? selection[NURIMS_DOSIMETRY_WRIST_DOSE] : "0"}
                        onChange={this.handleChange}
                      />
                    </Box>
                    <FormControl sx={{m: 1, minWidth: 250}}>
                      <InputLabel id="wrist-doseunits">Dose Units</InputLabel>
                      <Select
                        labelId="wrist-doseunits"
                        id="wrist-doseunits"
                        disabled={dosimetryType !== "wrist"}
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_UNITS) ? selection[NURIMS_DOSIMETRY_UNITS] : defaultUnits}
                        label="Dose Units"
                        onChange={this.handleDoseUnitsChange}
                      >
                        <MenuItem value={"mr"}>Milli Rems</MenuItem>
                        <MenuItem value={"msv"}>Milli Sieverts</MenuItem>
                        <MenuItem value={"usv"}>Micro Sieverts</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

DosimetryMeasurementMetadata.defaultProps = {
  onChange: (msg) => {
  },
};

export default DosimetryMeasurementMetadata;