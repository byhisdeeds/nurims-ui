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
} from "../../utils/constants";

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
          id: 0,
          title: 'All Day Event very long title',
          allDay: true,
          start: new Date(2023, 3, 0),
          end: new Date(2023, 3, 1),
        },
        {
          id: 1,
          title: 'Long Event',
          start: new Date(2023, 3, 7),
          end: new Date(2023, 3, 10),
        },

        {
          id: 2,
          title: 'DTS STARTS',
          start: new Date(2016, 2, 13, 0, 0, 0),
          end: new Date(2016, 2, 20, 0, 0, 0),
        },

        {
          id: 3,
          title: 'DTS ENDS',
          start: new Date(2016, 10, 6, 0, 0, 0),
          end: new Date(2016, 10, 13, 0, 0, 0),
        },

        {
          id: 4,
          title: 'Some Event',
          start: new Date(2023, 3, 9, 0, 0, 0),
          end: new Date(2023, 3, 10, 0, 0, 0),
        },
        {
          id: 5,
          title: 'Conference',
          start: new Date(2023, 3, 11),
          end: new Date(2023, 3, 13),
          desc: 'Big conference for important people',
        },
        {
          id: 6,
          title: 'Meeting',
          start: new Date(2023, 3, 12, 10, 30, 0, 0),
          end: new Date(2023, 3, 12, 12, 30, 0, 0),
          desc: 'Pre-meeting meeting, to prepare for the meeting',
        },
        {
          id: 7,
          title: 'Lunch',
          start: new Date(2023, 3, 12, 12, 0, 0, 0),
          end: new Date(2023, 3, 12, 13, 0, 0, 0),
          desc: 'Power lunch',
        },
        {
          id: 8,
          title: 'Meeting',
          start: new Date(2023, 3, 12, 14, 0, 0, 0),
          end: new Date(2023, 3, 12, 15, 0, 0, 0),
        },
        {
          id: 9,
          title: 'Happy Hour',
          start: new Date(2023, 3, 12, 17, 0, 0, 0),
          end: new Date(2023, 3, 12, 17, 30, 0, 0),
          desc: 'Most important meal of the day',
        },
        {
          id: 10,
          title: 'Dinner',
          start: new Date(2023, 3, 12, 20, 0, 0, 0),
          end: new Date(2023, 3, 12, 21, 0, 0, 0),
        },
        {
          id: 11,
          title: 'Planning Meeting with Paige',
          start: new Date(2023, 3, 13, 8, 0, 0),
          end: new Date(2023, 3, 13, 10, 30, 0),
        },
        {
          id: 11.1,
          title: 'Inconvenient Conference Call',
          start: new Date(2023, 3, 13, 9, 30, 0),
          end: new Date(2023, 3, 13, 12, 0, 0),
        },
        {
          id: 11.2,
          title: "Project Kickoff - Lou's Shoes",
          start: new Date(2023, 3, 13, 11, 30, 0),
          end: new Date(2023, 3, 13, 14, 0, 0),
        },
        {
          id: 11.3,
          title: 'Quote Follow-up - Tea by Tina',
          start: new Date(2023, 3, 13, 15, 30, 0),
          end: new Date(2023, 3, 13, 16, 0, 0),
        },
        {
          id: 12,
          title: 'Late Night Event',
          start: new Date(2023, 3, 17, 19, 30, 0),
          end: new Date(2023, 3, 18, 2, 0, 0),
        },
        {
          id: 12.5,
          title: 'Late Same Night Event',
          start: new Date(2023, 3, 17, 19, 30, 0),
          end: new Date(2023, 3, 17, 23, 30, 0),
        },
        {
          id: 13,
          title: 'Multi-day Event',
          start: new Date(2023, 3, 20, 19, 30, 0),
          end: new Date(2023, 3, 22, 2, 0, 0),
        },
        {
          id: 14,
          title: 'Today',
          start: new Date(new Date().setHours(new Date().getHours() - 1)),
          end: new Date(new Date().setHours(new Date().getHours() + 1)),
        },
        {
          id: 144,
          title: 'Today',
          start: new Date(new Date().setHours(new Date().getHours() - 2)),
          end: new Date(new Date().setHours(new Date().getHours() + 2)),
        },
        {
          id: 1444,
          title: 'Today',
          start: new Date(new Date().setHours(new Date().getHours() - 3)),
          end: new Date(new Date().setHours(new Date().getHours() + 3)),
        },
        {
          id: 16,
          title: 'Video Record',
          start: new Date(2023, 3, 14, 15, 30, 0),
          end: new Date(2023, 3, 14, 19, 0, 0),
        },
        {
          id: 17,
          title: 'Dutch Song Producing',
          start: new Date(2023, 3, 14, 16, 30, 0),
          end: new Date(2023, 3, 14, 20, 0, 0),
        },
        {
          id: 18,
          title: 'Itaewon Meeting',
          start: new Date(2023, 3, 14, 16, 30, 0),
          end: new Date(2023, 3, 14, 17, 30, 0),
        },
        {
          id: 19,
          title: 'Online Coding Test',
          start: new Date(2023, 3, 14, 17, 30, 0),
          end: new Date(2023, 3, 14, 20, 30, 0),
        },
        {
          id: 20,
          title: 'An overlapped Event',
          start: new Date(2023, 3, 14, 17, 0, 0),
          end: new Date(2023, 3, 14, 18, 30, 0),
        },
        {
          id: 21,
          title: 'Phone Interview',
          start: new Date(2023, 3, 14, 17, 0, 0),
          end: new Date(2023, 3, 14, 18, 30, 0),
        },
        {
          id: 22,
          title: 'Cooking Class',
          start: new Date(2023, 3, 14, 17, 30, 0),
          end: new Date(2023, 3, 14, 19, 0, 0),
        },
        {
          id: 23,
          title: 'Go to the gym',
          start: new Date(2023, 3, 14, 18, 30, 0),
          end: new Date(2023, 3, 14, 20, 0, 0),
        },
        {
          id: 24,
          title: '971070',
          start: new Date(2023, 9, 30, 0, 0, 1),
          end: new Date(2023, 9, 30, 23, 59, 57),
          resourceId: "971070"
        },
        {
          id: 25,
          title: '971073',
          start: new Date(2023, 9, 30, 0, 0, 1),
          end: new Date(2023, 9, 30, 23, 59, 58),
          resourceId: "971073"
        },
        {
          id: 26,
          title: '971098',
          start: new Date(2023, 9, 30, 0, 0, 1),
          end: new Date(2023, 9, 30, 23, 59, 56),
          resourceId: "971098"
        },
        {
          id: 27,
          title: '973014',
          start: new Date(2023, 9, 30, 0, 0, 1),
          end: new Date(2023, 9, 30, 23, 59, 56),
          resourceId: "973014"
        },
        {
          id: 28,
          title: '974017',
          start: new Date(2023, 9, 30, 0, 0, 3),
          end: new Date(2023, 9, 30, 9, 33, 32),
          resourceId: "974017"
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
      this.props.send({
        cmd: CMD_GENERATE_STREAM_DATA_METRICS,
        module: this.Module,
        startYear: 2023,
        endYear: 2023,
        startMonth: 12,
        endMonth: 12,
        "run_in_background": "true",
        "forceOverwrite": true
      });
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
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
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