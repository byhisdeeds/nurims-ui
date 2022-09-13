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
  Typography,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import UploadIcon from '@mui/icons-material/Upload';
import MonitorList from "./MonitorList";
import {toast} from "react-toastify";
import MonitorMetadata from "./MonitorMetadata";
import {
  CMD_DISABLE_MONITOR_RECORD,
  CMD_DISABLE_PERSONNEL_RECORD, CMD_GET_MONITOR_RECORDS,
  CMD_GET_PERSONNEL_RECORDS, CMD_UPDATE_MONITOR_RECORD, CMD_UPDATE_PERSONNEL_RECORD,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";
import {isCommandResponse, messageHasMetadata, messageHasResponse, messageStatusOk} from "../../utils/WebsocketUtils";
import {v4 as uuid} from "uuid";

const MODULE = "AddEditMonitor";

function ConfirmRemoveDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete record for ${props.person.hasOwnProperty(NURIMS_TITLE) ? props.person[NURIMS_TITLE] : ""}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the record
            for {props.person.hasOwnProperty(NURIMS_TITLE) ? props.person[NURIMS_TITLE] : ""} (
            {props.person.hasOwnProperty("item_id") ? props.person["item_id"] : ""})?
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

class AddEditMonitor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      alert: false,
      confirm_remove: false,
      previous_selection: {},
      selection: {},
      title: props.title,
    };
    this.mlref = React.createRef();
    this.mmref = React.createRef();
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_MONITOR_RECORDS,
      module: MODULE,
    })
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_MONITOR_RECORDS)) {
          // console.log("UPDATE SELECTED PERSONNEL METADATA", messageHasMetadata(message))
          if (messageHasMetadata(message)) {
            console.log("UPDATE SELECTED MONITOR METADATA", Array.isArray(response.monitor))
            const selection = this.state.selection;
            console.log("SELECTED MONITOR", selection)
            if (response.monitor[0].item_id === selection["item_id"]) {
              selection[NURIMS_TITLE] = response.monitor[0][NURIMS_TITLE];
              selection[NURIMS_WITHDRAWN] = response.monitor[0][NURIMS_WITHDRAWN];
              selection["metadata"] = [...response.monitor[0]["metadata"]]
            }
            if (this.mmref.current) {
              this.mmref.current.set_monitor_object(selection);
            }
          } else {
            // update monitor list (no metadata included)
            console.log("UPDATE MONITOR LIST (NO METADATA INCLUDED)", Array.isArray(response.monitor))
            if (this.mlref.current) {
              // We don't need to skip records with duplicate names here because
              // these records have already been vetted and given an item_id
              this.mlref.current.add(response.monitor, false);
            }
          }
        } else if (isCommandResponse(message, CMD_UPDATE_MONITOR_RECORD)) {
          toast.success(`Monitor record for ${response.monitor[NURIMS_TITLE]} updated successfully`)
          if (this.mlref.current) {
            this.mlref.current.update(response.monitor);
          }
        } else if (isCommandResponse(message, CMD_DISABLE_MONITOR_RECORD)) {
          toast.success("Monitor record disabled successfully")
          if (this.mlref.current) {
            this.mlref.current.removeMonitor(this.state.selection)
          }
          if (this.mmref.current) {
            this.mmref.current.set_monitor_object({})
          }
          this.setState( {selection: {}})
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  onMonitorSelected = (selection) => {
    // console.log("-- onMonitorSelected (previous selection) --", previous_selection)
    console.log("-- onMonitorSelected (selection) --", selection)
    if (selection.hasOwnProperty("item_id") && selection.item_id === -1) {
      if (this.mmref.current) {
        this.mmref.current.set_monitor_object(selection)
      }
    } else {
      this.setState(pstate => {
        return { selection: selection }
      });
      this.props.send({
        cmd: CMD_GET_MONITOR_RECORDS,
        item_id: selection.item_id,
        "include.metadata": "true",
        module: MODULE,
      })
    }
    this.setState({ selection: selection })
  }

  saveChanges = () => {
    if (this.mlref.current) {
      const monitors = this.mlref.current.getMonitors();
      for (const monitor of monitors) {
        console.log("SAVING MONITOR WITH CHANGED METADATA ", monitor)
        // only save monitor record with changed metadata
        if (monitor.changed) {
          if (monitor.item_id === -1 && !monitor.hasOwnProperty("record_key")) {
            monitor["record_key"] = uuid();
          }
          this.props.send({
            cmd: CMD_UPDATE_MONITOR_RECORD,
            item_id: monitor.item_id,
            "nurims.title": monitor[NURIMS_TITLE],
            metadata: monitor.metadata,
            record_key: monitor.record_key,
            module: MODULE,
          })
        }
      }
    }

    this.setState({metadata_changed: false})
  }

  addMonitor = () => {
    if (this.mlref.current) {
      this.mlref.current.add([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Monitor",
        "nurims.withdrawn": 0,
        "metadata": []
      }], false);
      this.setState({ changed: true });
    }
  }

  onMetadataChanged = (state) => {
    this.setState({metadata_changed: state});
  }

  proceed_with_selection_change = () => {
    // set new selection and load details
    // console.log("#### saving personnel details ###", this.state.previous_selection)
    this.setState({alert: false, metadata_changed: false});
    if (this.mlref.current) {
      this.mlref.current.setSelection(this.state.selection)
    }
    if (this.state.selection.hasOwnProperty("item_id") && this.state.selection.item_id === -1) {
      if (this.mmref.current) {
        this.mmref.current.set_metadata(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: CMD_GET_PERSONNEL_RECORDS,
        "include.metadata": "true",
        item_id: this.state.selection.item_id,
        module: MODULE,
      });
    }
  }

  cancel_selection_change = () => {
    this.setState({alert: false,});
    if (this.mlref.current) {
      this.mlref.current.setSelection(this.state.previous_selection)
    }
  }

  removeMonitor = () => {
    this.setState({confirm_remove: true,});
  }

  cancel_remove = () => {
    this.setState({confirm_remove: false,});
  }

  proceed_with_remove = () => {
    this.setState({confirm_remove: false,});
    console.log("REMOVE MONITOR", this.state.selection);
    if (this.state.selection.item_id === -1) {
      if (this.mlref.current) {
        this.mlref.current.removeMonitor(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: CMD_DISABLE_MONITOR_RECORD,
        item_id: this.state.selection.item_id,
        module: MODULE,
      });
    }
  }

  handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    console.log("file uploaded", selectedFile)
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      alert('Unable to read ' + selectedFile.name);
      toast.error(`Error occurred reading file: ${selectedFile.name}`)
    };
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (event) {
      // console.log(">>>>>", event.target.result);
      const data = JSON.parse(event.target.result);
      console.log(data)
      if (data.hasOwnProperty("dosereport")) {
        const dr = data.dosereport;
        if (dr.hasOwnProperty("badges")) {
          const badges = dr.badges;
          if (typeof badges === "object") {
            if (badges.hasOwnProperty("badge")) {
              const badge = badges.badge;
              if (Array.isArray(badge)) {
                const persons = []
                for (const b of badge) {
                  const name = b["tld.employee.name"];
                  const id = b["tld.dosimeter.employee"].split("/")[1];
                  console.log("EMPLOYEE", name, b["tld.dosimeter.employee"], id);
                  if (!name.toLowerCase().includes("area monitor")) {
                    persons.push({
                      "changed": true,
                      "item_id": -1,
                      "nurims.title": name,
                      "nurims.withdrawn": 0,
                      "metadata": [
                        {"nurims.entity.doseproviderid": `icens|${id}`}
                      ]

                    });
                    that.setState({ changed: true });
                  }
                }
                if (that.mlref.current) {
                  that.mlref.current.add(persons, true)
                }
              } else {
                toast.warn(`Incorrect dosereport.badges.badge type in dose report data file. Expecting an array but found ${typeof badge}`)
              }
            }
          } else {
            toast.warn(`Incorrect dosereport.badges type in dose report data file. Expecting an object but found ${typeof badges}`)
          }
        } else {
          toast.warn('Missing dosereport.badges field in dose report data file')
        }
      } else {
        toast.warn('Unknown file format')
      }
    };
  }

  render() {
    const {metadata_changed, alert, confirm_remove, previous_selection, selection, title} = this.state;
    return (
      <React.Fragment>
        <ConfirmSelectionChangeDialog open={alert}
                                      person={previous_selection}
                                      onProceed={this.proceed_with_selection_change}
                                      onCancel={this.cancel_selection_change}
        />
        <ConfirmRemoveDialog open={confirm_remove}
                             person={selection}
                             onProceed={this.proceed_with_remove}
                             onCancel={this.cancel_remove}
        />
        <input
          accept="*.csv, *.txt, text/plain"
          // className={classes.input}
          id="import-file-uploader"
          style={{display: 'none',}}
          onChange={this.handleFileUpload}
          type="file"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={5}>
            <MonitorList
              ref={this.mlref}
              onPersonSelection={this.onMonitorSelected}
              properties={this.props.properties}
            />
          </Grid>
          <Grid item xs={7}>
            <MonitorMetadata
              ref={this.mmref}
              onChange={this.onMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeMonitor}
               // disabled={!((selection["nurims.withdrawn"] === 1) || selection["item_id"] === -1)}>
               disabled={!selection.hasOwnProperty("item_id")}>
            <PersonRemoveIcon sx={{mr: 1}}/>
            Remove Monitor
          </Fab>
          <label htmlFor="import-file-uploader">
            <Fab variant="extended" size="small" color="primary" aria-label="import" component={"span"}>
              <UploadIcon sx={{mr: 1}}/>
              Import From Dose Report
            </Fab>
          </label>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addMonitor}>
            <AddIcon sx={{mr: 1}}/>
            Add Monitor
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

AddEditMonitor.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default AddEditMonitor;