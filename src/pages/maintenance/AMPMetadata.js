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
import "leaflet/dist/leaflet.css";
import {
  getRecordMetadataValue,
  setMetadataValue,
} from "../../utils/MetadataUtils";
import {
  getPropertyAsMenuitems,
  getPropertyValue,
} from "../../utils/PropertyUtils";
import {
  NURIMS_AMP_AGEING_MECHANISM,
  NURIMS_AMP_AGEING_EFFECT,
  NURIMS_AMP_AGEING_DETECTION_METHOD,
  NURIMS_AMP_AGEING_DEGRADATION,
  NURIMS_AMP_MATERIALS,
  NURIMS_AMP_ACCEPTANCE_CRITERIA,
  NURIMS_AMP_MITIGATION_STEPS,
  NURIMS_SURVEILLANCE_FREQUENCY, NURIMS_AMP_SURVEILLANCE_FREQUENCY,
} from "../../utils/constants";
import {HtmlTooltip, TooltipText} from "../../utils/TooltipUtils";
import {getGlossaryValue} from "../../utils/GlossaryUtils";


class AMPMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssc: {},
      properties: props.properties,
    };
    this.glossary = {};
  }

  setGlossaryTerms = (terms) => {
    // console.log("AMPMetadata.setGlossaryTerms", terms)
    for (const term of terms) {
      this.glossary[term.name] = term.value;
    }
    this.forceUpdate();
  }

  setRecordMetadata = (ssc) => {
    console.log("AMPMetadata.setAMPMetadata", ssc)
    // if (ssc.hasOwnProperty("metadata")) {
    //   const metadata = storage.metadata;
    // }
    this.setState({ssc: ssc})
    this.props.onChange(false);
  }

  getRecordMetadata = () => {
    return this.state.ssc;
  }

  handleSSCAgingMechanismChange = (e) => {
    console.log("handleSSCAgingMechanismChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_AMP_AGEING_MECHANISM, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCAgeingEffectChange = (e) => {
    console.log("handleSSCAgeingEffectChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_AMP_AGEING_EFFECT, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCAgeingDetectionMethodChange = (e) => {
    console.log("handleSSCAgeingDetectionMethodChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_AMP_AGEING_DETECTION_METHOD, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCAgeingDegradationChange = (e) => {
    console.log("handleSSCAgeingDegradationChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_AMP_AGEING_DEGRADATION, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCAgingMaterialsChange = (e) => {
    console.log("handleSSCAgingMaterialsChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_AMP_MATERIALS, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCAgeingAcceptanceCriteriaChange = (e) => {
    console.log("handleSSCAgeingAcceptanceCriteriaChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_AMP_ACCEPTANCE_CRITERIA, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCAgeingMitigationStepsChange = (e) => {
    console.log("handleSSCAgeingMitigationStepsChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_AMP_MITIGATION_STEPS, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCAgeingSurveillanceFrequencyChange = (e) => {
    console.log("handleSSCAgeingSurveillanceFrequencyChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_AMP_SURVEILLANCE_FREQUENCY, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  render() {
    const {ssc, properties} = this.state;
    console.log("AMPMetadata.RENDER - ssc", ssc)
    const disabled = Object.entries(ssc).length === 0;

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
              <Grid item xs={12}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_AGEING_MECHANISM, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="ageing-mechanism">SSC Ageing Mechanism</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      multiple
                      labelId="ageing-mechanism"
                      label="SSC Ageing Mechanism"
                      id="ageing-mechanism"
                      value={getRecordMetadataValue(ssc, NURIMS_AMP_AGEING_MECHANISM, [])}
                      onChange={this.handleSSCAgingMechanismChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_AMP_AGEING_MECHANISM)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_AGEING_EFFECT, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="ageing-effect">SSC Ageing Effect</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      multiple
                      labelId="ageing-effect"
                      label="SSC Ageing Effect"
                      id="ageing-effect"
                      value={getRecordMetadataValue(ssc, NURIMS_AMP_AGEING_EFFECT, [])}
                      onChange={this.handleSSCAgeingEffectChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_AMP_AGEING_EFFECT)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_AGEING_DETECTION_METHOD, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="ageing-detection-method">SSC Ageing Detection Method</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      multiple
                      labelId="ageing-detection-method"
                      label="SSC Ageing Detection Method"
                      id="ageing-detection-method"
                      value={getRecordMetadataValue(ssc, NURIMS_AMP_AGEING_DETECTION_METHOD, [])}
                      onChange={this.handleSSCAgeingDetectionMethodChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_AMP_AGEING_DETECTION_METHOD)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_AGEING_DEGRADATION, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="ageing-degradation">SSC Ageing Degradation</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      multiple
                      labelId="ageing-degradation"
                      label="SSC Ageing Degradation"
                      id="ageing-degradation"
                      value={getRecordMetadataValue(ssc, NURIMS_AMP_AGEING_DEGRADATION, [])}
                      onChange={this.handleSSCAgeingDegradationChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_AMP_AGEING_DEGRADATION)}
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
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_MATERIALS, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="ageing-mechanism">SSC Ageing Materials</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      multiple
                      labelId="ageing-materials"
                      label="SSC Ageing Materials"
                      id="ageing-materials"
                      value={getRecordMetadataValue(ssc, NURIMS_AMP_MATERIALS, [])}
                      onChange={this.handleSSCAgingMaterialsChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_AMP_MATERIALS)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_ACCEPTANCE_CRITERIA, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="acceptance-criteria">Ageing Acceptance Criteria</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      multiple
                      labelId="acceptance-criteria"
                      label="Ageing Acceptance Criteria"
                      id="acceptance-criteria"
                      value={getRecordMetadataValue(ssc, NURIMS_AMP_ACCEPTANCE_CRITERIA, [])}
                      onChange={this.handleSSCAgeingAcceptanceCriteriaChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_AMP_ACCEPTANCE_CRITERIA)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_AMP_MITIGATION_STEPS, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="mitigation-steps">Ageing Mitigation Steps</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      multiple
                      labelId="mitigation-steps"
                      label="Ageing Mitigation Steps"
                      id="mitigation-steps"
                      value={getRecordMetadataValue(ssc, NURIMS_AMP_MITIGATION_STEPS, [])}
                      onChange={this.handleSSCAgeingMitigationStepsChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_AMP_MITIGATION_STEPS)}
                    </Select>
                  </FormControl>
                </HtmlTooltip>
              </Grid>
              <Grid item xs={12} sm={6}>
                <HtmlTooltip
                  placement={'left'}
                  title={
                    <TooltipText htmlText={getGlossaryValue(this.glossary, NURIMS_SURVEILLANCE_FREQUENCY, "")} />
                  }
                >
                  <FormControl sx={{ml: 0, mb: 2, width: '100%'}}>
                    <InputLabel id="ageing-surveillance-frequency">Ageing Surveillance Frequency</InputLabel>
                    <Select
                      disabled={disabled}
                      required
                      fullWidth
                      labelId="ageing-surveillance-frequency"
                      label="Ageing Surveillance Frequency"
                      id="ageing-surveillance-frequency"
                      value={getRecordMetadataValue(ssc, NURIMS_AMP_SURVEILLANCE_FREQUENCY, "")}
                      onChange={this.handleSSCAgeingSurveillanceFrequencyChange}
                    >
                      {getPropertyAsMenuitems(properties, NURIMS_SURVEILLANCE_FREQUENCY)}
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

AMPMetadata.defaultProps = {
  onChange: (msg) => {
  },
};

export default AMPMetadata;