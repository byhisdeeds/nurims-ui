import React, {Component} from 'react';
import {
  Box,
  Card,
  CardContent, CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
// import "leaflet/dist/leaflet.css";
import {
  getDateFromDateString,
  getRecordMetadataValue,
  setMetadataValue,
} from "../../utils/MetadataUtils";
import {
  getPropertyAsArray,
  getPropertyAsMenuitems,
  getPropertyValue,
} from "../../utils/PropertyUtils";
import {
  NURIMS_DESCRIPTION,
  NURIMS_TITLE,
  NURIMS_SSC_TYPE,
  NURIMS_SSC_CLASSIFICATION,
  NURIMS_SSC_SAFETY_FUNCTION,
  NURIMS_SSC_SAFETY_CATEGORY,
  NURIMS_SSC_SURVEILLANCE_FREQUENCY,
  NURIMS_SSC_COMMISSIONING_DATE,
  NURIMS_SSC_ID,
  NURIMS_SSC_MAINTAINABILITY,
  NURIMS_SURVEILLANCE_FREQUENCY,
  NURIMS_SSC_MAINTENANCE_TASK,
  NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA,
  NURIMS_SSC_MAINTENANCE_SCOPE, NURIMS_MATERIAL_TYPE, NURIMS_SSC_FUNCTION,
} from "../../utils/constants";
import {
  HtmlTooltip,
  TooltipText
} from "../../utils/TooltipUtils";
import {
  getGlossaryValue
} from "../../utils/GlossaryUtils";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import EditableTable from "../../components/EditableTable";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  DatePickerWithTooltip, SelectFormControlWithTooltip, TextFieldWithTooltip
} from "../../components/CommonComponents";

export const SSCMETADATA_REF = "SSCMetadata";

class SSCMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      ssc: {},
      properties: props.properties,
    };
    this.module = SSCMETADATA_REF;
    this.ref = React.createRef();
    this.glossary = {};
    this.sscSurveillanceData = [];
    this.sscSurveillanceFields = [
      {
        label: "Scope",
        name: NURIMS_SSC_MAINTENANCE_TASK,
        width: '20ch',
        align: 'center',
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Acceptance",
        name: NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA,
        width: '20ch',
        align: 'center',
        validation: e => {
          return true;
        },
        error: "Haha"
      },
      {
        label: "Frequency",
        name: NURIMS_SSC_SURVEILLANCE_FREQUENCY,
        type: "select",
        width: '16ch',
        align: 'center',
        options: [],
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
    ];
    getPropertyValue(props.properties, NURIMS_SURVEILLANCE_FREQUENCY, "").split('|').map((n) => {
      const t = n.split(',');
      if (t.length === 2) {
        return this.sscSurveillanceFields[2].options.push({ label: t[1], value: t[0] });
      }
    })
  }

  setGlossaryTerms = (terms) => {
    // console.log("SSCMetadata.setGlossaryTerms", terms)
    for (const term of terms) {
      this.glossary[term.name] = term.value;
    }
  }

  handleChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.module, "handleChange", "id", e.target.id, "value", e.target.value);
    }
    // console.log(">>>", e.target.id)
    const ssc = this.state.ssc;
    const id = e.target.id === undefined ? e.target.name : e.target.id;
    if (id === "name") {
      ssc["changed"] = true;
      ssc[NURIMS_TITLE] = e.target.value;
    } else if (id === "description") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_DESCRIPTION, e.target.value)
    } else if (id === "ssc-id") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_ID, e.target.value);
    } else if (id === "type") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_TYPE, e.target.value);
    } else if (id === "classification") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, e.target.value);
    } else if (id === "function") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_FUNCTION, e.target.value);
    } else if (id === "safety-category") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, e.target.value);
    } else if (id === "reactor-safety-function") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, e.target.value);
    } else if (id === "maintainability") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_MAINTAINABILITY, e.target.value);
    }
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleCommissioningDateChange = (date) => {
    if (this.context.debug) {
      ConsoleLog(this.module, "handleCommissioningDateChange", "date", date);
    }
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_COMMISSIONING_DATE, date.toISOString().substring(0,10))
    this.setState({ssc: ssc})
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.module, "setRecordMetadata", "record", record);
    }
    if (this.ref.current) {
      this.ref.current.setRowData(getRecordMetadataValue(record, NURIMS_SSC_MAINTENANCE_SCOPE, []), true);
    }
    this.setState({ssc: record})
    this.props.onChange(false);
  }

  getRecordMetadata = () => {
    return this.state.ssc;
  }

  // handleSSCTypeChange = (e) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.module, "handleSSCTypeChange", "value", e.target.value, "id", e.target.id, e.target.name);
  //   }
  //   const ssc = this.state.ssc;
  //   setMetadataValue(ssc, NURIMS_SSC_TYPE, e.target.value);
  //   ssc.changed = true;
  //   this.setState({ssc: ssc})
  //   // signal to parent that metadata has changed
  //   this.props.onChange(true);
  // }

  // handleSSCClassificationChange = (e) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.module, "handleSSCClassificationChange", "value", e.target.value);
  //   }
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleSSCFunctionChange = (e) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.module, "handleSSCFunctionChange", "value", e.target.value);
  //   }
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_FUNCTION, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleSSCSafetyFunctionChange = (e) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.module, "handleSSCSafetyFunctionChange", "value", e.target.value);
  //   }
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleSSCMaintainabilityChange = (e) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.module, "handleSSCMaintainabilityChange", "value", e.target.value);
  //   }
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_MAINTAINABILITY, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleSSCSafetyCategoryChange = (e) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.module, "handleSSCSafetyCategoryChange", "value", e.target.value);
  //   }
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleSSCSurveillanceFrequencyChange = (e) => {
  //   console.log("handleSSCSurveillanceFrequencyChange", e.target.value);
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_SURVEILLANCE_FREQUENCY, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  saveTableData = data => {
    console.log("UPDATED SURVEILLANCE TABLE DATA", data);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_MAINTENANCE_SCOPE, data);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  };

  render() {
    const {ssc, properties} = this.state;
    const disabled = Object.entries(ssc).length === 0;
    if (this.context.debug) {
      ConsoleLog(this.module, "render", "ssc", ssc);
    }
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '100%'},
        }}
        noValidate
        autoComplete="off"
      >
        <Card variant={"outlined"} style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardHeader title={"Basic Details"} titleTypographyProps={{fontSize: "1.5em"}} sx={{pt: 1, pl: 3, pb: 0}}/>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextFieldWithTooltip
                  id={"name"}
                  label={"Name"}
                  required={true}
                  value={ssc.hasOwnProperty(NURIMS_TITLE) ? ssc[NURIMS_TITLE] : ""}
                  onChange={this.handleChange}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_TITLE, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextFieldWithTooltip
                  id={"description"}
                  label="Description"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_DESCRIPTION, "")}
                  onChange={this.handleChange}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextFieldWithTooltip
                  id={"id"}
                  label="ID"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_ID, "")}
                  onChange={this.handleChange}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_ID, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePickerWithTooltip
                  padding={8}
                  width={"25ch"}
                  label="Commissioning Date"
                  value={getDateFromDateString(getRecordMetadataValue(ssc, NURIMS_SSC_COMMISSIONING_DATE,
                    "1970-01-01"), null)}
                  onChange={this.handleCommissioningDateChange}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_COMMISSIONING_DATE, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"type"}
                  label="Type"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_TYPE, "")}
                  onChange={this.handleChange}
                  options={["structure,Structure", "system,System", "component,Component"]}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_TYPE, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"classification"}
                  label="Classification"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, [])}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_CLASSIFICATION, [])}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_CLASSIFICATION, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"function"}
                  label="Function Related To"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_FUNCTION, [])}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_FUNCTION, [])}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_FUNCTION, "")}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardHeader title={"Reactor Safety"} titleTypographyProps={{fontSize: "1.5em"}} sx={{pt: 1, pl: 3, pb: 0}}/>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"safety-category"}
                  label="Reactor Safety Category"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, "")}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_SAFETY_CATEGORY, [])}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_SAFETY_CATEGORY, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"reactor-safety-function"}
                  label="Reactor Safety Function"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, "")}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_SAFETY_FUNCTION, [])}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_SAFETY_FUNCTION, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"maintainability"}
                  label="Maintainability"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_MAINTAINABILITY, "")}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_MAINTAINABILITY, [])}
                  disabled={disabled}
                  tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_MAINTAINABILITY, "")}
                />
              </Grid>
              {/*<Grid item xs={12} sm={12}>*/}
              {/*  <EditableTable*/}
              {/*    disable={disabled}*/}
              {/*    ref={this.ref}*/}
              {/*    addRowBtnText={"Add Surveillance"}*/}
              {/*    initWithoutHead={false}*/}
              {/*    defaultData={this.sscSurveillanceData}*/}
              {/*    getData={this.saveTableData}*/}
              {/*    fieldsArr={this.sscSurveillanceFields}*/}
              {/*  />*/}
              {/*</Grid>*/}
            </Grid>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardHeader title={"Operations"} titleTypographyProps={{fontSize: "1.5em"}} sx={{pt: 1, pl: 3, pb: 0}}/>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_TITLE, "")} />
                  }
                >
                  <TextField
                    required
                    id="name"
                    label="Name"
                    value={ssc.hasOwnProperty(NURIMS_TITLE) ? ssc[NURIMS_TITLE] : ""}
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")} />
                  }
                >
                  <TextField
                    id="description"
                    label="SSC Description"
                    value={getRecordMetadataValue(ssc, NURIMS_DESCRIPTION, "")}
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_ID, "")} />
                  }
                >
                  <TextField
                    id="ssc-id"
                    label="SSC ID"
                    value={getRecordMetadataValue(ssc, NURIMS_SSC_ID, "")}
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="SSC Commissioning Date"
                    inputFormat={"yyyy-MM-dd"}
                    value={getDateFromDateString(getRecordMetadataValue(ssc, NURIMS_SSC_COMMISSIONING_DATE, "1970-01-01"), null)}
                    onChange={this.handleCommissioningDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_TYPE, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 0, width: '100%'}}>
                    <InputLabel id="type">SSC Type</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="type"
                      label="SSC Type"
                      id="type"
                      value={getRecordMetadataValue(ssc, NURIMS_SSC_TYPE, "")}
                      onChange={this.handleSSCTypeChange}
                    >
                      <MenuItem value='structure'>Structure</MenuItem>
                      <MenuItem value='system'>System</MenuItem>
                      <MenuItem value='component'>Component</MenuItem>
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardHeader title={"Surveillance"} titleTypographyProps={{fontSize: "1.5em"}} sx={{pt: 1, pl: 3, pb: 0}}/>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <EditableTable
                  disable={disabled}
                  ref={this.ref}
                  addRowBtnText={"Add Surveillance"}
                  initWithoutHead={false}
                  defaultData={this.sscSurveillanceData}
                  getData={this.saveTableData}
                  fieldsArr={this.sscSurveillanceFields}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")} />
                  }
                >
                  <TextField
                    id="description"
                    label="SSC Description"
                    value={getRecordMetadataValue(ssc, NURIMS_DESCRIPTION, "")}
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_ID, "")} />
                  }
                >
                  <TextField
                    id="ssc-id"
                    label="SSC ID"
                    value={getRecordMetadataValue(ssc, NURIMS_SSC_ID, "")}
                    onChange={this.handleChange}
                  />
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="SSC Commissioning Date"
                    inputFormat={"yyyy-MM-dd"}
                    value={getDateFromDateString(getRecordMetadataValue(ssc, NURIMS_SSC_COMMISSIONING_DATE, "1970-01-01"), null)}
                    onChange={this.handleCommissioningDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_TYPE, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 0, width: '100%'}}>
                    <InputLabel id="type">SSC Type</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="type"
                      label="SSC Type"
                      id="type"
                      value={getRecordMetadataValue(ssc, NURIMS_SSC_TYPE, "")}
                      onChange={this.handleSSCTypeChange}
                    >
                      <MenuItem value='structure'>Structure</MenuItem>
                      <MenuItem value='system'>System</MenuItem>
                      <MenuItem value='component'>Component</MenuItem>
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

SSCMetadata.defaultProps = {
  onChange: (msg) => {
  },
};

export default SSCMetadata;