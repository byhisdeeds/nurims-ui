import React, {Children, Component} from 'react';
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
import {
  withTheme
} from "@mui/styles";
import {
  Calendar,
  Views,
  dayjsLocalizer
} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import dayjs from 'dayjs'
import {
  Grid
} from "@mui/material";
import {
  TitleComponent
} from "../../components/CommonComponents";
import {
  CMD_GET_DATA_STREAM_METRICS_RECORDS, CMD_SUBSCRIBE_TO_DATA_PUBLISHER, CMD_UNSUBSCRIBE_FROM_DATA_PUBLISHER,
  ITEM_ID,
  NURIMS_OPERATION_DATA_STREAM_METRICS,
} from "../../utils/constants";
import {
  isCommandResponse,
  messageHasResponse,
  messageResponseStatusOk
} from "../../utils/WebsocketUtils";
import {
  getRecordData
} from "../../utils/MetadataUtils";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";

const localizer = dayjsLocalizer(dayjs)

export const REACTOR_OPERATION_PARAMETERS_DASHBOARD_REF = "ReactorOperationParametersDashboard";

class ReactorOperationParametersDashboard extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      currentDay: dayjs(),
    };
    this.Module = REACTOR_OPERATION_PARAMETERS_DASHBOARD_REF;
  }


  componentDidMount() {
    this.props.send({
      cmd: CMD_SUBSCRIBE_TO_DATA_PUBLISHER,
      module: this.Module,
    });
  }

  componentWillUnmount() {
    this.props.send({
      cmd: CMD_UNSUBSCRIBE_FROM_DATA_PUBLISHER,
      module: this.Module,
    });
  }

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_DATA_STREAM_METRICS_RECORDS)) {
          // this.addEventFromMetrics(response.operation);
          this.refreshEventsFromMetrics(response.operation);
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  render() {
    const {events} = this.state;
    return <h2>Hi, I AREA PARAMETERS am a Car!</h2>;
  }
}

ReactorOperationParametersDashboard.defaultProps = {
};

export default withTheme(ReactorOperationParametersDashboard);