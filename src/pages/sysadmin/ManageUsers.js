import React from 'react';
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import {ConfirmRemoveRecordDialog} from "../../components/UtilityDialogs";
import {
  Box,
  Fab,
  Grid,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import UserList from "./UserList";
import Constants, {
  CMD_DELETE_USER_RECORD, CMD_GET_PUBLIC_KEY,
  CMD_GET_USER_RECORDS,
  CMD_UPDATE_USER_RECORD,
  ITEM_ID,
  METADATA,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import UserMetadata from "./UserMetadata";
import {TitleComponent} from "../../components/CommonComponents";
import {encryptText} from "../../utils/EncryptionUtils";
import {enqueueErrorSnackbar, enqueueSuccessSnackbar, enqueueWarningSnackbar} from "../../utils/SnackbarVariants";
import {getUserRecordData, getUserRecordMetadataValue, record_uuid} from "../../utils/MetadataUtils";

export const MANAGEUSERS_REF = "ManageUsers";

class ManageUsers extends React.Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      selection: {},
      include_archived: false,
    };
    this.Module = MANAGEUSERS_REF;
    this.puk = "";
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
  }

  componentDidMount() {
    // get public key as base64 string
    // this.ws.send(JSON.stringify({uuid:this.uuid, cmd: Constants.CMD_GET_PUBLIC_KEY}));
    this.props.send({
      cmd: CMD_GET_PUBLIC_KEY,
      module: this.Module,
    })
    this.requestGetRecords(this.state.include_archived);
  }

  isValidSelection = (selection) => {
    return (selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
  }

  changeRecordArchivalStatus = () => {
    console.log("changeRecordArchivalStatus - selection", this.state.selection)
    const selection = this.state.selection;
    if (selection.hasOwnProperty(NURIMS_WITHDRAWN)) {
      selection[NURIMS_WITHDRAWN] = selection[NURIMS_WITHDRAWN] === 0 ? 1 : 0;
      selection.changed = true;
      this.setState({selection: selection, metadata_changed: selection.changed});
    }
  }

  isRecordArchived = (record) => {
    return (record.hasOwnProperty(NURIMS_WITHDRAWN) && record[NURIMS_WITHDRAWN] === 1);
  }

  onRecordMetadataChanged = (state) => {
    this.setState({metadata_changed: state});
  }

  removeRecord = () => {
    console.log("REMOVE RECORD")
    this.setState({confirm_remove: true,});
  }

  cancelRemove = () => {
    this.setState({confirm_remove: false,});
  }

  proceedWithRemove = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithRemove", "selection", this.state.selection);
    }
    this.setState({confirm_remove: false,});
    if (this.state.selection.item_id === -1) {
      if (this.listRef.current) {
        this.listRef.current.removeRecord(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: CMD_DELETE_USER_RECORD,
        item_id: this.state.selection.item_id,
        username: this.state.selection[NURIMS_TITLE],
        module: this.Module,
      });
    }
  }

  addRecord = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "addRecord");
    }
    if (this.listRef.current) {
      this.listRef.current.addRecords([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Record",
        "nurims.withdrawn": 0,
        "metadata": {
          username: "New Record",
          password1: "",
          password2: "",
          authorized_module_level: "",
          role: "[]",
        }
      }], false);
      this.setState({metadata_changed: true});
    }
  }

  requestGetRecords = (include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    this.props.send({
      cmd: CMD_GET_USER_RECORDS,
      "include.disabled": include_archived ? "true" : "false",
      module: this.Module,
    })
    this.setState({include_archived: include_archived});
  }

  saveChanges = () => {
    if (this.listRef.current) {
      const records = this.listRef.current.getRecords();
      for (const record of records) {
        // only save user records with changed metadata
        if (record.changed) {
          if (this.context.debug) {
            ConsoleLog(this.Module, "saveChanges", record);
          }
          // if passwords don't match then do nothing
          if (record.metadata.password1 === "") {
            enqueueWarningSnackbar(`Empty password for ${record[NURIMS_TITLE]}`);
            return;
          } else if (record.metadata.password2 === "") {
            enqueueWarningSnackbar(`Empty password (again) for ${record[NURIMS_TITLE]}`);
            return;
          } else if (record.metadata.password1 !== record.metadata.password2) {
            enqueueWarningSnackbar(`Passwords for ${record[NURIMS_TITLE]} don't match`);
            return;
          }
          if (record.item_id === -1 && !record.hasOwnProperty("record_key")) {
            record["record_key"] = record_uuid();
          }
          record.metadata.password = encryptText(this.puk, record.metadata.password1);
          delete record.metadata.password1;
          delete record.metadata.password2;
          this.props.send({
            cmd: CMD_UPDATE_USER_RECORD,
            item_id: record.item_id,
            "nurims.title": record[NURIMS_TITLE],
            "nurims.withdrawn": record[NURIMS_WITHDRAWN],
            metadata: record.metadata,
            record_key: record.record_key,
            module: this.Module,
          })
        }
      }
    }

    this.setState({metadata_changed: false})
  }

  ws_message(message) {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_USER_RECORDS)) {
          const selection = this.state.selection;
          if (Object.keys(selection).length === 0) {
            if (this.listRef.current) {
              this.listRef.current.setRecords(response.users);
            }
            if (this.metadataRef.current) {
              this.metadataRef.current.setRecordMetadata(selection);
            }
          } else {
            if (!message.hasOwnProperty("item_id") && this.listRef.current) {
              // this.listRef.current.setRecords(response[this.recordTopic], true);
              this.listRef.current.setRecords(response.users);
            }
            if (message.hasOwnProperty("item_id")) {
              // const record = getMatchingResponseObject(message, "response." + this.recordTopic, "item_id", selection["item_id"]);
              const record = getMatchingResponseObject(message, "response.users", "item_id", selection["item_id"]);
              selection[METADATA] = [...record[METADATA]]
              if (this.metadataRef.current) {
                this.metadataRef.current.setRecordMetadata(selection);
              }
            }
          }
        } else if (isCommandResponse(message, CMD_GET_PUBLIC_KEY)) {
          this.puk = message.response.public_key;
        } else if (isCommandResponse(message, CMD_UPDATE_USER_RECORD)) {
          enqueueSuccessSnackbar(`Successfully updated record for ${getUserRecordData(message.response.users[0], NURIMS_TITLE, "unknown")}.`);
          if (this.listRef.current) {
            // this.listRef.current.updateRecord(response[this.recordTopic]);
            this.listRef.current.updateRecord(response.users[0]);
          }
        } else if (isCommandResponse(message, CMD_DELETE_USER_RECORD)) {
          enqueueSuccessSnackbar(`User record for '${message.username}' deleted successfully`);
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setRecordMetadata({})
          }
          this.setState({selection: {}, metadata_changed: false});
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  onRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onRecordSelection", "selection", selection);
    }
    if (selection.hasOwnProperty("item_id")) {
      if (this.metadataRef.current) {
        this.metadataRef.current.setRecordMetadata(selection)
      }
    }
    this.setState({selection: selection})
  }

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "metadata_changed", metadata_changed,
        "confirm_removed", confirm_remove, "include_archived", include_archived, "selection", selection);
    }
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={3}>
            <UserList
              ref={this.listRef}
              title={"Users"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              includeArchived={include_archived}
              requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={true}
            />
          </Grid>
          <Grid item xs={9}>
            <UserMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onRecordMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
               disabled={selection === -1}>
            <RemoveCircleIcon sx={{mr: 1}}/>
            Remove User
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
               onClick={this.changeRecordArchivalStatus} disabled={!this.isValidSelection(selection)}>
            {this.isRecordArchived(selection) ?
              <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore User Record"</React.Fragment> :
              <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive User Record"</React.Fragment>}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
            <AddIcon sx={{mr: 1}}/>
            Add User
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

ManageUsers.defaultProps = {
  send: (msg) => {},
};

export default ManageUsers;