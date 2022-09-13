import * as React from 'react';
import {withTheme} from "@mui/styles";
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import {Component} from "react";
import "../../utils/MetadataUtils"
import {getMetadataValue, setMetadataValue} from "../../utils/MetadataUtils";
import {
  NURIMS_ENTITY_IS_EXTREMITY_MONITORED,
  NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED,
  NURIMS_ENTITY_IS_WRIST_MONITORED, NURIMS_TITLE,
} from "../../utils/constants";
import {PageableTable} from "../../components/CommonComponents";

const TABLE_ROW_HEIGHT = 24;

class PersonsMonitoredStatusList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: NURIMS_TITLE,
      selected: {},
      previous_selection: {},
      page: 0,
      dense: 29.3,
      rowsPerPage: 10,
    };
    this.rows = [];
  }

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

  renderCell = (row, cell) => {
    if (cell.id === NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED) {
      const status = getMetadataValue(row, cell.id, "false");
      return (
        <TableCell align={cell.align} padding={cell.disablePadding ? 'none' : 'normal'}>{
          <Checkbox
            id={`wholebody-${row.item_id}`}
            color="primary"
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={status === "true"}
            onChange={this.handleCheckboxChange}
            inputProps={{
              'aria-label': 'select is whole body monitored',
            }}
          />
        }</TableCell>
      )
    } else if (cell.id === NURIMS_ENTITY_IS_EXTREMITY_MONITORED) {
      const status = getMetadataValue(row, cell.id, "false");
      return (
        <TableCell align={cell.align} padding={cell.disablePadding ? 'none' : 'normal'}>{
          <Checkbox
            id={`extremity-${row.item_id}`}
            color="primary"
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={status === "true"}
            onChange={this.handleCheckboxChange}
            inputProps={{
              'aria-label': 'select is extremity monitored',
            }}
          />
        }</TableCell>
      )
    } else if (cell.id === NURIMS_ENTITY_IS_WRIST_MONITORED) {
      const status = getMetadataValue(row, cell.id, "false");
      return (
        <TableCell align={cell.align} padding={cell.disablePadding ? 'none' : 'normal'}>{
          <Checkbox
            id={`wrist-${row.item_id}`}
            color="primary"
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={status === "true"}
            onChange={this.handleCheckboxChange}
            inputProps={{
              'aria-label': 'select is wrist monitored',
            }}
          />
        }</TableCell>
      )
    } else {
      return (
        <TableCell align={cell.align} padding={cell.disablePadding ? 'none' : 'normal'}>{row[cell.id]}</TableCell>
      )
    }
  }

  render() {
    // const {order, orderBy, selected, page, dense, rowsPerPage} = this.state;
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
                sortField: true,
              },
              {
                id: NURIMS_TITLE,
                align: 'left',
                disablePadding: true,
                label: 'Name',
                sortField: true,
              },
              {
                id: NURIMS_ENTITY_IS_WHOLE_BODY_MONITORED,
                align: 'center',
                disablePadding: true,
                label: 'Whole Body Monitored',
                sortField: false,
              },
              {
                id: NURIMS_ENTITY_IS_EXTREMITY_MONITORED,
                align: 'center',
                disablePadding: true,
                label: 'Extremity Monitored',
                sortField: false,
              },
              {
                id: NURIMS_ENTITY_IS_WRIST_MONITORED,
                align: 'center',
                disablePadding: true,
                label: 'Wrist Monitored',
                sortField: false,
              },
            ]}
            theme={this.props.theme}
            rowHeight={TABLE_ROW_HEIGHT}
            order={'asc'}
            orderBy={NURIMS_TITLE}
            title={"Personnel"}
            disabled={false}
            rows={this.rows}
            // onRowSelection={this.handleRowSelection}
            renderCell={this.renderCell}
          />
        </Paper>
      </Box>
    );
  }
}

export default withTheme(PersonsMonitoredStatusList)
