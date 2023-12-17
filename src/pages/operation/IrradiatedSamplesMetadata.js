import React, {Component} from 'react';
import {withTheme} from "@mui/styles";
import {
  setMetadataValue,
  getRecordMetadataValue,
  appendMetadataChangedField,
  getMetadataValueAsISODateString, setRecordChanged,
} from "../../utils/MetadataUtils";
import {
  NURIMS_DESCRIPTION,
  NURIMS_ENTITY_DATE_OF_BIRTH,
  NURIMS_ENTITY_DOSE_PROVIDER_ID,
  NURIMS_ENTITY_IS_EXTREMITY_MONITORED,
  NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED, NURIMS_ENTITY_IS_WRIST_MONITORED,
  NURIMS_ENTITY_NATIONAL_ID,
  NURIMS_ENTITY_SEX,
  NURIMS_ENTITY_WORK_DETAILS,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDES,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDEUNITS,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_REPORTFILE,
  NURIMS_SAMPLEDATE,
  NURIMS_TITLE,
  UNDEFINED_DATE_STRING
} from "../../utils/constants";
import PropTypes from "prop-types";
import {readString} from "react-papaparse";
import {
  DateSelect,
} from "../../components/CommonComponents";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  getPropertyValue
} from "../../utils/PropertyUtils";
import {
  Grid,
  Box,
  TextField
} from "@mui/material";
import EditableTable from "../../components/EditableTable";
import TextFileViewer from "../../components/TextFileViewer";
import dayjs from 'dayjs';
import DataTable from "../../components/DataTable";
import PagedEditableTable from "../../components/PagedEditableTable";
import {enqueueErrorSnackbar} from "../../utils/SnackbarVariants";


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
    this.samples = [
      {
        id: 1,
        sample_id: "",
        samples: "name1",
        age: 25,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 2,
        sample_id: "",
        samples: "name2",
        age: 36,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 3,
        sample_id: "",
        samples: "name3",
        age: 19,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 4,
        sample_id: "",
        samples: "name 4",
        age: 28,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 5,
        sample_id: "",
        samples: "name 5",
        age: 23,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 6,
        sample_id: "",
        samples: "name 6",
        age: 23,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 7,
        sample_id: "",
        samples: "name 7",
        age: 23,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 8,
        sample_id: "",
        samples: "name 8",
        age: 23,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 11,
        sample_id: "",
        samples: "name1",
        age: 25,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 12,
        sample_id: "",
        samples: "name2",
        age: 36,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 13,
        sample_id: "",
        samples: "name3",
        age: 19,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 14,
        sample_id: "",
        samples: "name 4",
        age: 28,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 15,
        sample_id: "",
        samples: "name 5",
        age: 23,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 16,
        sample_id: "",
        samples: "name 6",
        age: 23,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 17,
        sample_id: "",
        samples: "name 7",
        age: 23,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
      {
        id: 18,
        sample_id: "",
        samples: "name 8",
        age: 23,
        timein: "2015-12-18 09:42:00",
        timeout: "2015-12-18 09:42:00",
        site: "1",
        type: "sample"
      },
    ];

    this.nuclidesData = [];
    this.tableFields = [
      {
        label: "ID",
        name: "id",
        width: '8ch',
        align: 'center',
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Samples ID's",
        name: "samples",
        width: '18ch',
        align: 'center',
        validation: e => {
          return true;
        },
        error: "Haha"
      },
      {
        label: "Time IN",
        name: "timein",
        width: '8ch',
        type: "dateTime",
        align: 'center',
        validation: e => {
          return true;
        },
        error: "Haha"
      },
      {
        label: "Time OUT",
        name: "timeout",
        width: '8ch',
        type: "dateTime",
        align: 'center',
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Site",
        name: "site",
        width: '8ch',
        align: 'center',
        type: "singleSelect",
        options: [
          {label: "Site 1", value: "1"},
          {label: "Site 3", value: "3"},
          {label: "Site 4", value: "4"},
          {label: "Site 5", value: "5"}
        ],
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Sample Type",
        name: "type",
        width: '8ch',
        align: 'center',
        type: "singleSelect",
        options: [
          {label: "Sample", value: "sample"},
          {label: "Cadmium", value: "cadmium"}
        ],
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      }
    ];
    // getPropertyValue(props.properties, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDES,
    //   "").split('|').map((n) => {
    //   const t = n.split(',');
    //   if (t.length === 2) {
    //     return this.tableFields[0].options.push({ label: t[1], value: t[0] });
    //   }
    // })
    // getPropertyValue(props.properties, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDEUNITS,
    //   "").split('|').map((n) => {
    //   const t = n.split(',');
    //   if (t.length === 2) {
    //     return this.tableFields[3].options.push({ label: t[1], value: t[0] });
    //   }
    // })
    // this.doc = { uri: "data:text/plain,test.txt\nwtewrw\nwqrwrwqr\n" };
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

  handleChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleChange", "id", e.target.id, "value", e.target.value);
    }
    const record = this.state.record;
    if (e.target.id === "name") {
      record["changed"] = true;
      record[NURIMS_TITLE] = e.target.value;
      this.setState({record: record})
    } else if (e.target.id === "description") {
      appendMetadataChangedField(record["changed.metadata"], NURIMS_DESCRIPTION);
      setMetadataValue(record, NURIMS_DESCRIPTION, e.target.value, "");
      this.setState({record: record})
    }
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    // if (record) {
    //   setRecordChanged(record, false);
    //   // record["changed.metadata"] = [];
    //   // this.doc = {uri: getRecordMetadataValue(
    //   //   record, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_REPORTFILE, "").uri};
    // }
    this.setState({
      record: (record) ? record : [],
      disabled: !(record),
    })
    if (this.ref.current && (record)) {
      // this.ref.current.setRowData(getRecordMetadataValue(
      //   record, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS, []));
    }
    this.props.onChange(false);
  }

  getUserMetadata = () => {
    return this.state.user;
  }

  handleModuleAuthorizationLevelChange = (e) => {
    const user = this.state.user;
    user["changed"] = true;
    user.metadata["authorized_module_level"] = e.target.value;
    this.setState({user: user})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  handleDateAvailableChange = (e) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "handleDateAvailableChange", "date", e.format("YYYY-MM-DD"));
    }
    const record = this.state.record;
    record["changed"] = true;
    appendMetadataChangedField(record["changed.metadata"], NURIMS_SAMPLEDATE);
    setMetadataValue(record, NURIMS_SAMPLEDATE, e.format("YYYY-MM-DD"), "");
    this.setState({record: record})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  saveTableData = data => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "saveTableData", "data", data);
    }
    // const material = this.state.material;
    // material["changed"] = true;
    // setMetadataValue(material, "nurims.material.nuclides", data);
    // this.setState({material: material})
    // signal to parent that details have changed
    this.props.onChange(true);
  };

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
      console.log("RECORDS", that.samples)
      console.log("RESULT", results)
      const header = results.meta.fields;
      const ts_column = results.meta.fields;
      let parseHeader = true;
      // if (results.hasOwnProperty("data")) {
      //   const table_data = [];
      //   for (const row of results.data) {
      //     let found = false;
      //     for (const person of that.persons) {
      //       if (row.hasOwnProperty("Id") && row.Id === getRecordMetadataValue(person, NURIMS_ENTITY_DOSE_PROVIDER_ID, null)) {
      //         found = true;
      //         break;
      //       }
      //     }
      //     if (!found) {
      //       const p = {
      //         item_id: -1,
      //         "nurims.title": row.Name,
      //         "nurims.withdrawn": 0,
      //         "record_type": row.Type === "employee_record" ? "employee_record" : row.Type === "fixed_location_monitor_record" ? "monitor_record" : "",
      //         metadata: []
      //       };
      //       if (row.hasOwnProperty("DateOfBirth")) {
      //         setMetadataValue(p, NURIMS_ENTITY_DATE_OF_BIRTH, row.DateOfBirth)
      //       }
      //       if (row.hasOwnProperty("WorkDetails")) {
      //         setMetadataValue(p, NURIMS_ENTITY_WORK_DETAILS, row.WorkDetails)
      //       }
      //       if (row.hasOwnProperty("Sex")) {
      //         setMetadataValue(p, NURIMS_ENTITY_SEX, row.Sex)
      //       }
      //       if (row.hasOwnProperty("NID")) {
      //         setMetadataValue(p, NURIMS_ENTITY_NATIONAL_ID, row.NID)
      //       }
      //       if (row.hasOwnProperty("Id")) {
      //         setMetadataValue(p, NURIMS_ENTITY_DOSE_PROVIDER_ID, row.Id)
      //       }
      //       if (row.hasOwnProperty("IsWholeBodyMonitored")) {
      //         setMetadataValue(p, NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED, isPersonMonitored(row.IsWholeBodyMonitored))
      //       }
      //       if (row.hasOwnProperty("IsExtremityMonitored")) {
      //         setMetadataValue(p, NURIMS_ENTITY_IS_EXTREMITY_MONITORED, isPersonMonitored(row.IsExtremityMonitored))
      //       }
      //       if (row.hasOwnProperty("IsWristMonitored")) {
      //         setMetadataValue(p, NURIMS_ENTITY_IS_WRIST_MONITORED, isPersonMonitored(row.IsWristMonitored))
      //       }
      //       that.persons.push(p);
      //     }
      //   }
      // }
      console.log("SAMPLES", that.samples)
      that.setState({busy: 0, data_changed: true});
    };
  }

  render() {
    const {record, disabled} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "disabled", disabled, "record", record);
    }
    // const authorized_module_levels = getPropertyValue(properties, "system.authorizedmodulelevels", "").split('|');
    // const user_roles = getPropertyValue(properties, "system.userrole", "").split('|');
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
        />
        <Grid container spacing={2}>
          <Grid>
            <DataTable
              data={this.samples}
              columns={[
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
              ]}
            >
            </DataTable>
            {/*<PagedEditableTable*/}
            {/*  addButtonLabel={"Add Record"}*/}
            {/*  data={tableData}*/}
            {/*  cols={[*/}
            {/*    {*/}
            {/*      accessorKey: 'id',*/}
            {/*      header: 'Id',*/}
            {/*      enableEditing: true,*/}
            {/*      size: 80,*/}
            {/*    },*/}
            {/*    {*/}
            {/*      accessorKey: 'samples',*/}
            {/*      header: 'Samples',*/}
            {/*      enableEditing: true,*/}
            {/*      muiEditTextFieldProps: {*/}
            {/*        required: true,*/}
            {/*        // error: !!validationErrors?.firstName,*/}
            {/*        // helperText: validationErrors?.firstName,*/}
            {/*        // //remove any previous validation errors when user focuses on the input*/}
            {/*        // onFocus: () =>*/}
            {/*        //   setValidationErrors({*/}
            {/*        //     ...validationErrors,*/}
            {/*        //     firstName: undefined,*/}
            {/*        //   }),*/}
            {/*        // //optionally add validation checking for onBlur or onChange*/}
            {/*      },*/}
            {/*    },*/}
            {/*    {*/}
            {/*      accessorKey: 'timein',*/}
            {/*      header: 'Time IN',*/}
            {/*      muiEditTextFieldProps: {*/}
            {/*        type: 'datetime',*/}
            {/*        required: true,*/}
            {/*        // error: !!validationErrors?.lastName,*/}
            {/*        // helperText: validationErrors?.lastName,*/}
            {/*        // //remove any previous validation errors when user focuses on the input*/}
            {/*        // onFocus: () =>*/}
            {/*        //   setValidationErrors({*/}
            {/*        //     ...validationErrors,*/}
            {/*        //     lastName: undefined,*/}
            {/*        //   }),*/}
            {/*      },*/}
            {/*    },*/}
            {/*    {*/}
            {/*      accessorKey: 'timeout',*/}
            {/*      header: 'Time OUT',*/}
            {/*      muiEditTextFieldProps: {*/}
            {/*        type: 'datetime',*/}
            {/*        required: true,*/}
            {/*        // error: !!validationErrors?.email,*/}
            {/*        // helperText: validationErrors?.email,*/}
            {/*        // //remove any previous validation errors when user focuses on the input*/}
            {/*        // onFocus: () =>*/}
            {/*        //   setValidationErrors({*/}
            {/*        //     ...validationErrors,*/}
            {/*        //     email: undefined,*/}
            {/*        //   }),*/}
            {/*      },*/}
            {/*    },*/}
            {/*    {*/}
            {/*      accessorKey: 'site',*/}
            {/*      header: 'Site',*/}
            {/*      size: 80,*/}
            {/*      editVariant: 'select',*/}
            {/*      editSelectOptions: [*/}
            {/*        {label: "Site 1", value: "1"},*/}
            {/*        {label: "Site 3", value: "3"},*/}
            {/*        {label: "Site 4", value: "4"},*/}
            {/*        {label: "Site 5", value: "5"}*/}
            {/*      ],*/}
            {/*      muiEditTextFieldProps: {*/}
            {/*        // error: !!validationErrors?.state,*/}
            {/*        // helperText: validationErrors?.state,*/}
            {/*      },*/}
            {/*    },*/}
            {/*  ]}*/}
            {/*  columnEditProps={[*/}
            {/*    {*/}
            {/*      accessorKey: 'samples',*/}
            {/*      muiEditTextFieldProps: {*/}
            {/*        required: true,*/}
            {/*        error: "samples",*/}
            {/*        helperText: "samples",*/}
            {/*        //remove any previous validation errors when user focuses on the input*/}
            {/*        onFocus: {*/}
            {/*          samples: undefined,*/}
            {/*        },*/}
            {/*        //optionally add validation checking for onBlur or onChange*/}
            {/*      },*/}
            {/*    },*/}
            {/*    {*/}
            {/*      accessorKey: 'timein',*/}
            {/*      muiEditTextFieldProps: {*/}
            {/*        type: 'datetime',*/}
            {/*        required: true,*/}
            {/*        error: "timein",*/}
            {/*        helperText: "timein",*/}
            {/*        //remove any previous validation errors when user focuses on the input*/}
            {/*        onFocus: {*/}
            {/*          timein: undefined,*/}
            {/*        },*/}
            {/*      },*/}
            {/*    },*/}
            {/*    {*/}
            {/*      accessorKey: 'timeout',*/}
            {/*      muiEditTextFieldProps: {*/}
            {/*        type: 'datetime',*/}
            {/*        required: true,*/}
            {/*        error: "timeout",*/}
            {/*        helperText: "timeout",*/}
            {/*        //remove any previous validation errors when user focuses on the input*/}
            {/*        onFocus: {*/}
            {/*          timeout: undefined,*/}
            {/*        },*/}
            {/*      },*/}
            {/*    },*/}
            {/*    {*/}
            {/*      accessorKey: 'site',*/}
            {/*      muiEditTextFieldProps: {*/}
            {/*        select: true,*/}
            {/*        error: "site",*/}
            {/*        helperText: "site",*/}
            {/*      },*/}
            {/*    },*/}
            {/*  ]}*/}
            {/*/>*/}
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