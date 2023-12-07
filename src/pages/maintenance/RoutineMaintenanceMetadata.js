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
import ReactJson from 'react-json-view'
import {
  runidAsTitle
} from "../../utils/OperationUtils";


class RoutineMaintenanceMetadata extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      record: {},
      disabled: true,
    };
    this.Module = "RoutineMaintenanceMetadata";
  }

  setRecordMetadata = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "setRecordMetadata", "record", record);
    }
    this.setState({
      record: record,
    })
    this.props.onChange(false);
  }

  editRunData = (edit) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "editRunData", "edit", edit);
    }
    const record = this.state.record;
    record["changed"] = true;
    this.setState({
      record: record,
    })
    this.props.onChange(true);
    return true;
  }

  render() {
    const {record} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", `record.metadata.${NURIMS_OPERATION_DATA_STATS}`,
        getRecordMetadataValue(record, NURIMS_OPERATION_DATA_STATS, ""));
    }
    const stats = getRecordMetadataValue(record, NURIMS_OPERATION_DATA_STATS, {});
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
            title={`Routine Maintenance Record:  ${record[NURIMS_TITLE]}`}
            titleTypographyProps={{fontSize: "1.5em", whiteSpace: "pre"}}
            sx={{pt: 1, pl: 3, pb: 0}}
          />
          <CardContent sx={{height: 600, overflowY: "auto"}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <ReactJson
                  name={false}
                  iconStyle={"triangle"}
                  collapseStringsAfterLength={128}
                  groupArraysAfterLength={100}
                  displayObjectSize={true}
                  onAdd={false}
                  onDelete={false}
                  onEdit={this.editRunData}
                  theme={"bright"}
                  collapsed={1}
                  src={stats}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }
}

RoutineMaintenanceMetadata.propTypes = {
  ref: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
}

RoutineMaintenanceMetadata.defaultProps = {
};

export default withTheme(RoutineMaintenanceMetadata);