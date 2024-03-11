import React from 'react';
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog
} from "../../components/UtilityDialogs";
import {
  Grid,
} from "@mui/material";
import UserList from "./UserList";
import {
  CMD_DELETE_USER_RECORD,
  CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_USER_RECORDS,
  CMD_UPDATE_USER_RECORD,
  CURRENT_USER,
  ITEM_ID,
  METADATA,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
  ROLE_SYSADMIN
} from "../../utils/constants";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import UserMetadata from "./UserMetadata";
import {
  AddRemoveArchiveSaveSubmitProvenanceButtonPanel,
  TitleComponent
} from "../../components/CommonComponents";
import {encryptText} from "../../utils/EncryptionUtils";
import {
  enqueueErrorSnackbar,
  enqueueSuccessSnackbar,
  enqueueWarningSnackbar
} from "../../utils/SnackbarVariants";
import {
  getUserRecordData,
  record_uuid
} from "../../utils/MetadataUtils";
import {
  isValidUserRole
} from "../../utils/UserUtils";
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon
} from "@mui/icons-material";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";

export const MANAGEUSERS_REF = "ManageUsers";

class ManageUsers extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      selection: {},
      include_archived: false,
      show_provenance_view: false,
    };
    this.Module = MANAGEUSERS_REF;
    this.puk = props.puk[0];
    this.provenanceRecords = [];
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
  }

  componentDidMount() {
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

  isRecordChanged = (record) => {
    return record.hasOwnProperty("changed") && record.changed;
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
          api_token: "",
        }
      }], false);
      this.setState({metadata_changed: true});
    }
  }

  requestGetRecords = (include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "requestGetRecords", "include_archived", include_archived);
    }
    const params = {
      cmd: CMD_GET_USER_RECORDS,
      "include.disabled": include_archived ? "true" : "false",
      module: this.Module,
    };
    if (!isValidUserRole(this.props.user, "sysadmin")) {
      params["id"] = this.props.user.profile.id;
    }
    this.props.send(params)
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
          record.metadata.api_token = encryptText(this.puk, record.metadata.api_token);
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
      if (messageResponseStatusOk(message)) {
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
        } else if (isCommandResponse(message, CMD_UPDATE_USER_RECORD)) {
          // update existing user profile if it is for me
          if (this.props.user.profile.id ===  message.response.users[0].item_id) {
            const user_metadata = message.response.users[0].metadata;
            this.props.user.profile.username = user_metadata.username;
            this.props.user.profile.fullname = user_metadata.fullname;
            this.props.user.profile.role = user_metadata.role;
            this.props.user.profile.authorized_module_level = user_metadata.authorized_module_level;
          }
          enqueueSuccessSnackbar(
            `Successfully updated record for ${getUserRecordData(message.response.users[0],
              NURIMS_TITLE, "unknown")}.`);
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
        } else if (isCommandResponse(message, CMD_GET_PROVENANCE_RECORDS)) {
          this.setProvenanceRecords(response.provenance)
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

  setProvenanceRecords = (provenance) => {
    setProvenanceRecordsHelper(this, provenance);
  }

  showProvenanceRecordsView = () => {
    showProvenanceRecordsViewHelper(this);
  }

  closeProvenanceRecordsView = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    this.setState({show_provenance_view: false,});
  }

  // isSelectableByRoles = (selection, roles, valid_item_id) => {
  //   // console.log("== isSelectableByRoles SELECTION ==", selection)
  //   // console.log("== isSelectableByRoles user ==", this.context.user)
  //   for (const r of roles) {
  //     // if role is **current_user** then a match between the current user and the selection user returns true
  //     if (r === "**current_user**" &&
  //         selection.hasOwnProperty(NURIMS_TITLE) &&
  //         selection[NURIMS_TITLE] === this.context.user.profile.username) {
  //       return true
  //     } else if (isValidUserRole(this.context.user, r)) {
  //       // We have at least one match, now we check for a valid item_id boolean parameter has been specified
  //       if (valid_item_id) {
  //         return selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1;
  //       }
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // hasChangedRecords = () => {
  //   if (this.listRef.current) {
  //     for (const record of this.listRef.current.getRecords()) {
  //       if (record.hasOwnProperty("changed") && record.changed) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection, show_provenance_view} = this.state;
    const {user} = this.props;
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
        <ShowProvenanceRecordsDialog open={show_provenance_view}
                                     selection={selection}
                                     body={this.provenanceRecords.join("\n")}
                                     onCancel={this.closeProvenanceRecordsView}
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
        <AddRemoveArchiveSaveSubmitProvenanceButtonPanel
          THIS={this}
          user={user}
          onClickAddRecord={this.addRecord}
          onClickChangeRecordArchivalStatus={this.changeRecordArchivalStatus}
          onClickRemoveRecord={this.removeRecord}
          onClickSaveRecordChanges={this.saveChanges}
          onClickViewProvenanceRecords={this.showProvenanceRecordsView}
          addRecordIcon={<PersonAddIcon sx={{mr: 1}}/>}
          addRecordButtonLabel={"Add User"}
          removeRecordIcon={<PersonRemoveIcon sx={{mr: 1}}/>}
          removeRecordButtonLabel={"Remove User"}
          addRole={ROLE_SYSADMIN}
          removeRole={ROLE_SYSADMIN}
          saveRole={CURRENT_USER}
          archiveRole={ROLE_SYSADMIN}
          ignoreSaveDisabledIfNotCreator={true}
        />
      </React.Fragment>
    );
  }
}

ManageUsers.defaultProps = {
  send: (msg) => {},
};

export default ManageUsers;