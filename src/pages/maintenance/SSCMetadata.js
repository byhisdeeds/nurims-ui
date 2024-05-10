import React, {Component} from 'react';
import {
  Box,
  Card,
  CardContent, CardHeader,
  Grid,
} from "@mui/material";
import {
  getDateFromDateString,
  getRecordMetadataValue,
  setMetadataValue,
  getGlossaryValue
} from "../../utils/MetadataUtils";
import {
  getPropertyAsArray,
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
  NURIMS_SSC_FUNCTION,
  NURIMS_SSC_REACTOR_SAFETY_CATEGORY,
  NURIMS_SSC_REACTOR_SAFETY_FUNCTION,
} from "../../utils/constants";
import EditableTable from "../../components/EditableTable";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  DatePickerWithTooltip,
  SelectFormControlWithTooltip,
  TextFieldWithTooltip
} from "../../components/CommonComponents";

export const SSCMETADATA_REF = "SSCMetadata";

class SSCMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      ssc: {},
    };
    this.module = SSCMETADATA_REF;
    this.ref = React.createRef();
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

  handleChange = (e) => {
    // console.log(">>>", e.target.id)
    const ssc = this.state.ssc;
    const id = e.target.id === undefined ? e.target.name : e.target.id;
    if (this.context.debug) {
      ConsoleLog(this.module, "handleChange", "id", id, "value", e.target.value);
    }
    if (id === "name") {
      ssc["changed"] = true;
      ssc[NURIMS_TITLE] = e.target.value;
    } else if (id === "description") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_DESCRIPTION, e.target.value)
    } else if (id === "id") {
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
    } else if (id === "reactor-safety-category") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_REACTOR_SAFETY_CATEGORY, e.target.value);
    } else if (id === "safety-category") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, e.target.value);
    } else if (id === "reactor-safety-function") {
      ssc["changed"] = true;
      setMetadataValue(ssc, NURIMS_SSC_REACTOR_SAFETY_FUNCTION, e.target.value);
    } else if (id === "safety-function") {
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
    const {ssc} = this.state;
    const {properties, glossary} = this.props;
    const disabled = Object.entries(ssc).length === 0;
    const ssc_function = getRecordMetadataValue(ssc, NURIMS_SSC_FUNCTION, "");
    const no_reactor_safety_functions = disabled || ssc_function !== "reactor_safety";
    const no_operations_functions = disabled || ssc_function !== "operations";
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
                  tooltip={getGlossaryValue(glossary, NURIMS_TITLE, "")}
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
                  tooltip={getGlossaryValue(glossary, NURIMS_DESCRIPTION, "")}
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
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_ID, "")}
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
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_COMMISSIONING_DATE, "")}
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
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_TYPE, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"classification"}
                  label="Classification"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, "")}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_CLASSIFICATION, [])}
                  disabled={disabled}
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_CLASSIFICATION, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"function"}
                  label="Function Related To"
                  required={true}
                  value={ssc_function}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_FUNCTION, [])}
                  disabled={disabled}
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_FUNCTION, "")}
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
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_MAINTAINABILITY, "")}
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
                  id={"reactor-safety-category"}
                  label="Reactor Safety Category"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_REACTOR_SAFETY_CATEGORY, "")}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_REACTOR_SAFETY_CATEGORY, [])}
                  disabled={no_reactor_safety_functions}
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_REACTOR_SAFETY_CATEGORY, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"reactor-safety-function"}
                  label="Reactor Safety Function"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_REACTOR_SAFETY_FUNCTION, "")}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_REACTOR_SAFETY_FUNCTION, [])}
                  disabled={no_reactor_safety_functions}
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_REACTOR_SAFETY_FUNCTION, "")}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardHeader title={"Operations"} titleTypographyProps={{fontSize: "1.5em"}} sx={{pt: 1, pl: 3, pb: 0}}/>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"safety-category"}
                  label="Safety Category"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, "")}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_SAFETY_CATEGORY, [])}
                  disabled={no_operations_functions}
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_SAFETY_CATEGORY, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"safety-function"}
                  label="Safety Function"
                  required={true}
                  value={getRecordMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, "")}
                  onChange={this.handleChange}
                  options={getPropertyAsArray(properties, NURIMS_SSC_SAFETY_FUNCTION, [])}
                  disabled={no_operations_functions}
                  tooltip={getGlossaryValue(glossary, NURIMS_SSC_SAFETY_FUNCTION, "")}
                />
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