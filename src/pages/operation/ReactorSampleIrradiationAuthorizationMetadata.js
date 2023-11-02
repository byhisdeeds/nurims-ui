import React, {Component} from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  CMD_SUGGEST_ANALYSIS_JOBS,
  CMD_UPDATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD,
  NURIMS_CREATED_BY,
  NURIMS_CREATION_DATE,
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB,
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST,
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVAL_DATE,
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVER,
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_DATE,
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_ENTITY,
  NURIMS_OPERATION_DATA_IRRADIATIONDURATION,
  NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES,
  NURIMS_OPERATION_DATA_NEUTRONFLUX,
  NURIMS_OPERATION_DATA_PROPOSED_IRRADIATION_DATE,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
  UNDEFINED_DATE_STRING
} from "../../utils/constants";
import {
  ApproveIrradiationMessageComponent,
  AutoCompleteComponent,
  DateSelect,
  SelectFormControlWithTooltip,
  TextFieldWithTooltip
} from "../../components/CommonComponents";
import {
  ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF
} from "./AddEditReactorSampleIrradiationAuthorization";
import {
  analysisJobAsObject,
  getRecordData,
  setRecordData,
  record_uuid
} from "../../utils/MetadataUtils";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  isValidUserRole,
  userFullname
} from "../../utils/UserUtils";
import dayjs from 'dayjs';
import {
  withTheme
} from "@mui/styles";
import PropTypes from "prop-types";


