import * as React from 'react';
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
// import Checkbox from '@mui/material/Checkbox';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
// import DeleteIcon from '@mui/icons-material/Delete';
// import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';
// import {Component} from "react";
// import {getMetadataValue} from "../../utils/MetadataUtils";
// import {isIcensDoseReport, importIcensDoseReport} from "../../utils/DoseReportUtils";
// import {
//   getPropertyValue,
// } from "../../utils/PropertyUtils";
//
// import {toast} from "react-toastify";
// import {Person, PersonOff} from "@mui/icons-material";





function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'nurims.title',
    align: 'left',
    disablePadding: true,
    label: 'Name',
  }
];

function EnhancedTableHead(props) {
  const {order, orderBy, numSelected, rowCount, onRequestSort} = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const {numSelected, onRefresh} = props;

  return (
    <Toolbar
      sx={{
        pl: {sm: 0},
        pr: {xs: 1, sm: 1},
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Typography
        sx={{flex: '1 1 100%'}}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Storage
      </Typography>

      {/*{numSelected > 0 ? (*/}
      {/*  <Tooltip title="Delete">*/}
      {/*    <IconButton>*/}
      {/*      <DeleteIcon/>*/}
      {/*    </IconButton>*/}
      {/*  </Tooltip>*/}
      {/*) : (*/}
      {/*  <Tooltip title="Filter list">*/}
      {/*    <IconButton>*/}
      {/*      <FilterListIcon/>*/}
      {/*    </IconButton>*/}
      {/*  </Tooltip>*/}
      {/*)}*/}
      <Tooltip title="Refresh List">
        <IconButton onClick={onRefresh}>
          <RefreshIcon/>
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default class StorageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'nurims.title',
      selected: {},
      previous_selection: {},
      page: 0,
      dense: false,
      rowsPerPage: 10,
    };
    this.rows = [];
  }

  handleRequestSort = (event, property) => {
    const isAsc = this.state.orderBy === property && this.state.order === 'asc';
    this.setState({order: isAsc ? 'desc' : 'asc'});
    this.setState({orderBy: property});
  };

  setSelection = (row) => {
    this.setState({selected: row});
    // this.props.onClick(this.state.selected, row);
  };

  handleClick = (row) => {
    // only do something if selection has changed
    if (this.state.selected !== row) {
      this.setState({previous_selection: this.state.selected, selected: row});
      this.props.onClick(this.state.selected, row);
    }
  };

  handleChangePage = (event, newPage) => {
    this.setState({page: newPage});
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage: parseInt(event.target.value, 10)});
    this.setState({page: 0});
  };

  handleChangeDense = (event) => {
    this.setState({dense: event.target.checked});
  };

  handleRowSelection = (row) => {
    // only do something if selection has changed
    if (this.state.selected !== row) {
      this.setState({previous_selection: this.state.selected, selected: row});
      this.props.onRowSelection(this.state.selected, row);
    }
  };

  isSelected = (selected, row) => {
    // return this.state.selected.indexOf(name) !== -1;
    // return selected.hasOwnProperty("item_id") && row.hasOwnProperty("item_id") && selected.item_id === row.item_id;
    return selected === row;
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  emptyRows = () => {
    return this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - this.rows.length) : 0;
  }

  update_selected_person = (person) => {
    this.setState({ selected: {...person}} );
    // for (const r of this.rows) {
    //   if (r.item_id === person.item_id) {
    //     for (const [k, v] of Object.entries(person)) {
    //       r[k] = v;
    //     }
    //     this.forceUpdate()
    //   }
    // }
  }

  removePerson = (person) => {
    for(let i = 0; i < this.rows.length; i++){
      if (this.rows[i] === person) {
        this.rows.splice(i, 1);
        this.setState({ selected: {}} );
        return;
      }
    }
  }

  add = (stores, skipIfStorageInList) => {
    let refresh = false;
    if (Array.isArray(stores)) {
      for (const storage of stores) {
        let add_to_list = true;
        console.log("StorageList.add", storage)
        if (skipIfStorageInList && skipIfStorageInList === true) {
          for (const row of this.rows) {
            if (row["nurims.title"] === storage["nurims.title"]) {
              add_to_list = false;
              break;
            }
          }
        }
        if (add_to_list) {
          this.rows.push(storage);
          refresh = true;
        }
      }
    }
    if (refresh) {
      this.setState({page: this.state.page})
    }
  }

  getStores = () => {
    return this.rows;
  }
  // update_personnel = (msg) => {
  //   if (Array.isArray(msg)) {
  //     for (const person of msg) {
  //       console.log("DosimetrySurveillanceList.update_personnel", person)
  //       // Fill in missing metadata fields
  //       // for (const mf of METADATA_FIELDS) {
  //       //   if (!person.hasOwnProperty(mf)) {
  //       //     person[mf] = "";
  //       //   }
  //       // }
  //       // this.rows.push(createData(name, '305', 3.7, 67, ""+withdrawn));
  //       // this.rows.push(createData(name, '305', 3.7, 67, ""+withdrawn));
  //       // this.rows.push(createData(name, '305', 3.7, 67, ""+withdrawn));
  //       // const title = person.hasOwnProperty("nurims.title") ? person["nurims.title"] : "";
  //       // const withdrawn = person.hasOwnProperty("nurims.withdrawn") ? person["nurims.withdrawn"] : "0";
  //       // const item_id = person.hasOwnProperty("item_id") ? person["item_id"] : "";
  //       // this.rows.push({
  //       //   "nurims.title": title,
  //       //   id: "305",
  //       //   item_id: item_id,
  //       //   "nurims.withdrawn": withdrawn
  //       // });
  //       person.has_changed = false;
  //       this.rows.push(person);
  //     }
  //   }
  //   this.setState({page: this.state.page})
  // }

  setStorageLocations = (locations) => {
    if (Array.isArray(locations)) {
      this.rows.length = 0;
      for (const manufacturer of locations) {
        console.log("StorageList.setStorageLocations", manufacturer)
        manufacturer.changed = false;
        this.rows.push(manufacturer);
      }
    }
    this.setState({page: this.state.page})
  }

  refreshList = () => {
    this.props.onRefresh();
  }

  // importDoseReport = (data) => {
  //   if (isIcensDoseReport(data)) {
  //     // parse ICENS dose report
  //     importIcensDoseReport(data, this.rows, getPropertyValue(this.props.properties, "nurims.property.doseunits"), "usv");
  //     this.props.onChange(true);
  //   } else {
  //     toast.warn('Unknown file format')
  //   }
  // }

  render() {
    const {order, orderBy, selected, page, dense, rowsPerPage} = this.state;
    return (
      <Box sx={{width: '100%'}}>
        <Paper sx={{width: '100%', mb: 2}}>
          <EnhancedTableToolbar numSelected={0} onRefresh={this.refreshList}/>
          <TableContainer>
            <Table
              sx={{minWidth: 150}}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={0}
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={this.rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(this.rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = this.isSelected(selected, row);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const disabled = row["nurims.withdrawn"] === 1;

                    return (
                      <TableRow
                        hover
                        onClick={()=>this.handleRowSelection(row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        data-row={row}
                        key={row.item_id}
                        selected={isItemSelected}
                      >
                        {/*<TableCell align="left" padding="none">{row["item_id"]}</TableCell>*/}
                        <TableCell align="left" >{row["nurims.title"]}</TableCell>
                      </TableRow>
                    );
                  })}
                {this.emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * this.emptyRows,
                    }}
                  >
                    <TableCell colSpan={6}/>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/*<TablePagination*/}
          {/*  rowsPerPageOptions={[5, 10, 25]}*/}
          {/*  component="div"*/}
          {/*  count={this.rows.length}*/}
          {/*  rowsPerPage={rowsPerPage}*/}
          {/*  page={page}*/}
          {/*  onPageChange={this.handleChangePage}*/}
          {/*  onRowsPerPageChange={this.handleChangeRowsPerPage}*/}
          {/*/>*/}
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={this.handleChangeDense}/>}
          label="Dense padding"
        />
      </Box>
    );
  }

}
