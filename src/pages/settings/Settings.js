import React, { Component } from 'react';
import List from "@mui/material/List";
import {ListItem, ListItemIcon, ListItemText, ListSubheader, Switch} from "@mui/material";
import WifiIcon from '@mui/icons-material/Wifi';
import MyAccount from "../account/MyAccount";

const MODULE = "Settings";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: props.theme,
    };
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

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
  }

  render() {
    const { theme } = this.state;
    return (
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        subheader={<ListSubheader>Settings</ListSubheader>}
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
    );
  }
}

MyAccount.defaultProps = {
  send: (msg) => {},
};

export default Settings;