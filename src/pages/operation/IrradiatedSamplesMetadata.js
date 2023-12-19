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
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import utc from "dayjs/plugin/utc";
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
  enqueueErrorSnackbar, enqueueInfoSnackbar
} from "../../utils/SnackbarVariants";
import BusyIndicator from "../../components/BusyIndicator";
import {nanoid} from "nanoid";


function timestampToString(ts) {
  const year = ts.year().toString().padStart(4, "0");
  const month = (ts.month() + 1).toString().padStart(2, "0");
  const day = ts.date().toString().padStart(2, "0");
  const hour = ts.hour().toString().padStart(2, "0");
  const minute = ts.minute().toString().padStart(2, "0");
  const second = ts.second().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function get_field_timestamp(field) {
  if (field) {
    const ls_field = field.toLowerCase();
    if (ls_field.includes("am") || ls_field.includes("pm")) {
      return dayjs(field, "HH:mm:ss A")
    }
    return dayjs(field, "HH:mm:ss")
  }
  return dayjs("", "HH:mm:ss")
}

function isWordInString(needle, haystack) {
  return haystack
    .split(',')
    .some(p => (p === needle));
}

function filter_duplicate_sample_entries(rows, row) {
  // check for id already registered
  for (const r of rows) {
    if (r.sample_id === row.sample_id) {
      // ID already registered, now we check if the sample label already registered also
      console.log(`-- isWordInString (${row.samples}, ${r.samples}) = `, isWordInString(row.samples, r.samples))
      if (!isWordInString(row.samples, r.samples)) {
        // if sample entry not already registered then we add it now
        if (r.samples.length === 0) {
          r.samples = row.samples;
        } else {
          r.samples += `,${row.samples}`;
        }
      }
      return true;
    }
  }
  console.log(`-- isWordInString (${row.samples}, *) = NOT FOUND`)
  // row not already registered so we don't filter it
  return false;
}

class IrradiatedSamplesMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      record: {},
      busy: 0,
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
    this.setState({busy: 1});
    fileReader.readAsText(selectedFile);
    fileReader.onload = function (e) {
      const results = readString(e.target.result, {header: true, dynamicTyping: false});
      console.log("SELECTION", that.state.record)
      console.log("YEAR", that.state.record[NURIMS_TITLE])
      console.log("RECORDS", that.samples)
      console.log("RESULT", results)
      const header = results.meta.fields;
      const ts_column = results.meta.fields;
      let parseHeader = true;
      if (results.hasOwnProperty("data")) {
        let p_dmy = null;
        let p_tin = null;
        let p_tout = null;
        let p_id = null;
        let p_sample_type = null;
        let p_label = null;
        let p_site = null;
        let p_comments = null;
        let count = 0;
        for (const row of results.data) {
          if (results.meta.fields.includes("Comments")) {
            let dmy = dayjs(row["Date"], "D-MMM-YY");
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            // console.log(">>>>> ROW[DATE]: ", row["Date"], row["Date"] === undefined ? "undefined" : row["Date"].length, dmy.isValid())
            // if this rows date is not valid then use the previous rows value
            if (!dmy.isValid()) {
              dmy = p_dmy;
            }
            let tin = get_field_timestamp(row["Time Stamp In"])
            console.log(">>>>> ROW[Time Stamp In]: ",tin.isValid(), row["Time Stamp In"])
            // if this rows timestamp IN is not valid then use the previous rows value
            if (!tin.isValid()) {
              tin = p_tin;
            }
            let tout = get_field_timestamp(row["Time Stamp Out"])
            console.log(">>>>> ROW[Time Stamp Out]: ", tout.isValid(),  row["Time Stamp Out"])
            // if this rows timestamp OUT is not valid then use the previous rows value
            if (!tout.isValid()) {
              tout = p_tout;
            }
            let id = row["ID"];
            // console.log(">>>>> ROW[ID]: ", id === undefined ? "undefined" : id.length, id);
            if (id === undefined || id.length === 0) {
              id = p_id;
            }
            let sample_type = row["Sample Type"];
            // console.log(">>>>> ROW[Sample Type]: ", sample_type === undefined ? "undefined" : sample_type.length, sample_type);
            if (sample_type === undefined || sample_type.length === 0) {
              sample_type = p_sample_type;
            }
            let label = row["Label"];
            // console.log(">>>>> ROW[Label]: ", label === undefined ? "undefined" : label.length, label);
            if (label === undefined || label.length === 0) {
              label = p_label;
            }
            let site = row["Site"];
            // console.log(">>>>> ROW[Site]: ", site === undefined ? "undefined" : site.length, site);
            if (site === undefined || site.length === 0) {
              site = p_site;
            }
            if (dmy) {
              // if SampleType contains Cadmium and Label contains Capsule then this is a 'cadmium' capsule.
              // All other samples are called 'capsules'
              if (sample_type.toLowerCase().includes("cadmium") && label.toLowerCase().includes("capsule")) {
                sample_type = "cadmium";
              } else {
                sample_type = "sample";
              }
              const tsin =
                timestampToString(dmy.clone().hour(tin.hour()).minute(tin.minute()).second(tin.second()))
              const tsout =
                timestampToString(dmy.clone().hour(tout.hour()).minute(tout.minute()).second(tout.second()))
              console.log("----- LABEL: ", label);
              console.log("----- SAMPLE TYPE: ", sample_type);
              console.log("----- ID: ", id);
              console.log("----- IN: ", tsin);
              console.log("----- OUT: ", tsout);
              console.log("----- SITE: ",site);
              // only import sample entries for the record year
              if ("" + dmy.year() === that.state.record[NURIMS_TITLE]) {
                if (that.ref.current) {
                  if (that.ref.current.addRow({
                    id: nanoid(),
                    sample_id: id,
                    timein: tsin,
                    // timein: timestampToString(tsin),
                    timeout: tsout,
                    // timeout: timestampToString(tsout),
                    site: site,
                    samples: label,
                    type: sample_type,
                  }, filter_duplicate_sample_entries)) {
                    count++;
                  }
                }
              }
            } else {
              console.log("----- INVALID ENTRY (COMMENT): ", row["Comments"])
            }
            p_dmy = dmy;
            p_tin = tin;
            p_tout = tout;
            p_id = id;
            p_sample_type = sample_type;
            p_label = label;
            p_site = site;
          } else if (results.meta.fields.includes("timein")) {
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
                  }, filter_duplicate_sample_entries)
                }
              }
            }
          }
        }
        enqueueInfoSnackbar(`Imported ${count} log entries from '${selectedFile.name}'.`)
      }
      that.setState({busy: 0, data_changed: true});
    };
    // 👇️ reset file input
    e.target.value = null;
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
    const {record, disabled, busy} = this.state;
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
        <BusyIndicator open={busy > 0} loader={"pulse"} size={40}/>
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