import React, {Component} from 'react';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import {
  changeRecordArchivalStatus,
  getDateFromDateString,
  getRecordMetadataValue,
  getRecordTitle,
  isRecordEmpty,
  new_record,
  removeMetadataField,
  setMetadataValue,
  setRecordChanged,
  getGlossaryValue, isRecordType,
} from "../../utils/MetadataUtils";
import {
  NURIMS_TITLE,
  NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA,
  NURIMS_SSC_MAINTENANCE_RETURNED_TO_SERVICE,
  UNDEFINED_DATE_STRING,
  ITEM_ID,
  ROLE_MAINTENANCE_DATA_ENTRY,
  CMD_GET_PROVENANCE_RECORDS,
  NURIMS_RELATED_ITEM_ID,
  NURIMS_TITLE_SUBTITLE,
  NURIMS_SSC_MAINTENANCE_REMOVED_FROM_SERVICE,
  NURIMS_SSC_MAINTENANCE_IMPACT_REACTOR_USAGE,
  NURIMS_SSC_MAINTENANCE_OBSOLESCENCE_ISSUE,
  NURIMS_SSC_MAINTENANCE_ISSUE,
  NURIMS_SSC_MAINTENANCE_CORRECTIVE_ACTIONS,
  NURIMS_SSC_MAINTENANCE_DOCUMENTS,
  NURIMS_SSC_MAINTENANCE_PERSONNEL,
  CMD_GET_REFERRED_TO_ITEM_RECORDS,
  CMD_UPDATE_ITEM_RECORD,
  SSC_MAINTENANCE_RECORD,
  CMD_GET_ITEM_RECORDS,
} from "../../utils/constants";
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
import PropTypes from "prop-types";
import {
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog
} from "../../components/UtilityDialogs";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";
import {
  messageHasResponse,
} from "../../utils/WebsocketUtils";
import {
  ADDEDITMODIFICATIONRECORD_REF
} from "./AddEditModificationRecord";
import {
  enqueueSuccessSnackbar
} from "../../utils/SnackbarVariants";

const UNDEFINED_DATE = dayjs(UNDEFINED_DATE_STRING)

export const SSCMAINTENANCERECORDS_REF = "SSCMaintenanceRecords";

