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
  CMD_UPDATE_MATERIAL_RECORD, INCLUDE_METADATA, METADATA,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN,
} from "../../utils/constants";
import {withTheme} from "@mui/styles";
import {
  getMatchingResponseObject,
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {
  ConfirmRemoveDialog,
  isValidSelection
} from "../../utils/UtilityDialogs";

const MODULE = "Material";

class Material extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      confirm_remove: false,
      selection: {},
      title: props.title,
    };
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
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
    this.onRefreshMaterialsList(false);
  }

  onRefreshMaterialsList = (include_metadata) => {
    this.props.send({
      cmd: CMD_GET_MATERIAL_RECORDS,
      "include.metadata": (include_metadata) ? ""+include_metadata : "false",
      module: MODULE,
    });
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_GLOSSARY_TERMS)) {
          if (this.metadataRef.current) {
            this.metadataRef.current.setGlossaryTerms(response.terms)
          }
        } else if (isCommandResponse(message, CMD_GET_MANUFACTURER_RECORDS)) {
          if (this.listRef.current) {
            this.metadataRef.current.setManufacturers(response.manufacturer)
          }
        } else if (isCommandResponse(message, CMD_GET_STORAGE_LOCATION_RECORDS)) {
          if (this.listRef.current) {
            this.metadataRef.current.setStorageLocations(response.storage_location)
          }
        } else if (isCommandResponse(message, CMD_GET_MATERIAL_RECORDS)) {
          if (message.hasOwnProperty(INCLUDE_METADATA) && message[INCLUDE_METADATA] === "true") {
            const selection = this.state.selection;
            const material = getMatchingResponseObject(message, "response.material", "item_id", selection["item_id"]);
            selection[METADATA] = [...material[METADATA]]
            if (this.metadataRef.current) {
              this.metadataRef.current.setMaterialMetadata(selection);
            }
          } else {
            if (this.listRef.current) {
              this.listRef.current.setMaterials(response.material)
            }
          }
        } else if (isCommandResponse(message, CMD_UPDATE_MATERIAL_RECORD)) {
          toast.success(`Successfully updated material record for ${message[NURIMS_TITLE]}.`);
        } else if (isCommandResponse(message, CMD_DELETE_MATERIAL_RECORD)) {
          toast.success(`Material record (id: ${response.item_id}) deleted successfully`)
          if (this.listRef.current) {
            this.listRef.current.removeMaterial(this.state.selection)
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setMaterialMetadata({})
          }
          this.setState({selection: {}, metadata_changed: false})
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  onMaterialSelected = (material) => {
    // console.log("-- onMaterialSelected (selection) --", material)
    // if (this.metadataRef.current) {
    //   this.metadataRef.current.setMaterialMetadata(material)
    // }
    this.onRefreshMaterialsList(true);
    this.setState({selection: material})
  }

  saveChanges = () => {
    console.log("saving changes")
    if (this.listRef.current) {
      const materials = this.listRef.current.getMaterials()
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
    if (this.listRef.current) {
      this.listRef.current.add([{
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
              ref={this.listRef}
              height={400}
              properties={this.props.properties}
              onRowClicked={this.onMaterialSelected}
              // onClick={this.onMaterialSelected}
              onRefresh={this.onRefreshMaterialsList}
            />
          </Grid>
          <Grid item xs={8}>
            <MaterialMetadata
              ref={this.metadataRef}
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