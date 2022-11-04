import React, {Component} from 'react';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  TableCell,
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
import Charts from 'react-apexcharts'

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
      data_changed: false,
      selection: {},
      readonly: true,
      series: [
        {
          data: [
            {
              x: '',
              y: [54, 66, 69, 75, 88]
            },
          ]
        }
      ],
      options: {
        chart: {
          type: 'boxPlot',
          height: 200
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
      let ts_min = null;
      let d0_min = null;
      let ts_max = null;
      let d0_max = null;
      for (const row of this.rows) {
        if (row[NURIMS_DOSIMETRY_BATCH_ID] === selected) {
          row["use"] = e.target.checked;
        }
        // re-calculate descriptive statistics dataset
        const ts = parseISO(row[NURIMS_DOSIMETRY_TIMESTAMP]);
        if (ts_min === null || ts_max === null) {
          ts_min = ts;
          ts_max = ts;
        } else if (ts.getTime() <= ts_min.getTime()) {
          ts_min = ts;
        } else if (ts.getTime() >= ts_max.getTime()) {
          ts_max = ts;
        }
        const d0 = row[NURIMS_DOSIMETRY_TYPE] === "wholebody" ? row[NURIMS_DOSIMETRY_SHALLOW_DOSE] :
                   row[NURIMS_DOSIMETRY_TYPE] === "extremity" ? row[NURIMS_DOSIMETRY_EXTREMITY_DOSE] :
                   row[NURIMS_DOSIMETRY_TYPE] === "wrist" ? row[NURIMS_DOSIMETRY_WRIST_DOSE] : 0;
        if (d0_min === null || d0_max === null) {
          d0_min = row[NURIMS_DOSIMETRY_TYPE] === "wholebody" ? row[NURIMS_DOSIMETRY_SHALLOW_DOSE] :
                   row[NURIMS_DOSIMETRY_TYPE] === "extremity" ? row[NURIMS_DOSIMETRY_EXTREMITY_DOSE] :
                   row[NURIMS_DOSIMETRY_TYPE] === "wrist" ? row[NURIMS_DOSIMETRY_WRIST_DOSE] : 0;
          d0_max = row[NURIMS_DOSIMETRY_TYPE] === "wholebody" ? row[NURIMS_DOSIMETRY_SHALLOW_DOSE] :
                   row[NURIMS_DOSIMETRY_TYPE] === "extremity" ? row[NURIMS_DOSIMETRY_EXTREMITY_DOSE] :
                   row[NURIMS_DOSIMETRY_TYPE] === "wrist" ? row[NURIMS_DOSIMETRY_WRIST_DOSE] : 0;
        } else if (d0 <= d0_min) {
          d0_min = d0;
        } else if (d0 >= d0_max) {
          d0_max = d0;
        }
      }
      console.log("FROM", ts_min, "TO", ts_max)
      console.log("MIN", d0_min, "MAX", d0_max)
      this.setState(pstate => {
        return {
          options: {
            ...this.state.options,
            title: {
              ...this.state.options.title,
              text: `Data from ${format(ts_min, "MMM io, yyyy")} to ${format(ts_max, "MMM io, yyyy")}`
            }
          }
        }
      });
    }
    this.setState({dosimetryType: dosimetryType})
  }

  setRecordMetadata = (record) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    this.rawData = getRecordMetadataValue(record, NURIMS_DOSIMETRY_MEASUREMENTS, []);
    for (const r of this.rawData) {
      r["use"] = true;
    }
    // filter data based on default record type
    this.rows = filterRecordsByRecordType(this.rawData, "wholebody")
    this.setState({selection: {}, dosimetryType: "wholebody"});
    this.props.onChange(false);
  }

  onMeasurementSelection = (item) => {
    this.setState({selection: item, readonly: true})
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
        {cell.id === "use" && <Checkbox id={`data-filter-${row[NURIMS_DOSIMETRY_BATCH_ID]}`} checked={row[cell.id]} onChange={this.handleChange} />}
        {cell.id !== "use" && (cell.hasOwnProperty("format") ? cell.format(row[cell.id]) : row[cell.id])}
      </TableCell>
    )
  }

  render() {
    const {properties, busy, data_changed, selection, dosimetryType, options} = this.state;
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
              rowsPerPage={15}
              selectedRow={selection}
              selectionMetadataField={""}
              // onRowSelection={this.handleListItemSelection}
              renderCell={this.renderCell}
            />
          </Grid>
          <Grid item xs={4}>
            <Card variant="outlined" sx={{mb: 1, minWidth: 300}}>
              <CardContent>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    Descriptive Statistics
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "end", paddingRight: 8, backgroundColor: 'red'}}>
                    N :
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "start", backgroundColor: 'green'}}>
                    0
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "end", paddingRight: 8, backgroundColor: 'red'}}>
                    Mean :
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "start", backgroundColor: 'green'}}>
                    0
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "end", paddingRight: 8, backgroundColor: 'red'}}>
                    Min. :
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "start", backgroundColor: 'green'}}>
                    0
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "end", paddingRight: 8, backgroundColor: 'red'}}>
                    Max. :
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "start", backgroundColor: 'green'}}>
                    0
                  </Grid>
                  <Grid item xs={12} style={{textAlign: "center", backgroundColor: 'orange'}}>
                    <div id="chart">
                      <Charts
                        options={this.state.options}
                        series={this.state.series}
                        type="boxPlot"
                        height={200}
                      />
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card variant="outlined" sx={{mb: 1, minWidth: 275}}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6} style={{backgroundColor: 'red'}}>
                    left colr
                  </Grid>
                  <Grid item xs={6} style={{backgroundColor: 'green'}}>
                    right colr
                  </Grid>
                  <Grid item xs={12} style={{backgroundColor: 'blue'}}>
                    both
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