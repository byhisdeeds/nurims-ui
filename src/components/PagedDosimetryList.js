import * as React from "react";
import {withTheme} from "@mui/styles";
import PropTypes from "prop-types";
import {
  ITEM_ID, METADATA,
  NURIMS_TITLE, NURIMS_TITLE_SUBTITLE,
  NURIMS_WITHDRAWN
} from "../utils/constants";
import {
  Box,
  Paper,
  Switch,
  TableCell
} from "@mui/material";
import {PageableTable} from "./CommonComponents";
import {ConsoleLog, UserDebugContext} from "../utils/UserDebugContext";
import {getRecordMetadataValue} from "../utils/MetadataUtils";

class PagedDosimetryList extends React.Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      include_archived: props.includeArchived,
    };
    this.__Component__ = "PagedRecordList";
    this.rows = [];
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
            if (row[NURIMS_TITLE] === record[NURIMS_TITLE]) {
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
    if (this.context.debug > 5) {
      ConsoleLog(this.__Component__, "setRecords", "records", records);
    }
    if (Array.isArray(records)) {
      let selection = {};
      this.rows = [...records];
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
    if (this.context.debug > 5) {
      ConsoleLog(this.__Component__, "updateRecord", "record", record);
    }
    if (record) {
      for (const row of this.rows) {
        if (row.item_id === -1 && row.record_key === record.record_key) {
          row.item_id = record[ITEM_ID]
          row[NURIMS_TITLE] = record[NURIMS_TITLE];
          row[NURIMS_WITHDRAWN] = record[NURIMS_WITHDRAWN];
          row["changed"] = false;
          if (row.hasOwnProperty(NURIMS_TITLE_SUBTITLE)) {
            row[NURIMS_TITLE_SUBTITLE] = record[NURIMS_TITLE_SUBTITLE];
          }
          row[METADATA] = [...record[METADATA]]
        } else if (row.item_id !== -1 && row.item_id === record[ITEM_ID]) {
          row[NURIMS_TITLE] = record[NURIMS_TITLE];
          row[NURIMS_WITHDRAWN] = record[NURIMS_WITHDRAWN];
          if (row.hasOwnProperty(NURIMS_TITLE_SUBTITLE)) {
            row[NURIMS_TITLE_SUBTITLE] = record[NURIMS_TITLE_SUBTITLE];
          }
          row["changed"] = false;
          row[METADATA] = [...record[METADATA]]
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
    let value = "";
    if (row.hasOwnProperty(cell.id)) {
      value = row[cell.id];
    } else {
      value = getRecordMetadataValue(row, cell.id, "__@@@__");
      if (value === "__@@@__") {
        value = "";
      }
    }
    return (
      <TableCell
        align={cell.align}
        padding={cell.disablePadding ? 'none' : 'normal'}
        style={{
          color: row[NURIMS_WITHDRAWN] === 0 ?
            this.props.theme.palette.primary.light :
            this.props.theme.palette.text.disabled
        }}
      >
        {value} {(cell.id === NURIMS_TITLE && row[NURIMS_WITHDRAWN] === 1) && "<- archived"}
      </TableCell>
    )
  }

  includeArchivedRecords = (e) => {
    this.props.requestGetRecords(e.target.checked)
    this.setState({include_archived: e.target.checked});
  }

  render () {
    const {include_archived, selection} = this.state;
    if (this.context.debug > 5) {
      ConsoleLog("PagedRecordList", "render", "include_archived", include_archived, "selection", selection);
    }
    return (
      <Box sx={{width: '100%', height: this.props.height}}>
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
            renderCell={this.renderCell}
            filterElement={this.props.enableRecordArchiveSwitch && <Switch
              inputProps={{'aria-labelledby': 'include-archived-records-switch'}}
              onChange={this.includeArchivedRecords}
              checked={include_archived}
            />}
          />
        </Paper>
      </Box>
    );
  }

}

PagedDosimetryList.propTypes = {
  title: PropTypes.string.isRequired,
  rowHeight: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  onListItemSelection: PropTypes.func,
  requestGetRecords: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
  includeArchived: PropTypes.bool,
  cells: PropTypes.array,
}

PagedDosimetryList.defaultProps = {
  includeArchived: false,
  enableRecordArchiveSwitch: false,
  rowHeight: 24,
  rowsPerPage: 20,
  minWidth: 350,
  height: 400,
  cells: [
    {
      id: "NURIMS_TITLE",
      align: 'left',
      disablePadding: true,
      label: 'Name',
      width: '90%',
      sortField: true,
    },
  ],
  onListItemSelection: (item) => {
  },
  requestGetRecords: (include_archived) => {
  },
};

export default withTheme(PagedDosimetryList)