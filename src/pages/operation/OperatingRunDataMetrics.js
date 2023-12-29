import React, {Children, Component} from 'react';
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";
import {
  withTheme
} from "@mui/styles";
import {
  Calendar,
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
  CMD_GENERATE_STREAM_DATA_METRICS,
  CMD_GET_DATA_STREAM_METRICS_RECORDS,
  CMD_GET_SAMPLE_IRRADIATION_LOG_RECORDS,
  CMD_GET_STREAM_DATA_METRICS_RECORDS, ITEM_ID, NURIMS_OPERATION_DATA_STREAM_METRICS,
} from "../../utils/constants";
import {isCommandResponse, messageHasResponse, messageResponseStatusOk} from "../../utils/WebsocketUtils";
import {renderEditSingleSelectCell} from "@mui/x-data-grid";
import {getRecordData} from "../../utils/MetadataUtils";

const localizer = dayjsLocalizer(dayjs)

export const OPERATINGRUNDATAMETRICS_REF = "OperatingRunDataMetrics";

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
    type: "974017",
    color: '#dedede',
    backgroundColor: '#408040',
  },
  {
    type: "973014",
    color: '#dedede',
    backgroundColor: '#b5843b',
  },
  {
    type: "971070",
    color: '#535353',
    backgroundColor: '#efcda4',
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
      <em style={{ color: 'magenta' }}>{event.title}</em>
      {"event.desc"}<br/>
      {"event.desc"}<br/>
      {"event.desc"}
    </span>
  )
}

class OperatingRunDataMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          id: 24,
          title: '971070',
          start: new Date(2023, 9, 30, 0, 0, 1),
          end: new Date(2023, 9, 30, 23, 59, 57),
          quality: 1,
          count: 0
        },
        {
          id: 25,
          title: '971073',
          start: new Date(2023, 9, 30, 0, 0, 1),
          end: new Date(2023, 9, 30, 23, 59, 58),
          quality: 1,
          count: 0
        },
        {
          id: 26,
          title: '971098',
          start: new Date(2023, 9, 30, 0, 0, 1),
          end: new Date(2023, 9, 30, 23, 59, 56),
          quality: 1,
          count: 0
        },
        {
          id: 27,
          title: '973014',
          start: new Date(2023, 9, 30, 0, 0, 1),
          end: new Date(2023, 9, 30, 23, 59, 56),
          quality: 1,
          count: 0
        },
        {
          id: 28,
          title: '974017',
          start: new Date(2023, 9, 30, 0, 0, 3),
          end: new Date(2023, 9, 30, 9, 33, 32),
          quality: 1,
          count: 0
        },
      ],
      currentDay: dayjs(),
    };
    this.Module = OPERATINGRUNDATAMETRICS_REF;
    this.MetricResources = [
      {
        id: "974017",
        title: '974017 ttile',
      },
      {
        id: "973014",
        title: '973014 title',
        backgroundColor: '#b5843b',
      },
      {
        id: "971070",
        color: '971070 title',
      },
      {
        id: "971098",
        color: '971098 title',
      },
      {
        id: "971073",
        color: '971073 title',
      }
    ];
  }


  componentDidMount() {
      // this.props.send({
      //   cmd: CMD_DISCOVER_DATA_STREAM_METRICS,
      //   module: this.Module,
      //   startYear: 2023,
      //   endYear: 2023,
      //   startMonth: 12,
      //   endMonth: 12,
      //   "run_in_background": "true",
      //   "forceOverwrite": true
      // });
    this.props.send({
      cmd: CMD_GET_DATA_STREAM_METRICS_RECORDS,
      module: this.Module,
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      "include.metadata": "true",
    });
  }

  addEventFromMetrics = (records) => {
    const events = this.state.events;
    let update = false;
    for (const record of records) {
      const r = getRecordData(record, NURIMS_OPERATION_DATA_STREAM_METRICS, {});
      let found = false;
      for (const event of events) {
        if (event.id === record[ITEM_ID]) {
          found = true;
          update = true;
          event.title = r.id;
          event.start = new Date(r.min_ts);
          event.end = new Date(r.max_ts);
          event.quality = r.quality;
          event.count = r.count;
        }
      }
      if (!found) {
        events.push({
          id: record[ITEM_ID],
          title: r.id,
          start: new Date(r.min_ts),
          end: new Date(r.max_ts),
          quality: 1,
          count: r.count
        })
      }
    }
    if (update) {
      this.setState({events: events});
    }
  }

  ColoredDateCellWrapper = ({children, value}) => {
    const dayjs_value = dayjs(value);
    const is_same = this.state.currentDay.year() === dayjs_value.year() &&
      this.state.currentDay.month() === dayjs_value.month() && this.state.currentDay.date() === dayjs_value.date();
    return React.cloneElement(Children.only(children), {
        style: {
            ...children.style,
          backgroundColor: is_same ? this.props.theme.palette.primary.main : this.props.theme.palette.background.paper1,
          // color: is_same ? this.props.theme.palette.error.main : this.props.theme.palette.primary.contrastText,
        },
    });
  }
  ws_message = (message) => {
    console.log("ON_WS_MESSAGE", this.Module, message)
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, CMD_GET_DATA_STREAM_METRICS_RECORDS)) {
          console.log("RESPONSE. OPERATION", response.operation)
          addEventFromMetrics(response.operation);
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  getEventStyle = (event) => {
    const event_style  = MetricEventStyles.find(css => css.type === event.title);
    return {
      className: 'special-day',
      style: {
        color: event_style ? event_style.color : "#abc",
        backgroundColor: event_style ? event_style.backgroundColor : "#16a",
        borderRadius: 'unset'
      },
    }
  }

  render() {
    const {events} = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2} style={{paddingLeft: 0, paddingTop: 0}}>
          <Grid item xs={12}>
            <TitleComponent title={this.props.title}/>
          </Grid>
          <Grid item xs={12}>
            <Calendar
              localizer={localizer}
              defaultDate={new Date()}
              defaultView={"month"}
              dateFormat={"YYYY-MM-DD"}
              events={events}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              style={{ height: 500 }}
              eventPropGetter={this.getEventStyle}
              // resourceAccessor="resourceId"
              // resourceIdAccessor="id"
              // resources={this.MetricResources}
              // resourceTitleAccessor="resourceTitle"
              components={{
                dateCellWrapper: this.ColoredDateCellWrapper,
                agenda: {
                  event: EventAgenda
                }
              }}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

OperatingRunDataMetrics.defaultProps = {
};

export default withTheme(OperatingRunDataMetrics);