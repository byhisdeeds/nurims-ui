import React, {Component} from 'react';
import {
  withTheme
} from "@mui/styles";
import {
  getRecordMetadataValue,
} from "../../utils/MetadataUtils";
import {
  NURIMS_OPERATION_DATA_STATS,
  NURIMS_TITLE
} from "../../utils/constants";
import PropTypes from "prop-types";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";
import {
  Grid,
  Box,
  CardHeader,
  CardContent,
  Card
} from "@mui/material";
import {JsonView, darkStyles, collapseAllNested} from "react-json-view-lite";
import "../../css/json-viewer-lite.css";
import {
  runidAsTitle
} from "../../utils/OperationUtils";


class OperatingRunMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      record: {},
      disabled: true,
    };
    this.Module = "OperatingRunMetadata";
  }

  componentDidMount() {
  }

  handleChange = (e) => {
    console.log(">>>", e.target.id)
    const user = this.state.user;
    if (e.target.id === "username") {
      user["changed"] = true;
      user[NURIMS_TITLE] = e.target.value;
      user.metadata["username"] = e.target.value;
      this.setState({user: user})
    } else if (e.target.id === "password") {
      user["changed"] = true;
      this.setState({user: user, password: e.target.value})
    } else if (e.target.id === "password2") {
      user["changed"] = true;
      this.setState({user: user, password_check: e.target.value})
    }
    // signal to parent that details have changed
    this.props.onChange(true);
  }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    this.setState({
      record: record,
      disabled: false,
      password: "", // record.metadata.password,
      password_check: "", // record.metadata.password
    })
    this.props.onChange(false);
  }

  render() {
    const {record, disabled} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "record",
        getRecordMetadataValue(record, NURIMS_OPERATION_DATA_STATS, ""));
    }
    let stats = getRecordMetadataValue(record, NURIMS_OPERATION_DATA_STATS, {});
    return (
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': {m: 1, width: '100%'},
        }}
        noValidate
        autoComplete="off"
      >
        <Card variant="outlined" style={{marginBottom: 8}} sx={{m: 0, pl: 0, pb: 0, width: '100%'}}>
          <CardHeader
            title={`Operating Run: ${runidAsTitle(record[NURIMS_TITLE] || "")}`}
            titleTypographyProps={{fontSize: "1.5em"}}
            sx={{pt: 1, pl: 3, pb: 0}}
          />
          <CardContent sx={{height: 600, overflowY: "auto"}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <JsonView
                  data={stats}
                  shouldExpandNode={collapseAllNested}
                  style={darkStyles}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

OperatingRunMetadata.propTypes = {
  ref: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
}

OperatingRunMetadata.defaultProps = {
};

export default withTheme(OperatingRunMetadata);