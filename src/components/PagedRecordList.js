import * as React from "react";
import {withTheme} from "@mui/styles";
import PropTypes from "prop-types";
import {
  ITEM_ID,
  METADATA,
  NURIMS_TITLE,
  NURIMS_TITLE_SUBTITLE,
  NURIMS_WITHDRAWN,
  RECORD_KEY
} from "../utils/constants";
import {
  Box,
  Paper,
  Switch,
  TableCell
} from "@mui/material";
import {PageableTable} from "./CommonComponents";
import {ConsoleLog, UserContext} from "../utils/UserContext";
import {getRecordMetadataValue} from "../utils/MetadataUtils";

function filterRowsByName(rows, value) {
  const regex = new RegExp(value);
  const filteredRows = [];
  for (const r of rows) {
    if (r.hasOwnProperty("nurims.title") && regex.test(r["nurims.title"])) {
      filteredRows.push(r);
    }
  }
  return filteredRows;
}

class PagedRecordList extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      include_archived: props.includeArchived,
      filterValue: "",
    };
    this.__Component__ = "PagedRecordList";
    this.rows = [];
    this.allRows = [];
  }

  removeRecord = (record) => {
    for(let i = 0; i < this.rows.length; i++){
      if (this.rows[i] === record) {
        this.rows.splice(i, 1);
        this.setState({ selected: {}} );
        return;
      }
    }
  }

  addRecords = (records, skipIfRecordInList) => {
    let refresh = false;
    if (Array.isArray(records)) {
      for (const record of records) {
        let add_to_list = true;
        if (skipIfRecordInList && skipIfRecordInList === true) {
          for (const row of this.rows) {
            // if (row[NURIMS_TITLE] === record[NURIMS_TITLE] && row[RECORD_KEY] === record[RECORD_KEY]) {
            if (row[RECORD_KEY] === record[RECORD_KEY]) {
              add_to_list = false;
              break;
            }
          }
        }
        if (add_to_list) {
          this.rows.push(record);
          refresh = true;
        }
      }
    }
    if (refresh) {
      this.forceUpdate();
    }
  }

  setRecords = (records) => {
    if (this.context.debug) {
      ConsoleLog(this.__Component__, "setRecords", "records", records);
    }
    if (Array.isArray(records)) {
      let selection = {};
      this.allRows = [...records];
      this.rows = filterRowsByName(this.allRows, this.state.filterValue);
      const s_item_id = Object.keys(this.state.selection).length === 0 ? -1 : this.state.selection.item_id;
      for (const r of this.rows) {
        r["changed"] = false;
        if (s_item_id > 0) {
          if (r.item_id === s_item_id) {
            selection = r;
          }
        }
      }
      this.setState({selection: selection});
    }
  }

  getRecords = () => {
    return this.rows;
  }

  updateRecord = (record) => {
    if (this.context.debug) {
      ConsoleLog(this.__Component__, "updateRecord", "record", record);
    }
    if (record) {
      for (const row of this.rows) {
        if (row.item_id === -1 && row.record_key === record.record_key) {
          row.item_id = record[ITEM_ID]
          row[NURIMS_TITLE] = record[NURIMS_TITLE];
          row[NURIMS_WITHDRAWN] = record[NURIMS_WITHDRAWN];
          row["changed"] = false;
          if (record.hasOwnProperty(NURIMS_TITLE_SUBTITLE)) {
            row[NURIMS_TITLE_SUBTITLE] = record[NURIMS_TITLE_SUBTITLE];
          }
          if (Array.isArray(row[METADATA])) {
            row[METADATA] = [...record[METADATA]]
          } else {
            row[METADATA] = {...record[METADATA]}
          }
        } else if (row.item_id !== -1 && row.item_id === record[ITEM_ID]) {
          row[NURIMS_TITLE] = record[NURIMS_TITLE];
          row[NURIMS_WITHDRAWN] = record[NURIMS_WITHDRAWN];
          if (record.hasOwnProperty(NURIMS_TITLE_SUBTITLE)) {
            row[NURIMS_TITLE_SUBTITLE] = record[NURIMS_TITLE_SUBTITLE];
          }
          row["changed"] = false;
          if (Array.isArray(row[METADATA])) {
            row[METADATA] = [...record[METADATA]]
          } else {
            row[METADATA] = {...record[METADATA]}
          }
        }
      }
    }
  }

  handleListItemSelection = (item) => {
    // only do something if selection has changed
    if (this.state.selection !== item) {
      this.setState({selection: item});
      this.props.onListItemSelection(item);
    }
  };

  renderCell = (row, cell) => {
    // let value = row[cell.id];
    let value = "";
    if (row.hasOwnProperty(cell.id)) {
      value = row[cell.id];
    } else {
      value = getRecordMetadataValue(row, cell.id, "__@@@__");
      if (value === "__@@@__") {
        value = "";
      }
    }
    if (cell.hasOwnProperty("format")) {
      value = cell.format(value)
    }
    return (
      <TableCell
        align={cell.align}
        padding={cell.disablePadding ? 'none' : 'normal'}
        style={this.props.renderCellStyle(row, cell, this.props.theme, this.state.selection === row)}
      >
        {value} {(cell.id === NURIMS_TITLE && row[NURIMS_WITHDRAWN] === 1) && "<- archived"}
      </TableCell>
    )
  }

  includeArchivedRecords = (e) => {
    this.props.requestGetRecords(e.target.checked)
    this.setState({include_archived: e.target.checked});
  }

  filterRows = (value) => {
    console.log("%%% PagedRecordList.filterRows %%%", value)
    this.setState({filterValue: value});
    this.rows = filterRowsByName(this.allRows, value);
  }

  render () {
    const {include_archived, selection} = this.state;
    if (this.context.debug) {
      ConsoleLog(this.__Component__, "render", "include_archived", include_archived, "selection", selection);
    }
    return (
      <Box sx={{width: '100%'}}>
        <Paper sx={{width: '100%', mb: 2}}>
          <PageableTable
            minWidth={this.props.minWidth}
            cells={this.props.cells}
            theme={this.props.theme}
            rowHeight={this.props.rowHeight}
            order={'asc'}
            orderBy={NURIMS_TITLE}
            title={this.props.title}
            disabled={false}
            rows={this.rows}
            rowsPerPage={this.props.rowsPerPage}
            selectedRow={selection}
            onRowSelection={this.handleListItemSelection}
            selectionMetadataField={"item_id"}
            renderCell={this.renderCell}
            filterElement={this.props.enableRecordArchiveSwitch && <Switch
              inputProps={{'aria-labelledby': 'include-archived-records-switch'}}
              onChange={this.includeArchivedRecords}
              checked={include_archived}
            />}
            enableRowFilter={this.props.enableRowFilter}
            filterTooltip={this.props.filterTooltip}
            filterRows={this.filterRows}
          />
        </Paper>
      </Box>
    );
  }

}