class ReactorSampleIrradiationAuthorizationMetadata extends Component {
  static contextType = UserContext;

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
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
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
    console.log("++++++++++++++++++")
    console.log(">>", value)
    console.log(">>", typeof value == "string" ? analysisJobAsObject(value) : value)
    console.log("++++++++++++++++++")
    clearTimeout(this.timeout);
    this.timeout = null;
    const record = this.state.record;
    setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB,
      typeof value == "string" ? analysisJobAsObject(value) : value);
    this.setState({record: record});
  };

  updateAnalysisJobs = (jobs) => {
    this.setState({jobs: jobs, searching: false});
  }

  getJobLabel = (job) => {
    return typeof job === "object" ? job.hasOwnProperty('name') ? job.name : '' : job;
  };

  handleIrradiationDateChange = (date) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleIrradiationDateChange", date);
    }
    const record = this.state.record;
    setRecordData(record, NURIMS_OPERATION_DATA_PROPOSED_IRRADIATION_DATE, date.toISOString());
    this.setState({record: record})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleChange = (e) => {
    const id = e.target.id || e.target.name || "";
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleChange", "id", id, "value", e.target.value);
    }
    const record = this.state.record;
    if (id === "flux") {
      setRecordData(record, NURIMS_OPERATION_DATA_NEUTRONFLUX, e.target.value);
    } else if (id === "samples") {
      setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, e.target.value.replaceAll("\n", ","));
    } else if (id === "duration") {
      setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONDURATION, e.target.value);
    } else if (id === "sample-type") {
      setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES, e.target.value);
    }
    this.setState({record: record})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  recordDisplayText = (record) => {
    if (Object.keys(record).length === 0) return "";
    const d = dayjs(getRecordData(record, NURIMS_CREATION_DATE, "1970-01-01 00:00:00"));
    return getRecordData(record, NURIMS_TITLE, "") + " created by " +
      getRecordData(record, NURIMS_CREATED_BY, "") + " on " +
      d.format("d MMMM, YYYY");
  }

  onClickApproveRequest = () => {
    const record = this.state.record;
    const user = this.context.user;
    setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVER, user.profile.username);
    setRecordData(record, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVAL_DATE, dayjs().toISOString());
    if (record.item_id === -1 && !record.hasOwnProperty("record_key")) {
      record["record_key"] = record_uuid();
    }
    this.props.send({
      cmd: CMD_UPDATE_REACTOR_SAMPLE_IRRADIATION_AUTHORIZATION_RECORD,
      item_id: record.item_id,
      "nurims.title": record[NURIMS_TITLE],
      "nurims.withdrawn": record[NURIMS_WITHDRAWN],
      metadata: record.metadata,
      record_key: record.record_key,
      module: ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF,
    });
  };

  render() {
    const {record, properties, selected_job, jobs, searching, busy, ac_open} = this.state;
    const disabled = Object.entries(record).length === 0;
    const can_authorize =
      isValidUserRole(this.context.user, "irradiation_authorizer");
    const submission_date =
      getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_DATE, "")
    const submission_entity =
      getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_ENTITY, "")
    const approvedby =
      getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVER, "")
    const approval_date =
      getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVAL_DATE, "")
    let status = "info";
    let status_message = "";
    if (Object.keys(record).length > 0) {
      if (submission_date === "") {
        // request is being prepared and has not yet been submitted for authorization
        status_message = "Request is being prepared.";
        status = "info";
      } else if (approvedby === "") {
        // request has been submitted for authorization but has not yet been authorized
        status_message = `Request was submitted for authorization by ${userFullname(submission_entity, this.context.user)} on ${dayjs(submission_date).format("MMMM D, YYYY h:mm A")}`;
        // status_message = `Request was submitted for authorization by ${submission_entity} on ${submission_date}`;
        status = "warning";
      } else {
        // request has been authorized
        status_message = `Request was authorized by ${userFullname(approvedby, this.context.user)} on ${dayjs(approval_date).format("MMMM D, YYYY h:mm A")}`;
        // status_message = `Request was authorized by ${approvedby} on ${approval_date}`;
        status = "success";
      }
    }
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "disabled", disabled, "record", record, "selected_job",
        selected_job, "user", this.context.user, "can_authorize", can_authorize);
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
        <Alert
          severity={status}
          sx={{fontFamily: "robotoslabregular", fontSize: 16}}
          variant={"outlined"}
        >
          {status_message}
        </Alert>
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={10}>
                <TextFieldWithTooltip
                  id={"record"}
                  label="Record"
                  value={this.recordDisplayText(record)}
                  readOnly={true}
                  tooltip={"Authorisation record identifier."}
                  padding={0}
                  disabled={disabled}
                  onChange={(e)=>{}}/>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextFieldWithTooltip
                  id={"flux"}
                  label="Neutron Flux"
                  value={getRecordData(record, NURIMS_OPERATION_DATA_NEUTRONFLUX, "")}
                  onChange={this.handleChange}
                  disabled={disabled}
                  tooltip={"ss"}
                  padding={0}
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
                  padding={8}
                />
              </Grid>
              <Grid item xs={12} sm={10}>
                <AutoCompleteComponent
                  disabled={disabled}
                  defaultValue={getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB, {name: "abc"})}
                  freeInput={true}
                  label={"Analysis Job"}
                  isOpen={ac_open}
                  onOpen={this.onAutocompleteOpen}
                  onClose={this.onAutocompleteClose}
                  getOptionLabel={this.getJobLabel}
                  options={jobs}
                  loading={searching}
                  onSelected={this.onAnalysisJobSelected}
                  onChange={this.onAnalysisJobChange}
                  busy={busy}
                  padding={0}
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
              <Grid item xs={12} sm={6}>
                <DateSelect
                  label={"Proposed Irradiation Date"}
                  value={dayjs(getRecordData(record, NURIMS_OPERATION_DATA_PROPOSED_IRRADIATION_DATE, UNDEFINED_DATE_STRING))}
                  disabled={disabled}
                  onChange={this.handleIrradiationDateChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextFieldWithTooltip
                  id={"samples"}
                  label="Samples To Irradiate"
                  value={getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, "").replaceAll(",", "\n")}
                  onChange={this.handleChange}
                  disabled={disabled}
                  tooltip={"ss"}
                  lines={10}
                  padding={0}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ApproveIrradiationMessageComponent
                  record={record}
                  user={this.context.user}
                  disabled={disabled}
                  onClickApproveRequest={this.onClickApproveRequest}
                  theme={this.props.theme}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

ReactorSampleIrradiationAuthorizationMetadata.propTypes = {
  properties: PropTypes.object.isRequired,
}

ReactorSampleIrradiationAuthorizationMetadata.defaultProps = {
  onChange: (msg) => {
  },
  send: (msg) => {
  },
};

export default withTheme(ReactorSampleIrradiationAuthorizationMetadata);