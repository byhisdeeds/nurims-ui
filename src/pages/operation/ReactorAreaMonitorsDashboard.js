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

  const CHERENKOV_COLOR = "#256dfc"


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
        if (message.response.hasOwnProperty("data")) {
          console.log("--- RESPONSE.DATA-->", response.data)
          for (const data of response.data) {
            console.log("-->", data)
            if (this.poolRadmonRef.current && data.hasOwnProperty("id") && data.id === REACTOR_POOL_RADIATION_MONITOR_ID) {
              this.poolRadmonRef.current.update(data);
              console.log("REACTOR_POOL_RADIATION_MONITOR", data)
            } else if (this.ceilingRadmonRef.current && data.hasOwnProperty("id") && data.id === CEILING_RADIATION_MONITOR_ID) {
              this.ceilingRadmonRef.current.update(data);
              console.log("CEILING_RADIATION_MONITOR", data)
            } else if (this.ic1RadmonRef.current && data.hasOwnProperty("id") && data.id === IC1_RADIATION_MONITOR_ID) {
              this.ic1RadmonRef.current.update(data);
            } else if (this.ic3RadmonRef.current && data.hasOwnProperty("id") && data.id === IC3_RADIATION_MONITOR_ID) {
              this.ic3RadmonRef.current.update(data);
              console.log("IC3_RADIATION_MONITOR", data)
            }
            if (this.ref.current && data.hasOwnProperty("id") && data.id === REACTOR_POOL_RADIATION_MONITOR_ID) {
              this.ref.current.update(data);
              console.log("REACTOR_POOL_RADIATION_MONITOR", data)
            }
          }
        }
    } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  render() {
    const {titleFontSize, labelsFontSize, unitsFontSize, valueFontSize} = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render",);
    }
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


//{
//   "message": "",
//   "status": 0,
//   "data": [
//     {
//       "timestamp": "2024-06-06 10:42:52.518192",
//       "id": "server.timestamp"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:52.179000-05:00",
//       "id": "Control_Rod_Position",
//       "value": 0.3,
//       "units": "in",
//       "label": "Control Rod Position"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:52.026000-05:00",
//       "id": "Neutron_Flux",
//       "value": 0.0,
//       "units": "10^11 n/cm2/s",
//       "label": "Neutron Flux"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:52.128000-05:00",
//       "id": "Inlet_Temp",
//       "value": 20.05,
//       "units": "\\u00b0C",
//       "label": "Inlet Temp"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:52.077000-05:00",
//       "id": "Outlet_Temp",
//       "value": 20.47,
//       "units": "\\u00b0C",
//       "label": "Outlet Temp"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:52.099000-05:00",
//       "id": "971070",
//       "value": 0.02,
//       "units": "mR/hr",
//       "label": "IC3"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:52.056000-05:00",
//       "id": "971073",
//       "value": 0.01,
//       "units": "mR/hr",
//       "label": "Reactor"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:50.206000-05:00",
//       "id": "971098",
//       "value": 0.01,
//       "units": "mR/hr",
//       "label": "Ceiling"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:49.495000-05:00",
//       "id": "973014",
//       "value": 0.03,
//       "units": "mR/hr",
//       "label": "IC1"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:51.470000-05:00",
//       "id": "974017",
//       "value": 0.03,
//       "units": "mR/hr",
//       "label": "DI-Column"
//     },
//     {
//       "timestamp": "2024-06-06 10:42:52.596329",
//       "id": "query.stats",
//       "n": 9,
//       "total.duration": "0.00095",
//       "min.duration": "0.00009",
//       "max.duration": "0.00013",
//       "median.duration": "0.00011"
//     }
//   ]
// }