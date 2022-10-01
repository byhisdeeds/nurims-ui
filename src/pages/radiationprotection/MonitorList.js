// import * as React from 'react';
// import {withTheme} from "@mui/styles";
// import PropTypes from 'prop-types';
// import {alpha} from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import TableSortLabel from '@mui/material/TableSortLabel';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Checkbox from '@mui/material/Checkbox';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
// import DeleteIcon from '@mui/icons-material/Delete';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import {visuallyHidden} from '@mui/utils';
// import {Component} from "react";
// import {Person, PersonOff} from "@mui/icons-material";
// import {NURIMS_TITLE, NURIMS_WITHDRAWN} from "../../utils/constants";
// import {PageableTable} from "../../components/CommonComponents";
//
//
// const TABLE_ROW_HEIGHT = 24;
//
// // function descendingComparator(a, b, orderBy) {
// //   if (b[orderBy] < a[orderBy]) {
// //     return -1;
// //   }
// //   if (b[orderBy] > a[orderBy]) {
// //     return 1;
// //   }
// //   return 0;
// // }
// //
// // function getComparator(order, orderBy) {
// //   return order === 'desc'
// //     ? (a, b) => descendingComparator(a, b, orderBy)
// //     : (a, b) => -descendingComparator(a, b, orderBy);
// // }
//
// // This method is created for cross-browser compatibility, if you don't
// // need to support IE11, you can use Array.prototype.sort() directly
// // function stableSort(array, comparator) {
// //   const stabilizedThis = array.map((el, index) => [el, index]);
// //   stabilizedThis.sort((a, b) => {
// //     const order = comparator(a[0], b[0]);
// //     if (order !== 0) {
// //       return order;
// //     }
// //     return a[1] - b[1];
// //   });
// //   return stabilizedThis.map((el) => el[0]);
// // }
//
// // const headCells = [
// //   {
// //     id: 'item_id',
// //     align: 'center',
// //     disablePadding: true,
// //     label: 'ID',
// //     width: '10%',
// //     sortField: true,
// //   },
// //   {
// //     id: 'nurims.title',
// //     align: 'left',
// //     disablePadding: true,
// //     label: 'Name',
// //     width: '90%',
// //     sortField: true,
// //   },
// // ];
// //
// // function EnhancedTableHead(props) {
// //   const {order, orderBy, numSelected, rowCount, onRequestSort} = props;
// //
// //   const createSortHandler = (property) => (event) => {
// //     onRequestSort(event, property);
// //   };
// //
// //   return (
// //     <TableHead>
// //       <TableRow>
// //         {headCells.map((headCell) => (
// //           <TableCell
// //             style={{width: headCell.width}}
// //             key={headCell.id}
// //             align={headCell.align}
// //             padding={headCell.disablePadding ? 'none' : 'normal'}
// //             sortDirection={headCell.sortField ? order : false}
// //           >
// //             <TableSortLabel
// //               active={headCell.sortField}
// //               hideSortIcon={true}
// //               direction={orderBy === headCell.id ? order : 'asc'}
// //               onClick={createSortHandler(headCell.id)}
// //             >
// //               {headCell.label}
// //               {headCell.sortField &&
// //                 <Box component="span" sx={visuallyHidden}>
// //                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
// //                 </Box>
// //               }
// //             </TableSortLabel>
// //           </TableCell>
// //         ))}
// //       </TableRow>
// //     </TableHead>
// //   );
// // }
// //
// // EnhancedTableHead.propTypes = {
// //   numSelected: PropTypes.number.isRequired,
// //   onRequestSort: PropTypes.func.isRequired,
// //   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
// //   orderBy: PropTypes.string.isRequired,
// //   rowCount: PropTypes.number.isRequired,
// // };
// //
// // const EnhancedTableToolbar = (props) => {
// //   const {numSelected} = props;
// //
// //   return (
// //     <Toolbar
// //       sx={{
// //         pl: {sm: 2},
// //         pr: {xs: 1, sm: 1},
// //         ...(numSelected > 0 && {
// //           bgcolor: (theme) =>
// //             alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
// //         }),
// //       }}
// //     >
// //       {numSelected > 0 ? (
// //         <Typography
// //           sx={{flex: '1 1 100%'}}
// //           color="inherit"
// //           variant="subtitle1"
// //           component="div"
// //         >
// //           {numSelected} selected
// //         </Typography>
// //       ) : (
// //         <Typography
// //           sx={{flex: '1 1 100%'}}
// //           variant="h6"
// //           id="tableTitle"
// //           component="div"
// //         >
// //           Personnel
// //         </Typography>
// //       )}
// //
// //       {numSelected > 0 ? (
// //         <Tooltip title="Delete">
// //           <IconButton>
// //             <DeleteIcon/>
// //           </IconButton>
// //         </Tooltip>
// //       ) : (
// //         <Tooltip title="Filter list">
// //           <IconButton>
// //             <FilterListIcon/>
// //           </IconButton>
// //         </Tooltip>
// //       )}
// //     </Toolbar>
// //   );
// // };
// //
// // EnhancedTableToolbar.propTypes = {
// //   numSelected: PropTypes.number.isRequired,
// // };
//
// class MonitorList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       order: 'asc',
//       orderBy: NURIMS_TITLE,
//       selected: {},
//       previous_selection: {},
//       page: 0,
//       dense: TABLE_ROW_HEIGHT,
//       rowsPerPage: 20,
//     };
//     this.rows = [];
//   }
//
//   // handleRequestSort = (event, property) => {
//   //   const isAsc = this.state.orderBy === property && this.state.order === 'asc';
//   //   this.setState({order: isAsc ? 'desc' : 'asc', orderBy: property});
//   // };
//
//   // setSelection = (row) => {
//   //   this.setState({selected: row});
//   //   // this.props.onClick(this.state.selected, row);
//   // };
//
//   handleRowSelection = (row) => {
//     // only do something if selection has changed
//     if (this.state.selected !== row) {
//       this.setState({selected: row});
//       // this.setState({previous_selection: this.state.selected, selected: row});
//       this.props.onPersonSelection(row);
//     }
//   };
//
//   // handleChangePage = (event, newPage) => {
//   //   this.setState({page: newPage});
//   // };
//   //
//   // handleChangeRowsPerPage = (event) => {
//   //   this.setState({page: 0, rowsPerPage: parseInt(event.target.value, 10)});
//   // };
//
//   // isSelected = (selected, row) => {
//   //   // return this.state.selected.indexOf(name) !== -1;
//   //   // return selected.hasOwnProperty("item_id") && row.hasOwnProperty("item_id") && selected.item_id === row.item_id;
//   //   return selected === row;
//   // }
//
//   // Avoid a layout jump when reaching the last page with empty rows.
//   // emptyRows = () => {
//   //   return this.state.page > 0 ? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - this.rows.length) : 0;
//   // }
//
//   update_selected_monitor = (person) => {
//     this.setState({ selected: {...person}} );
//     for (const r of this.rows) {
//       if (r.item_id === person.item_id) {
//         for (const [k, v] of Object.entries(person)) {
//           r[k] = v;
//         }
//         r["changed"] = true;
//         this.forceUpdate()
//       }
//     }
//   }
//
//   removeMonitor = (monitors) => {
//     for(let i = 0; i < this.rows.length; i++){
//       if (this.rows[i] === monitors) {
//         this.rows.splice(i, 1);
//         this.setState({ selected: this.state.previous_selection, previous_selection: {}} );
//         return;
//       }
//     }
//   }
//
//   setRecords = (monitors, skipIfMonitorInList) => {
//     let refresh = false;
//     if (Array.isArray(monitors)) {
//       for (const person of monitors) {
//         let add_to_list = true;
//         console.log("MonitorList.add", person)
//         if (skipIfMonitorInList && skipIfMonitorInList === true) {
//           for (const row of this.rows) {
//             if (row[NURIMS_TITLE] === person[NURIMS_TITLE]) {
//               add_to_list = false;
//               break;
//             }
//           }
//         }
//         if (add_to_list) {
//           this.rows.push(person);
//           refresh = true;
//         }
//       }
//     }
//     if (refresh) {
//       this.setState({page: this.state.page})
//     }
//   }
//
//   updateRecord = (monitor) => {
//     console.log("MonitorList.update", monitor)
//     for (const row of this.rows) {
//       if (row.item_id === -1 && row.record_key === monitor.record_key) {
//         row.item_id = monitor["item_id"]
//         row[NURIMS_TITLE] = monitor[NURIMS_TITLE];
//         row[NURIMS_WITHDRAWN] = monitor[NURIMS_WITHDRAWN];
//         row["changed"] = false;
//         row["metadata"] = [...monitor["metadata"]]
//       } else if (row.item_id !== -1 && row.item_id === monitor["item_id"]) {
//         row[NURIMS_TITLE] = monitor[NURIMS_TITLE];
//         row[NURIMS_WITHDRAWN] = monitor[NURIMS_WITHDRAWN];
//         row["changed"] = false;
//         row["metadata"] = [...monitor["metadata"]]
//       }
//     }
//   }
//
//   getRecords = () => {
//     return this.rows;
//   }
//
//   renderCell = (row, cell) => {
//     return (
//       <TableCell align={cell.align} padding={cell.disablePadding ? 'none' : 'normal'}>{row[cell.id]}</TableCell>
//     )
//   }
//   render() {
//     // const {order, orderBy, selected, page, dense, rowsPerPage} = this.state;
//     return (
//       <Box sx={{width: '100%'}}>
//         <Paper sx={{width: '100%', mb: 2}}>
//           <PageableTable
//             minWidth={350}
//             cells={[
//               {
//                 id: 'item_id',
//                 align: 'center',
//                 disablePadding: true,
//                 label: 'ID',
//                 width: '10%',
//                 sortField: true,
//               },
//               {
//                 id: 'nurims.title',
//                 align: 'left',
//                 disablePadding: true,
//                 label: 'Name',
//                 width: '90%',
//                 sortField: true,
//               },
//             ]}
//             theme={this.props.theme}
//             rowHeight={TABLE_ROW_HEIGHT}
//             order={'asc'}
//             orderBy={NURIMS_TITLE}
//             title={"Material"}
//             disabled={false}
//             rows={this.rows}
//             onRowSelection={this.handleRowSelection}
//             renderCell={this.renderCell}
//           />
//         </Paper>
//       </Box>
//     );
//   }
// }
//
// export default withTheme(MonitorList)
import * as React from 'react';
import PagedRecordList from "../../components/PagedRecordList";
import PropTypes from "prop-types";

class MonitorList extends React.Component {
  constructor(props) {
    super(props);
    this.ref=React.createRef();
  }

  removeRecord = (record) => {
    if (this.ref.current) {
      this.ref.current.removeRecord(record);
    }
  }

  addRecords = (records, skipIfRecordInList) => {
    if (this.ref.current) {
      this.ref.current.addRecords(records, skipIfRecordInList);
    }
  }

  getRecords = () => {
    return (this.ref.current) ? this.ref.current.getRecords() : [];
  }

  updateRecord = (record) => {
    if (this.ref.current) {
      this.ref.current.updateRecord(record);
    }
  }

  setRecords = (records) => {
    if (this.ref.current) {
      this.ref.current.setRecords(records);
    }
  }

  render() {
    return (
      <PagedRecordList
        ref={this.ref}
        height={this.props.height}
        onListItemSelection={this.props.onSelection}
        requestGetRecords={this.props.requestGetRecords}
        includeArchived={this.props.includeArchived}
        title={this.props.title}
        enableRecordArchiveSwitch={this.props.enableRecordArchiveSwitch}
      />
    )
  }
}

MonitorList.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default MonitorList