PagedRecordList.propTypes = {
  title: PropTypes.string.isRequired,
  rowHeight: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  onListItemSelection: PropTypes.func,
  requestGetRecords: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
  enableRowFilter: PropTypes.bool.isRequired,
  includeArchived: PropTypes.bool,
  cells: PropTypes.array,
  rowsPerPage: PropTypes.number,
  filterTooltip: PropTypes.string,
  renderCellStyle: PropTypes.func,
}

PagedRecordList.defaultProps = {
  includeArchived: false,
  enableRowFilter: true,
  enableRecordArchiveSwitch: false,
  filterTooltip: "Include archived records",
  rowHeight: 24,
  rowsPerPage: 20,
  minWidth: 350,
  height: 400,
  cells: [
    {
      id: ITEM_ID,
      align: 'center',
      disablePadding: true,
      label: 'ID',
      width: '10%',
      sortField: true,
    },
    {
      id: NURIMS_TITLE,
      align: 'left',
      disablePadding: true,
      label: 'Name',
      width: '90%',
      sortField: true,
    },
  ],
  onListItemSelection: (item) => {
  },
  requestGetRecords: (include_archived, include_metadata) => {
  },
  renderCellStyle: (row, cell, theme) => {
    return {
      color: row[NURIMS_WITHDRAWN] === 0 ? theme.palette.primary.light : theme.palette.text.disabled
    }
  },
};

export default withTheme(PagedRecordList)