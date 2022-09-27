import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Typography
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {toast} from "react-toastify";
import Box from "@mui/material/Box";
import AMPList from "./AMPList";
import AMPMetadata from "./AMPMetadata";
import AddIcon from "@mui/icons-material/Add";
import {
  CMD_DELETE_SSC_RECORD,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_SSC_RECORDS,
  CMD_UPDATE_SSC_RECORD,
  INCLUDE_METADATA,
  ITEM_ID,
  METADATA,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
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
import {isRecordArchived} from "../../utils/MetadataUtils";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import ArchiveIcon from "@mui/icons-material/Archive";

const MODULE = "AMP";

class AMP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata_changed: false,
      changed: false,
      selection: {},
      confirm_remove: false,
      include_archived: false,
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
      cmd: CMD_GET_SSC_RECORDS,
      module: MODULE,
    });
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_SSC_RECORDS)) {
          if (message.hasOwnProperty(INCLUDE_METADATA) && message[INCLUDE_METADATA] === "true") {
            const selection = this.state.selection;
            const ssc = getMatchingResponseObject(message, "response.structures_systems_components", "item_id", selection["item_id"]);
            selection[METADATA] = [...ssc[METADATA]]
            if (this.metadataRef.current) {
              this.metadataRef.current.setSSCMetadata(selection);
            }
          } else {
            if (this.listRef.current) {
              this.listRef.current.setRecords(response.structures_systems_components);
            }
          }
        } else if (isCommandResponse(message, CMD_GET_GLOSSARY_TERMS)) {
          if (this.metadataRef.current) {
            this.metadataRef.current.setGlossaryTerms(response.terms)
          }
        } else if (isCommandResponse(message, CMD_UPDATE_SSC_RECORD)) {
          // toast.success(`Successfully updated SSC record for '${message[NURIMS_TITLE]}'.`);
          toast.success(`SSC record for ${response.structures_systems_components[NURIMS_TITLE]} updated successfully`)
          if (this.listRef.current) {
            this.listRef.current.updateRecord(response.structures_systems_components);
          }
        } else if (isCommandResponse(message, CMD_DELETE_SSC_RECORD)) {
          toast.success(`SSC record (id: ${response.item_id}) deleted successfully`)
          if (this.listRef.current) {
            this.listRef.current.removeRecord(this.state.selection)
          }
          if (this.metadataRef.current) {
            this.metadataRef.current.setSSCMetadata({});
          }
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  onSSCSelected = (ssc) => {
    console.log("-- onSSCSelected - selection", ssc)
    if (ssc.hasOwnProperty(ITEM_ID) && ssc.item_id === -1) {
      if (this.metadataRef.current) {
        this.metadataRef.current.setSSCMetadata(ssc)
      }
    } else {
      this.props.send({
        cmd: CMD_GET_SSC_RECORDS,
        item_id: ssc.item_id,
        "include.metadata": "true",
        "include.withdrawn": this.state.include_archived ? "true" : "false",
        module: MODULE,
      });
    }
    this.setState({ selection: ssc })
  }

  saveChanges = () => {
    if (this.listRef.current) {
      const sscs = this.listRef.current.getRecords()
      for (const ssc of sscs) {
        if (ssc.changed) {
          console.log(">>>>>", ssc)
          ssc["changed"] = false
          this.props.send({
            cmd: CMD_UPDATE_SSC_RECORD,
            item_id: ssc.item_id,
            "nurims.title": ssc[NURIMS_TITLE],
            "nurims.withdrawn": ssc[NURIMS_WITHDRAWN],
            metadata: ssc.metadata,
            module: MODULE,
          })
        }
      }
    }

    this.setState({changed: false})
  }

  onAMPMetadataChanged = (state) => {
    this.setState({metadata_changed: state});
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

  requestListUpdate = (include_archived) => {
    console.log("requestListUpdate switch func", include_archived)
    this.props.send({
      cmd: CMD_GET_SSC_RECORDS,
      "include.withdrawn": include_archived ? "true" : "false",
      module: MODULE,
    })
    this.setState({include_archived: include_archived});
  }

  addAMP = () => {
    if (this.listRef.current) {
      this.listRef.current.addRecords([{
        "changed": true,
        "item_id": -1,
        "nurims.title": "New AMP",
        "nurims.withdrawn": false,
        "metadata": []
      }], false);
      this.setState({ changed: true });
    }
  }

  removeAMP = () => {

  }

  cancel_remove = () => {
    this.setState({confirm_remove: false,});
  }

  proceed_with_remove = () => {
    this.setState({confirm_remove: false,});
    console.log("REMOVE AMP", this.state.selection);
    if (this.state.selection.item_id === -1) {
      if (this.listRef.current) {
        this.listRef.current.removeSSC(this.state.selection)
      }
    } else {
      this.props.send({
        cmd: CMD_DELETE_SSC_RECORD,
        item_id: this.state.selection.item_id,
        module: MODULE,
      });
    }
  }

  render() {
    const {metadata_changed, confirm_remove, include_archived, selection, title} = this.state;
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
          <Grid item xs={3}>
            <AMPList
              ref={this.listRef}
              title={"SSC's"}
              properties={this.props.properties}
              onSelection={this.onSSCSelected}
              includeArchived={include_archived}
              requestListUpdate={this.requestListUpdate}
            />
          </Grid>
          <Grid item xs={9}>
            <AMPMetadata
              ref={this.metadataRef}
              properties={this.props.properties}
              onChange={this.onAMPMetadataChanged}
            />
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 2}}} style={{textAlign: 'center'}}>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeAMP}
               disabled={selection === -1}>
            <RemoveCircleIcon sx={{mr: 1}}/>
            Remove AMP
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="archive" component={"span"}
               onClick={this.changeRecordArchivalStatus} disabled={!isValidSelection(selection)}>
            {isRecordArchived(selection) ?
              <React.Fragment><UnarchiveIcon sx={{mr: 1}}/> "Restore SSC Record"</React.Fragment> :
              <React.Fragment><ArchiveIcon sx={{mr: 1}}/> "Archive SSC Record"</React.Fragment>}
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!metadata_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addAMP}>
            <AddIcon sx={{mr: 1}}/>
            Add AMP
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

AMP.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(AMP);