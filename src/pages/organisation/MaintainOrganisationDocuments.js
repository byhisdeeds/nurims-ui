import React from 'react';

const MODULE = "MaintainOrganisationDocuments";

class MaintainOrganisationDocuments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
    };
  }

  componentDidMount() {
    // this.props.send({cmd: 'dddd', module: MODULE})
  }

  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", MODULE, message)
  }

  render() {
    const { user } = this.state;
    return (
      <pre style={{fontSize: 16}}>
        sdgfssr MaintainOrganisationDocuments aeeea
      </pre>
    );
  }
}

MaintainOrganisationDocuments.defaultProps = {
  send: (msg) => {},
};

export default MaintainOrganisationDocuments;