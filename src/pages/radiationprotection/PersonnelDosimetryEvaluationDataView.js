import React, {Component} from 'react';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  TableCell,
  Typography,
  TextField,
  Button,
  Checkbox
} from "@mui/material";
import dayjs from "dayjs";
import {
  getRecordMetadataValue,
  getDateRangeFromDateString,
  getDateRangeAsDays
} from "../../utils/MetadataUtils";
import {
  getPropertyValue,
} from "../../utils/PropertyUtils";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  NURIMS_DOSIMETRY_BATCH_ID,
  NURIMS_DOSIMETRY_DEEP_DOSE,
  NURIMS_DOSIMETRY_EXTREMITY_DOSE,
  NURIMS_DOSIMETRY_MEASUREMENTS,
  NURIMS_DOSIMETRY_MONITOR_PERIOD,
  NURIMS_DOSIMETRY_SHALLOW_DOSE,
  NURIMS_DOSIMETRY_TIMESTAMP,
  NURIMS_DOSIMETRY_TYPE,
  NURIMS_DOSIMETRY_UNITS,
  NURIMS_DOSIMETRY_WRIST_DOSE,
  NURIMS_WITHDRAWN,
  WHOLE_BODY,
  EXTREMITY,
  WRIST,
  CMD_GENERATE_PERSONNEL_DOSE_EVALUATION_PDF,
} from "../../utils/constants";
import {PageableTable} from "../../components/CommonComponents";
import {withTheme} from "@mui/styles";
import Charts from "react-apexcharts";
import * as ss from "simple-statistics"
import {doseProfileStats, doseStats} from "../../utils/StatsUtils";
import {ConfirmRemoveRecordDialog, PdfViewerDialog} from "../../components/UtilityDialogs";
import {isCommandResponse, messageHasResponse, messageResponseStatusOk} from "../../utils/WebsocketUtils";
import {
  PERSONNELDOSIMETRYEVALUATION_REF
} from "./PersonnelDosimetryEvaluation";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";
import PropTypes from "prop-types";

const doseUnits = "mSv";


function getMonitorPeriod(selection, field, missingValue) {
  const period = selection.hasOwnProperty(field) ? selection[field] : "1900-01-01 to 1900-01-01";
  return getDateRangeFromDateString(period.replaceAll(" to ", "|"), missingValue);
}

function filterRecordsByRecordType(rawData, recordType) {
  const rows = [];
  for (const d of rawData) {
    if (d[NURIMS_DOSIMETRY_TYPE] === recordType) {
      if (recordType === WHOLE_BODY) {
        if (d[NURIMS_DOSIMETRY_SHALLOW_DOSE] === 0 && d[NURIMS_DOSIMETRY_DEEP_DOSE] === 0) {
          d["use"] = false;
        }
      } else if (recordType === "extremity") {
        if (d[NURIMS_DOSIMETRY_EXTREMITY_DOSE] === 0) {
          d["use"] = false;
        }
      } else if (recordType === "wrist") {
        if (d[NURIMS_DOSIMETRY_WRIST_DOSE] === 0) {
          d["use"] = false;
        }
      }
      rows.push(d);
    }
  }
  return rows;
}

