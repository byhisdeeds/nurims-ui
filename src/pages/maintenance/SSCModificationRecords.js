import React, {Component} from 'react';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import {
  getDateFromDateString,
  getRecordMetadataValue,
  isRecordEmpty,
  new_record,
  removeMetadataField,
  setMetadataValue,
} from "../../utils/MetadataUtils";
import {
  getPropertyValue,
} from "../../utils/PropertyUtils";
import {
  NURIMS_TITLE,
  NURIMS_SSC_SURVEILLANCE_FREQUENCY,
  NURIMS_SURVEILLANCE_FREQUENCY,
  NURIMS_SSC_MAINTENANCE_TASK,
  NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA,
  NURIMS_SSC_MAINTENANCE_RECORDS,
  NURIMS_SSC_MAINTENANCE_RECORD_NAME,
  NURIMS_SSC_MAINTENANCE_RECORD_ISSUE,
  NURIMS_SSC_MAINTENANCE_RECORD_REMOVED_FROM_SERVICE,
  NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE,
  NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_ACTIONS,
  NURIMS_SSC_MAINTENANCE_RECORD_DOCUMENTS,
  NURIMS_SSC_MAINTENANCE_RECORD_IMPACT_REACTOR_USAGE,
  NURIMS_SSC_MAINTENANCE_RECORD_ACCEPTANCE_CRITERIA,
  NURIMS_SSC_MAINTENANCE_RECORD_PERSONNEL,
  NURIMS_SSC_MAINTENANCE_RECORD_OBSOLESCENCE_ISSUE,
  NURIMS_SSC_MAINTENANCE_RECORD_PREVENTIVE_MAINTENANCE,
  NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_MAINTENANCE,
  UNDEFINED_DATE_STRING,
  ITEM_ID,
  ROLE_MAINTENANCE_DATA_ENTRY,
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_PROVENANCE_RECORDS,
  CMD_GET_SSC_MODIFICATION_RECORDS,
  NURIMS_RELATED_ITEM_ID,
  CMD_UPDATE_SSC_MODIFICATION_RECORD,
  NURIMS_TITLE_SUBTITLE,
} from "../../utils/constants";
import {getGlossaryValue} from "../../utils/GlossaryUtils";
import dayjs from 'dayjs';
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import PagedRecordList from "../../components/PagedRecordList";
import {
  AddRemoveArchiveSaveProvenanceButtonPanel,
  CheckboxWithTooltip,
  DatePickerWithTooltip,
  SelectFormControlWithTooltip,
  TextFieldWithTooltip
} from "../../components/CommonComponents";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import PropTypes from "prop-types";
import {
  ConfirmRemoveRecordDialog, ShowProvenanceRecordsDialog
} from "../../components/UtilityDialogs";
import {
  isValidUserRole
} from "../../utils/UserUtils";
import {setProvenanceRecordsHelper, showProvenanceRecordsViewHelper} from "../../utils/ProvenanceUtils";
import {isCommandResponse, messageHasResponse, messageResponseStatusOk} from "../../utils/WebsocketUtils";

const UNDEFINED_DATE = dayjs(UNDEFINED_DATE_STRING)

export const SSCMODIFICATIONRECORDS_REF = "SSCModificationRecords";

