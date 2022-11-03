import React, {Component} from 'react';
import {
  BLANK_PDF,
} from "../../utils/constants";
import {
  Grid,
  Stack,
  IconButton,
  Slider
} from "@mui/material";
import {toast} from "react-toastify";
import PdfViewer from "../../components/PdfViewer";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {withTheme} from "@mui/styles";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from "@mui/material/TextField";
import {TitleComponent} from "../../components/CommonComponents";

const MODULE = "MaintenanceSchedule";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const periodMarks = [
  {
    value: 0,
    label: 'Jan',
  },
  {
    value: 3,
    label: 'Apr',
  },
  {
    value: 6,
    label: 'Jul',
  },
  {
    value: 9,
    label: 'Oct',
  },
  {
    value: 11,
    label: 'Dec',
  },
];

class MaintenanceSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdf: BLANK_PDF,
      year: new Date(),
      period: [0, 11],
    };
  }

  ws_message = (message) => {
    // console.log("ON_WS_MESSAGE", MODULE, message)
    if (message.hasOwnProperty("response")) {
      const response = message.response;
      if (response.hasOwnProperty("status") && response.status === 0) {
        if (message.hasOwnProperty("cmd") && message.cmd === CMD_GENERATE_SSC_MAINTENANCE_SCHEDULE_PDF) {
          this.setState({ pdf: message.data.pdf });
        }
      } else {
        toast.error(response.message);
      }
    }
  }

  handleYearChange = (year) => {
    this.setState({ year: year });
  }

  handlePeriodChange = (event, period) => {
    this.setState({ period: period });
  }

  GenerateMaintenanceSchedulePdf = () => {
    this.props.send({
      cmd: CMD_GENERATE_SSC_MAINTENANCE_SCHEDULE_PDF,
      year: this.state.year.toISOString().substring(0,4),
      period: this.state.period,
      module: MODULE,
    });
  }

  valueLabelFormat = (value) => {
    return months[value];
  }

  render() {
    const { pdf, year, period, } = this.state;
    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year']}
                  label="Maintenance Year"
                  value={year}
                  onChange={this.handleYearChange}
                  renderInput={(params) => <TextField {...params} style={{width: '20ch'}}/>}
                />
              </LocalizationProvider>
              <Slider
                style={{marginRight: 24, marginLeft: 24}}
                // getAriaLabel={() => 'Temperature range'}
                value={period}
                onChange={this.handlePeriodChange}
                valueLabelDisplay="auto"
                // getAriaValueText={this.getValueText}
                valueLabelFormat={this.valueLabelFormat}
                step={1}
                marks={periodMarks}
                min={0}
                max={11}
              />
              <IconButton onClick={this.GenerateMaintenanceSchedulePdf}>
                <FileDownloadIcon/>
              </IconButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <PdfViewer height={"800px"} source={ pdf } />
          </Grid>
        </Grid>
      </React.Fragment>
    );

  }
}

MaintenanceSchedule.defaultProps = {
};

export default withTheme(MaintenanceSchedule);