class PersonnelDosimetryEvaluationDataView extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      pdf: '',
      pdfReady: false,
      groupDataRange: 1,
      measurements: {},
      dosimetryType: "",
      busy: 0,
      record: {},
      selection: {},
      readonly: true,
      nobs: 0,
      d0_min: 0,
      d0_max: 0,
      d0_mean: 0,
      d0_std: 0,
      d1_min: 0,
      d1_max: 0,
      d1_mean: 0,
      d1_std: 0,
      d0_skewness: 0,
      d1_skewness: 0,
      series: [],
      options: {
        chart: {
          type: 'boxPlot',
          height: 200,
          foreColor: props.theme.palette.text.secondary
        },
        yaxis: {
          forceNiceScale: true,
          min: 0,
        },
        tooltip: {
          theme: 'dark',
        },
        title: {
          text: 'Data from 2017-01-01 to 2022-04-23',
          align: 'left'
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '50%'
          },
          boxPlot: {
            colors: {
              upper: '#7fb1ff',
              lower: '#b6dbf8'
            }
          }
        },
        stroke: {
          colors: ['#6c757d']
        }
      },
      hoptions: {
        chart: {
          id: "basic-bar",
          foreColor: props.theme.palette.text.secondary
        },
        tooltip: {
          theme: 'dark',
        },
        yaxis: {
          title: {
            text: 'Count'
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          title: {
            text: `Dose\n(${doseUnits})`,
          },
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
      },
      hseries: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ],
      profile_series: [],
      profile_options: {
        chart: {
          type: 'boxPlot',
          height: 200,
          foreColor: props.theme.palette.text.secondary
        },
        yaxis: {
          forceNiceScale: true,
          min: 0,
        },
        tooltip: {
          theme: 'dark',
        },
        title: {
          text: 'Profile from ',
          align: 'left'
        },
        colors:['#7da169', '#7fb1ff'],
        plotOptions: {
          boxPlot: {
            colors: {
              upper: '#7fb1ff',
              lower: '#b6dbf8'
            }
          }
        },
        stroke: {
          colors: ['#d7d7d7']
        }
      }
    };
    this.ref = React.createRef();
    this.Module = "PersonnelDosimetryEvaluationDataView";
    this.cells = [
      {
        id: "use",
        align: 'center',
        disablePadding: true,
        label: '',
        width: '8%',
        sortField: true,
      },
      {
        id: NURIMS_DOSIMETRY_BATCH_ID,
        align: 'left',
        disablePadding: true,
        label: <Typography>Batch ID</Typography>,
        width: '20%',
        sortField: true,
      },
      {
        id: NURIMS_DOSIMETRY_TIMESTAMP,
        align: 'left',
        disablePadding: true,
        label: <Typography>Timestamp</Typography>,
        width: '20%',
        sortField: true,
        format: (row, cell) => {
          // return row[cell] ? format(parseISO(row[cell]), "yyyy-MM-dd HH:mm:ss") : row[cell]
          return row[cell] ? dayjs(row[cell], "yyyy-MM-dd HH:mm:ss").format("yyyy-MM-dd HH:mm:ss") : row[cell]
        },
      },
      {
        id: NURIMS_DOSIMETRY_MONITOR_PERIOD,
        align: 'left',
        disablePadding: true,
        label: <Typography>Monitor Period</Typography>,
        width: '20%',
        sortField: true,
        format: (row, cell) => {
          return row[cell] ?
            <span>
            <Typography>{row[cell]}</Typography>
            <Typography>{getDateRangeAsDays(row[cell].replaceAll(" to ", "|"), 0)} days</Typography>
          </span> : row[cell]
        },
      },
      {
        id: NURIMS_DOSIMETRY_SHALLOW_DOSE,
        align: 'left',
        disablePadding: true,
        label: <span><Typography>Shallow</Typography><Typography>({doseUnits})</Typography></span>,
        width: '8%',
        sortField: true,
        format: (row, cell) => {
          return row[cell] ?
            <span
              style={{color: row[`${NURIMS_DOSIMETRY_SHALLOW_DOSE}.qa`] === '>2' ? this.props.theme.palette.warning.main : 'inherit'}}>
            <Typography>{row[cell].toFixed(2)}</Typography>
            <Typography>{row[`${NURIMS_DOSIMETRY_SHALLOW_DOSE}.qa`]}</Typography>
          </span> : row[cell]
        },
      },
      {
        id: NURIMS_DOSIMETRY_DEEP_DOSE,
        align: 'left',
        disablePadding: true,
        label: <span><Typography>Deep</Typography><Typography>({doseUnits})</Typography></span>,
        width: '8%',
        sortField: true,
        format: (row, cell) => {
          return row[cell] ? row[cell].toFixed(2) : row[cell]
        },
      },
      {
        id: NURIMS_DOSIMETRY_EXTREMITY_DOSE,
        align: 'left',
        disablePadding: true,
        label: <span><Typography>Extremity</Typography><Typography>({doseUnits})</Typography></span>,
        width: '8%',
        sortField: true,
        format: (row, cell) => {
          return row[cell] ? row[cell].toFixed(2) : row[cell]
        },
      },
      {
        id: NURIMS_DOSIMETRY_WRIST_DOSE,
        align: 'left',
        disablePadding: true,
        label: <span><Typography>Wrist</Typography><Typography>({doseUnits})</Typography></span>,
        width: '8%',
        sortField: true,
        format: (row, cell) => {
          return row[cell] ? row[cell].toFixed(2) : row[cell]
        },
      },
    ];
    this.rows = [];
    this.rawData = [];
  }

  updateStatistics = (rows, dosimetryType) => {
    const {
      d0,
      q0,
      q1,
      d0_mean,
      d1_mean,
      d0_std,
      d1_std,
      d0_skewness,
      d1_skewness,
      series_data,
      ts_min,
      ts_max,
      b0,
      h_series_data
    } = doseStats(rows, dosimetryType);
    const a = `Data from ${ts_min ? ts_min.format("MMM io, yyyy") : ""} to ${ts_max ? ts_max.format("MMM io, yyyy") : ""}`

    this.setState(pstate => {
      return {
        dosimetryType: dosimetryType,
        nobs: d0.length,
        d0_min: q0[0],
        d0_max: q0[4],
        d1_min: q1[0],
        d1_max: q1[4],
        d0_mean: d0_mean,
        d1_mean: d1_mean,
        d0_std: d0_std,
        d1_std: d1_std,
        d0_skewness: d0_skewness,
        d1_skewness: d1_skewness,
        series: [
          {
            data: series_data
          }
        ],
        options: {
          ...this.state.options,
          title: {
            ...this.state.options.title,
            // text: `Data from ${ts_min ? format(ts_min, "MMM io, yyyy") : ""} to ${ts_max ? format(ts_max, "MMM io, yyyy") : ""}`
            text: `Data from ${ts_min ? ts_min.format("MMM io, yyyy") : ""} to ${ts_max ? ts_max.format("MMM io, yyyy") : ""}`
          }
        },
        hoptions: {
          ...this.state.hoptions,
          xaxis: {
            categories: b0.reduce((prev, obj) => {
              prev.push(obj.label);
              return prev;
            }, [])
          }
        },
        hseries: h_series_data
      }
    });
  }

  updateDoseProfileStatistics = (rows, dosimetryType, groupDataRange) => {

    const profile_series_data = doseProfileStats(rows, dosimetryType, groupDataRange);

    this.setState(pstate => {
      return {
        profile_series: profile_series_data,
        groupDataRange: groupDataRange
      }
    });
  }

  handleChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleChange", "target.id", e.target.id, "target.value", e.target.value);
    }
    const options = this.state.options;
    let dosimetryType = this.state.dosimetryType;
    if (e.target.id === "whole-body-record") {
      if (e.target.checked) {
        dosimetryType = WHOLE_BODY;
        this.rows = filterRecordsByRecordType(this.rawData, dosimetryType)
      }
    } else if (e.target.id === "extremity-record") {
      if (e.target.checked) {
        dosimetryType = EXTREMITY;
        this.rows = filterRecordsByRecordType(this.rawData, dosimetryType)
      }
    } else if (e.target.id === "wrist-record") {
      if (e.target.checked) {
        dosimetryType = WRIST;
        this.rows = filterRecordsByRecordType(this.rawData, dosimetryType)
      }
    } else if (e.target.id.startsWith("data-filter-")) {
      const selected = e.target.id.replaceAll("data-filter-", "");
      for (const row of this.rows) {
        if (row[NURIMS_DOSIMETRY_BATCH_ID] === selected) {
          row["use"] = e.target.checked;
        }
      }
    }

    this.updateStatistics(this.rows, dosimetryType);
    this.updateDoseProfileStatistics(this.rows, dosimetryType, this.state.groupDataRange);
  }

  handleProfileRangeChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleProfileRangeChange", "target.value", e.target.value);
    }

    this.updateDoseProfileStatistics(this.rows, this.state.dosimetryType, parseInt(e.target.value));
  }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    const dosimetryType = WHOLE_BODY;
    this.rawData = getRecordMetadataValue(record, NURIMS_DOSIMETRY_MEASUREMENTS, []);
    for (const r of this.rawData) {
      r["use"] = true;
      r["days"] = getDateRangeAsDays(r[NURIMS_DOSIMETRY_MONITOR_PERIOD].replaceAll(" to ", "|"), 1);
    }
    // filter data based on default record type
    this.rows = filterRecordsByRecordType(this.rawData, dosimetryType)
    this.updateStatistics(this.rows, dosimetryType);
    if (true) return
    this.updateDoseProfileStatistics(this.rows, dosimetryType, this.state.groupDataRange);
    this.setState({selection: {}, record: record});
    this.props.onChange(false);
  }

  ws_message = (message) => {
    console.log("%%%%%%%%%%%%ON_WS_MESSAGE", this.Module, message)
    if (messageResponseStatusOk(message)) {
      if (isCommandResponse(message, CMD_GENERATE_PERSONNEL_DOSE_EVALUATION_PDF)) {
        this.setState({ pdf: message.data.pdf, pdfReady: true });
      }
    } else {
      if (messageHasResponse(message)) {
        enqueueErrorSnackbar(message.response.message);
      }
    }
  }

  renderCell = (row, cell) => {
    return (
      <TableCell
        align={cell.align}
        padding={cell.disablePadding ? 'none' : 'normal'}
        style={{
          color: row[NURIMS_WITHDRAWN] === 0 ?
            this.props.theme.palette.primary.light :
            this.props.theme.palette.text.disabled
        }}
      >
        {cell.id === "use" && <Checkbox id={`data-filter-${row[NURIMS_DOSIMETRY_BATCH_ID]}`} checked={row[cell.id]}
                                        onChange={this.handleChange}/>}
        {cell.id !== "use" && (cell.hasOwnProperty("format") ? cell.format(row, cell.id) : row[cell.id])}
      </TableCell>
    )
  }

  generatePDF = () => {
    this.props.send({
      cmd: CMD_GENERATE_PERSONNEL_DOSE_EVALUATION_PDF,
      record: this.state.record,
      data: this.rows,
      module: PERSONNELDOSIMETRYEVALUATION_REF,
    })
    this.setState({busy: 1});
  }

  closePdfViewer = () => {
    this.setState({pdfReady: false});
  }

  render() {
    const {
      busy, selection, dosimetryType, options, series, nobs, d0_min, d0_max, d1_min, d1_max,
      d0_mean, d1_mean, d0_std, d1_std, d0_skewness, d1_skewness, hoptions, hseries, profile_options, profile_series,
      groupDataRange, record, pdf, pdfReady
    } = this.state;
    const {properties, glossary} = this.props;
    const monitorPeriod = getMonitorPeriod(selection, NURIMS_DOSIMETRY_MONITOR_PERIOD, [null, null]);
    const defaultUnits = getPropertyValue(properties, "nurims.dosimetry.units", "");
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "dosimetryType", dosimetryType, "options",
        options, "profile_series", profile_series, "selection", selection);
    }
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '25ch'},
        }}
        noValidate
        autoComplete="off"
      >
        <PdfViewerDialog title={"Personnel Dosimetry Report"} open={pdfReady} pdf={pdf} onClose={this.closePdfViewer} />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{display: 'flex'}}>
            <FormControlLabel
              control={
                <Checkbox
                  id={"whole-body-record"}
                  checked={dosimetryType === WHOLE_BODY}
                  onChange={this.handleChange}
                />
              }
              label="Whole Body Data"
            />
            <FormControlLabel
              control={
                <Checkbox
                  id={"extremity-record"}
                  checked={dosimetryType === "extremity"}
                  onChange={this.handleChange}
                />
              }
              label="Extremity Data"
            />
            <FormControlLabel
              control={
                <Checkbox
                  id={"wrist-record"}
                  checked={dosimetryType === "wrist"}
                  onChange={this.handleChange}
                />
              }
              label="Wrist Data"
            />
            <div style={{flexGrow: 1}}/>
            <Button
              small
              onClick={this.generatePDF}
              disabled={Object.keys(record).length === 0}
            >
              Generate PDF
            </Button>
          </Grid>
          <Grid item xs={12}>
            <PageableTable
              minWidth={350}
              cells={this.cells}
              theme={this.props.theme}
              rowHeight={24}
              order={'asc'}
              orderBy={NURIMS_DOSIMETRY_BATCH_ID}
              title={"Dosimetry Data"}
              disabled={false}
              rows={this.rows}
              rowsPerPage={8}
              selectedRow={selection}
              selectionMetadataField={""}
              // onRowSelection={this.handleListItemSelection}
              renderCell={this.renderCell}
            />
          </Grid>
          <Grid item xs={6}>
            <Card variant="outlined" sx={{mb: 1}}>
              <CardContent>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    Dose Statistics
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    N :
                  </Grid>
                  <Grid item xs={2} style={{
                    textAlign: "start",
                    backgroundColor: this.props.theme.palette.action.disabledBackground
                  }}>
                    {nobs}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Mean :
                  </Grid>
                  <Grid item xs={2} style={{
                    textAlign: "start",
                    backgroundColor: this.props.theme.palette.action.disabledBackground
                  }}>
                    <Typography>{d0_mean.toFixed(2)} (S)</Typography>
                    {dosimetryType === WHOLE_BODY && <Typography>{d1_mean.toFixed(2)} (D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Min. :
                  </Grid>
                  <Grid item xs={2} style={{
                    textAlign: "start",
                    backgroundColor: this.props.theme.palette.action.disabledBackground
                  }}>
                    <Typography>{d0_min.toFixed(2)} {doseUnits}(S)</Typography>
                    {dosimetryType === WHOLE_BODY && <Typography>{d1_min.toFixed(2)} {doseUnits}(D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Max. :
                  </Grid>
                  <Grid item xs={2} style={{
                    textAlign: "start",
                    backgroundColor: this.props.theme.palette.action.disabledBackground
                  }}>
                    <Typography>{d0_max.toFixed(2)} {doseUnits}(S)</Typography>
                    {dosimetryType === WHOLE_BODY && <Typography>{d1_max.toFixed(2)} {doseUnits}(D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Std. :
                  </Grid>
                  <Grid item xs={2} style={{
                    textAlign: "start",
                    backgroundColor: this.props.theme.palette.action.disabledBackground
                  }}>
                    <Typography>{d0_std.toFixed(2)} {doseUnits}(S)</Typography>
                    {dosimetryType === WHOLE_BODY && <Typography>{d1_std.toFixed(2)} {doseUnits}(D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Skew. :
                  </Grid>
                  <Grid item xs={2} style={{
                    textAlign: "start",
                    backgroundColor: this.props.theme.palette.action.disabledBackground
                  }}>
                    <Typography>{d0_skewness.toFixed(2)} {doseUnits}(S)</Typography>
                    {dosimetryType === WHOLE_BODY && <Typography>{d1_skewness.toFixed(2)} {doseUnits}(D)</Typography>}
                  </Grid>
                  <Grid item xs={12} style={{textAlign: "center", paddingTop: 16}}>
                    <div id="chart">
                      <Charts
                        options={options}
                        series={series}
                        type="boxPlot"
                        height={200}
                      />
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
              <CardContent>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    Frequency Distribution
                  </Grid>
                  <Grid item xs={12} style={{paddingTop: 8}}>
                    <div id="chart1">
                      <Charts
                        options={hoptions}
                        series={hseries}
                        type="bar"
                        width="500"
                      />
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card variant="outlined" sx={{mb: 1}}>
              <CardContent>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    Dose Profile
                  </Grid>
                  <Grid item xs={12} style={{textAlign: "end", paddingRight: 8, paddingTop: 8}}>
                    <Box sx={{'& .MuiTextField-root': {m: 1, width: '100%'}}}>
                      <TextField
                        id="profile-range"
                        label="Profile Range"
                        type="number"
                        value={groupDataRange}
                        onChange={this.handleProfileRangeChange}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} style={{textAlign: "center", paddingTop: 16}}>
                    <div id="chart2">
                      <Charts
                        options={profile_options}
                        series={profile_series}
                        type="boxPlot"
                        height={200}
                      />
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

PersonnelDosimetryEvaluationDataView.propTypes = {
  send: PropTypes.func.isRequired,
  properties: PropTypes.array.isRequired,
  glossary: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

PersonnelDosimetryEvaluationDataView.defaultProps = {
  onChange: (msg) => {
  },
};

export default withTheme(PersonnelDosimetryEvaluationDataView);