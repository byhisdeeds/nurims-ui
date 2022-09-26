import * as React from "react";
import {withTheme} from "@mui/styles";
import PropTypes from "prop-types";
import TableCell from "@mui/material/TableCell";
import {ITEM_ID, NURIMS_TITLE, NURIMS_WITHDRAWN} from "../utils/constants";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {PageableTable} from "./CommonComponents";
import {Switch} from "@mui/material";

PagedRecordList.propTypes = {
  title: PropTypes.string.isRequired,
  rowHeight: PropTypes.number,
  minWidth: PropTypes.number,
  properties: PropTypes.object.isRequired,
  onListItemSelection: PropTypes.func,
  requestListUpdate: PropTypes.func,
  cells: PropTypes.array
}

PagedRecordList.defaultProps = {
  rowHeight: 24,
  minWidth: 350,
  onListItemSelection: (item) => {
  },
  requestListUpdate: (include_archived) => {
  },
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
  onListItddemSelection: (row) => {
  },
};

class PagedRecordList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      include_archived: props.include_archived,
    };
    this.rows = [];
  }

  handleListItemSelection = (item) => {
    // only do something if selection has changed
    console.log("@@@@@@ HANDLE_LIST_ITEM_SELECTION", item)
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

  render() {
    const {include_archived} = this.state;
    return (
      <Box sx={{width: '100%'}}>
        <Paper sx={{width: '100%', mb: 2}}>
          <PageableTable
            minWidth={this.props.minWidth}
            cells={this.props.cells}
            theme={this.props.theme}
            rowHeight={this.props.rowHeight}
            order={'asc'}
            orderBy={this.props.cells[1].id}
            title={this.props.title}
            disabled={false}
            rows={this.rows}
            onRowSelection={this.handleListItemSelection}
            renderCell={this.renderCell}
            filterElement={<Switch
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

export default withTheme(PagedRecordList)