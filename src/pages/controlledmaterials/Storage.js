import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Typography
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import {toast} from "react-toastify";
import Box from "@mui/material/Box";
import StorageList from "./StorageList";
import StorageMetadata from "./StorageMetadata";
import AddIcon from "@mui/icons-material/Add";
import {
  CMD_DELETE_STORAGE_LOCATION_RECORD,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_STORAGE_LOCATION_RECORDS,
  CMD_UPDATE_STORAGE_LOCATION_RECORD,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";
import {withTheme} from "@mui/styles";
import {
  ConfirmRemoveDialog,
  isValidSelection
} from "../../utils/UtilityDialogs";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const MODULE = "Storage";

class Storage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      confirm_remove: false,
      selection: {},
      title: props.title,
      include_archived: false,
    };
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: MODULE,
    });
    this.onRefreshStoragesList();
  }

  onRefreshStoragesList = () => {
    this.props.send({
      cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "true",
      module: MODULE,
    });
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd === CMD_GET_STORAGE_LOCATION_RECORDS) {
          if (this.listRef.current) {
            this.listRef.current.setRecords(response.storage_location)
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_GET_GLOSSARY_TERMS) {
          if (this.metadataRef.current) {
            this.metadataRef.current.setGlossaryTerms(response.terms)
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_UPDATE_STORAGE_LOCATION_RECORD) {
          toast.success(`Successfully updated storage location record for ${message[NURIMS_TITLE]}.`);
          const stores = this.listRef.current.getRecords()
          for (const store of stores) {
            if (store.item_id === response.storage_location.item_id) {
              store.changed = false;
            }
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_DELETE_STORAGE_LOCATION_RECORD) {
          toast.success(`Successfully deleted storage location record for ${message[NURIMS_TITLE]}.`);
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setStorageMetadata({})
          }
          this.setState({selection: {}, metadata_changed: false})
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  onStorageSelected = (storage) => {
    console.log("-- onStorageSelected (selection) --", storage)
    if (this.metadataRef.current) {
      this.metadataRef.current.setStorageMetadata(storage)
    }
    this.setState({selection: storage})
  }

  saveChanges = () => {
    console.log("saving changes")
    if (this.listRef.current) {
      const stores = this.listRef.current.getRecords()
      for (const store of stores) {
        if (store.changed) {
          this.props.send({
            cmd: CMD_UPDATE_STORAGE_LOCATION_RECORD,
            item_id: store.item_id,
            "nurims.title": store[NURIMS_TITLE],
            "nurims.withdrawn": store[NURIMS_WITHDRAWN],
            metadata: store.metadata,
            module: MODULE,
          })
        }
      }
    }

    this.setState({changed: false})
  }

  onStorageMetadataChanged = (state) => {
    this.setState({changed: state});
  }

  removeStorageLocation = () => {
    this.setState({confirm_remove: true,});
  }

  cancel_remove = () => {
    this.setState({confirm_remove: false,});
  }

  proceed_with_remove = () => {
    this.setState({confirm_remove: false,});
    console.log("REMOVE STORAGE LOCATION", this.state.selection);
    if (this.state.selection.item_id === -1) {
      if (this.plref.current) {
        this.plref.current.removePerson(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: CMD_DELETE_STORAGE_LOCATION_RECORD,
        item_id: this.state.selection.item_id,
        module: MODULE,
      });
    }
  }

  addStorage = () => {
    if (this.listRef.current) {
      this.listRef.current.addRecords([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Storage",
        "nurims.withdrawn": 0,
        "metadata": []
      }], false);
      this.setState({ changed: true });
    }
  }

  render() {
    const {changed, confirm_remove, selection, title, include_archived} = this.state;
    return (
      <React.Fragment>
        <ConfirmRemoveDialog open={confirm_remove}
                             selection={selection}
                             onProceed={this.proceed_with_remove}
                             onCancel={this.cancel_remove}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={4}>
            <StorageList
              ref={this.listRef}
              title={"Storage Locations"}
              properties={this.props.properties}
              onSelection={this.onStorageSelected}
              includeArchived={include_archived}
              // requestListUpdate={this.requestListUpdate}
            />
          </Grid>
          <Grid item xs={8}>
            <StorageMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onStorageMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeStorageLocation}
               disabled={!isValidSelection(selection)}>
            <RemoveCircleIcon sx={{mr: 1}}/>
            Remove Storage Location
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addStorage}>
            <AddIcon sx={{mr: 1}}/>
            Add Storage
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

Storage.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(Storage);