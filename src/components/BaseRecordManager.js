import React, {Component} from "react";
import {ConfirmRemoveDialog, isValidSelection} from "../utils/UtilityDialogs";
import {Fab, Grid, Typography} from "@mui/material";
import MaterialList from "../pages/controlledmaterials/MaterialList";
import MaterialMetadata from "../pages/controlledmaterials/MaterialMetadata";
import Box from "@mui/material/Box";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

class BaseRecordManager extends Component {

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
            <MaterialList
              ref={this.listRef}
              title={"Materials"}
              properties={this.props.properties}
              onSelection={this.onMaterialSelected}
              includeArchived={include_archived}
              requestListUpdate={this.onRequestListUpdate}
              enableRecordArchiveSwitch={true}
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
    )
  }
}