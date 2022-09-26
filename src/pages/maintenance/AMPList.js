import * as React from 'react';
import {
  Box,
  Paper,
  Switch
} from '@mui/material';
import {withTheme} from "@mui/styles";
import {ITEM_ID, NURIMS_TITLE, NURIMS_WITHDRAWN} from "../../utils/constants";
import {PageableTable} from "../../components/CommonComponents";
import TableCell from "@mui/material/TableCell";

const TABLE_ROW_HEIGHT = 24;

class AMPList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: {},
      include_archived: props.include_archived,
    };
    this.rows = [];
  }

  removeSSC = (ssc) => {
    for(let i = 0; i < this.rows.length; i++){
      if (this.rows[i] === ssc) {
        this.rows.splice(i, 1);
        this.setState({ selected: {}} );
        return;
      }
    }
  }

  handleRowSelection = (row) => {
    // only do something if selection has changed
    console.log("@@@@@@ HANDLE_ROW_SELECTION", row)
    if (this.state.selection !== row) {
      this.setState({selection: row});
      this.props.onSSCSelection(row);
    }
  };

  add = (sscs, skipIfSSCInList) => {
    let refresh = false;
    if (Array.isArray(sscs)) {
      for (const ssc of sscs) {
        let add_to_list = true;
        console.log("AMPList.add", ssc)
        if (skipIfSSCInList && skipIfSSCInList === true) {
          for (const row of this.rows) {
            if (row[NURIMS_TITLE] === ssc[NURIMS_TITLE]) {
              add_to_list = false;
              break;
            }
          }
        }
        if (add_to_list) {
          this.rows.push(ssc);
          refresh = true;
        }
      }
    }
    if (refresh) {
      this.forceUpdate();
    }
  }

  getSSCs = () => {
    return this.rows;
  }

  refresh = () => {
    this.forceUpdate();
  }

  setSSCs = (sscs) => {
    if (Array.isArray(sscs)) {
      this.rows.length = 0;
      for (const ssc of sscs) {
        console.log("AMPList.setSSCs", ssc)
        ssc.changed = false;
        this.rows.push(ssc);
      }
    }
    this.forceUpdate();
  }

  onRowSelected = (e) => {
    this.props.onRowSelection(parseInt(e.target.dataset.rowIndex));
    this.setState({ selectedRowIndex: parseInt(e.target.dataset.rowIndex) });
  }

  renderList = (index) => {
    const row = this.rows[index];
    const bgcolor = this.state.selectedRowIndex === index ?
      this.props.theme.palette.action.selected :
      this.props.theme.palette.background.paper;
    return (
      <Box
        data-row-index={index}
        onClick={this.onRowSelected}
        sx={{backgroundColor: bgcolor, color: this.props.theme.palette.text.primary }}
        >
        Item {row[NURIMS_TITLE]}
      </Box>
    )
  }

  renderCell = (row, cell) => {
    return (
      <TableCell
        align={cell.align}
        padding={cell.disablePadding ? 'none' : 'normal'}
        style={{color: row[NURIMS_WITHDRAWN] === 0 ?
            this.props.theme.palette.primary.light :
            this.props.theme.palette.text.disabled}}
      >
        {row[cell.id]} {(cell.id === NURIMS_TITLE && row[NURIMS_WITHDRAWN] === 1) && "<- archived"}
      </TableCell>
    )
  }

  includeArchivedRecords = (e) => {
    this.props.requestListUpdate(e.target.checked)
  }

  render() {
    const {include_archived} = this.state;
    return (
      <Box sx={{width: '100%'}}>
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
            title={"SSC's"}
            disabled={false}
            rows={this.rows}
            onRowSelection={this.handleRowSelection}
            renderCell={this.renderCell}
            filterElement={ <Switch
              inputProps={{'aria-labelledby': 'include-archived-records-switch'}}
              onChange={this.includeArchivedRecords}
              checked={include_archived}
            />}
          />
        </Paper>
      </Box>
    );
  }

}

AMPList.defaultProps = {
  onRowSelection: (index) => {
  },
};

export default withTheme(AMPList)
