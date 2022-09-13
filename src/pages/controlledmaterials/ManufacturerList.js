import * as React from 'react';
import {withTheme} from "@mui/styles";
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import {Component} from "react";
import {NURIMS_TITLE} from "../../utils/constants";
import {PageableTable} from "../../components/CommonComponents";



const TABLE_ROW_HEIGHT = 24;

class ManufacturerList extends Component {
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

  handleRowSelection = (row) => {
    // only do something if selection has changed
    if (this.state.selected !== row) {
      this.setState({previous_selection: this.state.selected, selected: row});
      this.props.onRowSelection(this.state.selected, row);
    }
  };

  removePerson = (person) => {
    for(let i = 0; i < this.rows.length; i++){
      if (this.rows[i] === person) {
        this.rows.splice(i, 1);
        this.setState({ selected: {}} );
        return;
      }
    }
  }

  add = (manufacturers, skipIfManufacturerInList) => {
    let refresh = false;
    if (Array.isArray(manufacturers)) {
      for (const manufacturer of manufacturers) {
        let add_to_list = true;
        console.log("ManufacturersList.add", manufacturer)
        if (skipIfManufacturerInList && skipIfManufacturerInList === true) {
          for (const row of this.rows) {
            if (row["nurims.title"] === manufacturer["nurims.title"]) {
              add_to_list = false;
              break;
            }
          }
        }
        if (add_to_list) {
          this.rows.push(manufacturer);
          refresh = true;
        }
      }
    }
    if (refresh) {
      this.setState({page: this.state.page})
    }
  }

  getManufacturers = () => {
    return this.rows;
  }

  setManufacturers = (manufacturers) => {
    if (Array.isArray(manufacturers)) {
      this.rows.length = 0;
      for (const manufacturer of manufacturers) {
        console.log("ManufacturersList.setManufacturers", manufacturer)
        manufacturer.changed = false;
        this.rows.push(manufacturer);
      }
    }
    this.setState({page: this.state.page})
  }

  refreshList = () => {
    this.props.onRefresh();
  }

  renderCell = (row, cell) => {
    return (
      <TableCell align={cell.align} padding={cell.disablePadding ? 'none' : 'normal'}>{row[cell.id]}</TableCell>
    )
  }

  render() {
    return (
      <Box sx={{width: '100%'}}>
        <Paper sx={{width: '100%', mb: 2}}>
          <PageableTable
            minWidth={350}
            cells={[
              {
                id: 'item_id',
                align: 'center',
                disablePadding: true,
                label: 'ID',
                width: '10%',
                sortField: true,
              },
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
            title={"Manufacturers"}
            disabled={false}
            rows={this.rows}
            onRowSelection={this.handleRowSelection}
            renderCell={this.renderCell}
          />
        </Paper>
      </Box>
    );
  }

}

export default withTheme(ManufacturerList)