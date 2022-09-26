import {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {withStyles, withTheme} from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
// import { AutoSizer, Column, Table } from 'react-virtualized';
// import {VirtualizedTable} from "./VirtualizedTable";
import Box from "@mui/material/Box";
// import {Component} from "react";
// import MuiVirtualizedTable from './VirtualizedTable'
import {
  ITEM_ID,
  NURIMS_TITLE,
  NURIMS_WITHDRAWN
} from "../../utils/constants";
import * as React from "react";
import {Virtuoso} from "react-virtuoso";
import {PageableTable} from "../../components/CommonComponents";
import {Switch} from "@mui/material";

const TABLE_ROW_HEIGHT = 24;


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


class MaterialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: NURIMS_TITLE,
      selection: {},
      page: 0,
      dense: false,
      rowsPerPage: 10,
    };
    this.rows = [];
    // this.VirtualizedTable = withStyles(styles, props.theme)(MuiVirtualizedTable);
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
        // console.log("MaterialList.setMaterials", material)
        material.changed = false;
        this.rows.push(material);
      }
    }
    this.setState({selection: -1})
  }

  handleRowSelection = (row) => {
    // only do something if selection has changed
    console.log("@@@@@@ HANDLE_ROW_SELECTION", row)
    if (this.state.selection !== row) {
      this.setState({selection: row});
      this.props.onRowClicked(row);
      // this.props.onPersonSelection(row);
    }
  };

  renderCell = (row, cell) => {
    return (
      <TableCell
        align={cell.align}
        padding={cell.disablePadding ? 'none' : 'normal'}
      >
        {row[cell.id]}
      </TableCell>
    )
  }


  // renderList = (index) => {
  //   const row = this.rows[index];
  //   const bgcolor = this.state.selection === index ?
  //     this.props.theme.palette.action.selection :
  //     this.props.theme.palette.background.paper;
  //   return (
  //     <Box
  //       data-row-index={index}
  //       onClick={this.onRowSelected}
  //       sx={{backgroundColor: bgcolor, color: this.props.theme.palette.text.primary }}
  //     >
  //       Item {row[NURIMS_TITLE]}
  //     </Box>
  //   )
  // }
  removeMaterial = (material) => {
    for(let i = 0; i < this.rows.length; i++){
      if (this.rows[i] === material) {
        this.rows.splice(i, 1);
        this.setState({ selected: {}} );
        return;
      }
    }
  }

  render () {
    return (
      <Box
        style={{
          height: this.props.height,
          width: '100%'
        }}
      >
        <Paper sx={{width: '100%', mb: 2}}>
          <PageableTable
            minWidth={350}
            cells={[
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
            ]}
            theme={this.props.theme}
            rowHeight={TABLE_ROW_HEIGHT}
            order={'asc'}
            orderBy={NURIMS_TITLE}
            title={"Materials"}
            disabled={false}
            rows={this.rows}
            onRowSelection={this.handleRowSelection}
            renderCell={this.renderCell}
            // filterElement={ <Switch
            //   inputProps={{'aria-labelledby': 'include-archived-records-switch'}}
            //   onChange={this.includeArchivedRecords}
            //   checked={include_archived}
            // />}
          />
        </Paper>
        {/*<Virtuoso*/}
        {/*  style={{ height: '500px' }}*/}
        {/*  data={this.rows}*/}
        {/*  totalCount={this.rows.length}*/}
        {/*  itemContent={this.renderList}*/}
        {/*/>*/}
      </Box>
    );
  }
}

export default withTheme(MaterialList);
