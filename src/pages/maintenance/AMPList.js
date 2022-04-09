import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {Virtuoso} from "react-virtuoso";
import Typography from '@mui/material/Typography';
import {Stack} from "@mui/material";
import {withTheme} from "@mui/styles";
import {NURIMS_TITLE} from "../../utils/constants";

class AMPList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowIndex: -1,
    };
    this.rows = [];
  }

  removePerson = (person) => {
    for(let i = 0; i < this.rows.length; i++){
      if (this.rows[i] === person) {
        this.rows.splice(i, 1);
        this.setState({ selected: {}} );
        return;
      }
    }
  }

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

  render() {
    // const {selectedRowIndex} = this.state;
    console.log("THEME ", this.props.theme)
    return (
      <Stack spacing={1} sx={{width: '100%'}}>
        <Typography sx={{pl: 1}}>SSC's List</Typography>
        <Box sx={{
          p: 1,
          borderColor: this.props.theme.palette.divider,
          borderRadius: 1,
          borderWidth: 1,
          borderStyle: 'solid',
        }}>
        <Virtuoso
          style={{ height: '500px' }}
          data={this.rows}
          totalCount={this.rows.length}
          itemContent={this.renderList}
        />
        </Box>
      </Stack>
    );
  }

}

AMPList.defaultProps = {
  onRowSelection: (index) => {
  },
};

export default withTheme(AMPList)
