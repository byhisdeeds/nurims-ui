import {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
// import {VirtualizedTable} from "./VirtualizedTable";
import Box from "@mui/material/Box";
// import {Component} from "react";
import MuiVirtualizedTable from './VirtualizedTable'


const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      ...(theme.direction === 'rtl' && {
        paddingLeft: '0 !important',
      }),
      ...(theme.direction !== 'rtl' && {
        paddingRight: undefined,
      }),
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});


// const defaultTheme = createTheme();
// const VirtualizedTable = withStyles(styles, { defaultTheme })(MuiVirtualizedTable);


// const styles = (theme) => ({
//   flexContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     boxSizing: 'border-box',
//   },
//   table: {
//     // temporary right-to-left patch, waiting for
//     // https://github.com/bvaughn/react-virtualized/issues/454
//     '& .ReactVirtualized__Table__headerRow': {
//       ...(theme.direction === 'rtl' && {
//         paddingLeft: '0 !important',
//       }),
//       ...(theme.direction !== 'rtl' && {
//         paddingRight: undefined,
//       }),
//     },
//   },
//   tableRow: {
//     cursor: 'pointer',
//   },
//   tableRowHover: {
//     '&:hover': {
//       backgroundColor: theme.palette.grey[200],
//     },
//   },
//   tableCell: {
//     flex: 1,
//   },
//   noClick: {
//     cursor: 'initial',
//   },
// });
//
// class MuiVirtualizedTable extends React.PureComponent {
//   static defaultProps = {
//     headerHeight: 48,
//     rowHeight: 48,
//   };
//
//   getRowClassName = ({ index }) => {
//     const { classes, onRowClick } = this.props;
//
//     return clsx(classes.tableRow, classes.flexContainer, {
//       [classes.tableRowHover]: index !== -1 && onRowClick != null,
//     });
//   };
//
//   cellRenderer = ({ cellData, columnIndex }) => {
//     const { columns, classes, rowHeight, onRowClick } = this.props;
//     return (
//       <TableCell
//         component="div"
//         className={clsx(classes.tableCell, classes.flexContainer, {
//           [classes.noClick]: onRowClick == null,
//         })}
//         variant="body"
//         style={{ height: rowHeight }}
//         align={
//           (columnIndex != null && columns[columnIndex].numeric) || false
//             ? 'right'
//             : 'left'
//         }
//       >
//         {cellData}
//       </TableCell>
//     );
//   };
//
//   headerRenderer = ({ label, columnIndex }) => {
//     const { headerHeight, columns, classes } = this.props;
//
//     return (
//       <TableCell
//         component="div"
//         className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
//         variant="head"
//         style={{ height: headerHeight }}
//         align={columns[columnIndex].numeric || false ? 'right' : 'left'}
//       >
//         <span>{label}</span>
//       </TableCell>
//     );
//   };
//
//   render() {
//     const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
//     return (
//       <AutoSizer>
//         {({ height, width }) => (
//           <Table
//             height={height}
//             width={width}
//             rowHeight={rowHeight}
//             gridStyle={{
//               direction: 'inherit',
//             }}
//             headerHeight={headerHeight}
//             className={classes.table}
//             {...tableProps}
//             rowClassName={this.getRowClassName}
//           >
//             {columns.map(({ dataKey, ...other }, index) => {
//               return (
//                 <Column
//                   key={dataKey}
//                   headerRenderer={(headerProps) =>
//                     this.headerRenderer({
//                       ...headerProps,
//                       columnIndex: index,
//                     })
//                   }
//                   className={classes.flexContainer}
//                   cellRenderer={this.cellRenderer}
//                   dataKey={dataKey}
//                   {...other}
//                 />
//               );
//             })}
//           </Table>
//         )}
//       </AutoSizer>
//     );
//   }
// }
//
// MuiVirtualizedTable.propTypes = {
//   classes: PropTypes.object.isRequired,
//   columns: PropTypes.arrayOf(
//     PropTypes.shape({
//       dataKey: PropTypes.string.isRequired,
//       label: PropTypes.string.isRequired,
//       numeric: PropTypes.bool,
//       width: PropTypes.number.isRequired,
//     }),
//   ).isRequired,
//   headerHeight: PropTypes.number,
//   onRowClick: PropTypes.func,
//   rowHeight: PropTypes.number,
// };
//
// const defaultTheme = createTheme();
// const VirtualizedTable = withStyles(styles, { defaultTheme })(MuiVirtualizedTable);

// ---

// const sample = [
//   ['Frozen yoghurt', 159, 6.0, 24, 4.0],
//   ['Ice cream sandwich', 237, 9.0, 37, 4.3],
//   ['Eclair', 262, 16.0, 24, 6.0],
//   ['Cupcake', 305, 3.7, 67, 4.3],
//   ['Gingerbread', 356, 16.0, 49, 3.9],
// ];
//
// function createData(id, dessert, calories, fat, carbs, protein) {
//   return { id, dessert, calories, fat, carbs, protein };
// }
//
// const rows = [];
//
// for (let i = 0; i < 200; i += 1) {
//   const randomSelection = sample[Math.floor(Math.random() * sample.length)];
//   rows.push(createData(i, ...randomSelection));
// }

// function VirtualizedTable (props) {
//   return withStyles(styles, props.theme)(MuiVirtualizedTable);
// }

export default class MaterialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'nurims.title',
      selected: -1,
      previous_selection: -1,
      page: 0,
      dense: false,
      rowsPerPage: 10,
    };
    this.rows = [];
    this.VirtualizedTable = withStyles(styles, props.theme)(MuiVirtualizedTable);
  }

  add = (material, skipIfMaterialInList) => {
    let refresh = false;
    if (Array.isArray(material)) {
      for (const materials of material) {
        let add_to_list = true;
        console.log("MaterialsList.add", materials)
        if (skipIfMaterialInList && skipIfMaterialInList === true) {
          for (const row of this.rows) {
            if (row["nurims.title"] === materials["nurims.title"]) {
              add_to_list = false;
              break;
            }
          }
        }
        if (add_to_list) {
          this.rows.push(materials);
          refresh = true;
        }
      }
    }
    if (refresh) {
      this.setState({page: this.state.page})
    }
  }

  getMaterials = () => {
    return this.rows;
  }

  setMaterials = (materials) => {
    if (Array.isArray(materials)) {
      this.rows.length = 0;
      for (const material of materials) {
        console.log("MaterialList.setMaterials", material)
        material.changed = false;
        this.rows.push(material);
      }
    }
    this.setState({selection: -1, previous_selection: -1})
  }

  rowClicked = (e, index, rowData) => {
    console.log("row clicked", index, rowData)
    this.setState({selection: index})
    this.props.onRowClicked(index, rowData);
  }

  render () {
    return (
      <Box style={{ height: this.props.height, width: '100%' }}>
        <this.VirtualizedTable
          rowCount={this.rows.length}
          rowGetter={({ index }) => this.rows[index]}
          theme={this.props.theme}
          onRowClicked={this.rowClicked}
          columns={[
            {
              width: '100%',
              label: 'Material',
              dataKey: 'nurims.title',
            },
          ]}
        />
      </Box>
    );
  }
}
