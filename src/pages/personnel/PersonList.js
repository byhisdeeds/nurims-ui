import * as React from 'react';
import {withTheme} from "@mui/styles";
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import {Component} from "react";
import {NURIMS_TITLE, NURIMS_WITHDRAWN} from "../../utils/constants";
import {PageableTable} from "../../components/CommonComponents";

const TABLE_ROW_HEIGHT = 24;


class PersonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      previous_selection: {},
    };
    this.rows = [];
  }


  handleRowSelection = (row) => {
    // only do something if selection has changed
    console.log("@@@@@@ HANDLE_ROW_SELECTION", row)
    if (this.state.selected !== row) {
      this.setState({selected: row});
      // this.setState({previous_selection: this.state.selected, selected: row});
      this.props.onPersonSelection(row);
    }
  };

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
        // console.log("PersonList.add", person)
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
      if (row.item_id === -1 && row.record_key === person.record_key) {
        row.item_id = person["item_id"]
        row[NURIMS_TITLE] = person[NURIMS_TITLE];
        row[NURIMS_WITHDRAWN] = person[NURIMS_WITHDRAWN];
        row["changed"] = false;
        row["metadata"] = [...person["metadata"]]
      } else if (row.item_id !== -1 && row.item_id === person["item_id"]) {
        row[NURIMS_TITLE] = person[NURIMS_TITLE];
        row[NURIMS_WITHDRAWN] = person[NURIMS_WITHDRAWN];
        row["changed"] = false;
        row["metadata"] = [...person["metadata"]]
      }
    }
  }

  getPersons = () => {
    return this.rows;
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
            title={"Personnel"}
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

export default withTheme(PersonList)