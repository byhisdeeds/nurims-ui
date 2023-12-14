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
        type: "select",
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
        type: "select",
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