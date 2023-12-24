import React, {Children, Component} from 'react';
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";
import {withTheme} from "@mui/styles";
import {
  Calendar,
  dayjsLocalizer
} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import dayjs from 'dayjs'

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
    React.cloneElement(Children.only(children), {
        style: {
            ...children.style,
            backgroundColor: value < this.state.currentDay ? 'lightgreen' : 'lightblue',
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
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={this.state.events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        showMultiDayTimes
        selectable
        selected={this.state.selected}
        onSelectEvent={this.onSelectEvent}
        onSelectSlot={this.onSelectSlot}
        step={60}
        timeslots={1}
        components={{
          dateCellWrapper: this.ColoredDateCellWrapper
        }}
      />
    )
  }
}

OperatingRunDataMetrics.defaultProps = {
};

export default withTheme(OperatingRunDataMetrics);