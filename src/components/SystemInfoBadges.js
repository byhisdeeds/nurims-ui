import React, {Component} from 'react';
import {
  Badge,
  IconButton
} from "@mui/material";
import {
  CloudDone,
  NetworkCheck,
  People,
  Router
} from "@mui/icons-material";

class SystemInfoBadges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server_availability: 0,
      user_connections: 0,
      sensor_connections: 0,
      network_ready: false
    };
    this._mounted = false;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentDidMount() {
    this._mounted = true;
  }

  set_network_ready = (value) => {
    this.setState({ network_ready: value })
  }

  set_server_connections = (user_connections, sensor_connections) => {
    this.setState({ user_connections: user_connections, sensor_connections: sensor_connections })
  }

  set_server_availability = (data) => {
    this.setState({ server_availability: Math.round(data * 100) })
  }

  render() {
    const { server_availability, user_connections, sensor_connections, network_ready} = this.state
    return (
      <React.Fragment>
        <Badge
          badgeContent={server_availability}
          showZero={true}
          color="secondary"
          title={"% availability of server over the last 10 days"}
        >
          <CloudDone/>
        </Badge>
        <div style={{width: 20}}/>
        <Badge badgeContent={user_connections} color="secondary" title={"User web connections to the server"}>
          <People/>
        </Badge>
        <div style={{width: 10}}/>
        <Badge badgeContent={sensor_connections} color="secondary" title={"Sensors connected to the server"}>
          <Router/>
        </Badge>
        <IconButton size="large">
          <NetworkCheck color={'inherit'} style={{color: network_ready ? '#4CAF50' : '#F44336'}}/>
        </IconButton>
      </React.Fragment>
    );
  }
}

SystemInfoBadges.defaultProps = {
};

export default SystemInfoBadges;