import React, {Component} from 'react';
import {
  Fab,
  Grid,
  Typography
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import Box from "@mui/material/Box";
import {
  CMD_UPDATE_SAMPLE_IRRADIATION_LOG_RECORD,
  ITEM_ID,
} from "../../utils/constants";
import {
  isCommandResponse,
  messageHasResponse,
  messageStatusOk
} from "../../utils/WebsocketUtils";
import {withTheme} from "@mui/styles";
import BusyIndicator from "../../components/BusyIndicator";
import PagedCsvTable from "../../components/PagedCsvTable";
import {readString} from "react-papaparse";
import {ConsoleLog, UserContext} from "../../utils/UserContext";
import {TitleComponent} from "../../components/CommonComponents";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";

export const ADDEDITIRRADIATEDSAMPLES_REF = "AddEditIrradiatedSamples";

class AddEditIrradiatedSamples extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      busy: 0,
      data_changed: false,
      messages: [],
      title: props.title,
    };
    this.Module = ADDEDITIRRADIATEDSAMPLES_REF;
    this.tableRef = React.createRef();
    this.recordsToSave = [];
  }

  componentDidMount() {
  }

  ws_message = (message) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageStatusOk(message)) {
        if (isCommandResponse(message, CMD_UPDATE_SAMPLE_IRRADIATION_LOG_RECORD)) {
          const messages = this.state.messages;
          if (response.message !== "") {
            messages.push(response.message);
          } else if (response.hasOwnProperty("operation") && response.operation.hasOwnProperty("irradiated_sample_log_record")) {
            messages.push(`Irradiated sample record for ${response.operation.irradiated_sample_log_record["metadata"]["nurims.operation.data.irradiatedsample.id"]} updated successfully`);
          }
          this.setState({messages: messages});
          this.saveNextRecord();
        }
      } else {
        enqueueErrorSnackbar(response.message);
      }
    }
  }

  saveNextRecord = () => {
    const record = this.recordsToSave.pop();
    if (record) {
      this.props.send({
        cmd: CMD_UPDATE_SAMPLE_IRRADIATION_LOG_RECORD,
        record: record,
        module: this.Module,
      })
    }
  }

  saveChanges = () => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "saveChanges");
    }
    if (this.tableRef.current) {
      this.recordsToSave = [...this.tableRef.current.getRecords()];
      console.log(".....recordsToSave....", this.recordsToSave)
      this.saveNextRecord();
    }
    this.setState({data_changed: false})
  }

  handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleFileUpload", "selectedFile", selectedFile);
    }
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      enqueueErrorSnackbar(`Error occurred reading file: ${selectedFile.name}`)
    };
    this.setState({busy: 1});
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (event) {
      const csvData = event.target.result;
      // const data = JSON.parse(event.target.result);
      const results = readString(csvData);
      const header = {};
      const ts_column = [];
      let parseHeader = true;
      console.log("RESULT", results)
      if (results.hasOwnProperty("data")) {
        const table_data = [];
        for (const row of results.data) {
          if (row.length > 5) {
            if (parseHeader) {
              parseHeader = false;
              for (const index in row) {
                const column = row[index].trim().toLowerCase();
                if (column === "timestamp_in") {
                  header[index] = "nurims.operation.data.irradiatedsample.timestampin";
                  ts_column[index] = true;
                } else if (column === "timestamp_out") {
                  header[index] = "nurims.operation.data.irradiatedsample.timestampout";
                  ts_column[index] = true;
                } else if (column === "id") {
                  header[index] = "nurims.operation.data.irradiatedsample.id";
                  ts_column[index] = false;
                } else if (column === "sample_type") {
                  header[index] = "nurims.operation.data.irradiatedsample.type";
                  ts_column[index] = false;
                } else if (column === "label") {
                  header[index] = "nurims.operation.data.irradiatedsample.label";
                  ts_column[index] = false;
                } else if (column === "site") {
                  header[index] = "nurims.operation.data.irradiatedsample.site";
                  ts_column[index] = false;
                }
              }
            } else {
              const cell_data = {item_id: -1};
              for (const index in row) {
                if (ts_column[index]) {
                  cell_data[header[index]] = row[index].trim().substring(0,19);
                } else {
                  cell_data[header[index]] = row[index].trim();
                }
              }
              table_data.push(cell_data);
            }
          }
        }
        if (that.tableRef.current) {
          that.tableRef.current.setRecords(table_data);
        }
      }
      that.setState({busy: 0, data_changed: true});
    };
  }

  render() {
    const {busy, data_changed, messages} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "data_changed", data_changed);
    }    return (
      <React.Fragment>
        <BusyIndicator open={busy > 0} loader={"pulse"} size={40}/>
        <input
          accept="text/csv"
          // className={classes.input}
          id="import-file-uploader"
          style={{display: 'none',}}
          onChange={this.handleFileUpload}
          type="file"
        />
        <Grid container spacing={2}>
          <Grid item xs={12} style={{paddingLeft: 0, paddingTop: 0}}>
            <TitleComponent title={this.props.title} />
          </Grid>
          <Grid item xs={12} sx={{height: 300, overflowY: 'auto', paddingTop: 10}}>
            <PagedCsvTable
              ref={this.tableRef}
              title={"Irradiated Samples"}
              properties={this.props.properties}
              onSelection={this.onRecordSelection}
              // includeArchived={include_archived}
              // requestGetRecords={this.requestGetRecords}
              enableRecordArchiveSwitch={false}
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
                  id: "nurims.operation.data.irradiatedsample.timestampin",
                  align: 'left',
                  disablePadding: true,
                  label: 'Timestamp In',
                  width: '15%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.timestampout",
                  align: 'left',
                  disablePadding: true,
                  label: 'Timestamp Out',
                  width: '15%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.id",
                  align: 'left',
                  disablePadding: true,
                  label: 'ID',
                  width: '15%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.label",
                  align: 'left',
                  disablePadding: true,
                  label: 'Label',
                  width: '25%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.type",
                  align: 'left',
                  disablePadding: true,
                  label: 'Type',
                  width: '10%',
                  sortField: true,
                },
                {
                  id: "nurims.operation.data.irradiatedsample.site",
                  align: 'left',
                  disablePadding: true,
                  label: 'Type',
                  width: '10%',
                  sortField: true,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} sx={{height: 'calc(100vh - 520px)', overflowY: 'auto', paddingTop: 0}}>
            <Box>
              {messages.map(msg => (
                <div>{msg}</div>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
          <label htmlFor="import-file-uploader">
            <Fab variant="extended" size="small" color="primary" aria-label="import" component={"span"}>
              <UploadIcon sx={{mr: 1}}/>
              Import Irradiated Samples From .csv File
            </Fab>
          </label>
          <Fab variant="extended" size="small" color="primary" aria-label="save" onClick={this.saveChanges}
               disabled={!data_changed}>
            <SaveIcon sx={{mr: 1}}/>
            Save Changes
          </Fab>
        </Box>
      </React.Fragment>
    );
  }
}

AddEditIrradiatedSamples.defaultProps = {
  send: (msg) => {
  },
  user: {},
};

export default withTheme(AddEditIrradiatedSamples);