class SSCModificationRecords extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      ssc: {},
      selection: {},
      properties: props.properties,
      metadata_changed: false,
      confirm_remove: false,
      show_provenance_view: false,
    };
    this.Module = SSCMODIFICATIONRECORDS_REF;
    this.listRef = React.createRef();
    this.ref = React.createRef();
    this.provenanceRecords = [];
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
    console.log("+++++++++++++++")
    console.log(terms)
    console.log("+++++++++++++++")
    for (const term of terms) {
      this.glossary[term.name] = term.value;
    }
  }

  handleChange = (e) => {
    const selection = this.state.selection;
    const id = e.target.id === undefined ? e.target.name : e.target.id;
    if (this.context.debug) {
      ConsoleLog(this.module, "handleChange", "id", id, "value", e.target.value);
    }
    let changed = false;
    if (id === "name") {
      selection[NURIMS_TITLE] = e.target.value;
      changed = true;
    } else if (id === "issue") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_ISSUE, e.target.value)
      changed = true;
    } else if (e.target.id === "corrective-actions") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_ACTIONS, e.target.value);
      changed = true;
    } else if (e.target.id === "documents") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_DOCUMENTS, e.target.value);
      changed = true;
    } else if (e.target.name === "impact-reactor-usage") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_IMPACT_REACTOR_USAGE, ""+e.target.checked);
      changed = true;
    } else if (e.target.name === "obsolescence") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_OBSOLESCENCE_ISSUE, "" + e.target.checked);
      changed = true;
    } else if (e.target.name === "preventive-maintenance") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_PREVENTIVE_MAINTENANCE, "" + e.target.checked);
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_MAINTENANCE, "" + (!e.target.checked));
      changed = true;
    } else if (e.target.name === "corrective-maintenance") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_MAINTENANCE, "" + e.target.checked);
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_PREVENTIVE_MAINTENANCE, "" + (!e.target.checked));
      changed = true;
    } else if (e.target.id === "acceptance-criteria") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_ACCEPTANCE_CRITERIA, e.target.value);
      changed = true;
    } else if (e.target.name === "maintenance-personnel") {
      const values = [];
      for (const v of e.target.value) {
        if (v !== "") {
          values.push(v);
        }
      }
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_PERSONNEL, values.join(","));
      changed = true;
    }
    if (changed) {
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
  }

  removedFromServiceDateChange = (date) => {
    const selection = this.state.selection;
    if (date) {
      // setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_REMOVED_FROM_SERVICE, date.toISOString().substring(0,10));
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_REMOVED_FROM_SERVICE, date.format('YYYY-MM-DD'));
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
      // setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE, date.toISOString().substring(0,10));
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE, date.format('YYYY-MM-DD'));
    } else {
      removeMetadataField(selection, NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE);
    }
    this.setState({selection: selection, metadata_changed: true})
    // signal to parent that metadata has changed
    this.props.onChange(true);
  }

  // handleCommissioningDateChange = (date) => {
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_COMMISSIONING_DATE, date.toISOString().substring(0,10))
  //   this.setState({ssc: ssc})
  //   // signal to parent that metadata has changed
  //   this.props.onChange(true);
  // }

  // handleSSCTypeChange = (e) => {
  //   const ssc = this.state.ssc;
  //   setMetadataValue(ssc, NURIMS_SSC_TYPE, e.target.value);
  //   ssc.changed = true;
  //   this.setState({ssc: ssc})
  //   // signal to parent that metadata has changed
  //   this.props.onChange(true);
  // }

  // handleSSCClassificationChange = (e) => {
  //   console.log("handleSSCClassificationChange", e.target.value);
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_CLASSIFICATION, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleSSCSafetyFunctionChange = (e) => {
  //   console.log("handleSSCSafetyFunctionChange", e.target.value);
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_SAFETY_FUNCTION, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleSSCMaintainabilityChange = (e) => {
  //   console.log("handleSSCMaintainabilityChange", e.target.value);
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_MAINTAINABILITY, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleSSCSafetyCategoryChange = (e) => {
  //   console.log("handleSSCSafetyCategoryChange", e.target.value);
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_SAFETY_CATEGORY, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // handleSSCSurveillanceFrequencyChange = (e) => {
  //   console.log("handleSSCSurveillanceFrequencyChange", e.target.value);
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_SURVEILLANCE_FREQUENCY, e.target.value);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  // saveTableData = data => {
  //   console.log("UPDATED SURVEILLANCE TABLE DATA", data);
  //   const ssc = this.state.ssc;
  //   ssc["changed"] = true;
  //   setMetadataValue(ssc, NURIMS_SSC_MAINTENANCE_SCOPE, data);
  //   this.setState({ssc: ssc})
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // };
  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      if (message.cmd === CMD_GET_GLOSSARY_TERMS) {
        this.setGlossaryTerms(message.response.terms)
      } else if (message.cmd === CMD_GET_PROVENANCE_RECORDS) {
        this.setProvenanceRecords(message.response.provenance)
      } else if (message.cmd === CMD_GET_SSC_MODIFICATION_RECORDS) {
        if (this.listRef.current) {
          this.listRef.current.setRecords(message.response.structures_systems_components);
        }
      } else if (message.cmd === CMD_UPDATE_SSC_MODIFICATION_RECORD) {
        if (this.listRef.current) {
          this.listRef.current.updateRecord(message.response.structures_systems_components);
        }
      }
    }
  }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    if (this.listRef.current) {
      this.listRef.current.setRecords(getRecordMetadataValue(record, NURIMS_SSC_MAINTENANCE_RECORDS, []));
    }
    this.setState({ssc: record, selection: {}, metadata_changed: false})
    this.props.onChange(false);
  }

  setReferredToRecord = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setReferredToRecord", "record", record);
    }
    this.setState({ssc: record, selection: {}, metadata_changed: false});
  }

  getRecordMetadata = () => {
    return this.state.ssc;
  }

  addModificationRecord = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "addMaintenanceRecord");
    }
    if (this.listRef.current) {
      this.listRef.current.addRecords([new_record(
        null,
        "New Modification Record",
        0,
        this.context.user.profile.username,
        this.context.user.profile.fullname
      )], false);
      this.setState({metadata_changed: true});
    }
  }

  getMaintenanceRecords = (include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "getMaintenanceRecords", "include_archived", include_archived);
    }
  }

  onModificationRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "saveModificationRecord", "ssc", ssc);
      ConsoleLog(this.Module, "saveModificationRecord", "selection", this.state.selection);
    }
    this.setState({selection: selection, metadata_changed: false});
  }

  saveModificationRecord = () => {
    const ssc = this.state.ssc;
    const selection = this.state.selection;
    if (this.context.debug) {
      ConsoleLog(this.Module, "saveModificationRecord", "ssc", ssc);
      ConsoleLog(this.Module, "saveModificationRecord", "selection", this.state.selection);
    }
    setMetadataValue(selection, NURIMS_RELATED_ITEM_ID, ssc[ITEM_ID]);
    selection["changed"] = true;
    this.props.saveChanges(selection);
  }

  deleteModificationRecord = () => {
    this.setState({confirm_remove: true,});
  }

  cancelRemove = () => {
    this.setState({confirm_remove: false,});
  }

  proceedWithRemove = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithRemove", "selection", this.state.selection);
    }
    if (this.listRef.current) {
      this.listRef.current.removeRecord(this.state.selection)
    }
    this.setState({confirm_remove: false, metadata_changed: true});
  }

  renderCellStyle = (row, cell, theme) => {
    const openIssue = getRecordMetadataValue(row, NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE, null) === null;
    return {
      color: openIssue ? theme.palette.primary.contrastText : theme.palette.primary.light,
      backgroundColor: openIssue ? theme.palette.warning.light : theme.components.MuiTableRow.styleOverrides.root.backgroundColor,
    }
  }

  isSelectableByRoles = (selection, roles, valid_selection) => {
    for (const r of roles) {
      if (isValidUserRole(this.context.user, r)) {
        // We have at least one match, now we check for a valid item_id boolean parameter has been specified
        if (valid_selection) {
          return Object.keys(selection).length > 0 && selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1;
        }
        return true;
      }
    }
    return false;
  }
  setProvenanceRecords = (provenance) => {
    setProvenanceRecordsHelper(this, provenance);
  }

  showProvenanceRecordsView = () => {
    this.props.send({cmd: "ddd"})
    showProvenanceRecordsViewHelper(this);
  }

  closeProvenanceRecordsView = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    this.setState({show_provenance_view: false,});
  }

  isRecordChanged = (record) => {
    return record.hasOwnProperty("changed") && record.changed;
  }

  render() {
    const {confirm_remove, ssc, selection, metadata_changed, properties, show_provenance_view} = this.state;
    const no_selection = Object.entries(selection).length === 0;
    const no_ssc = Object.entries(ssc).length === 0;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "ssc", ssc);
      ConsoleLog(this.Module, "render", "selection", selection);
    }
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithRemove}
                                   onCancel={this.cancelRemove}
        />
        <ShowProvenanceRecordsDialog open={show_provenance_view}
                                     selection={selection}
                                     body={this.provenanceRecords.join("\n")}
                                     onCancel={this.closeProvenanceRecordsView}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PagedRecordList
              ref={this.listRef}
              onListItemSelection={this.onModificationRecordSelection}
              requestGetRecords={this.getMaintenanceRecords}
              includeArchived={true}
              title={`${ssc.hasOwnProperty(NURIMS_TITLE) ? "'" + ssc[NURIMS_TITLE] + "'" : ""} Modification Records`}
              enableRecordArchiveSwitch={false}
              enableRowFilter={true}
              height={'100%'}
              rowsPerPage={10}
              renderCellStyle={this.renderCellStyle}
              cells={[
                {
                  id: ITEM_ID,
                  align: 'center',
                  disablePadding: true,
                  label: 'ID',
                  width: '10%',
                  sortField: true,
                },
                {
                  id: NURIMS_TITLE,
                  align: 'left',
                  disablePadding: true,
                  label: 'Name',
                  width: '30%',
                  sortField: true,
                },
                {
                  id: NURIMS_TITLE_SUBTITLE,
                  align: 'center',
                  disablePadding: true,
                  label: 'Created By',
                  width: '60%',
                  sortField: true,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <AddRemoveArchiveSaveProvenanceButtonPanel
              THIS={this}
              user={this.context.user}
              deleteRecordRole={ROLE_MAINTENANCE_DATA_ENTRY}
              onClickDeleteRecord={this.deleteModificationRecord}
              saveRecordRole={ROLE_MAINTENANCE_DATA_ENTRY}
              onClickSaveRecord={this.saveModificationRecord}
              addRecordRole={ROLE_MAINTENANCE_DATA_ENTRY}
              onClickAddRecord={this.addModificationRecord}
              disableAddRecordButton={isRecordEmpty(ssc)}
              onClickViewProvenanceRecord={this.showProvenanceRecordsView}
              showViewProvenanceRecordButton={true}
              showArchiveRecordButton={true}
            />
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
                    <Grid item xs={12} sm={4} style={{textAlign: 'center'}}>
                      <DatePickerWithTooltip
                        width={"25ch"}
                        label="Removed From Service"
                        inputFormat={"yyyy-MM-dd"}
                        value={getDateFromDateString(getRecordMetadataValue(selection,
                          NURIMS_SSC_MAINTENANCE_RECORD_REMOVED_FROM_SERVICE, UNDEFINED_DATE_STRING), UNDEFINED_DATE)}
                        onChange={this.removedFromServiceDateChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(
                          this.glossary, NURIMS_SSC_MAINTENANCE_RECORD_REMOVED_FROM_SERVICE, "")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} style={{textAlign: 'center'}}>
                      <DatePickerWithTooltip
                        width={"25ch"}
                        label="Returned To Service"
                        inputFormat={"yyyy-MM-dd"}
                        value={getDateFromDateString(getRecordMetadataValue(selection,
                          NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE, UNDEFINED_DATE_STRING), UNDEFINED_DATE)}
                        onChange={this.returnedToServiceDateChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(
                          this.glossary, NURIMS_SSC_MAINTENANCE_RECORD_RETURNED_TO_SERVICE, "")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={3}>
                          <CheckboxWithTooltip
                            id={"impact-reactor-usage"}
                            label={"Impact Reactor Operation"}
                            onChange={this.handleChange}
                            required={true}
                            disabled={no_selection}
                            checked={getRecordMetadataValue(selection,
                              NURIMS_SSC_MAINTENANCE_RECORD_IMPACT_REACTOR_USAGE, "false")}
                            tooltip={"hg gugtt "}
                            padding={8}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CheckboxWithTooltip
                            id={"obsolescence"}
                            label={"Obsolescence Issue"}
                            onChange={this.handleChange}
                            checked={getRecordMetadataValue(selection,
                              NURIMS_SSC_MAINTENANCE_RECORD_OBSOLESCENCE_ISSUE, "false")}
                            disabled={no_selection}
                            tooltip={"hg gugtt "}
                            padding={8}
                          />
                        </Grid>
                        {/*<Grid item xs={12} sm={3}>*/}
                        {/*  <CheckboxWithTooltip*/}
                        {/*    id={"preventive-maintenance"}*/}
                        {/*    label={"Preventive Maintenance"}*/}
                        {/*    onChange={this.handleChange}*/}
                        {/*    checked={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_PREVENTIVE_MAINTENANCE, "false")}*/}
                        {/*    disabled={no_selection}*/}
                        {/*    tooltip={"hg gugtt "}*/}
                        {/*    padding={8}*/}
                        {/*  />*/}
                        {/*</Grid>*/}
                        {/*<Grid item xs={12} sm={3}>*/}
                        {/*  <CheckboxWithTooltip*/}
                        {/*    id={"corrective-maintenance"}*/}
                        {/*    label={"Corrective Maintenance"}*/}
                        {/*    onChange={this.handleChange}*/}
                        {/*    checked={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_CORRECTIVE_MAINTENANCE, "true")}*/}
                        {/*    disabled={no_selection}*/}
                        {/*    tooltip={"hg gugtt "}*/}
                        {/*    padding={8}*/}
                        {/*  />*/}
                        {/*</Grid>*/}
                      </Grid>
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
                        id={"acceptance-criteria"}
                        label="Acceptance Criteria"
                        required={true}
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_ACCEPTANCE_CRITERIA, "")}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_MAINTENANCE_RECORD_ACCEPTANCE_CRITERIA, "")}
                        padding={0}
                        lines={3}
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
                    <Grid item xs={12} sm={6}>
                      <SelectFormControlWithTooltip
                        id={"maintenance-personnel"}
                        label="Maintenance Personnel"
                        required={true}
                        multiple={true}
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RECORD_PERSONNEL, "")}
                        onChange={this.handleChange}
                        options={this.context.user.users}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(this.glossary, NURIMS_SSC_MAINTENANCE_RECORD_PERSONNEL, "")}
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

SSCModificationRecords.defaultProps = {
  onChange: (msg) => {
  },
  saveChanges: () => {
  },
};

SSCModificationRecords.propTypes = {
  ref: PropTypes.element.isRequired,
  properties: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  saveChanges: PropTypes.func.isRequired,
}

export default SSCModificationRecords;