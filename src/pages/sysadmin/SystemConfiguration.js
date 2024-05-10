import React, {Component} from 'react';
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid
} from "@mui/material";
import {
  CMD_GET_CONFIG_PROPERTIES, ROLE_REACTOR_OPERATIONS_DATA_EXPORT, ROLE_SYSADMIN,
} from "../../utils/constants";
import ReactJson from "react-json-view";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import PropTypes from "prop-types";
import {
  isCommandResponse,
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  TitleComponent
} from "../../components/CommonComponents";
import {
  Save as SaveIcon
} from "@mui/icons-material";
import {isValidUserRole} from "../../utils/UserUtils";


export const SYSTEMCONFIGURATION_REF = "SystemConfiguration";

class SystemConfiguration extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      config: {},
      config_changed: false,
    };
    this.Module = SYSTEMCONFIGURATION_REF;
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_CONFIG_PROPERTIES,
      module: this.Module,
    }, true);
  }

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_CONFIG_PROPERTIES)) {
          this.setState({ config: response.properties });
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  editConfig = (edit) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "editConfig", "edit", edit.updated_src);
    }
    this.setState({ config: edit.updated_src, config_changed: true});
  }

  saveChanges = () => {
    const config = this.state.config;
    if (this.context.debug) {
      ConsoleLog(this.Module, "saveChanges", "config", config);
    }
  }

  render() {
    const {config, config_changed} = this.state;
    const is_valid_role = isValidUserRole(this.props.user, [ROLE_SYSADMIN]);
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "config", config);
    }
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
          <TitleComponent title={this.props.title} />
        </Grid>
        <Grid item xs={12}>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': {m: 1, width: '100%'},
            }}
            noValidate
            autoComplete="off"
          >
            <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
              <CardContent sx={{height: 600, overflowY: "auto"}}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <ReactJson
                      name={false}
                      iconStyle={"triangle"}
                      collapseStringsAfterLength={128}
                      groupArraysAfterLength={100}
                      displayObjectSize={true}
                      onAdd={false}
                      onDelete={false}
                      onEdit={this.editConfig}
                      theme={"bright"}
                      collapsed={1}
                      src={config}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>
              <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
                   disabled={!(config_changed && is_valid_role)}>
                <SaveIcon sx={{mr: 1}}/>
                Save Changes
              </Fab>
            </Box>
          </Box>
        </Grid>
      </Grid>
    )
  }
}

SystemConfiguration.propTypes = {
  user: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  send: PropTypes.func.isRequired,
  properties: PropTypes.array.isRequired,
  glossary: PropTypes.object.isRequired,
}

SystemConfiguration.defaultProps = {
};

export default SystemConfiguration;