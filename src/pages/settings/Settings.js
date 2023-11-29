import React, { Component } from 'react';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Select,
  Switch,
} from "@mui/material";
import {
  Wifi as WifiIcon,
  Settings as SettingsIcon,
  Menu as MenuItem,
  ReceiptLongOutlined as ReceiptLongOutlinedIcon
} from '@mui/icons-material';
import {
  getPropertyValue
} from "../../utils/PropertyUtils";
import {
  withTheme
} from "@mui/styles";
import {
  TitleComponent
} from "../../components/CommonComponents";
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
import {
  UserContext
} from "../../utils/UserContext";
// import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

const SETTINGS_REF = "Settings";

class Settings extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
    };
    this.Module = SETTINGS_REF;
  }

  showDebugMessage = (e) => {
    this.props.onClick(e.target.checked ? 'show-debug-messages' : 'hide-debug-messages')
  };

  setLightTheme = (e) => {
    this.props.theme = 'light';
    this.props.onClick('set-light-theme')
  };

  setDarkTheme = (e) => {
    this.props.theme = 'dark';
    this.props.onClick('set-dark-theme')
  };

  handleDosimetryUnits = (e) => {
    this.props.send({
      cmd: 'set_system_property',
      property: "nurims.dosimeter.units",
      value: e.target.value,
    })
  };

  ws_message = (message) => {
    // console.log("ON_WS_MESSAGE", MODULE, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        // if (message.hasOwnProperty("cmd") && message.cmd === "get_system_properties") {
        //   this.setState({ properties: response.properties })
        // } else if (message.hasOwnProperty("cmd") && message.cmd === "set_system_property") {
        //   const property = response.property;
        //   setPropertyValue(this.state.properties, property.name, property.value);
        //   this.setState({ properties: this.state.properties });
        // }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  render() {
    const {theme, properties, user} = this.props;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
          <TitleComponent title={this.props.title} />
        </Grid>
        <Grid item xs={12}>
          <List sx={{width: '100%'}} subheader={<ListSubheader sx={{fontSize: 24}}>General</ListSubheader>}>
            <ListItem>
              <ListItemIcon>
                <WifiIcon />
              </ListItemIcon>
              <ListItemText id={"light-theme-switch"} primary="Light Theme" />
              <Switch
                edge="end"
                onChange={this.setLightTheme}
                checked={theme === 'light'}
                inputProps={{
                  'aria-labelledby': 'light-theme-switch',
                }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WifiIcon />
              </ListItemIcon>
              <ListItemText id={"dark-theme-switch"} primary="Dark Theme" />
              <Switch
                edge="end"
                onChange={this.setDarkTheme}
                checked={theme === 'dark'}
                inputProps={{
                  'aria-labelledby': 'dark-theme-switch',
                }}
              />
            </ListItem>
          </List>
          <List sx={{width: '100%'}} subheader={<ListSubheader sx={{fontSize: 24}}>Debugging</ListSubheader>}>
            <ListItem>
              <ListItemIcon>
                <ReceiptLongOutlinedIcon />
              </ListItemIcon>
              <ListItemText id={"light-theme-switch"} primary="Show Debugging Messages" />
              <Switch
                edge="end"
                onChange={this.showDebugMessage}
                checked={this.context.debug}
                inputProps={{
                  'aria-labelledby': 'light-theme-switch',
                }}
              />
            </ListItem>
          </List>
          <List sx={{ width: '100%'}} subheader={<ListSubheader sx={{fontSize: 24}}>Dosimetry</ListSubheader>}
          >
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText id={"dosimetry-units"} primary="Dosimetry Units"/>
              <Select
                style={{width: "300px"}}
                value={getPropertyValue(properties, "nurims.dosimeter.units", "")}
                onChange={this.handleDosimetryUnits}
                inputProps={{ 'aria-label': 'Dosimetry Units' }}
              >
                <MenuItem value={"msv"}>Milli Sieverts</MenuItem>
                <MenuItem value={"usv"}>Micro Sieverts</MenuItem>
                <MenuItem value={"mr"}>Milli Rems</MenuItem>
              </Select>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WifiIcon />
              </ListItemIcon>
              <ListItemText id={"dark-theme-switch"} primary="Dark Theme" />
              <Switch
                edge="end"
                onChange={this.setDarkTheme}
                checked={theme === 'dark'}
                inputProps={{
                  'aria-labelledby': 'dark-theme-switch',
                }}
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    );
  }
}

Settings.defaultProps = {
  send: (msg) => {},
};

export default withTheme(Settings);