class SSCMaintenanceRecords extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      ssc: {},
      selection: {},
      metadata_changed: false,
      include_archived: false,
      confirm_remove: false,
      show_provenance_view: false,
    };
    this.Module = SSCMAINTENANCERECORDS_REF;
    this.listRef = React.createRef();
    this.ref = React.createRef();
    this.provenanceRecords = [];
  }

  handleChange = (e) => {
    const selection = this.state.selection;
    const id = e.target.id === undefined ? e.target.name : e.target.id;
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleChange", "id", id, "value", e.target.value);
    }
    let changed = false;
    if (id === "name") {
      selection[NURIMS_TITLE] = e.target.value;
      changed = true;
    } else if (id === "maintenance") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_ISSUE, e.target.value)
      changed = true;
    } else if (e.target.id === "corrective-actions") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_CORRECTIVE_ACTIONS, e.target.value);
      changed = true;
    } else if (e.target.id === "documents") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_DOCUMENTS, e.target.value);
      changed = true;
    } else if (e.target.name === "impact-reactor-usage") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_IMPACT_REACTOR_USAGE, ""+e.target.checked);
      changed = true;
    } else if (e.target.name === "impact-obsolescence") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_OBSOLESCENCE_ISSUE, "" + e.target.checked);
      changed = true;
    } else if (e.target.id === "acceptance-criteria") {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA, e.target.value);
      changed = true;
    } else if (e.target.name === "personnel") {
      const values = [];
      for (const v of e.target.value) {
        if (v !== "") {
          values.push(v);
        }
      }
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_PERSONNEL, values.join(","));
      changed = true;
    }
    if (changed) {
      setRecordChanged(selection);
      // update scc modification records list entry
      if (this.listRef.current) {
        for (const r of this.listRef.current.getRecords()) {
          if (r.item_id === selection.item_id) {
            r[NURIMS_TITLE] = selection[NURIMS_TITLE];
            r.metadata = selection.metadata;
          }
        }
      }
      this.setState({selection: selection, metadata_changed: true})
    }
  }

  removedFromServiceDateChange = (date) => {
    const selection = this.state.selection;
    if (date) {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_REMOVED_FROM_SERVICE, date.format('YYYY-MM-DD'));
    } else {
      removeMetadataField(selection, NURIMS_SSC_MAINTENANCE_REMOVED_FROM_SERVICE);
    }
    setRecordChanged(selection);
    this.setState({metadata_changed: true})
  }

  returnedToServiceDateChange = (date) => {
    const selection = this.state.selection;
    if (date) {
      setMetadataValue(selection, NURIMS_SSC_MAINTENANCE_RETURNED_TO_SERVICE, date.format('YYYY-MM-DD'));
    } else {
      removeMetadataField(selection, NURIMS_SSC_MAINTENANCE_RETURNED_TO_SERVICE);
    }
    setRecordChanged(selection);
    this.setState({metadata_changed: true})
  }

  // modificationCommissionedDateChange = (date) => {
  //   const selection = this.state.selection;
  //   if (date) {
  //     setMetadataValue(selection, NURIMS_SSC_MODIFICATION_COMMISSIONED_DATE, date.format('YYYY-MM-DD'));
  //   } else {
  //     removeMetadataField(selection, NURIMS_SSC_MODIFICATION_COMMISSIONED_DATE);
  //   }
  //   setRecordChanged(selection);
  //   this.setState({metadata_changed: true})
  // }

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      if (message.cmd === CMD_GET_PROVENANCE_RECORDS) {
        this.setProvenanceRecords(message.response.provenance)
      } else if (message.cmd === CMD_GET_REFERRED_TO_ITEM_RECORDS) {
        if (this.listRef.current) {
          this.listRef.current.setRecords(message.response.structures_systems_components);
        }
      } else if (message.cmd === CMD_UPDATE_ITEM_RECORD) {
        const record = message.response.structures_systems_components;
        enqueueSuccessSnackbar(
          `Successfully updated modification record ${record.length === 1 ? record[NURIMS_TITLE] : ""}.`);
        if (this.listRef.current) {
          this.listRef.current.updateRecord(record);
        }
      } else if (message.cmd === CMD_GET_ITEM_RECORDS) {
        this.setState({selection: message.response.structures_systems_components[0]});
      }
    }
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

  addMaintenanceRecord = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "addMaintenanceRecord");
    }
    if (this.listRef.current) {
      this.listRef.current.addRecords([new_record(
        -1,
        "New Maintenance Record",
        0,
        this.context.user.profile.username,
        this.context.user.profile.fullname,
        SSC_MAINTENANCE_RECORD
      )], false);
      this.setState({metadata_changed: true});
    }
  }

  getMaintenanceRecords = (include_archived) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "getMaintenanceRecords", "include_archived", include_archived);
    }
    this.props.getMaintenanceRecords(this.state.ssc, include_archived);
    this.setState({include_archived: include_archived});
  }

  onMaintenanceRecordSelection = (selection) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "onMaintenanceRecordSelection", "selection", this.state.selection);
    }
    this.props.getMaintenanceRecord(selection);
    this.setState({selection: selection, metadata_changed: false});
  }

  saveMaintenanceRecord = () => {
    const ssc = this.state.ssc;
    const selection = this.state.selection;
    if (this.context.debug) {
      ConsoleLog(this.Module, "saveMaintenanceRecord", "selection", this.state.selection);
    }
    setMetadataValue(selection, NURIMS_RELATED_ITEM_ID, ssc[ITEM_ID]);
    setRecordChanged(selection);
    this.props.saveChanges(selection);
  }

  deleteMaintenanceRecord = () => {
    const selection = this.state.selection;
    this.setState({confirm_remove: true,});
  }

  cancelDelete = () => {
    this.setState({confirm_remove: false,});
  }

  proceedWithDelete = () => {
    const selection = this.state.selection;
    if (this.context.debug) {
      ConsoleLog(this.Module, "proceedWithDelete", "selection", selection);
    }
    if (this.listRef.current) {
      this.listRef.current.removeRecord(selection)
    }
    this.setState({confirm_remove: false, metadata_changed: false});
    this.props.deleteRecord(selection);
  }

  renderCellStyle = (row, cell, theme, selected) => {
    const openIssue = getRecordMetadataValue(
      row, NURIMS_SSC_MAINTENANCE_RETURNED_TO_SERVICE, null) === null;
    return {
      mixBlendMode: selected ? 'lighten' : 'inherit',
      color: openIssue ?
        theme.palette.primary.contrastText : theme.palette.primary.light,
      backgroundColor: openIssue ?
        theme.palette.warning.light : theme.components.MuiTableRow.styleOverrides.root.backgroundColor,
    }
  }

  setProvenanceRecords = (provenance) => {
    setProvenanceRecordsHelper(this, provenance);
  }

  showProvenanceRecordsView = () => {
    showProvenanceRecordsViewHelper(this, ADDEDITMODIFICATIONRECORD_REF);
  }

  closeProvenanceRecordsView = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    this.setState({show_provenance_view: false,});
  }

  toggleRecordArchivalStatus = () => {
    if (changeRecordArchivalStatus(this.state.selection)) {
      this.setState({include_archived: true});
    }
  }

  render() {
    const {confirm_remove, ssc, selection, include_archived, metadata_changed, show_provenance_view} = this.state;
    const {properties, glossary} = this.props;
    console.log("RRRRRRRRRRRR", selection)
    const no_selection = isRecordEmpty(selection);
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "users", this.context.user);
    }
    return (
      <React.Fragment>
        <ConfirmRemoveRecordDialog open={confirm_remove}
                                   selection={selection}
                                   onProceed={this.proceedWithDelete}
                                   onCancel={this.cancelDelete}
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
              onListItemSelection={this.onMaintenanceRecordSelection}
              requestGetRecords={this.getMaintenanceRecords}
              title={`${ssc.hasOwnProperty(NURIMS_TITLE) ? "'" + ssc[NURIMS_TITLE] + "'" : ""} Modification Records`}
              enableRecordArchiveSwitch={true}
              includeArchived={include_archived}
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
                  width: '60%',
                  sortField: true,
                },
                {
                  id: NURIMS_TITLE_SUBTITLE,
                  align: 'center',
                  disablePadding: true,
                  label: 'Created On',
                  width: '30%',
                  sortField: true,
                  format: (v) => {
                    return v.substring(0, 10)
                  },
                },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <AddRemoveArchiveSaveProvenanceButtonPanel
              THIS={this}
              user={this.context.user}
              deleteRecordRole={ROLE_MAINTENANCE_DATA_ENTRY}
              onClickDeleteRecord={this.deleteMaintenanceRecord}
              saveRecordRole={ROLE_MAINTENANCE_DATA_ENTRY}
              onClickSaveRecord={this.saveMaintenanceRecord}
              addRecordRole={ROLE_MAINTENANCE_DATA_ENTRY}
              onClickAddRecord={this.addMaintenanceRecord}
              disableAddRecordButton={isRecordEmpty(ssc)}
              onClickViewProvenanceRecords={this.showProvenanceRecordsView}
              showViewProvenanceRecordButton={true}
              showArchiveRecordButton={true}
              onClickArchiveRecords={this.toggleRecordArchivalStatus}
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
                        value={getRecordTitle(selection)}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={""} // {getGlossaryValue(glossary, NURIMS_SSC_MAINTENANCE_NAME, "")}
                        padding={0}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} style={{textAlign: 'center'}}>
                      <DatePickerWithTooltip
                        width={"25ch"}
                        label="Removed From Service"
                        inputFormat={"yyyy-MM-dd"}
                        value={getDateFromDateString(getRecordMetadataValue(selection,
                          NURIMS_SSC_MAINTENANCE_REMOVED_FROM_SERVICE, UNDEFINED_DATE_STRING), UNDEFINED_DATE)}
                        onChange={this.removedFromServiceDateChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(
                          glossary, NURIMS_SSC_MAINTENANCE_REMOVED_FROM_SERVICE, "")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} style={{textAlign: 'center'}}>
                      <DatePickerWithTooltip
                        width={"25ch"}
                        label="Returned To Service"
                        inputFormat={"yyyy-MM-dd"}
                        value={getDateFromDateString(getRecordMetadataValue(selection,
                          NURIMS_SSC_MAINTENANCE_RETURNED_TO_SERVICE, UNDEFINED_DATE_STRING), UNDEFINED_DATE)}
                        onChange={this.returnedToServiceDateChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(
                          glossary, NURIMS_SSC_MAINTENANCE_RETURNED_TO_SERVICE, "")}
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
                              NURIMS_SSC_MAINTENANCE_IMPACT_REACTOR_USAGE, "false")}
                            tooltip={"hg gugtt "}
                            padding={8}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CheckboxWithTooltip
                            id={"impact-obsolescence"}
                            label={"Obsolescence Issue"}
                            onChange={this.handleChange}
                            checked={getRecordMetadataValue(selection,
                              NURIMS_SSC_MAINTENANCE_OBSOLESCENCE_ISSUE, "false")}
                            disabled={no_selection}
                            tooltip={"hg gugtt "}
                            padding={8}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextFieldWithTooltip
                        id={"maintenance"}
                        label="Maintenance Issue Description"
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_ISSUE, "")}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(glossary, NURIMS_SSC_MAINTENANCE_ISSUE, "")}
                        lines={5}
                        padding={0}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <TextFieldWithTooltip
                        id={"corrective-actions"}
                        label="Corrective actions"
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_CORRECTIVE_ACTIONS, "")}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(glossary, NURIMS_SSC_MAINTENANCE_CORRECTIVE_ACTIONS, "")}
                        lines={5}
                        padding={0}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextFieldWithTooltip
                        id={"acceptance-criteria"}
                        label="Acceptance Criteria"
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA, "")}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(glossary, NURIMS_SSC_MAINTENANCE_ACCEPTANCE_CRITERIA, "")}
                        padding={0}
                        lines={3}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextFieldWithTooltip
                        id={"documents"}
                        label="Documents"
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_DOCUMENTS, "")}
                        onChange={this.handleChange}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(glossary, NURIMS_SSC_MAINTENANCE_DOCUMENTS, "")}
                        padding={0}
                        lines={3}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <SelectFormControlWithTooltip
                        id={"personnel"}
                        label="Maintenance Personnel"
                        required={true}
                        multiple={true}
                        value={getRecordMetadataValue(selection, NURIMS_SSC_MAINTENANCE_PERSONNEL, [])}
                        onChange={this.handleChange}
                        options={this.context.user.users}
                        disabled={no_selection}
                        tooltip={getGlossaryValue(glossary, NURIMS_SSC_MAINTENANCE_PERSONNEL, "")}
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
};

SSCMaintenanceRecords.propTypes = {
  ref: PropTypes.element.isRequired,
  properties: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  deleteRecord: PropTypes.func.isRequired,
  saveChanges: PropTypes.func.isRequired,
  getMaintenanceRecords: PropTypes.func.isRequired,
  getMaintenanceRecord: PropTypes.func.isRequired,
}

export default SSCMaintenanceRecords;