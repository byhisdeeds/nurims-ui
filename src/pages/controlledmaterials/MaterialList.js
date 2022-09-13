import {Component} from 'react';
import {withTheme} from "@mui/styles";
import TableCell from '@mui/material/TableCell';
// import {VirtualizedTable} from "./VirtualizedTable";
import Box from "@mui/material/Box";
// import {Component} from "react";
import {NURIMS_TITLE} from "../../utils/constants";
import {PageableTable} from "../../components/CommonComponents";
import * as React from "react";


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

const TABLE_ROW_HEIGHT = 24;

class MaterialList extends Component {
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


  handleRowSelection = (rowData) => {
    console.log("row clicked", rowData)
    this.setState({selection: rowData})
    this.props.onRowClicked(rowData);
  }

  renderCell = (row, cell) => {
    return (
      <TableCell align={cell.align} padding={cell.disablePadding ? 'none' : 'normal'}>{row[cell.id]}</TableCell>
    )
  }

  render () {
    return (
      <Box style={{ height: this.props.height, width: '100%' }}>
        <PageableTable
          minWidth={350}
          cells={[
            {
              id: 'nurims.title',
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
        />
      </Box>
    );
  }
}

export default withTheme(MaterialList)
