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
  Typography
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import {toast} from "react-toastify";
import Box from "@mui/material/Box";
import StorageList from "./StorageList";
import StorageMetadata from "./StorageMetadata";
import AddIcon from "@mui/icons-material/Add";
import {
  CMD_GET_GLOSSARY_TERMS, CMD_GET_STORAGE_LOCATION_RECORDS,
  CMD_UPDATE_STORAGE_LOCATION_RECORD,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";

const MODULE = "Storage";

// function ConfirmRemoveDialog(props) {
//   return (
//     <div>
//       <Dialog
//         open={props.open}
//         onClose={props.onCancel}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {`Delete record for ${props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""}`}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete the record
//             for {props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""} (
//             {props.person.hasOwnProperty("item_id") ? props.person["item_id"] : ""})?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={props.onCancel}>No</Button>
//           <Button onClick={props.onProceed} autoFocus>Yes</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

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
          {`Save Previous Changed for ${props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The details for {props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""} have
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

class Storage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      alert: false,
      previous_selection: {},
      selection: {},
      title: props.title,
    };
    this.slref = React.createRef();
    this.smref = React.createRef();
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
      module: MODULE,
    });
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd === CMD_GET_STORAGE_LOCATION_RECORDS) {
          if (this.slref.current) {
            this.slref.current.setStorageLocations(response.storage_locations)
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_GET_GLOSSARY_TERMS) {
          if (this.smref.current) {
            this.smref.current.setGlossaryTerms(response.terms)
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_UPDATE_STORAGE_LOCATION_RECORD) {
          toast.success(`Successfully updated storage record for ${message[NURIMS_TITLE]}.`);
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  onStorageSelected = (previous_storage, storage) => {
    console.log("-- onStorageSelected (previous selection) --", previous_storage)
    console.log("-- onStorageSelected (selection) --", storage)
    if (this.smref.current) {
      this.smref.current.setStorageMetadata(storage)
    }
    this.setState({previous_selection: previous_storage, selection: storage})
  }

  saveChanges = () => {
    console.log("saving changes")
    if (this.slref.current) {
      const stores = this.slref.current.getStores()
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

  proceed_with_selection_change = () => {
    // set new selection and load details
    // console.log("#### saving personnel details ###", this.state.previous_selection)
    const selection = this.state.selection;
    const previous_selection = this.state.previous_selection;
    selection.has_changed = false;
    previous_selection.has_changed = false;
    this.setState({alert: false, selection: selection, previous_selection: previous_selection});
    if (this.slref.current) {
      this.slref.current.setSelection(selection)
    }
    if (this.smref.current) {
      this.smref.current.setDoseMetadata(selection)
    }
  }

  cancel_selection_change = () => {
    this.setState({alert: false,});
    if (this.slref.current) {
      this.slref.current.setSelection(this.state.previous_selection)
    }
  }

  addStorage = () => {
    if (this.slref.current) {
      this.slref.current.add([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Storage",
        "nurims.withdrawn": false,
        "metadata": []
      }], false);
      this.setState({ changed: true });
    }
  }

  render() {
    const {changed, alert, previous_selection, selection, title, } = this.state;
    return (
      <React.Fragment>
        <ConfirmSelectionChangeDialog open={alert}
                                      person={previous_selection}
                                      onProceed={this.proceed_with_selection_change}
                                      onCancel={this.cancel_selection_change}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={3}>
            <StorageList
              ref={this.slref}
              properties={this.props.properties}
              onRowSelection={this.onStorageSelected}
              onClick={this.onStorageSelected}
              onRefresh={this.onRefreshStoragesList}
            />
          </Grid>
          <Grid item xs={9}>
            <StorageMetadata
              ref={this.smref}
              properties={this.props.properties}
              onChange={this.onStorageMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
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

export default Storage;