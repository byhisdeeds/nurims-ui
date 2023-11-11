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
  Menu as MenuItem
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

const SETTINGS_REF = "Settings";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: props.theme,
      user: props.user,
      properties: props.properties,
    };
    this.Module = SETTINGS_REF;
  }

  componentDidMount() {
  }

  setLightTheme = (e) => {
    this.setState({ theme: 'light'})
    this.props.onClick('set-light-theme')
  };

  setDarkTheme = (e) => {
    this.setState({ theme: 'dark'})
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
    const { theme, properties } = this.state;
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
          <TitleComponent title={this.props.title} />
        </Grid>
        <Grid item xs={12}>
          <List
            sx={{width: '100%'}}
            subheader={<ListSubheader>General</ListSubheader>}
          >
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
          <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            subheader={<ListSubheader>Dosimetry</ListSubheader>}
          >
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText id={"dosimetry-units"} primary="Dosimetry Units" />
              <Select
                value={getPropertyValue(properties, "nurims.dosimeter.units", "")}
                onChange={this.handleDosimetryUnits}
                displayEmpty
                // className={classes.selectEmpty}
                inputProps={{ 'aria-label': 'Dosimetry Units' }}
              >
                {/*<MenuItem value="">*/}
                {/*  <em>None</em>*/}
                {/*</MenuItem>*/}
                <MenuItem value={'msv'}>Milli Sieverts</MenuItem>
                <MenuItem value={'usv'}>Micro Sieverts</MenuItem>
                <MenuItem value={'mr'}>Milli Rems</MenuItem>
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