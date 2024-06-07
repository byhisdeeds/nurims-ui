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
import CoreCard from "../../components/CoreCard";

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
    this.coreRef = React.createRef();
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
        if (isCommandResponse(message, CMD_SUBSCRIBE_TO_DATA_PUBLISHER)) {
          if (response.hasOwnProperty("data")) {
            const data = JSON.parse(response.data)
            if (this.coreRef.current) {
              this.coreRef.current.ws_message(data);
            }
          }
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  render() {
    if (this.context.debug) {
      ConsoleLog(this.Module, "render");
    }
    return (<Grid container>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <CoreCard ref={this.coreRef}/>
        </Grid>
      </Grid>

    )
  }
}

ReactorOperationParametersDashboard.defaultProps = {
};

export default withTheme(ReactorOperationParametersDashboard);