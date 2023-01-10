import React, {Component} from 'react';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  Select,
} from "@mui/material";
import {
  CMD_SUGGEST_ANALYSIS_JOBS,
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB,
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER,
  NURIMS_OPERATION_DATA_IRRADIATIONDURATION, NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES,
  NURIMS_OPERATION_DATA_NEUTRONFLUX,
  NURIMS_TITLE
} from "../../../utils/constants";
import {
  AutoCompleteComponent,
  SelectFormControlWithTooltip,
  TextFieldWithTooltip
} from "../../../components/CommonComponents";
import {ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF} from "./AddEditReactorSampleIrradiationAuthorization";
import {
  analysisJobAsObject,
  getRecordData,
  setRecordData
} from "../../../utils/MetadataUtils";
import {getGlossaryValue} from "../../../utils/GlossaryUtils";
import {ConsoleLog, UserDebugContext} from "../../../utils/UserDebugContext";
import {isValidUserRole} from "../../../utils/UserUtils";


class ReactorSampleIrradiationAuthorizationMetadata extends Component {
  static contextType = UserDebugContext;
  constructor(props) {
    super(props);
    this.state = {
      record: {},
      properties: props.properties,
      jobs: [],
      selected_job: {},
      ac_open: false,
      searching: false,
      busy: false,
    };
    this.glossary = {};
    this.sampleTypes = [];
    this.timeout = null;
    this.Module = "ReactorSampleIrradiationAuthorizationMetadata";
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }

  setGlossaryTerms = (terms) => {
    // console.log("AMPMetadata.setGlossaryTerms", terms)
    for (const term of terms) {
      this.glossary[term.name] = term.value;
    }
    this.forceUpdate();
  }

  setSampleTypes = (types) => {
    for (const t of types) {
      this.sampleTypes.push({id: t.name, title: t.name});
    }
    this.forceUpdate();
  }

  setRecordMetadata = (record) => {
    console.log("ReactorSampleIrradiationAuthorizationMetadata.setRecordMetadata", record)
    this.setState({record: record})
    this.props.onChange(false);
  }

  getRecordMetadata = () => {
    return this.state.record;
  }

  onAutocompleteOpen = () => {
    this.setState({ac_open: true});
  };

  onAutocompleteClose = () => {
    this.setState({ac_open: false});
  };

