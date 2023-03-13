import React, {Component} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  Select
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import "leaflet/dist/leaflet.css";
import {
  getDateFromDateString,
  getRecordMetadataValue,
  setMetadataValue,
} from "../../utils/MetadataUtils";
import {
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
  NURIMS_SSC_MAINTENANCE_SCOPE,
} from "../../utils/constants";
import {HtmlTooltip, TooltipText} from "../../utils/TooltipUtils";
import {getGlossaryValue} from "../../utils/GlossaryUtils";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import EditableTable from "../../components/EditableTable";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";

export const SSCMETADATA_REF = "SSCMetadata";

class SSCMetadata extends Component {
  static contextType = UserDebugContext;

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
    // console.log(">>>", e.target.id)
    const ssc = this.state.ssc;
    if (e.target.id === "name") {
      ssc["changed"] = true;
      ssc[NURIMS_TITLE] = e.target.value;
    } else if (e.target.id === "description") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_DESCRIPTION, e.target.value)
    } else if (e.target.id === "ssc-id") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_ID, e.target.value);
    }
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleCommissioningDateChange = (date) => {
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

  handleSSCTypeChange = (e) => {
    const ssc = this.state.ssc;
    setMetadataValue(ssc, NURIMS_SSC_TYPE, e.target.value);
    ssc.changed = true;
    this.setState({ssc: ssc})
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleSSCClassificationChange = (e) => {
    console.log("handleSSCClassificationChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCSafetyFunctionChange = (e) => {
    console.log("handleSSCSafetyFunctionChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCMaintainabilityChange = (e) => {
    console.log("handleSSCMaintainabilityChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_MAINTAINABILITY, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCSafetyCategoryChange = (e) => {
    console.log("handleSSCSafetyCategoryChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

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
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
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
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_CLASSIFICATION, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="classification">SSC Classification</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      multiple
                      labelId="classification"
                      label="SSC Classification"
                      id="classification"
                      value={getRecordMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, [])}
                      onChange={this.handleSSCClassificationChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_SSC_CLASSIFICATION)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_SAFETY_CATEGORY, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="safety-category">SSC Safety Category</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="safety-category"
                      label="SSC Safety Category"
                      id="safety-category"
                      value={getRecordMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, "")}
                      onChange={this.handleSSCSafetyCategoryChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_SSC_SAFETY_CATEGORY)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_SAFETY_FUNCTION, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="safety-function">SSC Safety Function</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="safety-function"
                      label="SSC Safety Function"
                      id="safety-function"
                      value={getRecordMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, "")}
                      onChange={this.handleSSCSafetyFunctionChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_SSC_SAFETY_FUNCTION)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SSC_MAINTAINABILITY, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="maintainability">SSC Maintainability</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="maintainability"
                      label="SSC Maintainability"
                      id="maintainability"
                      value={getRecordMetadataValue(ssc, NURIMS_SSC_MAINTAINABILITY, "")}
                      onChange={this.handleSSCMaintainabilityChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_SSC_MAINTAINABILITY)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
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
                {/*<HtmlTooltip*/}
                {/*  placement={'left'}*/}
                {/*  title={*/}
                {/*    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SURVEILLANCE_FREQUENCY, "")} />*/}
                {/*  }*/}
                {/*>*/}
                {/*  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>*/}
                {/*    <InputLabel id="maintenance-surveillance">SSC Maintenance Surveillance Frequency</InputLabel>*/}
                {/*    <Select*/}
                {/*      disabled={disabled}*/}
                {/*      required*/}
                {/*      fullWidth*/}
                {/*      labelId="maintenance-surveillance"*/}
                {/*      label="SSC Maintenance Surveillance Frequency"*/}
                {/*      id="maintenance-surveillance"*/}
                {/*      value={getMetadataValue(ssc, NURIMS_SSC_SURVEILLANCE_FREQUENCY, "")}*/}
                {/*      onChange={this.handleSSCSurveillanceFrequencyChange}*/}
                {/*    >*/}
                {/*      {getPropertyAsMenuitems(properties, NURIMS_SURVEILLANCE_FREQUENCY)}*/}
                {/*    </Select>*/}
                {/*  </FormControl>*/}
                {/*</HtmlTooltip>*/}
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