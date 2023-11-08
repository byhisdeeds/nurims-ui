import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import Box from "@mui/material/Box";
import PersonsMonitoredStatusList from "./PersonsMonitoredStatusList";
import {
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
  CMD_UPDATE_PERSONNEL_RECORD,
  CMD_GET_PERSONNEL_RECORDS,
  METADATA,
} from "../../utils/constants";
import {withTheme} from "@mui/styles";
import {
  isCommandResponse,
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  TitleComponent
} from "../../components/CommonComponents";
import {
  enqueueErrorSnackbar,
  enqueueSuccessSnackbar
} from "../../utils/SnackbarVariants";

export const UPDATEMONITORINGSTATUS_REF = "UpdateMonitoringStatus";

function ConfirmSelectionChangeDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Save Previous Changed for ${props.person.hasOwnProperty(NURIMS_TITLE) ? props.person[NURIMS_TITLE] : ""}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The details for {props.person.hasOwnProperty(NURIMS_TITLE) ? props.person[NURIMS_TITLE] : ""} have
            changed without being saved. Do you want to continue without saving the details and loose the changes ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>No</Button>
          <Button onClick={props.onProceed} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

class UpdateMonitoringStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details_changed: false,
      alert: false,
      confirm_remove: false,
      previous_selection: {},
      selection: {},
    };
    this.plref = React.createRef();
    this.Module = UPDATEMONITORINGSTATUS_REF;
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_PERSONNEL_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "true",
      module: this.Module,
    })
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", this.Module, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_PERSONNEL_RECORDS)) {
          if (this.plref.current) {
            this.plref.current.update_personnel(response.personnel)
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_UPDATE_PERSONNEL_RECORD) {
          enqueueSuccessSnackbar(`Personnel record for ${response.personnel[NURIMS_TITLE]} updated successfully`)
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  saveChanges = () => {
    console.log("saving changes")
    if (this.plref.current) {
      const persons = this.plref.current.get_persons()
      // prepare personnel objects with just the metadata we want to update
      for (const person of persons) {
        if (person.changed) {
          this.props.send({
            cmd: CMD_UPDATE_PERSONNEL_RECORD,
            item_id: person.item_id,
            "nurims.title": person[NURIMS_TITLE],
            "nurims.withdrawn": person[NURIMS_WITHDRAWN],
            metadata: person[METADATA],
            module: this.Module,
          })
        }
      }
    }

    this.setState({details_changed: false})
  }

  on_details_changed = (state) => {
    this.setState({details_changed: state});
  }

  proceed_with_selection_change = () => {
    // set new selection and load details
    // console.log("#### saving personnel details ###", this.state.previous_selection)
    this.setState({alert: false, details_changed: false});
    if (this.plref.current) {
      this.plref.current.setSelection(this.state.selection)
    }
  }

  cancel_selection_change = () => {
    this.setState({alert: false,});
    if (this.plref.current) {
      this.plref.current.setSelection(this.state.previous_selection)
    }
  }

  render() {
    const {details_changed, alert,  previous_selection, title, } = this.state;
    return (
      <React.Fragment>
        <ConfirmSelectionChangeDialog open={alert}
                                      person={previous_selection}
                                      onProceed={this.proceed_with_selection_change}
                                      onCancel={this.cancel_selection_change}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12}>
            <PersonsMonitoredStatusList ref={this.plref} onChange={this.on_details_changed}/>
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!details_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

UpdateMonitoringStatus.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(UpdateMonitoringStatus);