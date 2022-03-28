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
import {NURIMS_TITLE, NURIMS_WITHDRAWN} from "../../utils/constants";


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
    id: 'nurims.title',
    align: 'left',
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'nurims.withdrawn',
    align: 'center',
    disablePadding: true,
    label: 'Disabled',
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

export default class PersonList extends Component {
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
      // details_have_changed: false,
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

  handleRowSelection = (row) => {
    // only do something if selection has changed
    if (this.state.selected !== row) {
      this.setState({selected: row});
      // this.setState({previous_selection: this.state.selected, selected: row});
      this.props.onPersonSelection(row);
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
    for (const r of this.rows) {
      if (r.item_id === person.item_id) {
        for (const [k, v] of Object.entries(person)) {
          r[k] = v;
        }
        r["changed"] = true;
        this.forceUpdate()
      }
    }
  }

  removePerson = (person) => {
    for(let i = 0; i < this.rows.length; i++){
      if (this.rows[i] === person) {
        this.rows.splice(i, 1);
        this.setState({ selected: this.state.previous_selection, previous_selection: {}} );
        return;
      }
    }
  }

  add = (persons, skipIfPersonInList) => {
    let refresh = false;
    if (Array.isArray(persons)) {
      for (const person of persons) {
        let add_to_list = true;
        console.log("PersonList.add", person)
        if (skipIfPersonInList && skipIfPersonInList === true) {
          for (const row of this.rows) {
            if (row[NURIMS_TITLE] === person[NURIMS_TITLE]) {
              add_to_list = false;
              break;
            }
          }
        }
        if (add_to_list) {
          this.rows.push(person);
          refresh = true;
        }
      }
    }
    if (refresh) {
      this.setState({page: this.state.page})
    }
  }

  update = (person) => {
    console.log("PersonList.update", person)
    for (const row of this.rows) {
      if (row["item_id"] === person["item_id"]) {
        row[NURIMS_TITLE] = person[NURIMS_TITLE];
        row[NURIMS_WITHDRAWN] = person[NURIMS_WITHDRAWN];
        row["metadata"] = [...person["metadata"]]
      }
    }
  }

  getPersons = () => {
    return this.rows;
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
                        <TableCell align="left" padding="none">{row["item_id"]}</TableCell>
                        <TableCell align="left" padding="none">{row["nurims.title"]}</TableCell>
                        <TableCell align="left">{disabled ? <PersonOff /> : <Person />}</TableCell>
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
