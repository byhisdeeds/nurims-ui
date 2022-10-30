import React, {Component} from 'react';
import {withTheme} from "@mui/styles";
import {
  setMetadataValue,
  getRecordMetadataValue,
  appendMetadataChangedField,
  getMetadataValueAsISODateString,
} from "../../../utils/MetadataUtils";
import {
  NURIMS_DESCRIPTION,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDES,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDEUNITS,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_REPORTFILE,
  NURIMS_SAMPLEDATE,
  NURIMS_TITLE
} from "../../../utils/constants";
import PropTypes from "prop-types";
import {
  DateSelect,
} from "../../../components/CommonComponents";
import {
  ConsoleLog,
  UserDebugContext
} from "../../../utils/UserDebugContext";
import {
  getPropertyValue
} from "../../../utils/PropertyUtils";
import {
  Grid,
  Box,
  TextField
} from "@mui/material";
import EditableTable from "../../../components/EditableTable";
import TextFileViewer from "../../../components/TextFileViewer";


class WaterSampleMetadata extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      record: {},
      disabled: true,
      password: "",
      password_check: "",
      properties: props.properties,
    };
    this.Module = "WaterSampleMetadata";
    this.ref = React.createRef();
    this.nuclidesData = [];
    this.nuclideTableFields = [
      {
        label: "Nuclide",
        name: "element",
        width: '20ch',
        align: 'center',
        type: "select",
        options: [],
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Activity",
        name: "activity",
        width: '8ch',
        align: 'center',
        validation: e => {
          return true;
        },
        error: "Haha"
      },
      {
        label: "Uncert.",
        name: "uncert",
        width: '18ch',
        align: 'center',
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Units",
        name: "units",
        type: "select",
        width: '8ch',
        align: 'center',
        options: [],
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      },
      {
        label: "Status",
        name: "status",
        width: '18ch',
        align: 'center',
        validation: (e, a) => {
          return true;
        },
        error: "go home kid"
      }
    ];
    getPropertyValue(props.properties, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDES,
      "").split('|').map((n) => {
      const t = n.split(',');
      if (t.length === 2) {
        return this.nuclideTableFields[0].options.push({ label: t[1], value: t[0] });
      }
    })
    getPropertyValue(props.properties, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDEUNITS,
      "").split('|').map((n) => {
      const t = n.split(',');
      if (t.length === 2) {
        return this.nuclideTableFields[3].options.push({ label: t[1], value: t[0] });
      }
    })
    this.doc = { uri: "data:text/plain,test.txt\nwtewrw\nwqrwrwqr\n" };
  }

  handleChange = (e) => {
    if (this.context.debug > 5) {
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
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    if (record) {
      record["changed"] = false;
      record["changed.metadata"] = [];
      this.doc = {uri: getRecordMetadataValue(record, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_REPORTFILE, "").url};
    }
    this.setState({
      record: (record) ? record : [],
      disabled: (!record),
    })
    if (this.ref.current && (record)) {
      console.log("######", getRecordMetadataValue(record, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS, []));
      this.ref.current.setRowData(getRecordMetadataValue(record, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS, []));
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
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "handleDateAvailableChange", "date", e.toISOString().substring(0,10));
    }
    const record = this.state.record;
    record["changed"] = true;
    appendMetadataChangedField(record["changed.metadata"], NURIMS_SAMPLEDATE);
    setMetadataValue(record, NURIMS_SAMPLEDATE, e.toISOString().substring(0,10), "");
    this.setState({record: record})
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  saveTableData = data => {
    if (this.context.debug > 5) {
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
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "render", "disabled", disabled, "record", record);
    }
    console.log("$$$$$", getMetadataValueAsISODateString(record, NURIMS_SAMPLEDATE, ""))
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
          <Grid item xs={4}>
            <TextField
              disabled={disabled}
              required
              fullWidth
              id="name"
              label="Name"
              value={record[NURIMS_TITLE]}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              disabled={disabled}
              id={"description"}
              label="Description"
              fullWidth
              value={getRecordMetadataValue(record, NURIMS_DESCRIPTION, "")}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={2}>
            <DateSelect
              disabled={disabled}
              label="Analysis Date"
              value={getMetadataValueAsISODateString(record, NURIMS_SAMPLEDATE, "")}
              onChange={this.handleDateAvailableChange}
            />
          </Grid>
          <Grid item xs={12}>
            <EditableTable
              tableName={"editable"}
              disable={disabled}
              ref={this.ref}
              addRowBtnText={"Add Nuclide"}
              initWithoutHead={false}
              defaultData={this.nuclidesData}
              getData={this.saveTableData}
              fieldsArr={this.nuclideTableFields}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFileViewer
              style={{
                fontSize: 16,
                backgroundColor: "#565656",
                height: 400,
              }}
              file={this.doc}
            />
          </Grid>
          <Grid item xs={12}>
            <p>sdfsfsfsf</p>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

WaterSampleMetadata.propTypes = {
  ref: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
}

WaterSampleMetadata.defaultProps = {
  onChange: (msg) => {
  },
};

export default withTheme(WaterSampleMetadata);