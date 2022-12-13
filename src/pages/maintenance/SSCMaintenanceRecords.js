import React, {Component} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  Select
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import "leaflet/dist/leaflet.css";
import {
  getDateFromDateString,
  getNextItemId,
  getRecordMetadataValue, removeMetadataField,
  setMetadataValue,
  toBoolean,
} from "../../utils/MetadataUtils";
import {
  getPropertyAsMenuitems,
  getPropertyValue,
} from "../../utils/PropertyUtils";
import {
  NURIMS_TITLE,
  NURIMS_SSC_TYPE,
  NURIMS_SSC_CLASSIFICATION,
  NURIMS_SSC_SAFETY_FUNCTION,
  NURIMS_SSC_SAFETY_CATEGORY,
  NURIMS_SSC_SURVEILLANCE_FREQUENCY,
  NURIMS_SSC_COMMISSIONING_DATE,
  NURIMS_SSC_ID,
  NURIMS_SSC_MAINTAINABILITY,
  NURIMS_SURVEILLANCE_FREQUENCY,
  NURIMS_SSC_MAINTENANCE_TASK,
  NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA,
  NURIMS_SSC_MAINTENANCE_SCOPE,
  NURIMS_SSC_MAINTENANCE_RECORDS,
  NURIMS_SSC_MAINTENANCE_RECORD_NAME,
  NURIMS_SSC_MAINTENANCE_RECORD_ISSUE,
  NURIMS_SSC_MAINTENANCE_RECORD_REMOVED_FROM_SERVICE,
  NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE,
  NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_ACTIONS,
  NURIMS_SSC_MAINTENANCE_RECORD_DOCUMENTS, NURIMS_SSC_MAINTENANCE_RECORD_IMPACT_REACTOR_USAGE,
} from "../../utils/constants";
import {HtmlTooltip, TooltipText} from "../../utils/TooltipUtils";
import {getGlossaryValue} from "../../utils/GlossaryUtils";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import EditableTable from "../../components/EditableTable";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";
import PagedRecordList from "../../components/PagedRecordList";
import {DatePickerWithTooltip, SwitchComponent, TextFieldWithTooltip} from "../../components/CommonComponents";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import PropTypes from "prop-types";
import {ConfirmRemoveRecordDialog} from "../../components/UtilityDialogs";

export const SSCMAINTENANCERECORDS_REF = "SSCMaintenanceRecords";

