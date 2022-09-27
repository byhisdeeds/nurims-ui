import React, {Component} from "react";
import {ConfirmRemoveDialog, isValidSelection} from "../utils/UtilityDialogs";
import {Fab, Grid, Typography} from "@mui/material";
import MaterialList from "../pages/controlledmaterials/MaterialList";
import MaterialMetadata from "../pages/controlledmaterials/MaterialMetadata";
import Box from "@mui/material/Box";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import {CMD_DELETE_MONITOR_RECORD} from "../utils/constants";

class BaseRecordManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      confirm_remove: false,
      selection: {},
      title: props.title,
      include_archived: false,
    };
    this.listRef = React.createRef();
    this.metadataRef = React.createRef();
    this.mlref = React.createRef();
    this.mmref = React.createRef();
  }

  removeRecord = () => {
    console.log("REMOVE RECORD")
    this.setState({confirm_remove: true,});
  }

  cancelRemove = () => {
    this.setState({confirm_remove: false,});
  }

  proceedWithRemove = (record_type) => {
    console.log("REMOVE RECORD TYPE", record_type)
    this.setState({confirm_remove: false,});
    console.log("REMOVE RECORD", this.state.selection);
    if (this.state.selection.item_id === -1) {
      if (this.mlref.current) {
        this.mlref.current.removeMonitor(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: CMD_DELETE_MONITOR_RECORD,
        item_id: this.state.selection.item_id,
        module: this.Module,
      });
    }
  }

}

export default BaseRecordManager