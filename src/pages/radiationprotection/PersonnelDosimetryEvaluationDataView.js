import React, {Component} from 'react';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  TableCell, Typography,
} from "@mui/material";
import {parseISO, format} from "date-fns";
import {
  getRecordMetadataValue,
  getDateRangeFromDateString
} from "../../utils/MetadataUtils";
import {
  getPropertyValue,
} from "../../utils/PropertyUtils";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import {
  NURIMS_DOSIMETRY_BATCH_ID,
  NURIMS_DOSIMETRY_DEEP_DOSE,
  NURIMS_DOSIMETRY_EXTREMITY_DOSE,
  NURIMS_DOSIMETRY_MEASUREMENTS,
  NURIMS_DOSIMETRY_MONITOR_PERIOD,
  NURIMS_DOSIMETRY_SHALLOW_DOSE, NURIMS_DOSIMETRY_TIMESTAMP,
  NURIMS_DOSIMETRY_TYPE,
  NURIMS_DOSIMETRY_UNITS,
  NURIMS_DOSIMETRY_WRIST_DOSE,
  NURIMS_WITHDRAWN,
} from "../../utils/constants";
import Checkbox from "@mui/material/Checkbox";
import {PageableTable} from "../../components/CommonComponents";
import {withTheme} from "@mui/styles";
import Charts from "react-apexcharts";
import * as ss from "simple-statistics"

function getMonitorPeriod(selection, field, missingValue) {
  const period = selection.hasOwnProperty(field) ? selection[field] : "1900-01-01 to 1900-01-01";
  return getDateRangeFromDateString(period.replaceAll(" to ", "|"), missingValue);
}

function getDescriptiveStatsDatset() {
  return [54, 66, 69, 75, 88];
}

function filterRecordsByRecordType(rawData, recordType) {
  const rows = [];
  for (const d of rawData) {
    if (d[NURIMS_DOSIMETRY_TYPE] === recordType) {
      rows.push(d);
    }
  }
  return rows;
}

