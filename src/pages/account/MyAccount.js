import React from 'react';
import JSONPretty from "react-json-pretty";

const MODULE = "MyAccount";

class MyAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
    };
  }

  componentDidMount() {
    this.props.send({cmd: 'dddd', module: MODULE})
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
  }

  render() {
    const { user } = this.state;
    return (
      <pre style={{fontSize: 16}}>
        <JSONPretty id="json-pretty" data={user} />
      </pre>
    );
  }
}

MyAccount.defaultProps = {
  send: (msg) => {},
};

export default MyAccount;