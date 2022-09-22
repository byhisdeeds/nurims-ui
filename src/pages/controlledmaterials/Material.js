import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Typography
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import {toast} from "react-toastify";
import Box from "@mui/material/Box";
import MaterialList from "./MaterialList";
import MaterialMetadata from "./MaterialMetadata";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {
  CMD_DELETE_MATERIAL_RECORD,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_MANUFACTURER_RECORDS,
  CMD_GET_MATERIAL_RECORDS,
  CMD_GET_STORAGE_LOCATION_RECORDS,
  CMD_UPDATE_MATERIAL_RECORD,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
} from "../../utils/constants";
import {withTheme} from "@mui/styles";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {
  ConfirmRemoveDialog,
  isValidSelection
} from "../../utils/UtilityDialogs";

const MODULE = "Material";

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

// function ConfirmSelectionChangeDialog(props) {
//   return (
//     <div>
//       <Dialog
//         open={props.open}
//         onClose={props.onCancel}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {`Save Previous Changed for ${props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""}`}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             The details for {props.person.hasOwnProperty("nurims.title") ? props.person["nurims.title"] : ""} have
//             changed without being saved. Do you want to continue without saving the details and loose the changes ?
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

class Material extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      confirm_remove: false,
      selection: {},
      title: props.title,
    };
    this.mlref = React.createRef();
    this.mmref = React.createRef();
  }

  componentDidMount() {
    this.props.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
      module: MODULE,
    });
    this.props.send({
      cmd: CMD_GET_MANUFACTURER_RECORDS,
      module: MODULE,
    });
    this.props.send({
      cmd: CMD_GET_STORAGE_LOCATION_RECORDS,
      module: MODULE,
    });
    this.onRefreshMaterialsList();
  }

  onRefreshMaterialsList = () => {
    this.props.send({
      cmd: CMD_GET_MATERIAL_RECORDS,
      "include.metadata": "true",
      module: MODULE,
    });
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_GLOSSARY_TERMS)) {
          if (this.mmref.current) {
            this.mmref.current.setGlossaryTerms(response.terms)
          }
        } else if (isCommandResponse(message, CMD_GET_MANUFACTURER_RECORDS)) {
          if (this.mlref.current) {
            this.mmref.current.setManufacturers(response.manufacturer)
          }
        } else if (isCommandResponse(message, CMD_GET_STORAGE_LOCATION_RECORDS)) {
          if (this.mlref.current) {
            this.mmref.current.setStorageLocations(response.storage_location)
          }
        } else if (isCommandResponse(message, CMD_GET_MATERIAL_RECORDS)) {
          if (this.mlref.current) {
            this.mlref.current.setMaterials(response.material)
          }
        } else if (isCommandResponse(message, CMD_UPDATE_MATERIAL_RECORD)) {
          toast.success(`Successfully updated material record for ${message[NURIMS_TITLE]}.`);
        } else if (isCommandResponse(message, CMD_DELETE_MATERIAL_RECORD)) {
          toast.success(`Material record (id: ${response.item_id}) deleted successfully`)
          if (this.mlref.current) {
            this.mlref.current.removeMaterial(this.state.selection)
          }
          if (this.mmref.current) {
            this.mmref.current.setMaterialMetadata({})
          }
          this.setState({selection: {}, metadata_changed: false})
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  onMaterialSelected = (material) => {
    // console.log("-- onMaterialSelected (previous selection) --", previous_material)
    console.log("-- onMaterialSelected (selection) --", material)
    if (this.mmref.current) {
      this.mmref.current.setMaterialMetadata(material)
    }
    this.setState({selection: material})
  }

  saveChanges = () => {
    console.log("saving changes")
    if (this.mlref.current) {
      const materials = this.mlref.current.getMaterials()
      console.log("ALL MATERIALS", materials)
      for (const material of materials) {
        if (material.changed) {
          this.props.send({
            cmd: CMD_UPDATE_MATERIAL_RECORD,
            item_id: material.item_id,
            "nurims.title": material[NURIMS_TITLE],
            "nurims.withdrawn": material[NURIMS_WITHDRAWN],
            metadata: material.metadata,
            module: MODULE,
          })
        }
      }
    }

    this.setState({changed: false})
  }

  onMaterialMetadataChanged = (state) => {
    this.setState({changed: state});
  }

  removeMaterial = () => {
    this.setState({confirm_remove: true,});
  }

  proceed_with_remove = () => {
    this.setState({confirm_remove: false,});
    console.log("REMOVE MATERIAL", this.state.selection);
    if (this.state.selection.item_id === -1) {
      if (this.plref.current) {
        this.plref.current.removePerson(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: CMD_DELETE_MATERIAL_RECORD,
        item_id: this.state.selection.item_id,
        module: MODULE,
      });
    }
  }

  cancel_remove = () => {
    this.setState({confirm_remove: false,});
  }

  addMaterial = () => {
    if (this.mlref.current) {
      this.mlref.current.add([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Material",
        "nurims.withdrawn": 0,
        "metadata": []
      }], false);
      this.setState({ changed: true });
    }
  }

  render() {
    const {changed, confirm_remove, selection, title, } = this.state;
    return (
      <React.Fragment>
        {/*<ConfirmSelectionChangeDialog open={alert}*/}
        {/*                              person={previous_selection}*/}
        {/*                              onProceed={this.proceed_with_selection_change}*/}
        {/*                              onCancel={this.cancel_selection_change}*/}
        {/*/>*/}
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
            <MaterialList
              ref={this.mlref}
              height={400}
              properties={this.props.properties}
              onRowClicked={this.onMaterialSelected}
              // onClick={this.onMaterialSelected}
              onRefresh={this.onRefreshMaterialsList}
            />
          </Grid>
          <Grid item xs={8}>
            <MaterialMetadata
              ref={this.mmref}
              properties={this.props.properties}
              onChange={this.onMaterialMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.removeMaterial}
               disabled={!isValidSelection(selection)}>
            <RemoveCircleIcon sx={{mr: 1}}/>
            Remove Material
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addMaterial}>
            <AddIcon sx={{mr: 1}}/>
            Add Material
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

Material.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(Material);