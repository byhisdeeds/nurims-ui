import React, {useState} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
} from "@mui/material";
import {
  ITEM_ID,
  NURIMS_TITLE
} from "../utils/constants";
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from "prop-types";
import {SameYearDateRangePicker} from "./CommonComponents";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import PdfViewer from "./PdfViewer";


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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [forceOverwrite, setForceOverwrite] = useState(false);

  const handleToDateRangeChange = (range) => {
    console.log("handleToDateRangeChange", range)
    setEndDate(range);
  }

  const handleFromDateRangeChange = (range) => {
    console.log("handleFromDateRangeChange", range)
    setStartDate(range);
  }

  const handleYearDateRangeChange = (year) => {
    console.log("handleYearDateRangeChange", year)
    setYear(year);
  }

  const onForceOverwriteChange = (e) => {
    setForceOverwrite(e.target.checked)
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
                startText="Start Date"
                endText="End Date"
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
          <Button onClick={() => props.onProceed(year, startDate, endDate, forceOverwrite)} autoFocus>Continue</Button>
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
        {`View provenance records for ${props.selection.hasOwnProperty(NURIMS_TITLE) ? props.selection[NURIMS_TITLE] : ""}`}
      </DialogTitle>
      <DialogContent dividers={true} >
        <DialogContentText
          id="scroll-dialog-description"
          tabIndex={-1}
          sx={{fontFamily: "monospace", whiteSpace: "pre"}}
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
