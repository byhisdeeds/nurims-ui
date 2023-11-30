import React, {useState} from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField
} from "@mui/material";
import {
  ITEM_ID,
  NURIMS_TITLE
} from "../utils/constants";
import {
  Close as CloseIcon
} from '@mui/icons-material';
import PropTypes from "prop-types";
import {MultipleYearDateRangePicker, SameYearDateRangePicker} from "./CommonComponents";
import PdfViewer from "./PdfViewer";
import {
  enqueueErrorSnackbar
} from "../utils/SnackbarVariants";

const ERROR_SNACKBAR_DURATION = 3;


export const ConfirmRemoveRecordDialog = (props) => (
  <div>
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Delete record for ${props.selection.hasOwnProperty(NURIMS_TITLE) ? props.selection[NURIMS_TITLE] : ""}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the record
          for {props.selection.hasOwnProperty(NURIMS_TITLE) ? props.selection[NURIMS_TITLE] : ""} (
          {props.selection.hasOwnProperty(ITEM_ID) ? props.selection[ITEM_ID] : ""})?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>No</Button>
        <Button onClick={props.onProceed} autoFocus>Yes</Button>
      </DialogActions>
    </Dialog>
  </div>
)

ConfirmRemoveRecordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selection: PropTypes.object.isRequired,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export const ConfirmBatchRemoveRecordDialog = (props) => (
  <div>
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Delete all ${props.selection.hasOwnProperty(NURIMS_TITLE) ? props.selection[NURIMS_TITLE] : ""} records`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete all the records?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>No</Button>
        <Button onClick={props.onProceed} autoFocus>Yes</Button>
      </DialogActions>
    </Dialog>
  </div>
)

ConfirmBatchRemoveRecordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selection: PropTypes.object.isRequired,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export const ConfirmRemoveDialog = (props) => (
  <div>
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Delete record for ${props.selection.hasOwnProperty(NURIMS_TITLE) ? props.selection[NURIMS_TITLE] : ""}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the record
          for {props.selection.hasOwnProperty(NURIMS_TITLE) ? props.selection[NURIMS_TITLE] : ""} (
          {props.selection.hasOwnProperty(ITEM_ID) ? props.selection[ITEM_ID] : ""})?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>No</Button>
        <Button onClick={props.onProceed} autoFocus>Yes</Button>
      </DialogActions>
    </Dialog>
  </div>
)

export const isValidSelection = (selection) => {
  return (selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
}


export const ConfirmOperatingRunDiscoveryDialog = (props) => {
  const [year, setYear] = useState(null);
  const [startMonth, setStartMonth] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  const [forceOverwrite, setForceOverwrite] = useState(false);

  const handleToDateRangeChange = (range) => {
    setEndMonth(range);
  }

  const handleFromDateRangeChange = (range) => {
    setStartMonth(range);
  }

  const handleYearDateRangeChange = (year) => {
    setYear(year);
  }

  const onForceOverwriteChange = (e) => {
    setForceOverwrite(e.target.checked)
  }

  const proceed = (year, startMonth, endMonth, forceOverwrite) => {
    if (year === null) {
      enqueueErrorSnackbar("No operating year selected", ERROR_SNACKBAR_DURATION);
    } else if (startMonth === null) {
      enqueueErrorSnackbar("No start month for the reactor operation period selected", ERROR_SNACKBAR_DURATION);
    } else if (endMonth === null) {
      enqueueErrorSnackbar("No end month for the reactor operation period selected", ERROR_SNACKBAR_DURATION);
    } else {
      props.onProceed(year, startMonth, endMonth, forceOverwrite);
    }
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Discover reactor operation runs"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Reactor operation parameters are available via the YOKOGAWA digital chart recorder, which
            provides information on a per second basis for the control rod movement, neutron flux,
            inlet and outlet temperatures, and gamma radiation area monitors.
            <p/>
            Select a year, month range to extract the operating runs that occurred during the period.
            <p/>
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SameYearDateRangePicker
                yearLabel={" Year "}
                startLabel={" Start Month "}
                endLabel={"End Month "}
                from={startMonth}
                to={endMonth}
                year={year}
                disabled={false}
                onYearChange={handleYearDateRangeChange}
                onToChange={handleToDateRangeChange}
                onFromChange={handleFromDateRangeChange}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField {...startProps}/>
                    <Box sx={{mx: 1}}>to</Box>
                    <TextField {...endProps}/>
                  </React.Fragment>
                )}
              />
            </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <FormControlLabel
            control={<Switch onChange={onForceOverwriteChange} checked={forceOverwrite} color="primary" />}
            label="Overwrite existing run data"
            labelPlacement="start"
          />
          <Box sx={{flexGrow: 1}} />
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button onClick={() => proceed(year, startMonth, endMonth, forceOverwrite)} autoFocus>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ConfirmOperatingRunDiscoveryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}


export const ConfirmGenerateReactorOperationReportDialog = (props) => {
  const [year, setYear] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState("summary");
  const [forceOverwrite, setForceOverwrite] = useState(false);

  const handleToDateRangeChange = (range) => {
    setEndDate(range);
  }

  const handleFromDateRangeChange = (range) => {
    setStartDate(range);
  }

  const handleYearDateRangeChange = (year) => {
    setYear(year);
  }

  const onForceOverwriteChange = (e) => {
    setForceOverwrite(e.target.checked)
  }

  const onReportTypeChange = (e) => {
    setReportType(e.target.value)
  }

  const proceed = (year, startDate, endDate, reportType, forceOverwrite) => {
    if (year === null) {
      enqueueErrorSnackbar("No reporting year selected", ERROR_SNACKBAR_DURATION);
    } else if (startDate === null) {
      enqueueErrorSnackbar("No start month for the reporting period selected", ERROR_SNACKBAR_DURATION);
    } else if (endDate === null) {
      enqueueErrorSnackbar("No end month for the reporting period selected", ERROR_SNACKBAR_DURATION);
    } else {
      props.onProceed(year, startDate, endDate, reportType, forceOverwrite);
    }
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Discover reactor operation runs"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Reactor operation reports can be generated in either a summary or detailed format. The
            summary report lists the number of operating runs and their duration for the selected period,
            while the detailed report includes graphs on the neutron flux, core temperatures, and
            radiation levels experienced during the runs.
            <p/><p/>
            Select a year and month range for the operating period, and the type of report required.
            <p/>
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SameYearDateRangePicker
                yearLabel={" Year "}
                startLabel={" Start Month "}
                endLabel={"End Month "}
                from={startDate}
                to={endDate}
                year={year}
                disabled={false}
                onYearChange={handleYearDateRangeChange}
                onToChange={handleToDateRangeChange}
                onFromChange={handleFromDateRangeChange}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField {...startProps}/>
                    <Box sx={{mx: 1}}>to</Box>
                    <TextField {...endProps}/>
                  </React.Fragment>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl style={{paddingRight: 8, marginTop: 8,}} variant="outlined">
                <InputLabel id="report-type-select-label">Report Type</InputLabel>
                <Select
                  labelId="report-type-select-label"
                  id="report-access"
                  value={reportType}
                  label="Report Type"
                  onChange={onReportTypeChange}
                >
                  <MenuItem value={'summary'}>Reactor Operations Summary</MenuItem>
                  <MenuItem value={'detailed'}>Detailed Reactor Operations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <FormControlLabel
            control={<Switch onChange={onForceOverwriteChange} checked={forceOverwrite} color="primary" />}
            label="Overwrite any existing reports."
            labelPlacement="start"
          />
          <Box sx={{flexGrow: 1}} />
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button onClick={() => proceed(year, startDate, endDate, reportType, forceOverwrite)} autoFocus>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ConfirmGenerateReactorOperationReportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}


export const PdfViewerDialog = (props) => (
  <div>
    <Dialog
      open={props.open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { width: '80%', maxWidth: '80%' } }}
    >
      <DialogTitle id="alert-dialog-title" style={{display: 'flex'}}>
        {props.title}
        <div style={{flexGrow: 1}} />
        <IconButton onClick={props.onClose} component={"span"}><CloseIcon/></IconButton>
      </DialogTitle>
      <DialogContent>
        <PdfViewer height={"800px"} source={props.pdf} />
      </DialogContent>
    </Dialog>
  </div>
)
PdfViewerDialog.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  pdf: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}


export const ShowProvenanceRecordsDialog = (props) => (
  <div>
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="provenance-dialog-title"
      aria-describedby="provenance-dialog-description"
      scroll={"paper"}
      sx={{ '& .MuiDialog-paper': { width: '70%', maxWidth: "70%", maxHeight: 500, height: 500 } }}
      // maxWidth="xl"
      // fullWidth={800}
    >
      <DialogTitle id="alert-dialog-title">
        {`Provenance records for '${props.selection.hasOwnProperty(NURIMS_TITLE) ? props.selection[NURIMS_TITLE] : ""}'
         (${props.selection.hasOwnProperty(ITEM_ID) ? props.selection[ITEM_ID] : ""})`}
      </DialogTitle>
      <DialogContent dividers={true} >
        <DialogContentText
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{fontFamily: "monospace", whiteSpace: "pre", fontSize: '0.9rem'}}
        >
          {props.body}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>{props.buttonLabel}</Button>
        {/*<Button onClick={props.onProceed} autoFocus>Yes</Button>*/}
      </DialogActions>
    </Dialog>
  </div>
)

ShowProvenanceRecordsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  selection: PropTypes.object.isRequired,
  body: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string
}

ShowProvenanceRecordsDialog.defaultProps = {
  buttonLabel: "Close"
}

export const ConfirmOperatingRunDataExportDialog = (props) => {
  const [dataset, setDataset] = useState(null);
  const [datasetFormat, setDatasetFormat] = useState("json");

  const handleExportDatasetSelected = (e) => {
    console.log("handleExportDatasetSelected", e.target.value)
    setDataset(e.target.value);
  }

  const handleExportDatasetFileFormat = (e) => {
    console.log("handleExportDatasetFileFormat", e.target.value)
    setDatasetFormat(e.target.value);
  }

  const proceed = () => {
    if (dataset === null) {
      enqueueErrorSnackbar("No operating run dataset selected", ERROR_SNACKBAR_DURATION);
    } else if (datasetFormat === null) {
      enqueueErrorSnackbar("No operating run export file format selected", ERROR_SNACKBAR_DURATION);
    } else {
      props.onProceed(dataset, datasetFormat);
    }
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Export Reactor Operation Run Data"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Reactor operating data extracted from the YOKOGAWA digital chart recorder,
            provides information on the staistics of a run and a per second accounr of
            the control rod movement, neutron flux, inlet and outlet temperatures,
            and gamma radiation area monitors.
            <p/>
            Select a year, month range, and dataset to export for a operating period.
            <p/>
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl style={{paddingRight: 8, marginTop: 8,}} variant="outlined">
                <InputLabel id="export-dataset-select-label">Dataset To Export</InputLabel>
                <Select
                  style={{width: "400px"}}
                  labelId="export-dataset-select-label"
                  id="export-dataset"
                  value={dataset}
                  label="Dataset To Export"
                  onChange={handleExportDatasetSelected}
                >
                  <MenuItem value={'rodevents'}>Operating Run Control Rod Events</MenuItem>
                  <MenuItem value={'neutronflux'}>Operating Run Neutron Flux Data</MenuItem>
                  <MenuItem value={'controlrodposition'}>Operating Run Control Position Data</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl style={{paddingRight: 8, marginTop: 8,}} variant="outlined">
                <InputLabel id="export-dataset-format-select-label">Export File Format</InputLabel>
                <Select
                  style={{width: "400px"}}
                  labelId="export-dataset-format-select-label"
                  id="export-dataset-format"
                  value={datasetFormat}
                  label="Export File Format"
                  onChange={handleExportDatasetFileFormat}
                >
                  <MenuItem value={'json'}>Javascript Notation (.json)</MenuItem>
                  <MenuItem value={'csv'}>Comma Seperated Values (.csv)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box sx={{flexGrow: 1}} />
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button
            onClick={proceed} autoFocus>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ConfirmOperatingRunDataExportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}


export const ConfirmOperatingRunStatisticsExportDialog = (props) => {
  const [dataset, setDataset] = useState(null);
  const [datasetFormat, setDatasetFormat] = useState("json");
  const [startYear, setStartYear] = useState(null);
  const [startMonth, setStartMonth] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [endMonth, setEndMonth] = useState(null);

  const handleToYearChange = (range) => {
    setEndYear(range);
  }

  const handleFromYearChange = (range) => {
    setStartYear(range);
  }

  const handleToMonthChange = (range) => {
    setEndMonth(range);
  }

  const handleFromMonthChange = (range) => {
    setStartMonth(range);
  }

  const handleExportDatasetSelected = (e) => {
    console.log("handleExportDatasetSelected", e.target.value)
    setDataset(e.target.value);
  }

  const handleExportDatasetFileFormat = (e) => {
    console.log("handleExportDatasetFileFormat", e.target.value)
    setDatasetFormat(e.target.value);
  }

  const proceed = () => {
    if (startYear === null) {
      enqueueErrorSnackbar("No start year for the reactor operation period selected", ERROR_SNACKBAR_DURATION);
    } else if (startMonth === null) {
      enqueueErrorSnackbar("No start month for the reactor operation period selected", ERROR_SNACKBAR_DURATION);
    } else if (endYear === null) {
      enqueueErrorSnackbar("No end year for the reactor operation period selected", ERROR_SNACKBAR_DURATION);
    } else if (endMonth === null) {
      enqueueErrorSnackbar("No end month for the reactor operation period selected", ERROR_SNACKBAR_DURATION);
    } else if (dataset === null) {
      enqueueErrorSnackbar("No operating run dataset selected", ERROR_SNACKBAR_DURATION);
    } else if (datasetFormat === null) {
      enqueueErrorSnackbar("No operating run export file format selected", ERROR_SNACKBAR_DURATION);
    } else {
      props.onProceed(startYear, startMonth, endYear, endMonth, dataset, datasetFormat);
    }
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Export Reactor Operation Run Data"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Reactor operating data extracted from the YOKOGAWA digital chart recorder,
            provides information on the staistics of a run and a per second accounr of
            the control rod movement, neutron flux, inlet and outlet temperatures,
            and gamma radiation area monitors.
            <p/>
            Select a year, month range, and dataset to export for a operating period.
            <p/>
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MultipleYearDateRangePicker
                fromYearLabel={" Start Year "}
                fromMonthLabel={" Start Month "}
                toYearLabel={" End Year "}
                toMonthLabel={" End Month "}
                fromYear={startYear}
                fromMonth={startMonth}
                toYear={endYear}
                toMonth={endMonth}
                disabled={false}
                onFromYearChange={handleFromYearChange}
                onFromMonthChange={handleFromMonthChange}
                onToYearChange={handleToYearChange}
                onToMonthChange={handleToMonthChange}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField {...startProps}/>
                    <Box sx={{mx: 1}}>to</Box>
                    <TextField {...endProps}/>
                  </React.Fragment>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl style={{paddingRight: 8, marginTop: 8,}} variant="outlined">
                <InputLabel id="export-dataset-select-label">Dataset To Export</InputLabel>
                <Select
                  style={{width: "400px"}}
                  labelId="export-dataset-select-label"
                  id="export-dataset"
                  value={dataset}
                  label="Dataset To Export"
                  onChange={handleExportDatasetSelected}
                >
                  <MenuItem value={'stats'}>Operating Run Statistics</MenuItem>
                  <MenuItem value={'rodevents'}>Operating Run Control Rod Events</MenuItem>
                  <MenuItem value={'neutronflux'}>Operating Run Neutron Flux Data</MenuItem>
                  <MenuItem value={'controlrodposition'}>Operating Run Control Position Data</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl style={{paddingRight: 8, marginTop: 8,}} variant="outlined">
                <InputLabel id="export-dataset-format-select-label">Export File Format</InputLabel>
                <Select
                  style={{width: "400px"}}
                  labelId="export-dataset-format-select-label"
                  id="export-dataset-format"
                  value={datasetFormat}
                  label="Export File Format"
                  onChange={handleExportDatasetFileFormat}
                >
                  <MenuItem value={'json'}>Javascript Notation (.json)</MenuItem>
                  <MenuItem value={'csv'}>Comma Seperated Values (.csv)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box sx={{flexGrow: 1}} />
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button
            onClick={proceed} autoFocus>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

ConfirmOperatingRunStatisticsExportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

