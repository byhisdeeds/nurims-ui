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
import ManufacturerList from "./ManufacturerList";
import ManufacturerMetadata from "./ManufacturerMetadata";
import AddIcon from "@mui/icons-material/Add";
import {NURIMS_TITLE} from "../../utils/constants";
import {withTheme} from "@mui/styles";

const MODULE = "Manufacturer";

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

class Manufacturer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      alert: false,
      previous_selection: {},
      selection: {},
      title: props.title,
    };
    this.mlref = React.createRef();
    this.mmref = React.createRef();
  }

  componentDidMount() {
    this.onRefreshManufacturersList();
  }

  onRefreshManufacturersList = () => {
    this.props.send({
      cmd: 'get_manufacturer_records',
      module: MODULE,
    });
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd === "get_manufacturer_records") {
          if (this.mlref.current) {
            this.mlref.current.setManufacturers(response.manufacturers)
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === "save_manufacturer_record") {
          toast.success(`Manufacturer record for ${response.manufacturer[NURIMS_TITLE]} updated successfully`)
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  onManufacturerSelected = (previous_manufacturer, manufacturer) => {
    console.log("-- onManufacturerSelected (previous selection) --", previous_manufacturer)
    console.log("-- onManufacturerSelected (selection) --", manufacturer)
    if (this.mmref.current) {
      this.mmref.current.setManufacturerMetadata(manufacturer)
    }
    this.setState({previous_selection: previous_manufacturer, selection: manufacturer})
  }

  saveChanges = () => {
    console.log("saving changes")
    if (this.mlref.current) {
      const manufacturers = this.mlref.current.getManufacturers()
      console.log("ALL MANUFACTURERS", manufacturers)

      for (const manufacturer of manufacturers) {
        if (manufacturer.changed) {
          this.props.send({
            cmd: 'save_manufacturer_record',
            item_id: manufacturer.item_id,
            "nurims.title": manufacturer["nurims.title"],
            "nurims.withdrawn": manufacturer["nurims.withdrawn"],
            metadata: manufacturer.metadata,
            module: MODULE,
          })
        }
      }
    }

    this.setState({changed: false})
  }

  onManufacturerMetadataChanged = (state) => {
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
    if (this.mlref.current) {
      this.mlref.current.setSelection(selection)
    }
    if (this.mmref.current) {
      this.mmref.current.setDoseMetadata(selection)
    }
  }

  cancel_selection_change = () => {
    this.setState({alert: false,});
    if (this.mlref.current) {
      this.mlref.current.setSelection(this.state.previous_selection)
    }
  }

  addManufacturer = () => {
    if (this.mlref.current) {
      this.mlref.current.add([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New Manufacturer",
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
          <Grid item xs={7} style={{border: '1px solid red'}}>
            <ManufacturerList
              ref={this.mlref}
              properties={this.props.properties}
              onRowSelection={this.onManufacturerSelected}
              onClick={this.onManufacturerSelected}
              onRefresh={this.onRefreshManufacturersList}
            />
          </Grid>
          <Grid item xs={5}>
            <ManufacturerMetadata
              ref={this.mmref}
              properties={this.props.properties}
              onChange={this.onManufacturerMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addManufacturer}>
            <AddIcon sx={{mr: 1}}/>
            Add Manufacturer
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

Manufacturer.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(Manufacturer);