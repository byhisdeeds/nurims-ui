import * as React from "react";
import {withTheme} from "@mui/styles";
import PropTypes from "prop-types";
import {
  ITEM_ID, METADATA,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../utils/constants";
import {
  Box,
  Paper,
  Switch,
  TableCell
} from "@mui/material";
import {PageableTable} from "./CommonComponents";

class PagedRecordList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      include_archived: props.include_archived,
    };
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
    if (Array.isArray(records)) {
      this.rows.length = 0;
      for (const record of records) {
        console.log("PagedRecordList.setRecords", records)
        record.changed = false;
        this.rows.push(record);
      }
    }
    this.forceUpdate();
  }

  getRecords = () => {
    return this.rows;
  }

  updateRecord = (record) => {
    console.log("PagedRecordList.updateRecord", record)
    if (record) {
      for (const row of this.rows) {
        if (row.item_id === -1 && row.record_key === record.record_key) {
          row.item_id = record[ITEM_ID]
          row[NURIMS_TITLE] = record[NURIMS_TITLE];
          row[NURIMS_WITHDRAWN] = record[NURIMS_WITHDRAWN];
          row["changed"] = false;
          row[METADATA] = [...record[METADATA]]
        } else if (row.item_id !== -1 && row.item_id === record[ITEM_ID]) {
          row[NURIMS_TITLE] = record[NURIMS_TITLE];
          row[NURIMS_WITHDRAWN] = record[NURIMS_WITHDRAWN];
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
        {row[cell.id]} {(cell.id === NURIMS_TITLE && row[NURIMS_WITHDRAWN] === 1) && "<- archived"}
      </TableCell>
    )
  }

  includeArchivedRecords = (e) => {
    this.props.requestListUpdate(e.target.checked)
  }

  render () {
    const {include_archived} = this.state;
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

PagedRecordList.propTypes = {
  title: PropTypes.string.isRequired,
  rowHeight: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  onListItemSelection: PropTypes.func.isRequired,
  requestListUpdate: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
  includeArchived: PropTypes.bool,
}

PagedRecordList.defaultProps = {
  includeArchived: false,
  enableRecordArchiveSwitch: false,
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
  requestListUpdate: (include_archived) => {
  },
};

export default withTheme(PagedRecordList)