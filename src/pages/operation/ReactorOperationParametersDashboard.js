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
import * as console from "node:console";

const localizer = dayjsLocalizer(dayjs)

export const REACTOR_OPERATION_PARAMETERS_DASHBOARD_REF = "ReactorOperationParametersDashboard";

const MetricsEventTypes = [
  {
    type: 1,
    title: 'DRM Day Data',
    details: {},
  },
  {
    type: 2,
    title: 'Yokogawa Day Data',
    details: {},
  },
];

const MetricEventStyles = [
  {
    type: "quality-1",
    color: '#dedede',
    backgroundColor: '#408040',
  },
  {
    type: "quality-0",
    color: '#dedede',
    backgroundColor: 'rgba(255,91,91,0.52)',
  },
  {
    type: "<50%",
    color: '#bebebe',
    backgroundColor: 'rgb(154,111,58)',
  },
  {
    type: "971098",
    color: '#535353',
    backgroundColor: '#d9a4ef',
  },
  {
    type: "971073",
    color: '#535353',
    backgroundColor: '#a4efd8',
  }
];

function EventAgenda({ event }) {
  return (
    <span>
      <em style={{ color: '#e8e8e8' }}>{event.title}</em><br/>
      Count: {event.count}<br/>
      Quality: {event.quality}<br/>
    </span>
  )
}

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

// addEventFromMetrics = (records) => {
  //   const events = this.state.events;
  //   let update = false;
  //   for (const record of records) {
  //     const r = getRecordData(record, NURIMS_OPERATION_DATA_STREAM_METRICS, {});
  //     let found = false;
  //     for (const event of events) {
  //       if (event.id === record[ITEM_ID]) {
  //         found = true;
  //         update = true;
  //         event.title = r.id;
  //         event.start = new Date(r.min_ts);
  //         event.end = new Date(r.max_ts);
  //         event.quality = r.quality;
  //         event.count = r.count;
  //         break;
  //       }
  //     }
  //     if (!found) {
  //       events.push({
  //         id: record[ITEM_ID],
  //         title: r.id,
  //         start: new Date(r.min_ts),
  //         end: new Date(r.max_ts),
  //         quality: r.quality,
  //         count: r.count
  //       })
  //     }
  //   }
  //   if (update) {
  //     this.setState({events: events});
  //   }
  // }

  // refreshEventsFromMetrics = (records) => {
  //   const events = [];
  //   for (const record of records) {
  //     const r = getRecordData(record, NURIMS_OPERATION_DATA_STREAM_METRICS, {});
  //     events.push({
  //       id: record[ITEM_ID],
  //       title: r.hasOwnProperty("label") ? (r.label !== r.id ? `${r.label} (${r.id})` : r.id) : r.id,
  //       start: new Date(r.min_ts),
  //       end: new Date(r.max_ts),
  //       quality: r.quality,
  //       count: r.count
  //     });
  //   }
  //   this.setState({events: events});
  // }

  // ColoredDateCellWrapper = ({children, value}) => {
  //   const dayjs_value = dayjs(value);
  //   const is_same = this.state.currentDay.year() === dayjs_value.year() &&
  //     this.state.currentDay.month() === dayjs_value.month() && this.state.currentDay.date() === dayjs_value.date();
  //   return React.cloneElement(Children.only(children), {
  //       style: {
  //           ...children.style,
  //         backgroundColor: is_same ? this.props.theme.palette.primary.main : this.props.theme.palette.background.paper1,
  //         // color: is_same ? this.props.theme.palette.error.main : this.props.theme.palette.primary.contrastText,
  //       },
  //   });
  // }
  ws_message = (message) => {
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

  // getEventStyle = (event) => {
  //   let event_style = "#abc";
  //   if (event.quality === 0 || event.count === 0) {
  //     event_style  = MetricEventStyles.find(css => css.type === "quality-0")
  //   } else if (event.count < 10000) {
  //     event_style  = MetricEventStyles.find(css => css.type === "<50%")
  //   } else {
  //     event_style  = MetricEventStyles.find(css => css.type === "quality-1")
  //   }
  //   return {
  //     className: 'special-day',
  //     style: {
  //       color: event_style ? event_style.color : "#abc",
  //       backgroundColor: event_style ? event_style.backgroundColor : "#16a",
  //       borderRadius: 'unset'
  //     },
  //   }
  // }

  // onRangeChange = (range) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.Module, "onRangeChange", "range", range);
  //   }
  //   if (range.hasOwnProperty("start") && range.hasOwnProperty("end")) {
  //     this.props.send({
  //       cmd: CMD_GET_DATA_STREAM_METRICS_RECORDS,
  //       module: this.Module,
  //       startDate: range.start.toISOString(),
  //       endDate: range.end.toISOString(),
  //       "include.metadata": "true",
  //     });
  //   }
  // }

  render() {
    const {events} = this.state;
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    return <h2>Hi, I AREA PARAMETERS am a Car!</h2>;
  }
}

ReactorOperationParametersDashboard.defaultProps = {
};

export default withTheme(ReactorOperationParametersDashboard);