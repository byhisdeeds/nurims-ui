import React, {Component} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Card, CardContent, FormControl, Grid, InputLabel, Select, Tooltip, Typography} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateRangePicker from '@mui/lab/DateRangePicker';
import {
  getRecordMetadataValue,
  setMetadataValue,
  getDoseRecordDosimeterId,
  setDoseRecordMetadataValue,
  getDateRangeFromDateString
} from "../../utils/MetadataUtils";
import {
  getPropertyValue,
} from "../../utils/PropertyUtils";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
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
import DosimetryMeasurementsList from "../../components/DosimetryMeasurementsList";


function getMonitorPeriod(selection, field, missingValue) {
  const period = selection.hasOwnProperty(field) ? selection[field] : "1900-01-01 to 1900-01-01";
  return getDateRangeFromDateString(period.replaceAll(" to ", "|"), missingValue);
}

class DosimetryMeasurementMetadata extends Component {
  static contextType = UserDebugContext;

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
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "handleChange", "target.value", e.target.value);
    }
    const selection = this.state.selection;
    if (e.target.id === "card-id") {
      selection[NURIMS_DOSIMETRY_ID] = e.target.value;
    } else if (e.target.id === "batch-id") {
      selection[NURIMS_DOSIMETRY_BATCH_ID] = e.target.value;
    } else if (e.target.id === "extremity-batchid") {
      const value = getDoseRecordDosimeterId(selection, "Extremity", "");
      setDoseRecordMetadataValue(selection, value, "Extremity", "nurims.dosimeter.batchid", e.target.value);
    } else if (e.target.id === "wrist-batchid") {
      const value = getDoseRecordDosimeterId(selection, "Wrist", "");
      setDoseRecordMetadataValue(selection, value, "Wrist", "nurims.dosimeter.batchid", e.target.value);
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
    if (this.context.debug > 5) {
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
  //   if (this.context.debug > 5) {
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
    if (this.context.debug > 5) {
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
    if (this.context.debug > 5) {
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
    if (this.context.debug > 5) {
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
    if (this.context.debug > 5) {
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
    const dosimetryType = selection.hasOwnProperty(NURIMS_DOSIMETRY_TYPE) ? selection[NURIMS_DOSIMETRY_TYPE] : "wholebody";
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '25ch'},
        }}
        noValidate
        autoComplete="off"
      >
        <Grid container spacing={0}>
          <Grid item xs={2} style={{paddingTop: 0, paddingRight: 2}}>
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
          <Grid item xs={10} style={{paddingTop: 0}}>
            <div>
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
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateRangePicker
                          startText="Wear Start"
                          endText="Wear End"
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
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              {dosimetryType === "wholebody" &&
                <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
                  <CardContent>
                    <Typography sx={{fontSize: 14, paddingLeft: 1}} color="text.secondary" gutterBottom>
                      Whole Body Data
                    </Typography>
                    <Box sx={{'& .MuiTextField-root': {m: 1, width: '15ch'}}}>
                      <FormControl sx={{m: 1, minWidth: 250}}>
                        <InputLabel id="dose-units">Dose Units</InputLabel>
                        <Select
                          labelId="dose-units"
                          id="dose-units"
                          value={selection.hasOwnProperty(NURIMS_DOSIMETRY_UNITS) ? selection[NURIMS_DOSIMETRY_UNITS] : defaultUnits}
                          label="Dose Units"
                          onChange={this.handleDoseUnitsChange}
                        >
                          <MenuItem value={"mr"}>Milli Rems</MenuItem>
                          <MenuItem value={"msv"}>Milli Sieverts</MenuItem>
                          <MenuItem value={"usv"}>Micro Sieverts</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        required
                        id="shallow-dose"
                        label="Shallow Dose"
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_SHALLOW_DOSE) ? selection[NURIMS_DOSIMETRY_SHALLOW_DOSE] : "0"}
                        onChange={this.handleChange}
                      />
                      <TextField
                        required
                        id="deep-dose"
                        label="Deep Dose"
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_DEEP_DOSE) ? selection[NURIMS_DOSIMETRY_DEEP_DOSE] : "0"}
                        onChange={this.handleChange}
                      />
                    </Box>
                  </CardContent>
                </Card>
              }
              {dosimetryType === "extremity" &&
                <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
                  <CardContent>
                    <Typography sx={{fontSize: 14, paddingLeft: 1}} color="text.secondary" gutterBottom>
                      Extremity Data
                    </Typography>
                    <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                      <TextField
                        required
                        id="extremity-dose"
                        label="Extremity Dose"
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_DEEP_DOSE) ? selection[NURIMS_DOSIMETRY_DEEP_DOSE] : "0"}
                        onChange={this.handleChange}
                      />
                    </Box>
                    <FormControl sx={{m: 1, minWidth: 250}}>
                      <InputLabel id="extremity-doseunits">Dose Units</InputLabel>
                      <Select
                        labelId="extremity-doseunits"
                        id="extremity-doseunits"
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
              }
              {dosimetryType === "wrist" &&
                <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
                  <CardContent>
                    <Typography sx={{fontSize: 14, paddingLeft: 1}} color="text.secondary" gutterBottom>
                      Wrist Data
                    </Typography>
                    <Box sx={{'& .MuiTextField-root': {m: 1, width: '12ch'}}}>
                      <TextField
                        required
                        id="wrist-dose"
                        label="Wrist Dose"
                        value={selection.hasOwnProperty(NURIMS_DOSIMETRY_DEEP_DOSE) ? selection[NURIMS_DOSIMETRY_DEEP_DOSE] : "0"}
                        onChange={this.handleChange}
                      />
                    </Box>
                    <FormControl sx={{m: 1, minWidth: 250}}>
                      <InputLabel id="wrist-doseunits">Dose Units</InputLabel>
                      <Select
                        labelId="wrist-doseunits"
                        id="wrist-doseunits"
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
              }
            </div>
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