import React, {Component} from 'react';
import {
  Badge,
  IconButton
} from "@mui/material";
import {
  CloudDone,
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
    };
    this._mounted = false;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  componentDidMount() {
    this._mounted = true;
  }

  set_server_connections = (user_connections, sensor_connections) => {
    this.setState({ user_connections: user_connections, sensor_connections: sensor_connections })
  }

  setServerInfo = (data) => {
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    console.log(data)
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    // this.setState({ server_availability: Math.round(data * 100) })
  }

  render() {
    const { server_availability, user_connections, sensor_connections} = this.state
    return (
      <React.Fragment>
        <Badge
          sx={{marginLeft: "10px", paddingLeft: "10px"}}
          badgeContent={user_connections}
          showZero={true}
          color={"secondary"}
          title={"Active user server connections."}
        >
          <People/>
        </Badge>
        {/*<div style={{width: 20}}/>*/}
        {/*<Badge badgeContent={user_connections} color="secondary" title={"User web connections to the server"}>*/}
        {/*  <People/>*/}
        {/*</Badge>*/}
        {/*<div style={{width: 10}}/>*/}
        {/*<Badge badgeContent={sensor_connections} color="secondary" title={"Sensors connected to the server"}>*/}
        {/*  <Router/>*/}
        {/*</Badge>*/}
      </React.Fragment>
    );
  }
}

SystemInfoBadges.defaultProps = {
};

export default SystemInfoBadges;