import React, {Component} from 'react';
import {withTheme} from "@mui/styles";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  getRecordMetadataValue,
  setMetadataValue,
} from "../../utils/MetadataUtils";
import {
  NURIMS_ENTITY_ADDRESS,
  NURIMS_ENTITY_CONTACT,
  NURIMS_TITLE
} from "../../utils/constants";
import PropTypes from "prop-types";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";


class OwnerMetadata extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      owner: {},
      properties: props.properties,
    };
    this.Module = "OwnerMetadata"
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const owner = this.state.owner;
    if (e.target.id === "name") {
      owner["changed"] = true;
      owner[NURIMS_TITLE] = e.target.value;
    } else if (e.target.id === "address") {
      owner["changed"] = true;
      setMetadataValue(owner, NURIMS_ENTITY_ADDRESS, e.target.value)
    } else if (e.target.id === "contact") {
      owner["changed"] = true;
      setMetadataValue(owner, NURIMS_ENTITY_CONTACT, e.target.value)
    }
    this.setState({owner: owner})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  set_owner_object = (owner) => {
    console.log("OwnerMetadata.set_owner_object", owner)
    this.setState({owner: owner});
  }

  setRecordMetadata = (owner) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "owner", owner);
    }
    this.setState({owner: owner})
    this.props.onChange(false);
  }

  getOwnerMetadata = () => {
    return this.state.owner;
  }

  render() {
    const {owner, properties} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "owner", owner);
    }
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '25ch'},
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            required
            id="name"
            label="Name"
            style={{minWidth: 400}}
            value={owner.hasOwnProperty(NURIMS_TITLE) ? owner[NURIMS_TITLE] : ""}
            onChange={this.handleChange}
          />
          <TextField
            id="address"
            label="Address"
            multiline
            style={{minWidth: 400}}
            maxRows={5}
            minRows={5}
            value={getRecordMetadataValue(owner, NURIMS_ENTITY_ADDRESS, "")}
            onChange={this.handleChange}
          />
          <TextField
            id="contact"
            label="Contact"
            multiline
            style={{minWidth: 400}}
            maxRows={5}
            minRows={5}
            value={getRecordMetadataValue(owner, NURIMS_ENTITY_CONTACT, "")}
            onChange={this.handleChange}
          />
        </div>
      </Box>
    );
  }
}

OwnerMetadata.propTypes = {
  ref: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.object.isRequired,
}

export default withTheme(OwnerMetadata);