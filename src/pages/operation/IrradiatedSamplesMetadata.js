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
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDES,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDEUNITS,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_REPORTFILE,
  NURIMS_SAMPLEDATE,
  NURIMS_TITLE,
  UNDEFINED_DATE_STRING
} from "../../utils/constants";
import PropTypes from "prop-types";
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



const tableData = [
  {
    id: 1,
    samples: "name1",
    age: 25,
    timein: "2015-12-18 09:42:00",
    timeout: "2015-12-18 09:42:00",
    site: "1",
    type: "sample"
  },
  {
    id: 2,
    samples: "name2",
    age: 36,
    timein: "2015-12-18 09:42:00",
    timeout: "2015-12-18 09:42:00",
    site: "1",
    type: "sample"
  },
  {
    id: 3,
    samples: "name3",
    age: 19,
    timein: "2015-12-18 09:42:00",
    timeout: "2015-12-18 09:42:00",
    site: "1",
    type: "sample"
  },
  {
    id: 4,
    samples: "name 4",
    age: 28,
    timein: "2015-12-18 09:42:00",
    timeout: "2015-12-18 09:42:00",
    site: "1",
    type: "sample"
  },
  {
    id: 5,
    samples: "name 5",
    age: 23,
    timein: "2015-12-18 09:42:00",
    timeout: "2015-12-18 09:42:00",
    site: "1",
    type: "sample"
  },
  {
    id: 6,
    samples: "name 6",
    age: 23,
    timein: "2015-12-18 09:42:00",
    timeout: "2015-12-18 09:42:00",
    site: "1",
    type: "sample"
  },
  {
    id: 7,
    samples: "name 7",
    age: 23,
    timein: "2015-12-18 09:42:00",
    timeout: "2015-12-18 09:42:00",
    site: "1",
    type: "sample"
  },
  {
    id: 8,
    samples: "name 8",
    age: 23,
    timein: "2015-12-18 09:42:00",
    timeout: "2015-12-18 09:42:00",
    site: "1",
    type: "sample"
  },
];



class IrradiatedSamplesMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      record: {},
      disabled: true,
      password: "",
      password_check: "",
      properties: props.properties,
    };
    this.Module = "IrradiatedSamplesMetadata";
    this.ref = React.createRef();
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EditableTable
              tableName={"irradiated-samples-table"}
              disable={disabled}
              ref={this.ref}
              addRowBtnText={"Add Sample"}
              initWithoutHead={false}
              defaultData={this.nuclidesData}
              getData={this.saveTableData}
              fieldsArr={this.tableFields}
            />
          </Grid>
          <Grid>
            <DataTable
              data={tableData}
              columns={[
                {
                  field: "id",
                  headerName: "ID",
                  width: 80,
                  editable: true
                },
                {
                  field: "samples",
                  headerName: "Sample ID's",
                  width: 180,
                  align: 'left',
                  headerAlign: 'left',
                  editable: true,
                },
                {
                  field: 'timein',
                  headerName: 'Time IN',
                  type: 'datetime',
                  width: 180,
                  editable: true,
                },
                {
                  field: 'timeout',
                  headerName: 'Time OUT',
                  type: 'datetime',
                  width: 180,
                  editable: true,
                },
                {
                  field: 'site',
                  headerName: 'Site',
                  width: 120,
                  editable: true,
                  type: 'singleSelect',
                  valueOptions: ['Market', 'Finance', 'Development'],
                },
                {
                  field: 'type',
                  headerName: 'Sample Type',
                  width: 150,
                  editable: true,
                  type: 'singleSelect',
                  valueOptions: ['Market', 'Finance', 'Development'],
                }
              ]}
            >
            </DataTable>
            <PagedEditableTable
              addButtonLabel={"Add Record"}
              data={tableData}
              cols={[
                {
                  accessorKey: 'id',
                  header: 'Id',
                  enableEditing: true,
                  size: 80,
                },
                {
                  accessorKey: 'samples',
                  header: 'First Name',
                  enableEditing: true,
                  muiEditTextFieldProps: {
                    required: true,
                    // error: !!validationErrors?.firstName,
                    // helperText: validationErrors?.firstName,
                    // //remove any previous validation errors when user focuses on the input
                    // onFocus: () =>
                    //   setValidationErrors({
                    //     ...validationErrors,
                    //     firstName: undefined,
                    //   }),
                    // //optionally add validation checking for onBlur or onChange
                  },
                },
                {
                  accessorKey: 'lastName',
                  header: 'Last Name',
                  muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                    // error: !!validationErrors?.lastName,
                    // helperText: validationErrors?.lastName,
                    // //remove any previous validation errors when user focuses on the input
                    // onFocus: () =>
                    //   setValidationErrors({
                    //     ...validationErrors,
                    //     lastName: undefined,
                    //   }),
                  },
                },
                {
                  accessorKey: 'email',
                  header: 'Email',
                  muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                    // error: !!validationErrors?.email,
                    // helperText: validationErrors?.email,
                    // //remove any previous validation errors when user focuses on the input
                    // onFocus: () =>
                    //   setValidationErrors({
                    //     ...validationErrors,
                    //     email: undefined,
                    //   }),
                  },
                },
                {
                  accessorKey: 'site',
                  header: 'Site',
                  size: 80,
                  editVariant: 'select',
                  editSelectOptions: ["Site 1","Site 3","Site 4","Site 5"],
                  muiEditTextFieldProps: {
                    select: true,
                    // error: !!validationErrors?.state,
                    // helperText: validationErrors?.state,
                  },
                },
              ]}
              columnEditProps={[
                {
                  accessorKey: 'samples',
                  muiEditTextFieldProps: {
                    required: true,
                    error: "samples",
                    helperText: "samples",
                    //remove any previous validation errors when user focuses on the input
                    onFocus: {
                      samples: undefined,
                    },
                    //optionally add validation checking for onBlur or onChange
                  },
                },
                {
                  accessorKey: 'lastName',
                  muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                    error: "lastName",
                    helperText: "lastName",
                    //remove any previous validation errors when user focuses on the input
                    onFocus: {
                      lastName: undefined,
                    },
                  },
                },
                {
                  accessorKey: 'email',
                  muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                    error: "email",
                    helperText: "email",
                    //remove any previous validation errors when user focuses on the input
                    onFocus: {
                      email: undefined,
                    },
                  },
                },
                {
                  accessorKey: 'site',
                  muiEditTextFieldProps: {
                    select: true,
                    error: "state",
                    helperText: "state",
                  },
                },
              ]}
            />
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