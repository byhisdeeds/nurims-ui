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
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_SSC_RECORD,
  CMD_GET_SSC_RECORDS,
  CMD_UPDATE_SSC_RECORD,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";
import {withTheme} from "@mui/styles";

const MODULE = "AMP";

class AMP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      alert: false,
      previous_selection: {},
      selection: -1,
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
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd === CMD_GET_SSC_RECORDS) {
          if (this.listRef.current) {
            this.listRef.current.setSSCs(response.structures_systems_components);
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_GET_SSC_RECORD) {
          if (this.listRef.current && this.metadataRef.current) {

            const row = this.listRef.current.getSSCs()[this.state.selection];
            const ssc = response.structures_systems_components[0];
            row[NURIMS_TITLE] = ssc[NURIMS_TITLE];
            row[NURIMS_WITHDRAWN] = ssc[NURIMS_WITHDRAWN];
            row.metadata = ssc.metadata;
            this.listRef.current.refresh();
            this.metadataRef.current.setAMPMetadata(row)
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_GET_GLOSSARY_TERMS) {
          if (this.metadataRef.current) {
            this.metadataRef.current.setGlossaryTerms(response.terms)
          }
        } else if (message.hasOwnProperty("cmd") && message.cmd === CMD_UPDATE_SSC_RECORD) {
          toast.success(`Successfully updated AMP record for '${message[NURIMS_TITLE]}'.`);
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  onSSCSelected = (index) => {
    console.log("-- onSSCSelected index --", index)
    if (this.listRef.current) {
      const ssc = this.listRef.current.getSSCs()[index];
      this.props.send({
        cmd: CMD_GET_SSC_RECORD,
        item_id: ssc["item_id"],
        "include.metadata": "true",
        module: MODULE,
      });
    }

    // if (this.metadataRef.current) {
    //   this.metadataRef.current.setAMPMetadata(storage)
    // }
    this.setState({ selection: index })
  }

  saveChanges = () => {
    console.log("saving changes")
    if (this.listRef.current) {
      const sscs = this.listRef.current.getSSCs()
      for (const ssc of sscs) {
        console.log(">>>>>", ssc)
        if (ssc.changed) {
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
    this.setState({changed: state});
  }

  // proceed_with_selection_change = () => {
  //   // set new selection and load details
  //   // console.log("#### saving personnel details ###", this.state.previous_selection)
  //   const selection = this.state.selection;
  //   const previous_selection = this.state.previous_selection;
  //   selection.has_changed = false;
  //   previous_selection.has_changed = false;
  //   this.setState({alert: false, selection: selection, previous_selection: previous_selection});
  //   if (this.listRef.current) {
  //     this.listRef.current.setSelection(selection)
  //   }
  //   if (this.metadataRef.current) {
  //     this.metadataRef.current.setDoseMetadata(selection)
  //   }
  // }

  // cancel_selection_change = () => {
  //   this.setState({alert: false,});
  //   if (this.listRef.current) {
  //     this.listRef.current.setSelection(this.state.previous_selection)
  //   }
  // }

  addAMP = () => {
    if (this.listRef.current) {
      this.listRef.current.add([{
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

  render() {
    const {changed, alert, previous_selection, selection, title, } = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <Typography variant="h5" component="div">{title}</Typography>
          </Grid>
          <Grid item xs={3}>
            <AMPList
              ref={this.listRef}
              properties={this.props.properties}
              onRowSelection={this.onSSCSelected}
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
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges} disabled={!changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addAMP}>
            <AddIcon sx={{mr: 1}}/>
            Add AMP
          </Fab>
          <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeAMP} disabled={selection === -1}>
            <RemoveCircleIcon sx={{mr: 1}}/>
            Remove AMP
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