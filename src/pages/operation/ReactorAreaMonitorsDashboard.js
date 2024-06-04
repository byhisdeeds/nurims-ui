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
  Card,
  CardContent,
  Grid
} from "@mui/material";
import {
  TitleComponent
} from "../../components/CommonComponents";
import {
  CMD_GET_DATA_STREAM_METRICS_RECORDS,
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
import ValueStepChart from "../../components/ValueStepChart";

const localizer = dayjsLocalizer(dayjs)

export const REACTOR_AREA_MONITORS_DASHBOARD_REF = "ReactorAreaMonitorsDashboard";

export const NORMAL_LEVEL_STROKE_COLOR = "rgb(225,225,225)";
export const NORMAL_LEVEL_COLOR = "rgb(225,225,225)";
export const NORMAL_LEVEL_BACKGROUND_COLOR = "rgb(47,47,47)";
export const WARNING_LEVEL_STROKE_COLOR = "rgba(255,180,49,1)";
export const WARNING_LEVEL_COLOR = "#ffffff";
export const WARNING_LEVEL_BACKGROUND_COLOR = "rgba(255,180,49,1)";
export const HIGH_LEVEL_STROKE_COLOR = "rgba(255,0,0,1)";
export const HIGH_LEVEL_COLOR = "#ffffff";
export const HIGH_LEVEL_BACKGROUND_COLOR = "rgba(255,0,0,1)";
const MESSAGE_INLET_TEMPERATURE = 'Inlet_Temp'
const MESSAGE_OUTLET_TEMPERATURE = 'Outlet_Temp'
const MESSAGE_CONTROL_ROD_POSITION = 'Control_Rod_Position'
const MESSAGE_NEUTRON_FLUX = 'Neutron_Flux'
const DATASET_SIZE = 50;
const MESSAGE_POOL_CHILLER_TEMP = 'Pool_Chiller_Temp'

const REACTOR_POOL_RADIATION_MONITOR_TITLE = "Pool Radiation"
const REACTOR_CEILING_RADIATION_MONITOR_TITLE = "Ceiling Radiation"
const IC1_RADIATION_MONITOR_TITLE= "IC-1 Radiation"
const IC3_RADIATION_MONITOR_TITLE = "IC-3 Radiation"

const POOL_COOLING_TEMPERATURE_MONITOR_TITLE = "Pool Cooling Temperature"

const REACTOR_POOL_RADIATION_MONITOR_ID = "971073"
const CEILING_RADIATION_MONITOR_ID = "971098"
const IC1_RADIATION_MONITOR_ID = "973014"
const IC3_RADIATION_MONITOR_ID = "971070"

  CHERENKOV_COLOR = "#256dfc"

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

class ReactorAreaMonitorsDashboard extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      currentDay: dayjs(),
    };
    this.Module = REACTOR_AREA_MONITORS_DASHBOARD_REF;
    this.poolRadmonRef = React.createRef();
    this.ceilingRadmonRef = React.createRef();
    this.ic1RadmonRef = React.createRef();
    this.ic3RadmonRef = React.createRef();
    this.ref = React.createRef();
  }


  componentDidMount() {
    // this.props.send({
    //   cmd: CMD_GET_DATA_STREAM_METRICS_RECORDS,
    //   module: this.Module,
    //   startDate: "2023-12-01",
    //   endDate: "2023-12-31",
    //   "include.metadata": "true",
    // });
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
    return (
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card>
            <CardContent style={{paddingBottom: 0}}>
              <ValueStepChart
                ref={this.poolRadmonRef}
                title={REACTOR_POOL_RADIATION_MONITOR_TITLE}
                titleFontSize={titleFontSize}
                id={REACTOR_POOL_RADIATION_MONITOR_ID}
                units={"μSv/hr"}
                unitsFontSize={unitsFontSize}
                labelsFontSize={labelsFontSize}
                precision={2}
                datasize={DATASET_SIZE}
                valueDigitsWidth={6}
                valueFontSize={valueFontSize}
                yAxisIntervals={[0.1, 30, 60, 90, 120]}
                limits={[
                  {
                    from: 0.1,
                    to: 60,
                    stroke: NORMAL_LEVEL_STROKE_COLOR,
                    color: NORMAL_LEVEL_COLOR,
                    background: NORMAL_LEVEL_BACKGROUND_COLOR
                  },
                  {
                    from: 61,
                    to: 100,
                    label: "Warning",
                    stroke: WARNING_LEVEL_STROKE_COLOR,
                    color: WARNING_LEVEL_COLOR,
                    background: WARNING_LEVEL_BACKGROUND_COLOR
                  },
                  {
                    from: 101,
                    to: 120,
                    label: "High",
                    stroke: HIGH_LEVEL_STROKE_COLOR,
                    color: HIGH_LEVEL_COLOR,
                    background: HIGH_LEVEL_BACKGROUND_COLOR
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card>
            <CardContent style={{paddingBottom: 0}}>
              <ValueStepChart
                ref={this.ceilingRadmonRef}
                title={REACTOR_CEILING_RADIATION_MONITOR_TITLE}
                titleFontSize={titleFontSize}
                id={CEILING_RADIATION_MONITOR_ID}
                units={"μSv/hr"}
                unitsFontSize={unitsFontSize}
                labelsFontSize={labelsFontSize}
                precision={2}
                valueDigitsWidth={6}
                valueFontSize={valueFontSize}
                datasize={DATASET_SIZE}
                yAxisIntervals={[0.1, 10, 20, 30, 40, 50]}
                limits={[
                  {
                    from: 0.1,
                    to: 20,
                    stroke: NORMAL_LEVEL_STROKE_COLOR,
                    color: NORMAL_LEVEL_COLOR,
                    background: NORMAL_LEVEL_BACKGROUND_COLOR
                  },
                  {
                    from: 21,
                    to: 30,
                    label: "Warning",
                    stroke: WARNING_LEVEL_STROKE_COLOR,
                    color: WARNING_LEVEL_COLOR,
                    background: WARNING_LEVEL_BACKGROUND_COLOR
                  },
                  {
                    from: 31,
                    to: 50,
                    label: "High",
                    stroke: HIGH_LEVEL_STROKE_COLOR,
                    color: HIGH_LEVEL_COLOR,
                    background: HIGH_LEVEL_BACKGROUND_COLOR
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card>
            <CardContent style={{paddingBottom: 0}}>
              <ValueStepChart
                ref={this.ic1RadmonRef}
                title={IC1_RADIATION_MONITOR_TITLE}
                titleFontSize={titleFontSize}
                id={IC1_RADIATION_MONITOR_ID}
                units={"μSv/hr"}
                unitsFontSize={unitsFontSize}
                labelsFontSize={labelsFontSize}
                fillStep={true}
                precision={2}
                valueDigitsWidth={6}
                valueFontSize={valueFontSize}
                datasize={DATASET_SIZE}
                yAxisIntervals={[0.1, 20, 40, 60, 80, 100]}
                limits={[
                  {
                    from: 0.1,
                    to: 10,
                    stroke: NORMAL_LEVEL_STROKE_COLOR,
                    color: NORMAL_LEVEL_COLOR,
                    background: NORMAL_LEVEL_BACKGROUND_COLOR
                  },
                  {
                    from: 11,
                    to: 50,
                    label: "Warning",
                    stroke: WARNING_LEVEL_STROKE_COLOR,
                    color: WARNING_LEVEL_COLOR,
                    background: WARNING_LEVEL_BACKGROUND_COLOR
                  },
                  {
                    from: 51,
                    to: 100,
                    label: "High",
                    stroke: HIGH_LEVEL_STROKE_COLOR,
                    color: HIGH_LEVEL_COLOR,
                    background: HIGH_LEVEL_BACKGROUND_COLOR
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card>
            <CardContent style={{paddingBottom: 0}}>
              <ValueStepChart
                ref={this.ic3RadmonRef}
                title={IC3_RADIATION_MONITOR_TITLE}
                titleFontSize={titleFontSize}
                id={IC3_RADIATION_MONITOR_ID}
                units={"μSv/hr"}
                unitsFontSize={unitsFontSize}
                labelsFontSize={labelsFontSize}
                fillStep={true}
                precision={2}
                valueDigitsWidth={6}
                valueFontSize={valueFontSize}
                datasize={DATASET_SIZE}
                yAxisIntervals={[0.1, 20, 40, 60, 80, 100]}
                limits={[
                  {
                    from: 0.1,
                    to: 10,
                    stroke: NORMAL_LEVEL_STROKE_COLOR,
                    color: NORMAL_LEVEL_COLOR,
                    background: NORMAL_LEVEL_BACKGROUND_COLOR
                  },
                  {
                    from: 11,
                    to: 50,
                    label: "Warning",
                    stroke: WARNING_LEVEL_STROKE_COLOR,
                    color: WARNING_LEVEL_COLOR,
                    background: WARNING_LEVEL_BACKGROUND_COLOR
                  },
                  {
                    from: 51,
                    to: 100,
                    label: "High",
                    stroke: HIGH_LEVEL_STROKE_COLOR,
                    color: HIGH_LEVEL_COLOR,
                    background: HIGH_LEVEL_BACKGROUND_COLOR
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

ReactorAreaMonitorsDashboard.defaultProps = {
};

export default withTheme(ReactorAreaMonitorsDashboard);