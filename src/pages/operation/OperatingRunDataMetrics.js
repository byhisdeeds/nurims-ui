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

const localizer = dayjsLocalizer(dayjs)

export const OPERATINGRUNDATAMETRICS_REF = "OperatingRunDataMetrics";

class OperatingRunDataMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: [],
      currentDay: dayjs(),
    };
    this.Module = OPERATINGRUNDATAMETRICS_REF;
  }

  ColoredDateCellWrapper = ({children, value}) => {
    console.log(">>>", value)
    return React.cloneElement(Children.only(children), {
        style: {
            ...children.style,
          backgroundColor: this.state.currentDay.isSame(value) ?
            this.props.theme.palette.primary.light : this.props.theme.palette.primary.main,
          color: this.state.currentDay.isSame(value) ?
            this.props.theme.palette.primary.contrastText : this.props.theme.palette.primary.contrastText,
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
  render() {
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
              defaultView="month"
              events={this.state.events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              components={{
                dateCellWrapper: this.ColoredDateCellWrapper
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