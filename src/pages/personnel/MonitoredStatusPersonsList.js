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
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';
import {Component} from "react";
import {Person, PersonOff} from "@mui/icons-material";
import "../../utils/MetadataUtils"
import {getMetadataValue, setMetadataValue} from "../../utils/MetadataUtils";
import {
  NURIMS_ENTITY_IS_EXTREMITY_MONITORED,
  NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED,
  NURIMS_ENTITY_IS_WRIST_MONITORED, NURIMS_TITLE, NURIMS_WITHDRAWN
} from "../../utils/constants";

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
    id: 'id',
    align: 'center',
    disablePadding: true,
    label: 'ID',
  },
  {
    id: NURIMS_TITLE,
    align: 'left',
    disablePadding: true,
    label: 'Name',
  },
  {
    id: NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED,
    align: 'center',
    disablePadding: true,
    label: 'Whole Body Monitored',
  },
  {
    id: NURIMS_ENTITY_IS_EXTREMITY_MONITORED,
    align: 'center',
    disablePadding: true,
    label: 'Extremity Monitored',
  },
  {
    id: NURIMS_ENTITY_IS_WRIST_MONITORED,
    align: 'center',
    disablePadding: true,
    label: 'Wrist Monitored',
  },
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
  const {numSelected} = props;

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{flex: '1 1 100%'}}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{flex: '1 1 100%'}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Personnel
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon/>
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default class MonitoredStatusPersonsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: NURIMS_TITLE,
      selected: {},
      previous_selection: {},
      page: 0,
      dense: false,
      rowsPerPage: 10,
      // details_have_changed: false,
    };
    this.rows = [];
  }

  handleRequestSort = (event, property) => {
    const isAsc = this.state.orderBy === property && this.state.order === 'asc';
    this.setState({order: isAsc ? 'desc' : 'asc'});
    this.setState({orderBy: property});
  };

  // setSelection = (row) => {
  //   this.setState({selected: row});
  //   // this.props.onClick(this.state.selected, row);
  // };

  handleClick = (row) => {
    // // only do something if selection has changed
    // if (this.state.selected !== row) {
    //   this.setState({previous_selection: this.state.selected, selected: row});
    //   this.props.onClick(this.state.selected, row);
    // }
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

  isSelected = (selected, row) => {
    // return this.state.selected.indexOf(name) !== -1;
    // return selected.hasOwnProperty("item_id") && row.hasOwnProperty("item_id") && selected.item_id === row.item_id;
    return selected === row;
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  emptyRows = () => {
    return this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - this.rows.length) : 0;
  }

  // update_selected_person = (person) => {
  //   this.setState({ selected: {...person}} );
  //   for (const r of this.rows) {
  //     if (r.item_id === person.item_id) {
  //       for (const [k, v] of Object.entries(person)) {
  //         r[k] = v;
  //       }
  //       this.forceUpdate()
  //     }
  //   }
  // }

  get_persons = () => {
    return this.rows;
  }

  update_personnel = (msg) => {
    if (Array.isArray(msg)) {
      for (const person of msg) {
        console.log("MonitoredStatusPersonsList.update_personnel", person)
        // this.rows.push(createData(name, '305', 3.7, 67, ""+withdrawn));
        // this.rows.push(createData(name, '305', 3.7, 67, ""+withdrawn));
        // this.rows.push(createData(name, '305', 3.7, 67, ""+withdrawn));
        // const title = person.hasOwnProperty("nurims.title") ? person["nurims.title"] : "";
        // const withdrawn = person.hasOwnProperty("nurims.withdrawn") ? person["nurims.withdrawn"] : "0";
        // const item_id = person.hasOwnProperty("item_id") ? person["item_id"] : "";
        // this.rows.push({
        //   "nurims.title": title,
        //   id: "305",
        //   item_id: item_id,
        //   "nurims.withdrawn": withdrawn
        // });
        this.rows.push(person);
      }
    }
    this.setState({page: this.state.page})
  }

  handleCheckboxChange = (e) => {
    console.log("handleCheckboxChange - id,value", e.target.id, e.target.checked, typeof e.target.checked);
    // parse row index and metadata id
    const parts = e.target.id.split('-');
    if (parts.length === 2) {
      console.log("handleCheckboxChange - value", typeof e.target.checked);
      for (const r of this.rows) {
        if (r.item_id === parseInt(parts[1])) {
          r["changed"] = true;
          if (parts[0] === 'wholebody') {
            setMetadataValue(r, NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED, `${e.target.checked}`);
          } else if (parts[0] === 'extremity') {
            setMetadataValue(r, NURIMS_ENTITY_IS_EXTREMITY_MONITORED, `${e.target.checked}`);
          } else if (parts[0] === 'wrist') {
            setMetadataValue(r, NURIMS_ENTITY_IS_WRIST_MONITORED, `${e.target.checked}`);
          }
          console.log("AFTER UPDATE", r)
          this.props.onChange(true);
        }
      }
    }
  }

  render() {
    const {order, orderBy, selected, page, dense, rowsPerPage} = this.state;
    return (
      <Box sx={{width: '100%'}}>
        <Paper sx={{width: '100%', mb: 2}}>
          <EnhancedTableToolbar numSelected={0}/>
          <TableContainer>
            <Table
              sx={{minWidth: 350}}
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
                    const disabled = row[NURIMS_WITHDRAWN] === 1;
                    const wholeBodyMonitoredStatus = getMetadataValue(row, NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED, "false");
                    const extremityMonitoredStatus = getMetadataValue(row, NURIMS_ENTITY_IS_EXTREMITY_MONITORED, "false");
                    const wristMonitoredStatus = getMetadataValue(row, NURIMS_ENTITY_IS_WRIST_MONITORED, "false")

                    return (
                      <TableRow
                        hover
                        onClick={()=>this.handleClick(row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        data-row={row}
                        key={row.item_id}
                        selected={isItemSelected}
                      >
                        <TableCell align="center" padding="none">{row["item_id"]}</TableCell>
                        <TableCell align="left" padding="none">{row[NURIMS_TITLE]}</TableCell>
                        <TableCell align="center">{
                          <Checkbox
                            id={`wholebody-${row.item_id}`}
                            color="primary"
                            // indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={wholeBodyMonitoredStatus === "true"}
                            onChange={this.handleCheckboxChange}
                            inputProps={{
                              'aria-label': 'select is whole body monitored',
                            }}
                          />
                        }</TableCell>
                        <TableCell align="center">{
                          <Checkbox
                            id={`extremity-${row.item_id}`}
                            color="primary"
                            // indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={extremityMonitoredStatus === "true"}
                            onChange={this.handleCheckboxChange}
                            inputProps={{
                              'aria-label': 'select is extremity monitored',
                            }}
                          />
                        }</TableCell>
                        <TableCell align="center">{
                          <Checkbox
                            id={`wrist-${row.item_id}`}
                            color="primary"
                            // indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={wristMonitoredStatus === "true"}
                            onChange={this.handleCheckboxChange}
                            inputProps={{
                              'aria-label': 'select is wrist monitored',
                            }}
                          />
                        }</TableCell>
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={this.rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={this.handleChangePage}
            onRowsPerPageChange={this.handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={this.handleChangeDense}/>}
          label="Dense padding"
        />
      </Box>
    );
  }

}
