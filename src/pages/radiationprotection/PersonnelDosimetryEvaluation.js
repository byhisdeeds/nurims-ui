import React, {Component} from "react";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";

export const PERSONNELDOSIMETRYEVALUATION_REF = "PersonnelDosimetryEvaluation";

class PersonnelDosimetryEvaluation extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
    };
    this.Module = PERSONNELDOSIMETRYEVALUATION_REF;
  }

  componentDidMount() {
    // this.props.send({cmd: 'dddd', module: MODULE})
  }

  ws_message = (message) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
  }

  render() {
    const { user } = this.state;
    return (
      <pre style={{fontSize: 16}}>
        ok
      </pre>
    );
  }
}

PersonnelDosimetryEvaluation.defaultProps = {
  send: (msg) => {},
};

export default PersonnelDosimetryEvaluation;