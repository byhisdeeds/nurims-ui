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
      title: "",
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
    this.setState({
      user_connections: data.clients.length,
      title: data.clients.reduce((prev, obj) => {
        return prev + obj.name + "<br/>";
      }, "")
    })
  }

  render() {
    const { server_availability, user_connections, title} = this.state
    return (
      <React.Fragment>
        <Badge
          sx={{marginLeft: "10px", paddingLeft: "10px"}}
          badgeContent={user_connections}
          showZero={true}
          color={"secondary"}
          title={title}
        >
          <People/>
        </Badge>
      </React.Fragment>
    );
  }
}

SystemInfoBadges.defaultProps = {
};

export default SystemInfoBadges;