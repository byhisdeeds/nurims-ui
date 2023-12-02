import React, {Component} from 'react';
import {
  enqueueErrorSnackbar, enqueueInfoSnackbar, enqueueSuccessSnackbar
} from "../../utils/SnackbarVariants";
import {
  Box,
  Card,
  CardContent,
  CardHeader, Fab,
  Grid
} from "@mui/material";
import {
  runidAsTitle
} from "../../utils/OperationUtils";
import {
  BLANK_PDF,
  CMD_DELETE_REACTOR_OPERATING_REPORT_RECORD,
  CMD_GENERATE_REACTOR_OPERATION_REPORT_PDF,
  CMD_GET_CONFIG_PROPERTIES, CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_REACTOR_OPERATING_REPORT_RECORDS,
  NURIMS_TITLE
} from "../../utils/constants";
import ReactJson from "react-json-view";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import PropTypes from "prop-types";
import {config, title} from "process";
import {isCommandResponse, messageHasResponse, messageResponseStatusOk} from "../../utils/WebsocketUtils";
import {TitleComponent} from "../../components/CommonComponents";
import {Save as SaveIcon} from "@mui/icons-material";


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
      ConsoleLog(this.Module, "editConfig", "edit", edit);
    }
  }

  saveChanges = () => {

  }

  render() {
    const {title} = this.props;
    const {config, config_changed} = this.state;
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
              <CardHeader
                title={title}
                titleTypographyProps={{fontSize: "1.5em", whiteSpace: "pre"}}
                sx={{pt: 1, pl: 3, pb: 0}}
              />
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
          </Box>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!config_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
        </Box>
      </Grid>
    )
  }
}

SystemConfiguration.propTypes = {
  user: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  send: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
}

SystemConfiguration.defaultProps = {
};

export default SystemConfiguration;