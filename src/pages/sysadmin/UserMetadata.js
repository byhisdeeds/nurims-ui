import React, {Component} from 'react';
import {withTheme} from "@mui/styles";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  getUserRecordMetadataValue, setRecordMetadataValue,
} from "../../utils/MetadataUtils";
import {
  NURIMS_TITLE
} from "../../utils/constants";
import PropTypes from "prop-types";
import {SelectFormControlWithTooltip} from "../../components/CommonComponents";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import {getPropertyValue} from "../../utils/PropertyUtils";
import {Grid} from "@mui/material";


class UserMetadata extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      disabled: true,
      password: "",
      password_check: "",
      properties: props.properties,
    };
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const user = this.state.user;
    if (e.target.id === "username") {
      user["changed"] = true;
      user[NURIMS_TITLE] = e.target.value;
      setRecordMetadataValue(user, "username", e.target.value);
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
    if (this.context.debug > 5) {
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
    user["changed"] = true;
    user.metadata["authorized_module_level"] = e.target.value;
    this.setState({user: user})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleUserRoleChange = (e) => {
    const user = this.state.user;
    user["changed"] = true;
    user.metadata["role"] = e.target.value;
    this.setState({user: user})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  render() {
    const {user, properties, disabled, password, password_check} = this.state;
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "setRecordMetadata", "disabled", disabled, "user", user);
    }
    const authorized_module_levels = getPropertyValue(properties, "system.authorizedmodulelevels", "").split('|');
    const user_roles = getPropertyValue(properties, "system.userrole", "").split('|');
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
              value={getUserRecordMetadataValue(user, "username", "")}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectFormControlWithTooltip
              id={"authorized_module_level"}
              label="Module Authorization Level"
              value={getUserRecordMetadataValue(user, "authorized_module_level", "")}
              onChange={this.handleModuleAuthorizationLevelChange}
              options={authorized_module_levels}
              disabled={disabled}
              tooltip={""}
              // target={this.tooltipRef}
            />
          </Grid>
          <Grid item xs={4}>
            <SelectFormControlWithTooltip
              id={"user_role"}
              label="User Role"
              value={getUserRecordMetadataValue(user, "role", "")}
              onChange={this.handleUserRoleChange}
              options={user_roles}
              disabled={disabled}
              tooltip={""}
              // target={this.tooltipRef}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              type={"password"}
              id="password1"
              label="Password"
              value={password}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              id="password2"
              type={"password"}
              label="Password (again)"
              value={password_check}
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