// import React, {Component} from 'react';
// import {
//   Fab,
//   Grid,
//   Typography
// } from "@mui/material";
// import SaveIcon from '@mui/icons-material/Save';
// import {toast} from "react-toastify";
// import Box from "@mui/material/Box";
// import StorageList from "./StorageList";
// import StorageMetadata from "./StorageMetadata";
// import AddIcon from "@mui/icons-material/Add";
// import {
//   CMD_DELETE_STORAGE_LOCATION_RECORD,
//   CMD_GET_GLOSSARY_TERMS,
//   CMD_GET_STORAGE_LOCATION_RECORDS,
//   CMD_UPDATE_STORAGE_LOCATION_RECORD,
//   NURIMS_TITLE,
//   NURIMS_WITHDRAWN
// } from "../../utils/constants";
// import {withTheme} from "@mui/styles";
// import {
//   ConfirmRemoveDialog,
//   isValidSelection
// } from "../../utils/UtilityDialogs";
// import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
//
// const MODULE = "Storage";
//
// class Storage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       changed: false,
//       confirm_remove: false,
//       selection: {},
//       title: props.title,
//       include_archived: false,
//     };
//     this.listRef = React.createRef();
//     this.metadataRef = React.createRef();
//   }
//
//   componentDidMount() {
//     this.props.send({
//       cmd: CMD_GET_GLOSSARY_TERMS,
//       module: MODULE,
//     });
//     this.onRefreshStoragesList();
//   }
//
//   onRefreshStoragesList = () => {
//     this.props.send({
//       cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
//       "include.withdrawn": "false",
//       "include.metadata": "true",
//       module: MODULE,
//     });
//   }
//
//   ws_message = (message) => {
//     console.log("ON_WS_MESSAGE", MODULE, message)
//     if (message.hasOwnProperty("response")) {
//       const response = message.response;
//       if (response.hasOwnProperty("status") && response.status === 0) {
//         if (message.hasOwnProperty("cmd") && message.cmd === CMD_GET_STORAGE_LOCATION_RECORDS) {
//           if (this.listRef.current) {
//             this.listRef.current.setRecords(response.storage_location)
//           }
//         } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_GET_GLOSSARY_TERMS) {
//           if (this.metadataRef.current) {
//             this.metadataRef.current.setGlossaryTerms(response.terms)
//           }
//         } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_UPDATE_STORAGE_LOCATION_RECORD) {
//           toast.success(`Successfully updated storage location record for ${message[NURIMS_TITLE]}.`);
//           const stores = this.listRef.current.getRecords()
//           for (const store of stores) {
//             if (store.item_id === response.storage_location.item_id) {
//               store.changed = false;
//             }
//           }
//         } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_DELETE_STORAGE_LOCATION_RECORD) {
//           toast.success(`Successfully deleted storage location record for ${message[NURIMS_TITLE]}.`);
//           if (this.listRef.current) {
//             this.listRef.current.removeRecord(this.state.selection)
//           }
//           if (this.metadataRef.current) {
//             this.metadataRef.current.setStorageMetadata({})
//           }
//           this.setState({selection: {}, metadata_changed: false})
//         }
//       } else {
//         toast.error(response.message);
//       }
//     }
//   }
//
//   onStorageSelected = (storage) => {
//     console.log("-- onStorageSelected (selection) --", storage)
//     if (this.metadataRef.current) {
//       this.metadataRef.current.setStorageMetadata(storage)
//     }
//     this.setState({selection: storage})
//   }
//
//   saveChanges = () => {
//     console.log("saving changes")
//     if (this.listRef.current) {
//       const stores = this.listRef.current.getRecords()
//       for (const store of stores) {
//         if (store.changed) {
//           this.props.send({
//             cmd: CMD_UPDATE_STORAGE_LOCATION_RECORD,
//             item_id: store.item_id,
//             "nurims.title": store[NURIMS_TITLE],
//             "nurims.withdrawn": store[NURIMS_WITHDRAWN],
//             metadata: store.metadata,
//             module: MODULE,
//           })
//         }
//       }
//     }
//
//     this.setState({changed: false})
//   }
//
//   onStorageMetadataChanged = (state) => {
//     this.setState({changed: state});
//   }
//
//   removeStorageLocation = () => {
//     this.setState({confirm_remove: true,});
//   }
//
//   cancel_remove = () => {
//     this.setState({confirm_remove: false,});
//   }
//
//   proceed_with_remove = () => {
//     this.setState({confirm_remove: false,});
//     console.log("REMOVE STORAGE LOCATION", this.state.selection);
//     if (this.state.selection.item_id === -1) {
//       if (this.plref.current) {
//         this.plref.current.removePerson(this.state.selection)
//       }
//     } else {
//       this.props.send({
//         cmd: CMD_DELETE_STORAGE_LOCATION_RECORD,
//         item_id: this.state.selection.item_id,
//         module: MODULE,
//       });
//     }
//   }
//
//   addStorage = () => {
//     if (this.listRef.current) {
//       this.listRef.current.addRecords([{
//         "changed": true,
//         "item_id": -1,
//         "nurims.title": "New Storage",
//         "nurims.withdrawn": 0,
//         "metadata": []
//       }], false);
//       this.setState({ changed: true });
//     }
//   }
//
//   render() {
//     const {changed, confirm_remove, selection, title, include_archived} = this.state;
//     return (
//       <React.Fragment>
//         <ConfirmRemoveDialog open={confirm_remove}
//                              selection={selection}
//                              onProceed={this.proceed_with_remove}
//                              onCancel={this.cancel_remove}
//         />
//         <Grid container spacing={2}>
//           <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
//             <Typography variant="h5" component="div">{title}</Typography>
//           </Grid>
//           <Grid item xs={4}>
//             <StorageList
//               ref={this.listRef}
//               title={"Storage Locations"}
//               properties={this.props.properties}
//               onSelection={this.onStorageSelected}
//               includeArchived={include_archived}
//               // requestGetRecords={this.requestGetRecords}
//             />
//           </Grid>
//           <Grid item xs={8}>
//             <StorageMetadata
//               ref={this.metadataRef}
//               properties={this.props.properties}
//               onChange={this.onStorageMetadataChanged}
//             />
//           </Grid>
//         </Grid>
//         <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
//           <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeStorageLocation}
//                disabled={!isValidSelection(selection)}>
//             <RemoveCircleIcon sx={{mr: 1}}/>
//             Remove Storage Location
//           </Fab>
//           <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
//                disabled={!changed}>
//             <SaveIcon sx={{mr: 1}}/>
//             Save Changes
//           </Fab>
//           <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addStorage}>
//             <AddIcon sx={{mr: 1}}/>
//             Add Storage
//           </Fab>
//         </Box>
//       </React.Fragment>
//     );
//   }
// }
//
// Storage.defaultProps = {
//   send: (msg) => {
//   },
//   user: {},
// };
//
// export default withTheme(Storage);
// import React, {Component} from 'react';
// import {
//   Fab,
//   Grid,
//   Typography
// } from "@mui/material";
// import SaveIcon from '@mui/icons-material/Save';
// import {toast} from "react-toastify";
// import Box from "@mui/material/Box";
// import ManufacturerList from "./ManufacturerList";
// import ManufacturerMetadata from "./ManufacturerMetadata";
// import AddIcon from "@mui/icons-material/Add";
// import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
// import {
//   CMD_DELETE_MANUFACTURER_RECORD,
//   CMD_GET_MANUFACTURER_RECORDS,
//   CMD_UPDATE_MANUFACTURER_RECORD, ITEM_ID,
//   NURIMS_TITLE
// } from "../../utils/constants";
// import {withTheme} from "@mui/styles";
// import {
//   isCommandResponse,
//   messageHasResponse,
//   messageStatusOk
// } from "../../utils/WebsocketUtils";
// import {
//   ConfirmRemoveDialog
// } from "../../utils/UtilityDialogs";
//
// const MODULE = "Manufacturer";
//
// class Manufacturer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       changed: false,
//       confirm_remove: false,
//       previous_selection: {},
//       selection: {},
//       include_archived: false,
//       title: props.title,
//     };
//     this.listRef = React.createRef();
//     this.metadataRef = React.createRef();
//   }
//
//   componentDidMount() {
//     this.onRefreshManufacturersList();
//   }
//
//   onRefreshManufacturersList = () => {
//     this.props.send({
//       cmd: CMD_GET_MANUFACTURER_RECORDS,
//       "include.withdrawn": "false",
//       "include.metadata": "true",
//       module: MODULE,
//     });
//   }
//
//   ws_message = (message) => {
//     console.log("ON_WS_MESSAGE", MODULE, message)
//     if (messageHasResponse(message)) {
//       const response = message.response;
//       if (messageStatusOk(message)) {
//         if (isCommandResponse(message, CMD_GET_MANUFACTURER_RECORDS)) {
//           if (this.listRef.current) {
//             this.listRef.current.setRecords(response.manufacturer)
//           }
//         } else if (isCommandResponse(message, CMD_UPDATE_MANUFACTURER_RECORD)) {
//           toast.success(`Manufacturer record for ${response.manufacturer[NURIMS_TITLE]} updated successfully`)
//           if (this.listRef.current) {
//             this.listRef.current.updateRecord(response.manufacturer);
//           }
//         } else if (isCommandResponse(message, CMD_DELETE_MANUFACTURER_RECORD)) {
//           toast.success(`Manufacturer record (id: ${response.item_id}) deleted successfully`);
//           if (this.listRef.current) {
//             this.listRef.current.removeRecord(this.state.selection)
//           }
//           if (this.metadataRef.current) {
//             this.metadataRef.current.set_manufacturer_object({})
//           }
//           this.setState({selection: {}, metadata_changed: false})
//         }
//       } else {
//         toast.error(response.message);
//       }
//     }
//   }
//
//   onManufacturerSelected = (manufacturer) => {
//     if (this.metadataRef.current) {
//       this.metadataRef.current.setManufacturerMetadata(manufacturer)
//     }
//     this.setState({selection: manufacturer})
//   }
//
//   saveChanges = () => {
//     console.log("saving changes")
//     if (this.listRef.current) {
//       const manufacturers = this.listRef.current.getRecords()
//       console.log("ALL MANUFACTURERS", manufacturers)
//       for (const manufacturer of manufacturers) {
//         if (manufacturer.changed) {
//           this.props.send({
//             cmd: CMD_UPDATE_MANUFACTURER_RECORD,
//             item_id: manufacturer.item_id,
//             "nurims.title": manufacturer["nurims.title"],
//             "nurims.withdrawn": manufacturer["nurims.withdrawn"],
//             metadata: manufacturer.metadata,
//             module: MODULE,
//           })
//         }
//       }
//     }
//
//     this.setState({changed: false})
//   }
//
//   onManufacturerMetadataChanged = (state) => {
//     this.setState({changed: state});
//   }
//
//   addManufacturer = () => {
//     if (this.listRef.current) {
//       this.listRef.current.addRecords([{
//         "changed": true,
//         "item_id": -1,
//         "nurims.title": "New Manufacturer",
//         "nurims.withdrawn": 0,
//         "metadata": []
//       }], false);
//       this.setState({ changed: true });
//     }
//   }
//   removeRecord = () => {
//     this.setState({confirm_remove: true,});
//   }
//
//   cancel_remove = () => {
//     this.setState({confirm_remove: false,});
//   }
//
//   proceed_with_remove = () => {
//     this.setState({confirm_remove: false,});
//     console.log("REMOVE MANUFACTURER", this.state.selection);
//     if (this.state.selection.item_id === -1) {
//       if (this.listRef.current) {
//         this.listRef.current.removeRecord(this.state.selection)
//       }
//     } else {
//       this.props.send({
//         cmd: CMD_DELETE_MANUFACTURER_RECORD,
//         item_id: this.state.selection.item_id,
//         module: MODULE,
//       });
//     }
//   }
//
//   render() {
//     const {changed, confirm_remove, selection, title, include_archived} = this.state;
//     return (
//       <React.Fragment>
//         <ConfirmRemoveDialog open={confirm_remove}
//                              selection={selection}
//                              onProceed={this.proceed_with_remove}
//                              onCancel={this.cancel_remove}
//         />
//         <Grid container spacing={2}>
//           <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
//             <Typography variant="h5" component="div">{title}</Typography>
//           </Grid>
//           <Grid item xs={4}>
//             <ManufacturerList
//               ref={this.listRef}
//               title={"Manufacturers"}
//               properties={this.props.properties}
//               onSelection={this.onManufacturerSelected}
//               // includeArchived={include_archived}
//             />
//           </Grid>
//           <Grid item xs={8}>
//             <ManufacturerMetadata
//               ref={this.metadataRef}
//               properties={this.props.properties}
//               onChange={this.onManufacturerMetadataChanged}
//             />
//           </Grid>
//         </Grid>
//         <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
//           <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.removeRecord}
//                disabled={!(selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1)}>
//             <RemoveCircleIcon sx={{mr: 1}}/>
//             Remove Record
//           </Fab>
//           <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
//                disabled={!changed}>
//             <SaveIcon sx={{mr: 1}}/>
//             Save Changes
//           </Fab>
//           <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addManufacturer}>
//             <AddIcon sx={{mr: 1}}/>
//             Add Manufacturer
//           </Fab>
//         </Box>
//       </React.Fragment>
//     );
//   }
// }
//
// Manufacturer.defaultProps = {
//   send: (msg) => {
//   },
//   user: {},
// };
//
// export default withTheme(Manufacturer);
import React from 'react';
import {
  Fab,
  Grid,
  Typography,
  Box
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_STORAGE_LOCATION_RECORDS,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
} from "../../components/UtilityDialogs";
import StorageList from "./StorageList";
import StorageMetadata from "./StorageMetadata";


class Storage extends BaseRecordManager {
  constructor(props) {
    super(props);
    this.Module = "Storage";
    this.recordTopic = "storage_location";
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: this.Module,
    });
    this.getStorageLocationRecords();
  }

  getStorageLocationRecords = () => {
    this.props.send({
      cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "true",
      module: this.Module,
    });
  }

  ws_message = (message) => {
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
    ]);
  }

  render() {
    const {metadata_changed, confirm_remove, selection, title} = this.state;
    console.log("render - RECORD_TYPE", this.recordTopic);
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={5}>
            <StorageList
              ref={this.listRef}
              title={"Storage Locations"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
            />
          </Grid>
          <Grid item xs={7}>
            <StorageMetadata
              ref={this.metadataRef}
              onChange={this.onRecordMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}
            // disabled={!((selection["nurims.withdrawn"] === 1) || selection["item_id"] === -1)}>
               disabled={!this.isValidSelection(selection)}>
            <PersonRemoveIcon sx={{mr: 1}}/>
            Remove Storage
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>
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