  onAnalysisJobChange = (event) => {
    const value = event.target.value;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.send({
        cmd: CMD_SUGGEST_ANALYSIS_JOBS,
        name: value,
        module: ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF,
      });
    }, 1000);
    const record = this.state.record;
    const job = getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB, {name:""});
    job.name = event.target.value
    setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB, job);

    this.setState({searching: true, record: record});
  };

  onAnalysisJobSelected = (event, value) => {
    clearTimeout(this.timeout);
    this.timeout = null;
    const record = this.state.record;
    setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB, typeof value == "string" ? analysisJobAsObject(value) : value);
    this.setState({record: record});
  };

  updateAnalysisJobs = (jobs) => {
    this.setState({jobs: jobs, searching: false});
  }

  getJobLabel = (job) => {
    return typeof job === "object" ? job.hasOwnProperty('name') ? job.name : '' : job;
  };

  handleChange = (e) => {
    const id = e.target.id || e.target.name || ""
    console.log(">>>", e.target.id, e.target.name, id, e.target.value)
    const record = this.state.record;
    if (id === "flux") {
      setRecordData(record, NURIMS_OPERATION_DATA_NEUTRONFLUX, e.target.value);
    } else if (id === "samples") {
      setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, e.target.value.replaceAll("\n", ","));
    } else if (id === "duration") {
      setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONDURATION, e.target.value);
    } else if (id === "sample-type") {
      setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES, e.target.value);
    } else if (id === "authorized-by") {
      setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER, e.target.value);
    }
    this.setState({record: record})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  render() {
    const {record, properties, selected_job, jobs, searching, busy, ac_open} = this.state;
    const disabled = Object.entries(record).length === 0;
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "render", "disabled", disabled, "record", record, "selected_job", selected_job);
    }
    const can_authorize = isValidUserRole(this.context.user, "irradiation_authorizer");
    const authorizer=[{
      id: can_authorize ? this.context.user.profile.username : "none",
      title: can_authorize ? this.context.user.profile.username : "Not authorized to approve request",
      disabled: !can_authorize}];
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
              <Grid item xs={12} sm={3}>
                <TextFieldWithTooltip
                  id={"record"}
                  label="Record"
                  value={getRecordData(record, NURIMS_TITLE, "")}
                  readOnly={true}
                  tooltip={"Authorisation record identifier."}
                  // tooltip={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <AutoCompleteComponent
                  defaultValue={getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB, {name: "abc"})}
                  freeInput={true}
                  label={"Analysis Job"}
                  isOpen={ac_open}
                  onOpen={this.onAutocompleteOpen}
                  onClose={this.onAutocompleteClose}
                  disabled={false}
                  getOptionLabel={this.getJobLabel}
                  options={jobs}
                  loading={searching}
                  onSelected={this.onAnalysisJobSelected}
                  onChange={this.onAnalysisJobChange}
                  busy={busy}
                  padding={0}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextFieldWithTooltip
                  id={"flux"}
                  label="Neutron Flux"
                  value={getRecordData(record, NURIMS_OPERATION_DATA_NEUTRONFLUX, "")}
                  onChange={this.handleChange}
                  disabled={disabled}
                  tooltip={"ss"}
                  // tooltip={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextFieldWithTooltip
                  id={"duration"}
                  label="Duration"
                  value={getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONDURATION, "")}
                  onChange={this.handleChange}
                  disabled={disabled}
                  tooltip={"ss"}
                  padding={0}
                  // tooltip={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectFormControlWithTooltip
                  id={"sample-type"}
                  label="Sample Material Type(s)"
                  value={getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES, [])}
                  onChange={this.handleChange}
                  options={this.sampleTypes}
                  disabled={disabled}
                  tooltip={"ss"}
                  multiple={true}
                  // tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_INVENTORY_STATUS, "")}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectFormControlWithTooltip
                  id={"authorized-by"}
                  label="Authorized By"
                  value={getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER, "")}
                  onChange={this.handleChange}
                  options={authorizer}
                  disabled={disabled}
                  tooltip={"ss"}
                  // tooltip={getGlossaryValue(this.glossary, NURIMS_MATERIAL_INVENTORY_STATUS, "")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldWithTooltip
                  id={"samples"}
                  label="Samples To Irradiate"
                  value={getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, "").replaceAll(",", "\n")}
                  onChange={this.handleChange}
                  disabled={disabled}
                  tooltip={"ss"}
                  lines={10}
                  padding={0}
                  // tooltip={getGlossaryValue(this.glossary, NURIMS_DESCRIPTION, "")}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/*<Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>*/}
        {/*  <CardContent>*/}
        {/*    <Grid container spacing={2}>*/}
        {/*      <Grid item xs={12}>*/}
        {/*        <HtmlTooltip*/}
        {/*          placement={'left'}*/}
        {/*          title={*/}
        {/*            <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_MATERIALS, "")} />*/}
        {/*          }*/}
        {/*        >*/}
        {/*          <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>*/}
        {/*            <InputLabel id="ageing-mechanism">SSC Ageing Materials</InputLabel>*/}
        {/*            <Select*/}
        {/*              disabled={disabled}*/}
        {/*              required*/}
        {/*              fullWidth*/}
        {/*              multiple*/}
        {/*              labelId="ageing-materials"*/}
        {/*              label="SSC Ageing Materials"*/}
        {/*              id="ageing-materials"*/}
        {/*              value={getRecordMetadataValue(ssc, NURIMS_AMP_MATERIALS, [])}*/}
        {/*              onChange={this.handleSSCAgingMaterialsChange}*/}
        {/*            >*/}
        {/*              {getPropertyAsMenuitems(properties, NURIMS_AMP_MATERIALS)}*/}
        {/*            </Select>*/}
        {/*          </FormControl>*/}
        {/*        </HtmlTooltip>*/}
        {/*      </Grid>*/}
        {/*      <Grid item xs={12} sm={6}>*/}
        {/*        <HtmlTooltip*/}
        {/*          placement={'left'}*/}
        {/*          title={*/}
        {/*            <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_ACCEPTANCE_CRITERIA, "")} />*/}
        {/*          }*/}
        {/*        >*/}
        {/*          <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>*/}
        {/*            <InputLabel id="acceptance-criteria">Ageing Acceptance Criteria</InputLabel>*/}
        {/*            <Select*/}
        {/*              disabled={disabled}*/}
        {/*              required*/}
        {/*              fullWidth*/}
        {/*              multiple*/}
        {/*              labelId="acceptance-criteria"*/}
        {/*              label="Ageing Acceptance Criteria"*/}
        {/*              id="acceptance-criteria"*/}
        {/*              value={getRecordMetadataValue(ssc, NURIMS_AMP_ACCEPTANCE_CRITERIA, [])}*/}
        {/*              onChange={this.handleSSCAgeingAcceptanceCriteriaChange}*/}
        {/*            >*/}
        {/*              {getPropertyAsMenuitems(properties, NURIMS_AMP_ACCEPTANCE_CRITERIA)}*/}
        {/*            </Select>*/}
        {/*          </FormControl>*/}
        {/*        </HtmlTooltip>*/}
        {/*      </Grid>*/}
        {/*      <Grid item xs={12} sm={6}>*/}
        {/*        <HtmlTooltip*/}
        {/*          placement={'left'}*/}
        {/*          title={*/}
        {/*            <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_MITIGATION_STEPS, "")} />*/}
        {/*          }*/}
        {/*        >*/}
        {/*          <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>*/}
        {/*            <InputLabel id="mitigation-steps">Ageing Mitigation Steps</InputLabel>*/}
        {/*            <Select*/}
        {/*              disabled={disabled}*/}
        {/*              required*/}
        {/*              fullWidth*/}
        {/*              multiple*/}
        {/*              labelId="mitigation-steps"*/}
        {/*              label="Ageing Mitigation Steps"*/}
        {/*              id="mitigation-steps"*/}
        {/*              value={getRecordMetadataValue(ssc, NURIMS_AMP_MITIGATION_STEPS, [])}*/}
        {/*              onChange={this.handleSSCAgeingMitigationStepsChange}*/}
        {/*            >*/}
        {/*              {getPropertyAsMenuitems(properties, NURIMS_AMP_MITIGATION_STEPS)}*/}
        {/*            </Select>*/}
        {/*          </FormControl>*/}
        {/*        </HtmlTooltip>*/}
        {/*      </Grid>*/}
        {/*      <Grid item xs={12} sm={6}>*/}
        {/*        <HtmlTooltip*/}
        {/*          placement={'left'}*/}
        {/*          title={*/}
        {/*            <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SURVEILLANCE_FREQUENCY, "")} />*/}
        {/*          }*/}
        {/*        >*/}
        {/*          <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>*/}
        {/*            <InputLabel id="ageing-surveillance-frequency">Ageing Surveillance Frequency</InputLabel>*/}
        {/*            <Select*/}
        {/*              disabled={disabled}*/}
        {/*              required*/}
        {/*              fullWidth*/}
        {/*              labelId="ageing-surveillance-frequency"*/}
        {/*              label="Ageing Surveillance Frequency"*/}
        {/*              id="ageing-surveillance-frequency"*/}
        {/*              value={getRecordMetadataValue(ssc, NURIMS_AMP_SURVEILLANCE_FREQUENCY, "")}*/}
        {/*              onChange={this.handleSSCAgeingSurveillanceFrequencyChange}*/}
        {/*            >*/}
        {/*              {getPropertyAsMenuitems(properties, NURIMS_SURVEILLANCE_FREQUENCY)}*/}
        {/*            </Select>*/}
        {/*          </FormControl>*/}
        {/*        </HtmlTooltip>*/}
        {/*      </Grid>*/}
        {/*    </Grid>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}
      </Box>
    );
  }
}

ReactorSampleIrradiationAuthorizationMetadata.defaultProps = {
  onChange: (msg) => {
  },
  send: (msg) => {
  },
};

export default ReactorSampleIrradiationAuthorizationMetadata;