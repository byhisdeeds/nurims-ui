import React, {Component} from 'react';
import {withTheme} from "@mui/styles";
import {
  getRecordMetadataValue,
  formatISODateString,
} from "../../../utils/MetadataUtils";
import {
  NURIMS_OPERATION_DATA_STATS,
  NURIMS_TITLE
} from "../../../utils/constants";
import PropTypes from "prop-types";
import {
  ConsoleLog,
  UserDebugContext
} from "../../../utils/UserDebugContext";
import {
  Grid,
  Box,
  TextField
} from "@mui/material";
import { duration } from "duration-pretty";


class OperatingRunMetadata extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      record: {},
      disabled: true,
    };
    this.Module = "OperatingRunMetadata";
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const user = this.state.user;
    if (e.target.id === "username") {
      user["changed"] = true;
      user[NURIMS_TITLE] = e.target.value;
      user.metadata["username"] = e.target.value;
      this.setState({user: user})
    } else if (e.target.id === "password") {
      user["changed"] = true;
      this.setState({user: user, password: e.target.value})
    } else if (e.target.id === "password2") {
      user["changed"] = true;
      this.setState({user: user, password_check: e.target.value})
    }
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    this.setState({
      record: record,
      disabled: false,
      password: "", // record.metadata.password,
      password_check: "", // record.metadata.password
    })
    this.props.onChange(false);
  }

  getUserMetadata = () => {
    return this.state.user;
  }

  render() {
    const {record, disabled} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "record",
        getRecordMetadataValue(record, NURIMS_OPERATION_DATA_STATS, ""));
    }
    let stats = getRecordMetadataValue(record, NURIMS_OPERATION_DATA_STATS, {});
    if (Object.keys(stats).length > 0) {
      if (stats.hasOwnProperty("url")) {
        stats = stats.url;
      }
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
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <TextField
              inputProps={
                { readOnly: true, }
              }
              fullWidth
              id="name"
              label="Run"
              value={record[NURIMS_TITLE] || ""}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              inputProps={
                { readOnly: true, }
              }
              fullWidth
              id="start-date"
              label="Start Date"
              value={stats.hasOwnProperty("start") ? formatISODateString(stats["start"]) : ""}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              inputProps={
                { readOnly: true, }
              }
              fullWidth
              id="end-date"
              label="End Date"
              value={stats.hasOwnProperty("end") ? formatISODateString(stats["end"]) : ""}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              inputProps={
                { readOnly: true, }
              }
              fullWidth
              id="duration"
              label="Duration (HH:MM)"
              value={stats.hasOwnProperty("duration") ? duration(stats["duration"], 'seconds').format('HH:mm') : 0}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              inputProps={
                { readOnly: true, }
              }
              fullWidth
              id="flux_hours"
              label="Flux Hours"
              value={stats.hasOwnProperty("flux_hours") ? stats["flux_hours"].toFixed(2) : 0}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              inputProps={
                { readOnly: true, }
              }
              fullWidth
              id="flux_runs"
              label="Flux Runs"
              value={stats.hasOwnProperty("flux") ? stats["flux"].reduce(function(acc, cur) {return acc.concat(cur["flux"].toFixed(1))},[]).join(", ") : ""}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              inputProps={
                { readOnly: true, }
              }
              fullWidth
              id="excess_reactivity"
              label="Excess Reactivity Runs"
              value={stats.hasOwnProperty("excess_reactivity") ? stats["excess_reactivity"].toFixed(2) : ""}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

OperatingRunMetadata.propTypes = {
  ref: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
}

OperatingRunMetadata.defaultProps = {
};

export default withTheme(OperatingRunMetadata);