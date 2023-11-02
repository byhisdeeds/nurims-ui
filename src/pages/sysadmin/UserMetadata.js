import React, {Component} from 'react';
import {withTheme} from "@mui/styles";
import {
  getUserRecordData,
  setUserRecordData
} from "../../utils/MetadataUtils";
import {
  NURIMS_TITLE, ROLE_SYSADMIN
} from "../../utils/constants";
import PropTypes from "prop-types";
import {
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
  Box
} from "@mui/material";
import {isValidUserRole} from "../../utils/UserUtils";


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

  componentDidMount() {
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const user = this.state.user;
    if (e.target.id === "username") {
      setUserRecordData(user, NURIMS_TITLE, e.target.value);
      setUserRecordData(user, "username", e.target.value);
    } else if (e.target.id === "fullname") {
      setUserRecordData(user, "fullname", e.target.value);
    } else if (e.target.id === "password1") {
      setUserRecordData(user, "password1", e.target.value);
      this.setState({user: user, password: e.target.value});
    } else if (e.target.id === "password2") {
      setUserRecordData(user, "password2", e.target.value);
      this.setState({user: user, password_check: e.target.value});
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
      password: "", // record.metadata.password,
      password_check: "", // record.metadata.password
    })
    this.props.onChange(false);
  }

  getUserMetadata = () => {
    return this.state.user;
  }

  handleModuleAuthorizationLevelChange = (e) => {
    const user = this.state.user;
    setUserRecordData(user, "authorized_module_level", e.target.value)
    this.setState({user: user})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleUserRoleChange = (e) => {
    const user = this.state.user;
    setUserRecordData(user, "role", e.target.value)
    this.setState({user: user})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  render() {
    const {user, properties, disabled} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "disabled", disabled, "user", user);
    }
    const authorized_module_levels = getPropertyValue(properties, "system.authorizedmodulelevels", "").split('|');
    const user_roles = getPropertyValue(properties, "system.userrole", "").split('|');
    const isSysadmin = isValidUserRole(this.context.user, ROLE_SYSADMIN);
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
              id="username"
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
              onChange={this.handleModuleAuthorizationLevelChange}
              options={authorized_module_levels}
              disabled={disabled || !isSysadmin}
              tooltip={""}
              // target={this.tooltipRef}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectFormControlWithTooltip
              id={"user_role"}
              label="User Role"
              value={getUserRecordData(user, "role", [])}
              onChange={this.handleUserRoleChange}
              options={user_roles}
              disabled={disabled || !isSysadmin}
              tooltip={""}
              multiple={true}
              // target={this.tooltipRef}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled={disabled}
              required
              fullWidth
              type={"password"}
              id="password1"
              label="Password"
              value={getUserRecordData(user, "password1", "")}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled={disabled}
              required
              fullWidth
              id="password2"
              type={"password"}
              label="Password (again)"
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
  ref: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
}

UserMetadata.defaultProps = {
  onChange: (msg) => {
  },
};

export default withTheme(UserMetadata);