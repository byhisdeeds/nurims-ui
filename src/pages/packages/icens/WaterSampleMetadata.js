import React, {Component} from 'react';
import {withTheme} from "@mui/styles";
import {
  setMetadataValue,
  getUserRecordMetadataValue, getMetadataValue,
} from "../../../utils/MetadataUtils";
import {
  NURIMS_AVAILABLE,
  NURIMS_DESCRIPTION,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDES,
  NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_NUCLIDEUNITS,
  NURIMS_TITLE
} from "../../../utils/constants";
import PropTypes from "prop-types";
import {
  DateSelect,
  SelectFormControlWithTooltip
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
        return this.nuclideTableFields[2].options.push({ label: t[1], value: t[0] });
      }
    })
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    if (this.context.debug > 5) {
      ConsoleLog(this.Module, "handleChange", "id", e.target.id, "value", e.target.value);
    }
    const record = this.state.record;
    if (e.target.id === "name") {
      record["changed"] = true;
      record[NURIMS_TITLE] = e.target.value;
      // user.metadata["username"] = e.target.value;
      this.setState({record: record})
    } else if (e.target.id === "description") {
      record["changed"] = true;
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
    this.setState({
      record: record,
      disabled: false,
    })
    if (this.ref.current) {
      console.log("######", getMetadataValue(record, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS, []));
      this.ref.current.setRowData(getMetadataValue(record, NURIMS_OPERATION_DATA_REACTORWATERCHEMISTRY_ANALYSIS, []));
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
    setMetadataValue(record, NURIMS_AVAILABLE, e.toISOString().substring(0,10), "");
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
      ConsoleLog(this.Module, "render", "record", disabled, "record", record);
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
          <Grid item xs={4}>
            <TextField
              required
              fullWidth
              id="name"
              label="Name"
              value={record[NURIMS_TITLE]}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              id={"description"}
              label="Description"
              fullWidth
              value={getMetadataValue(record, NURIMS_DESCRIPTION, "")}
              onChange={this.handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <DateSelect
              disabled={disabled}
              label="Analysis Date"
              value={getMetadataValue(record, NURIMS_AVAILABLE, "")}
              onChange={this.handleDateAvailableChange}
            />
          </Grid>
          <Grid item xs={12}>
            <EditableTable
              disable={disabled}
              ref={this.ref}
              addRowBtnText={"Add Nuclide"}
              initWithoutHead={false}
              defaultData={this.nuclidesData}
              getData={this.saveTableData}
              fieldsArr={this.nuclideTableFields}
            />
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