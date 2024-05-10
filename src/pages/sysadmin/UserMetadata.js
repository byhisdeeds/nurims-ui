import React, {Component} from 'react';
import {
  withTheme
} from "@mui/styles";
import {
  getUserRecordData, isSelectableByRoles, record_uuid,
  setUserRecordData
} from "../../utils/MetadataUtils";
import {
  NURIMS_TITLE,
  ROLE_SYSADMIN
} from "../../utils/constants";
import PropTypes from "prop-types";
import {
  MultipleSelectFormControlWithTooltip,
  SelectFormControlWithTooltip
} from "../../components/CommonComponents";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  getPropertyValue
} from "../../utils/PropertyUtils";
import {
  Grid,
  TextField,
  Box, Fab, Button
} from "@mui/material";
import {isValidUserRole} from "../../utils/UserUtils";
import app from "../../App";

class UserMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      disabled: true,
      properties: props.properties,
    };
    this.Module = "UserMetadata";
  }

  handleChange = (e) => {
    const user = this.state.user;
    const id = e.target.id === undefined ? e.target.name : e.target.id;
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleChange", "id", id, "value", e.target.value);
    }
    if (id === "user") {
      setUserRecordData(user, NURIMS_TITLE, e.target.value);
      setUserRecordData(user, "username", e.target.value);
    } else if (id === "fullname") {
      setUserRecordData(user, "fullname", e.target.value);
    } else if (id === "api_token") {
      setUserRecordData(user, "api_token", e.target.value);
    } else if (id === "password1") {
      setUserRecordData(user, "password1", e.target.value);
      this.setState({user: user, password: e.target.value});
    } else if (id === "password2") {
      setUserRecordData(user, "password2", e.target.value);
      this.setState({user: user, password_check: e.target.value});
    } else if (id === "authorized_module_level") {
      setUserRecordData(user, "authorized_module_level", e.target.value)
    } else if (id === "user_role") {
      setUserRecordData(user, "role", e.target.value)
    }
    this.setState({user: user});
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    this.setState({
      user: record,
      disabled: false,
      password: "",
      password_check: "",
    })
    this.props.onChange(false);
  }

  getUserMetadata = () => {
    return this.state.user;
  }

  onGenerateApiKey = () => {
    const user = this.state.user;
    setUserRecordData(user, "api_token", record_uuid());
    this.setState({user: user});
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  render() {
    const {user, properties, disabled} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "disabled", disabled, "user", user);
    }
    const  authorized_module_levels = (",|" + getPropertyValue(properties, "system.authorizedmodulelevels", "")).split('|');
    const user_roles = getPropertyValue(properties, "system.userrole", "").split('|');
    const isSysadmin = isValidUserRole(this.context.user, ROLE_SYSADMIN);
    console.log(">>>>>> authorized_module_levels: ", authorized_module_levels)
    console.log(">>>>>> authorized_module_levels value: ", getUserRecordData(user, "authorized_module_level", ""))
    console.log(">>>>>> user_roles: ", user_roles)
    console.log(">>>>>> user_roles value: ", getUserRecordData(user, "role", []))
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
          <Grid item xs={4}>
            <TextField
              required
              fullWidth
              id="user"
              label="Username/Email"
              value={getUserRecordData(user, "username", "")}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              required
              fullWidth
              id="fullname"
              label="Fullname"
              value={getUserRecordData(user, "fullname", "")}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectFormControlWithTooltip
              id={"authorized_module_level"}
              label="Module Authorization Level"
              value={getUserRecordData(user, "authorized_module_level", "")}
              onChange={this.handleChange}
              // onChange={this.handleModuleAuthorizationLevelChange}
              options={authorized_module_levels}
              disabled={disabled || !isSysadmin}
              tooltip={""}
              // target={this.tooltipRef}
            />
          </Grid>
          <Grid item xs={4}>
          <MultipleSelectFormControlWithTooltip
            id={"user_role"}
            label="User Role"
            value={getUserRecordData(user, "role", [])}
            onChange={this.handleChange}
            // onChange={this.handleUserRoleChange}
            options={user_roles}
            disabled={disabled || !isSysadmin}
            tooltip={""}
            multiple={true}
            // target={this.tooltipRef}
          />
        </Grid>
          <Grid item xs={2}>
            <Box sx={{textAlign: 'center', pt:2}}>
              <Fab
                variant="extended"
                size="small"
                color="primary"
                aria-label="remove"
                onClick={this.onGenerateApiKey}
                disabled={disabled}
              >
                &#160; {"Generate ApiKey"} &#160;
              </Fab>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <TextField
              aria-readonly={true}
              fullWidth
              id="api_token"
              label="Api Key"
              value={getUserRecordData(user, "api_token", "")}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled={disabled}
              required
              fullWidth
              type={"password"}
              id={"password1"}
              label={"Password"}
              value={getUserRecordData(user, "password1", "")}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled={disabled}
              required
              fullWidth
              type={"password"}
              id={"password2"}
              label={"Password (again)"}
              value={getUserRecordData(user, "password2", "")}
              onChange={this.handleChange}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

UserMetadata.propTypes = {
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.array.isRequired,
}

UserMetadata.defaultProps = {
};

export default withTheme(UserMetadata);