class PersonnelDosimetryEvaluationDataView extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      measurements: {},
      dosimetryType: "",
      properties: props.properties,
      busy: 0,
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
              upper: '#e9ecef',
              lower: '#f8f9fa'
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
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
      },
      hseries: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    };
    this.ref = React.createRef();
    this.Module = "PersonnelDosimetryEvaluationDataView";
    this.cells = [
      {
        id: "use",
        align: 'center',
        disablePadding: true,
        label: '',
        width: '5%',
        sortField: true,
      },
      {
        id: NURIMS_DOSIMETRY_BATCH_ID,
        align: 'left',
        disablePadding: true,
        label: 'Batch ID',
        width: '15%',
        sortField: true,
      },
      {
        id: NURIMS_DOSIMETRY_TIMESTAMP,
        align: 'left',
        disablePadding: true,
        label: 'Timestamp',
        width: '15%',
        sortField: true,
      },
      {
        id: NURIMS_DOSIMETRY_MONITOR_PERIOD,
        align: 'left',
        disablePadding: true,
        label: 'Monitor Period',
        width: '15%',
        sortField: true,
      },
      {
        id: NURIMS_DOSIMETRY_SHALLOW_DOSE,
        align: 'left',
        disablePadding: true,
        label: 'Shallow',
        width: '10%',
        sortField: true,
      },
      {
        id: NURIMS_DOSIMETRY_DEEP_DOSE,
        align: 'left',
        disablePadding: true,
        label: 'Deep',
        width: '10%',
        sortField: true,
        format: (data) => {return data ? data.toFixed(2) : data},
      },
      {
        id: NURIMS_DOSIMETRY_EXTREMITY_DOSE,
        align: 'left',
        disablePadding: true,
        label: 'Extremity',
        width: '10%',
        sortField: true,
        format: (data) => {return data ? data.toFixed(2) : data},
      },
      {
        id: NURIMS_DOSIMETRY_WRIST_DOSE,
        align: 'left',
        disablePadding: true,
        label: 'Wrist',
        width: '10%',
        sortField: true,
        format: (data) => {return data ? data.toFixed(2) : data},
      },
    ];
    this.rows = [];
    this.rawData = [];
  }

  histogram = (X, nbins) => {
    if (X.length < 3) {
      return [];
    }
    const bins = [];
    const extent = ss.extent(X);
    const interval = (extent[1] - extent[0]) / (nbins + 1);

      console.log("MIN,MAX,INTERVAL", extent, interval)
    //Setup Bins
    let binCount = 0;
    for (let i = extent[0]; i < extent[1]; i += interval) {
      bins.push({
        label: binCount++,
        min: i,
        max: i + interval,
        count: 0
      });
    }

    console.log(">>>>BINS", bins)

    // Loop through data and add to bin's count
    for (const item of X) {
      for (const bin of bins) {
        if (item > bin.min && item <= bin.max) {
          bin.count++;
          break;
        }
      }
    }
    console.log(">>>>X", X)
    console.log(">>>>BINS", bins)

    // const _bins = [];
    // for (const b of bins) {
    //   _bins.push(b.count);
    // }
    return bins;
  }

  updateStatistics = (rows, dosimetryType) => {
    let ts_min = null;
    let ts_max = null;
    const d0 = [];
    const d1 = [];
    // re-calculate descriptive statistics dataset
    for (const row of rows) {
      if (row.use) {
        const ts = parseISO(row[NURIMS_DOSIMETRY_TIMESTAMP]);
        if (ts_min === null || ts_max === null) {
          ts_min = ts;
          ts_max = ts;
        } else if (ts.getTime() <= ts_min.getTime()) {
          ts_min = ts;
        } else if (ts.getTime() >= ts_max.getTime()) {
          ts_max = ts;
        }
        if (row[NURIMS_DOSIMETRY_TYPE] === "wholebody" && dosimetryType === "wholebody") {
          d0.push(row[NURIMS_DOSIMETRY_SHALLOW_DOSE]);
          d1.push(row[NURIMS_DOSIMETRY_DEEP_DOSE]);
        } else if (row[NURIMS_DOSIMETRY_TYPE] === "extremity" && dosimetryType === "extremity") {
          d0.push(row[NURIMS_DOSIMETRY_EXTREMITY_DOSE]);
        } else if (row[NURIMS_DOSIMETRY_TYPE] === "wrist" && dosimetryType === "wrist") {
          d0.push(row[NURIMS_DOSIMETRY_WRIST_DOSE]);
        }
      }
    }
    const series_data = [];
    let q0 = [];
    let q1 = [];
    let b0 = [];
    let b1 = [];
    let extent0 = [0, 0];
    let extent1 = [0, 0];
    let d0_mean = 0;
    let d1_mean = 0;
    let d0_std = 0;
    let d1_std = 0;
    let d0_skewness = 0;
    let d1_skewness = 0;
    if (dosimetryType === "wholebody") {
      q0 = d0.length > 4 ? ss.quantile(d0, [0.25, 0.5, 0.75]) : [0,0,0];
      q1 = d1.length > 4 ? ss.quantile(d1, [0.25, 0.5, 0.75]) : [0,0,0];
      extent0 = d0.length > 4 ? ss.extent(d0) : [0, 0];
      extent1 = d1.length > 4 ? ss.extent(d1) : [0, 0];
      d0_mean = d0.length > 1 ? ss.mean(d0) : 0;
      d1_mean = d1.length > 1 ? ss.mean(d1) : 0;
      d0_std = d0.length > 4 ? ss.standardDeviation(d0) : 0;
      d1_std = d1.length > 4 ? ss.standardDeviation(d1) : 0;
      d0_skewness = d0.length > 4 ? ss.sampleSkewness(d0) : 0;
      d1_skewness = d1.length > 4 ? ss.sampleSkewness(d1) : 0;
      b0 = d0.length > 2 ? this.histogram(d0, 10) : [];
      b1 = d1.length > 2 ? this.histogram(d1, 10) : [];
      series_data.push(
        {
          x: 'Shallow',
          y: [extent0[0], q0[0], q0[1], q0[2], extent0[1]]
        },
        {
          x: 'Deep',
          y: [extent1[0], q1[0], q1[1], q1[2], extent1[1]]
        },
      );
    } else if (dosimetryType === "extremity") {
      q0 = d0.length > 4 ? ss.quantile(d0, [0.25, 0.5, 0.75]) : [0,0,0];
      extent0 = d0.length > 4 ? ss.extent(d0) : [0, 0];
      d0_mean = d0.length > 1 ? ss.mean(d0) : 0;
      d0_std = d0.length > 4 ? ss.standardDeviation(d0) : 0;
      d0_skewness = d0.length > 4 ? ss.sampleSkewness(d0) : 0;
      series_data.push(
        {
          x: 'Extremity',
          y: [extent0[0], q0[0], q0[1], q0[2], extent0[1]]
        }
      );
    } else if (dosimetryType === "wrist") {
      q0 = d0.length > 4 ? ss.quantile(d0, [0.25, 0.5, 0.75]) : [0,0,0];
      extent0 = d0.length > 4 ? ss.extent(d0) : [0, 0];
      d0_mean = d0.length > 1 ? ss.mean(d0) : 0;
      d0_std = d0.length > 4 ? ss.standardDeviation(d0) : 0;
      d0_skewness = d0.length > 4 ? ss.sampleSkewness(d0) : 0;
      series_data.push(
        {
          x: 'Wrist',
          y: [extent0[0], q0[0], q0[1], q0[2], extent0[1]]
        }
      );
    }
    console.log("FROM", ts_min, "TO", ts_max)
    console.log("EXTENT0", extent0)
    console.log("EXTENT1", extent1)
    console.log("MEAN0", d0_mean)
    console.log("MEAN1", d1_mean)
    console.log("QUANTILE0", q0)
    console.log("QUANTILE1", q1)
    console.log("STD0", d0_std)
    console.log("STD1", d1_std)
    console.log("SKEWNESS0", d0_skewness)
    console.log("SKEWNESS1", d1_skewness)
    console.log("BINS0", b0)
    console.log("BINS1", b1)
    this.setState(pstate => {
      return {
        nobs: d0.length,
        d0_min: extent0[0],
        d0_max: extent0[1],
        d1_min: extent1[0],
        d1_max: extent1[1],
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
            text: `Data from ${ts_min ? format(ts_min, "MMM io, yyyy") : ""} to ${ts_max ? format(ts_max, "MMM io, yyyy") : ""}`
          }
        },
        hoptions: {
          ...this.state.hoptions,
          xaxis: {
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          }
        },
        hseries: [
          {
            name: "Shallow",
            data: b0.reduce((prev, obj) => {prev.push(obj.count); return prev;}, [])
          },
          {
            name: "Deep",
            data: b1.reduce((prev, obj) => {prev.push(obj.count); return prev;}, [])
          }
        ]
      }
    });
  }

  handleChange = (e) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "handleChange", "target.id", e.target.id, "target.value", e.target.value);
    }
    const options = this.state.options;
    let dosimetryType = this.state.dosimetryType;
    if (e.target.id === "whole-body-record") {
      if (e.target.checked) {
        dosimetryType = "wholebody";
        this.rows = filterRecordsByRecordType(this.rawData, dosimetryType)
      }
    } else if (e.target.id === "extremity-record") {
      if (e.target.checked) {
        dosimetryType = "extremity";
        this.rows = filterRecordsByRecordType(this.rawData, dosimetryType)
      }
    } else if (e.target.id === "wrist-record") {
      if (e.target.checked) {
        dosimetryType = "wrist";
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

    this.setState({dosimetryType: dosimetryType})
  }

  setRecordMetadata = (record) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    const dosimetryType = "wholebody";
    this.rawData = getRecordMetadataValue(record, NURIMS_DOSIMETRY_MEASUREMENTS, []);
    for (const r of this.rawData) {
      r["use"] = true;
    }
    // filter data based on default record type
    this.rows = filterRecordsByRecordType(this.rawData, dosimetryType)
    this.updateStatistics(this.rows, dosimetryType);
    this.setState({selection: {}, dosimetryType: dosimetryType});
    this.props.onChange(false);
  }

  // onMeasurementSelection = (item) => {
  //   this.setState({selection: item, dosimetryType: item[NURIMS_DOSIMETRY_TYPE], readonly: true})
  // }

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
        {cell.id === "use" && <Checkbox id={`data-filter-${row[NURIMS_DOSIMETRY_BATCH_ID]}`} checked={row[cell.id]} onChange={this.handleChange} />}
        {cell.id !== "use" && (cell.hasOwnProperty("format") ? cell.format(row[cell.id]) : row[cell.id])}
      </TableCell>
    )
  }

  render() {
    const {properties, busy, selection, dosimetryType, options, series, nobs, d0_min, d0_max, d1_min, d1_max,
      d0_mean, d1_mean, d0_std, d1_std, d0_skewness, d1_skewness, hoptions, hseries} = this.state;
    const monitorPeriod = getMonitorPeriod(selection, NURIMS_DOSIMETRY_MONITOR_PERIOD, [null, null]);
    // const doseProviderId = getRecordMetadataValue(measurements, "nurims.entity.doseproviderid", "|").split('|');
    // const wholeBodyMonitor = getRecordMetadataValue(measurements, "nurims.entity.iswholebodymonitored", "false");
    // const extremityMonitor = getRecordMetadataValue(measurements, "nurims.entity.isextremitymonitored", "false");
    // const wristMonitor = getRecordMetadataValue(measurements, "nurims.entity.iswristmonitored", "false");
    const defaultUnits = getPropertyValue(properties, "nurims.dosimetry.units", "");
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "render", "dosimetryType", dosimetryType, "options", options);
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  id={"whole-body-record"}
                  checked={dosimetryType === "wholebody"}
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
              rowsPerPage={10}
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
                    Descriptive Statistics
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8, paddingTop: 8}}>
                    N :
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "start", backgroundColor: this.props.theme.palette.action.disabledBackground}}>
                    {nobs}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Mean :
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "start", backgroundColor: this.props.theme.palette.action.disabledBackground}}>
                    <Typography>{d0_mean.toFixed(2)} (S)</Typography>
                    {dosimetryType === "wholebody" && <Typography>{d1_mean.toFixed(2)} (D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Min. :
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "start", backgroundColor: this.props.theme.palette.action.disabledBackground}}>
                    <Typography>{d0_min.toFixed(2)} (S)</Typography>
                    {dosimetryType === "wholebody" && <Typography>{d1_min.toFixed(2)} (D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Max. :
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "start", backgroundColor: this.props.theme.palette.action.disabledBackground}}>
                    <Typography>{d0_max.toFixed(2)} (S)</Typography>
                    {dosimetryType === "wholebody" && <Typography>{d1_max.toFixed(2)} (D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Std. :
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "start", backgroundColor: this.props.theme.palette.action.disabledBackground}}>
                    <Typography>{d0_std.toFixed(2)} (S)</Typography>
                    {dosimetryType === "wholebody" && <Typography>{d1_std.toFixed(2)} (D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Skew. :
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "start", backgroundColor: this.props.theme.palette.action.disabledBackground}}>
                    <Typography>{d0_skewness.toFixed(2)} (S)</Typography>
                    {dosimetryType === "wholebody" && <Typography>{d1_skewness.toFixed(2)} (D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Last Dose :
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "start", backgroundColor: this.props.theme.palette.action.disabledBackground}}>
                    <Typography>{d0_skewness.toFixed(2)} (S)</Typography>
                    {dosimetryType === "wholebody" && <Typography>{d1_skewness.toFixed(2)} (D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Year Dose :
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "start", backgroundColor: this.props.theme.palette.action.disabledBackground}}>
                    <Typography>{d0_skewness.toFixed(2)} (S)</Typography>
                    {dosimetryType === "wholebody" && <Typography>{d1_skewness.toFixed(2)} (D)</Typography>}
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "end", paddingRight: 8}}>
                    Total Dose :
                  </Grid>
                  <Grid item xs={2} style={{textAlign: "start", backgroundColor: this.props.theme.palette.action.disabledBackground}}>
                    <Typography>{d0_skewness.toFixed(2)} (S)</Typography>
                    {dosimetryType === "wholebody" && <Typography>{d1_skewness.toFixed(2)} (D)</Typography>}
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
        </Grid>
      </Box>
    );
  }
}

PersonnelDosimetryEvaluationDataView.defaultProps = {
  onChange: (msg) => {
  },
};

export default withTheme(PersonnelDosimetryEvaluationDataView);