class SSCMaintenanceRecords extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      ssc: {},
      selection: {},
      properties: props.properties,
      metadata_changed: false,
      confirm_remove: false,
    };
    this.Module = SSCMAINTENANCERECORDS_REF;
    this.listRef = React.createRef();
    this.ref = React.createRef();
    this.glossary = {};
    this.sscSurveillanceData = [];
    this.sscSurveillanceFields = [
      {
        label: "Scope",
        name: NURIMS_SSC_MAINTENANCE_TASK,
        width: '20ch',
        align: 'center',
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Acceptance",
        name: NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA,
        width: '20ch',
        align: 'center',
        validation: e => {
          return true;
        },
        error: "Haha"
      },
      {
        label: "Frequency",
        name: NURIMS_SSC_SURVEILLANCE_FREQUENCY,
        type: "select",
        width: '16ch',
        align: 'center',
        options: [],
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
    ];
    getPropertyValue(props.properties, NURIMS_SURVEILLANCE_FREQUENCY, "").split('|').map((n) => {
      const t = n.split(',');
      if (t.length === 2) {
        return this.sscSurveillanceFields[2].options.push({ label: t[1], value: t[0] });
      }
    })
  }

  setGlossaryTerms = (terms) => {
    // console.log("SSCMaintenanceRecords.setGlossaryTerms", terms)
    for (const term of terms) {
      this.glossary[term.name] = term.value;
    }
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const selection = this.state.selection;
    if (e.target.id === "name") {
      selection[NURIMS_TITLE] = e.target.value;
    } else if (e.target.id === "issue") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_ISSUE, e.target.value)
    } else if (e.target.id === "corrective-actions") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_ACTIONS, e.target.value);
    } else if (e.target.id === "documents") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_DOCUMENTS, e.target.value);
    } else if (e.target.id === "impact-reactor-usage") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_IMPACT_REACTOR_USAGE, ""+e.target.checked);
    }
    // update scc record with maintenance records
    if (this.listRef.current) {
      for (const r of this.listRef.current.getRecords()) {
        if (r.item_id === selection.item_id) {
          r[NURIMS_TITLE] = selection[NURIMS_TITLE];
          r.metadata = selection.metadata;
        }
      }
    }
    this.setState({selection: selection, metadata_changed: true})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  removedFromServiceDateChange = (date) => {
    const selection = this.state.selection;
    if (date) {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_REMOVED_FROM_SERVICE, date.toISOString().substring(0,10));
    } else {
      removeMetadataField(selection, NURIMS_SSC_MAINTENANCE_RECORD_REMOVED_FROM_SERVICE);
    }
    this.setState({selection: selection, metadata_changed: true})
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  returnedToServiceDateChange = (date) => {
    const selection = this.state.selection;
    if (date) {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE, date.toISOString().substring(0,10));
    } else {
      removeMetadataField(selection, NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE);
    }
    this.setState({selection: selection, metadata_changed: true})
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleCommissioningDateChange = (date) => {
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_COMMISSIONING_DATE, date.toISOString().substring(0,10))
    this.setState({ssc: ssc})
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleSSCTypeChange = (e) => {
    const ssc = this.state.ssc;
    setMetadataValue(ssc, NURIMS_SSC_TYPE, e.target.value);
    ssc.changed = true;
    this.setState({ssc: ssc})
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  handleSSCClassificationChange = (e) => {
    console.log("handleSSCClassificationChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCSafetyFunctionChange = (e) => {
    console.log("handleSSCSafetyFunctionChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCMaintainabilityChange = (e) => {
    console.log("handleSSCMaintainabilityChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_MAINTAINABILITY, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleSSCSafetyCategoryChange = (e) => {
    console.log("handleSSCSafetyCategoryChange", e.target.value);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, e.target.value);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  // handleSSCSurveillanceFrequencyChange = (e) => {
  //   console.log("handleSSCSurveillanceFrequencyChange", e.target.value);
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_SURVEILLANCE_FREQUENCY, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  saveTableData = data => {
    console.log("UPDATED SURVEILLANCE TABLE DATA", data);
    const ssc = this.state.ssc;
    ssc["changed"] = true;
    setMetadataValue(ssc, NURIMS_SSC_MAINTENANCE_SCOPE, data);
    this.setState({ssc: ssc})
    // signal to parent that details have changed
    this.props.onChange(true);
  };

  setRecordMetadata = (record) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    if (this.listRef.current) {
      this.listRef.current.setRecords(getRecordMetadataValue(record, NURIMS_SSC_MAINTENANCE_RECORDS, []));
    }
    this.setState({ssc: record, selection: {}, metadata_changed: false})
    this.props.onChange(false);
  }

  getRecordMetadata = () => {
    return this.state.ssc;
  }

  addMaintenanceRecord = () => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "addMaintenanceRecord");
    }
    if (this.listRef.current) {
      this.listRef.current.addRecords([{
        "changed": true,
        "item_id": getNextItemId(this.listRef.current.getRecords()),
        "nurims.title": "New Maintenance Record",
        "nurims.withdrawn": 0,
        "metadata": []
      }], false);
      this.setState({metadata_changed: true});
    }
  }

  getMaintenanceRecords = (include_archived) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "getMaintenanceRecords", "include_archived", include_archived);
    }
  }

  onMaintenanceRecordSelection = (selection) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "onMaintenanceRecordSelection", "selection", selection, "ssc", this.state.ssc);
    }
    // save the existing selected metadata
    if (this.listRef.current) {
      console.log("$$$$", this.listRef.current.getRecords())
    }
    // display the selection metadata
    this.setState({selection: selection, metadata_changed: false});
  }

  saveMaintenanceRecord = () => {
    const ssc = this.state.ssc;
    if (this.listRef.current) {
      setMetadataValue(ssc, NURIMS_SSC_MAINTENANCE_RECORDS, this.listRef.current.getRecords())
      ssc["changed"] = true;
    }
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "saveMaintenanceRecord", "selection", this.state.selection, "ssc", ssc);
    }
    this.props.saveChanges();
  }

  removeRecord = () => {
    this.setState({confirm_remove: true,});
  }

  cancelRemove = () => {
    this.setState({confirm_remove: false,});
  }

  proceedWithRemove = () => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "proceedWithRemove", "selection", this.state.selection);
    }
    if (this.listRef.current) {
      this.listRef.current.removeRecord(this.state.selection)
    }
    this.setState({confirm_remove: false, metadata_changed: true});
  }

  render() {
    const {confirm_remove, ssc, selection, metadata_changed, properties} = this.state;
    const no_selection = Object.entries(selection).length === 0;
    const no_ssc = Object.entries(ssc).length === 0;
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "render", "ssc", ssc, "selection", selection);
    }
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PagedRecordList
              ref={this.listRef}
              onListItemSelection={this.onMaintenanceRecordSelection}
              requestGetRecords={this.getMaintenanceRecords}
              includeArchived={true}
              title={`'${ssc.hasOwnProperty(NURIMS_TITLE) ? ssc[NURIMS_TITLE] : ""}' Maintenance Records`}
              enableRecordArchiveSwitch={false}
              enableRowFilter={true}
              height={'100%'}
            />
          </Grid>
          <Grid item xs={12}>
            <Box style={{textAlign: 'center', display: 'flex', justifyContent: 'space-around'}}>
              <Button size={"small"} disabled={no_selection} variant="outlined" endIcon={<DeleteIcon/>} onClick={this.removeRecord}>
                Remove Record
              </Button>
              <Button size={"small"} disabled={!metadata_changed} variant="outlined" endIcon={<SaveIcon />} onClick={this.saveMaintenanceRecord}>
                Save Record
              </Button>
              <Button size={"small"} disabled={no_ssc} variant="outlined" endIcon={<AddCircleOutlineIcon />} onClick={this.addMaintenanceRecord}>
                Add Record
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': {m: 1, width: '100%'},
              }}
              noValidate
              autoComplete="off"
            >
              <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextFieldWithTooltip
                        id={"name"}
                        label="Record Name"
                        required={true}
                        value={selection.hasOwnProperty(NURIMS_TITLE) ? selection[NURIMS_TITLE] : ""}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_MAINTENANCE_RECORD_NAME, "")}
                        padding={0}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Removed From Service"
                          disabled={no_selection}
                          inputFormat={"yyyy-MM-dd"}
                          value={getDateFromDateString(getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_REMOVED_FROM_SERVICE, null), null)}
                          onChange={this.removedFromServiceDateChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Returned To Service"
                          disabled={no_selection}
                          inputFormat={"yyyy-MM-dd"}
                          value={getDateFromDateString(getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE, null), null)}
                          onChange={this.returnedToServiceDateChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <SwitchComponent
                        id={"impact-reactor-usage"}
                        label={"Impact Reactor"}
                        disabled={no_selection}
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_IMPACT_REACTOR_USAGE, "false")}
                        onChange={this.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextFieldWithTooltip
                        id={"issue"}
                        label="Maintenance Issue Description"
                        required={true}
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_ISSUE, "")}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_MAINTENANCE_RECORD_ISSUE, "")}
                        lines={5}
                        padding={0}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextFieldWithTooltip
                        id={"corrective-actions"}
                        label="Corrective actions"
                        required={true}
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_ACTIONS, "")}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_ACTIONS, "")}
                        lines={5}
                        padding={0}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextFieldWithTooltip
                        id={"documents"}
                        label="Documents"
                        required={true}
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_DOCUMENTS, "")}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_MAINTENANCE_RECORD_DOCUMENTS, "")}
                        padding={0}
                        lines={3}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

SSCMaintenanceRecords.defaultProps = {
  onChange: (msg) => {
  },
  saveChanges: () => {
  },
};

SSCMaintenanceRecords.propTypes = {
  ref: PropTypes.element.isRequired,
  properties: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  saveChanges: PropTypes.func.isRequired,
}

export default SSCMaintenanceRecords;