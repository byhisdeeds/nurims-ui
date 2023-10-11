import React from 'react';
import {
  Grid,
} from "@mui/material";
import {
  CMD_GET_GLOSSARY_TERMS,
  CMD_GET_MANUFACTURER_RECORDS, CMD_GET_PROVENANCE_RECORDS,
} from "../../utils/constants";

import BaseRecordManager from "../../components/BaseRecordManager";
import {
  ConfirmRemoveRecordDialog,
  ShowProvenanceRecordsDialog,
} from "../../components/UtilityDialogs";
import ManufacturerList from "./ManufacturerList";
import ManufacturerMetadata from "./ManufacturerMetadata";
import {
  TitleComponent,
  AddEditButtonPanel
} from "../../components/CommonComponents";
import {ConsoleLog, UserContext} from "../../utils/UserContext";
import {messageHasResponse, messageStatusOk} from "../../utils/WebsocketUtils";
import {
  setProvenanceRecordsHelper,
  showProvenanceRecordsViewHelper
} from "../../utils/ProvenanceUtils";

export const MANUFACTURER_REF = "Manufacturer";

class Manufacturer extends BaseRecordManager {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state["show_provenance_view"] = false;
    this.Module = MANUFACTURER_REF;
    this.recordTopic = "manufacturer";
    this.provenanceRecords = [];
  }

  componentDidMount() {
    // this.getManufacturerRecords();
    this.requestGetRecords(false, true);
  }

  getManufacturerRecords = () => {
    this.props.send({
      cmd: CMD_GET_MANUFACTURER_RECORDS,
      "include.withdrawn": "false",
      "include.metadata": "false",
      module: this.Module,
    });
  }

  ws_message = (message) => {
    super.ws_message(message, [
      { cmd: CMD_GET_GLOSSARY_TERMS, func: "setGlossaryTerms", params: "terms" }
    ]);
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (message.cmd === CMD_GET_PROVENANCE_RECORDS) {
          this.setProvenanceRecords(response.provenance)
        }
      }
    }
  }

  setProvenanceRecords = (provenance) => {
    setProvenanceRecordsHelper(this, provenance);
  }

  showProvenanceRecordsView = () => {
    showProvenanceRecordsViewHelper(this);
  }

  closeProvenanceRecordsView = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    }
    this.setState({show_provenance_view: false,});
  }

  render() {
    const {metadata_changed, confirm_remove, selection, show_provenance_view, include_archived} = this.state;
    // console.log("render - RECORD_TYPE", this.recordTopic);
    const {user} = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "recordTopic", this.recordTopic, "selection", selection);
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
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={5}>
            <ManufacturerList
              ref={this.listRef}
              title={"Manufacturers"}
              onSelection={this.onRecordSelection}
              properties={this.props.properties}
              includeArchived={include_archived}
              enableRecordArchiveSwitch={true}
              requestGetRecords={this.requestGetRecords}
            />
          </Grid>
          <Grid item xs={7}>
            <ManufacturerMetadata
              ref={this.metadataRef}
              onChange={this.onRecordMetadataChanged}
              properties={this.props.properties}
            />
          </Grid>
        </Grid>
        {<AddEditButtonPanel
          THIS={this}
          user={user}
          onClickAddRecord={this.addRecord}
          onClickChangeRecordArchivalStatus={this.changeRecordArchivalStatus}
          onClickRemoveRecord={this.removeRecord}
          onClickSaveRecordChanges={this.saveChanges}
          onClickViewProvenanceRecords={this.showProvenanceRecordsView}
          addRecordButtonLabel={"Add Manufacturer"}
          removeRecordButtonLabel={"Remove Manufacturer"}
        />}
        {/*<Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="remove" onClick={this.removeRecord}*/}
        {/*    // disabled={!((selection["nurims.withdrawn"] === 1) || selection["item_id"] === -1)}>*/}
        {/*       disabled={!this.isSysadminButtonAccessible(selection)}>*/}
        {/*    <PersonRemoveIcon sx={{mr: 1}}/>*/}
        {/*    Remove Monitor*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}*/}
        {/*       disabled={!metadata_changed}>*/}
        {/*    <SaveIcon sx={{mr: 1}}/>*/}
        {/*    Save Changes*/}
        {/*  </Fab>*/}
        {/*  <Fab variant="extended" size="small" color="primary" aria-label="add" onClick={this.addRecord}>*/}
        {/*    <AddIcon sx={{mr: 1}}/>*/}
        {/*    Add Monitor*/}
        {/*  </Fab>*/}
        {/*</Box>*/}
      </React.Fragment>
    );
  }
}

Manufacturer.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default Manufacturer;