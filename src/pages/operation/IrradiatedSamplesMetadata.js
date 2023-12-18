import React, {Component} from 'react';
import {withTheme} from "@mui/styles";
import {
  isRecordEmpty,
  getRecordMetadataValue,
  setRecordMetadataValue, setRecordChanged,
} from "../../utils/MetadataUtils";
import {
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST,
  NURIMS_TITLE,
} from "../../utils/constants";
import PropTypes from "prop-types";
import {readString} from "react-papaparse";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  Grid,
  Box,
} from "@mui/material";
import PagedDataTable from "../../components/PagedDataTable"
import {
  enqueueErrorSnackbar
} from "../../utils/SnackbarVariants";


class IrradiatedSamplesMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      record: {},
      disabled: true,
      data_changed: false,
      properties: props.properties,
    };
    this.Module = "IrradiatedSamplesMetadata";
    this.ref = React.createRef();
    this.importRef = React.createRef();
    this.samples = [];
    this.tableData = [];
    this.tableColumns = [
      {
        field: "sample_id",
        headerName: "ID",
        headerAlign: 'center',
        width: 80,
        editable: true,
      },
      {
        field: "samples",
        headerName: "Sample ID's",
        width: 180,
        align: 'left',
        headerAlign: 'center',
        editable: true,
      },
      {
        field: 'timein',
        headerName: 'Time IN',
        headerAlign: 'center',
        type: 'datetime',
        width: 180,
        editable: true,
      },
      {
        field: 'timeout',
        headerName: 'Time OUT',
        headerAlign: 'center',
        type: 'datetime',
        width: 180,
        editable: true,
      },
      {
        field: 'site',
        headerName: 'Site',
        headerAlign: 'center',
        align: 'center',
        width: 120,
        editable: true,
        type: 'singleSelect',
        valueOptions: [
          {label: "Site 1", value: "1"},
          {label: "Site 3", value: "3"},
          {label: "Site 4", value: "4"},
          {label: "Site 5", value: "5"}
        ],
      },
      {
        field: 'type',
        headerName: 'Sample Type',
        headerAlign: 'center',
        align: 'center',
        width: 150,
        editable: true,
        type: 'singleSelect',
        valueOptions: [
          {label: "Sample", value: "sample"},
          {label: "Cadmium", value: "cadmium"},
        ],
      }
    ];
  }

  componentDidMount() {
    document.addEventListener("keydown", this.ctrlKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.ctrlKeyPress, false);
  }

  ctrlKeyPress = (event) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ctrlKeyPress", "key", event.key, "ctrlKey", event.ctrlKey);
    }
    if (event.key === 'i' && event.ctrlKey) {
      // Ctrl+i
      event.preventDefault();
      if (this.importRef.current) {
        this.importRef.current.click();
      }
    }
  }

  // handleChange = (e) => {
  //   if (this.context.debug) {
  //     ConsoleLog(this.Module, "handleChange", "id", e.target.id, "value", e.target.value);
  //   }
  //   const record = this.state.record;
  //   if (e.target.id === "name") {
  //     record["changed"] = true;
  //     record[NURIMS_TITLE] = e.target.value;
  //     this.setState({record: record})
  //   } else if (e.target.id === "description") {
  //     appendMetadataChangedField(record["changed.metadata"], NURIMS_DESCRIPTION);
  //     setMetadataValue(record, NURIMS_DESCRIPTION, e.target.value, "");
  //     this.setState({record: record})
  //   }
  //   // signal to parent that details have changed
  //   this.props.onChange(true);
  // }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    this.setState({
      record: (record) ? record : [],
      disabled: !(record),
    })
    if (record) {
      this.ref.current.updateRows(getRecordMetadataValue(
        record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, []));
    }
    this.props.onChange(false);
  }

  handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    console.log("file uploaded", selectedFile)
    const that = this;
    const fileReader = new FileReader();
    fileReader.onerror = function () {
      alert('Unable to read ' + selectedFile.name);
      enqueueErrorSnackbar(`Error occurred reading file: ${selectedFile.name}`)
    };
    // this.setState({busy: 1});
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (e) {
      const results = readString(e.target.result, {header: true});
      console.log("SELECTION", that.state.record)
      console.log("YEAR", that.state.record[NURIMS_TITLE])
      console.log("RECORDS", that.samples)
      console.log("RESULT", results)
      const header = results.meta.fields;
      const ts_column = results.meta.fields;
      let parseHeader = true;
      if (results.hasOwnProperty("data")) {
        const table_data = [];
        for (const row of results.data) {
          let found = false;
          if (row.id.length > 0) {
            if (row.timein.startsWith(that.state.record[NURIMS_TITLE])) {
              if (that.ref.current) {
                that.ref.current.addRow({
                  id: row.id,
                  sample_id: row.sample_id,
                  timein: row.timein,
                  timeout: row.timeout,
                  site: row.site,
                  samples: row.samples,
                  type: row.type,
                })
              }
              // that.samples.push({
              //   id: row.id,
              //   sample_id: row.sample_id,
              //   timein: row.timein,
              //   timeout: row.timeout,
              //   site: row.site,
              //   samples: row.samples,
              //   type: row.type,
              // })
            }
          }
        }
      }
      that.setState({busy: 0, data_changed: true});
    };
  }

  onDataChanged = (state, rows) => {
    console.log("onDataChanged", state)
    // console.log("onDataChanged - tableData", this.tableData)
    const record = this.state.record;
    setRecordChanged(record, true);
    setRecordMetadataValue(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, rows);
    console.log("onDataChanged - record", record)
    this.props.onChange(state);
  }

  render() {
    const {record, disabled} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "disabled", disabled, "record", record);
    }
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '100%'},
        }}
        noValidate
        autoComplete="off"
      >
        <input
          ref={this.importRef}
          accept="*.csv"
          id="import-file-uploader"
          style={{display: 'none',}}
          onChange={this.handleFileUpload}
          type="file"
          disabled={isRecordEmpty(record)}
        />
        <Grid container spacing={2}>
          <Grid>
            <PagedDataTable
              ref={this.ref}
              data={getRecordMetadataValue(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, [])}
              columns={this.tableColumns}
              onDataChanged={this.onDataChanged}
            >
            </PagedDataTable>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

IrradiatedSamplesMetadata.propTypes = {
  ref: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
}

IrradiatedSamplesMetadata.defaultProps = {
  onChange: (msg) => {
  },
};

export default withTheme(IrradiatedSamplesMetadata);