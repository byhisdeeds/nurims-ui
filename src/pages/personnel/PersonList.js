// import * as React from 'react';
// import {withTheme} from "@mui/styles";
// import Box from '@mui/material/Box';
// import TableCell from '@mui/material/TableCell';
// import Paper from '@mui/material/Paper';
// import {Component} from "react";
// import {ITEM_ID, METADATA, NURIMS_TITLE, NURIMS_WITHDRAWN} from "../../utils/constants";
// import {PageableTable} from "../../components/CommonComponents";
// import {Switch} from "@mui/material";
//
// const TABLE_ROW_HEIGHT = 24;
//
//
// class PersonList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selection: {},
//       include_archived: props.include_archived,
//     };
//     this.rows = [];
//   }
//
//   handleRowSelection = (row) => {
//     // only do something if selection has changed
//     console.log("@@@@@@ HANDLE_ROW_SELECTION", row)
//     if (this.state.selection !== row) {
//       this.setState({selection: row});
//       this.props.onPersonSelection(row);
//     }
//   };
//
//   removePerson = (person) => {
//     for(let i = 0; i < this.rows.length; i++){
//       if (this.rows[i] === person) {
//         this.rows.splice(i, 1);
//         this.setState({ selection: {}} );
//         return;
//       }
//     }
//   }
//
//   add = (persons, clearPersonsList, skipIfPersonInList) => {
//     let refresh = false;
//     if (clearPersonsList) {
//       this.rows = [];
//     }
//     if (Array.isArray(persons)) {
//       for (const person of persons) {
//         let add_to_list = true;
//         // console.log("PersonList.add", person)
//         if (skipIfPersonInList && skipIfPersonInList === true) {
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
//   update = (person) => {
//     console.log("PersonList.update", person)
//     for (const row of this.rows) {
//       if (row.item_id === -1 && row.record_key === person.record_key) {
//         row.item_id = person[ITEM_ID]
//         row[NURIMS_TITLE] = person[NURIMS_TITLE];
//         row[NURIMS_WITHDRAWN] = person[NURIMS_WITHDRAWN];
//         row["changed"] = false;
//         row[METADATA] = [...person[METADATA]]
//       } else if (row.item_id !== -1 && row.item_id === person[ITEM_ID]) {
//         row[NURIMS_TITLE] = person[NURIMS_TITLE];
//         row[NURIMS_WITHDRAWN] = person[NURIMS_WITHDRAWN];
//         row["changed"] = false;
//         row[METADATA] = [...person[METADATA]]
//       }
//     }
//   }
//
//   getPersons = () => {
//     return this.rows;
//   }
//
//   renderCell = (row, cell) => {
//     return (
//       <TableCell
//         align={cell.align}
//         padding={cell.disablePadding ? 'none' : 'normal'}
//         style={{color: row[NURIMS_WITHDRAWN] === 0 ?
//             this.props.theme.palette.primary.light :
//             this.props.theme.palette.text.disabled}}
//       >
//         {row[cell.id]} {(cell.id === NURIMS_TITLE && row[NURIMS_WITHDRAWN] === 1) && "<- archived"}
//       </TableCell>
//     )
//   }
//
//   includeArchivedRecords = (e) => {
//     this.props.requestGetRecords(e.target.checked)
//   }
//
//   render() {
//     const {include_archived} = this.state;
//     return (
//       <Box sx={{width: '100%'}}>
//         <Paper sx={{width: '100%', mb: 2}}>
//           <PageableTable
//             minWidth={350}
//             cells={[
//               {
//                 id: ITEM_ID,
//                 align: 'center',
//                 disablePadding: true,
//                 label: 'ID',
//                 width: '10%',
//                 sortField: true,
//               },
//               {
//                 id: NURIMS_TITLE,
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
//             title={"Personnel"}
//             disabled={false}
//             rows={this.rows}
//             onRowSelection={this.handleRowSelection}
//             renderCell={this.renderCell}
//             filterElement={ <Switch
//                               inputProps={{'aria-labelledby': 'include-archived-records-switch'}}
//                               onChange={this.includeArchivedRecords}
//                               checked={include_archived}
//                             />}
//           />
//         </Paper>
//       </Box>
//     );
//   }
// }
//
// export default withTheme(PersonList)
import * as React from 'react';
import PagedRecordList from "../../components/PagedRecordList";
import PropTypes from "prop-types";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";

class PersonList extends React.Component {
  static contextType = UserDebugContext;

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
    if (this.context.debug > 5) {
      ConsoleLog("PersonList", "render");
    }
    return (
      <PagedRecordList
        ref={this.ref}
        rowsPerPage={15}
        onListItemSelection={this.props.onSelection}
        requestGetRecords={this.props.requestGetRecords}
        includeArchived={this.props.includeArchived}
        title={this.props.title}
        enableRecordArchiveSwitch={this.props.enableRecordArchiveSwitch}
      />
    )
  }
}

PersonList.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default PersonList