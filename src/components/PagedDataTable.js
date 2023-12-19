import React from 'react';
import {
  Box,
  Button
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  DeleteOutlined as DeleteIcon,
} from '@mui/icons-material';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import PropTypes from "prop-types";
import {nanoid} from "nanoid";
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";

const MODULE = "PagedDataTable";

class PagedDataTable extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      rows: props.data,
      rowModesModel: {},
    };
    this.column_actions = [
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({id}) => {
          const isInEditMode = this.state.rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={props.saveButtonIcon}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={this.handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={props.cancelButtonIcon}
                label="Cancel"
                className="textPrimary"
                onClick={this.handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={props.editButtonIcon}
              label="Edit"
              className="textPrimary"
              onClick={this.handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={props.deleteButtonIcon}
              label="Delete"
              onClick={this.handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      }
    ];
  }

  EditToolbar = ({addButtonLabel, addButtonIcon}) => {
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={addButtonIcon} onClick={this.handleAddClick}>
          {addButtonLabel}
        </Button>
      </GridToolbarContainer>
    );
  }

  handleAddClick = () => {
    const id = nanoid();
    // setRows((oldRows) => [...oldRows, { id, sample_id: "0000", samples: '', timein: '', timeout: '', site: '', type: '', isNew: true }]);
    const rows = [...this.state.rows, {
      id,
      sample_id: "0000",
      samples: '',
      timein: '',
      timeout: '',
      site: '',
      type: '',
      isNew: true
    }];
    this.setState({
      rows: rows,
      rowModesModel: this.state.rowModesModel,
      [id]: {mode: GridRowModes.Edit, fieldToFocus: "sample_id"},
    });
    this.props.onDataChanged(true, rows);
    // setRowModesModel((oldModel) => ({
    //   ...oldModel,
    //   [id]: { mode: GridRowModes.Edit, fieldToFocus: "sample_id"},
    // }));
  };

  handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
    // this.props.onDataChanged(false, this.state.rows);
  };

  handleEditClick = (id) => () => {
    this.setState({rowModesModel: {...this.state.rowModesModel, [id]: {mode: GridRowModes.Edit}}});
    // setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
  };

  handleSaveClick = (id) => () => {
    this.setState({rowModesModel: {...this.state.rowModesModel, [id]: {mode: GridRowModes.View}}});
    // setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    // this.props.onDataChanged(true, this.state.rows);
  };

  handleDeleteClick = (id) => () => {
    const rows = this.state.rows.filter((row) => row.id !== id);
    this.setState({rows: rows});
    // setRows(rows.filter((row) => row.id !== id));
    this.props.onDataChanged(true, rows);
  };

  handleCancelClick = (id) => () => {
    this.setState({rowModesModel: {
        ...this.state.rowModesModel,
        [id]: {mode: GridRowModes.View, ignoreModifications: true},
      }
    });
    // setRowModesModel({
    //   ...rowModesModel,
    //   [id]: {mode: GridRowModes.View, ignoreModifications: true},
    // });

    const editedRow = this.state.rows.find((row) => row.id === id);
    if (editedRow.hasOwnProperty("isNew") && editedRow.isNew) {
      const rows = this.state.rows.filter((row) => row.id !== id);
      this.setState({rows: rows});
      // setRows(rows.filter((row) => row.id !== id));
      this.props.onDataChanged(false, rows);
    }
  };

  processRowUpdate = (newRow) => {
    const updatedRow = {...newRow, isNew: false};
    const rows = this.state.rows.map((row) => (row.id === newRow.id ? updatedRow : row));
    this.setState({rows: rows});
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    this.props.onDataChanged(true, rows);
    return updatedRow;
  };

  handleRowModesModelChange = (newRowModesModel) => {
    this.setState({rowModesModel: newRowModesModel});
    // setRowModesModel(newRowModesModel);
  };

  updateRows = (rows) => {
    this.setState({rows: rows});
  }

  addRow = (row, filter) => {
    if (filter) {
      if (filter(this.state.rows, row)) {
        return;
      }
    }
    const rows = [...this.state.rows, row];
    this.setState({rows: rows});
    this.props.onDataChanged(true, rows);
    // const rows = [...this.state.rows, row];
    // this.setState({rows: rows});
    // this.props.onDataChanged(true, rows);
  }

  render() {
    const {rowModesModel, rows} = this.state;
    const {columns, addButtonLabel, addButtonIcon, editMode, data} = this.props;
    return (
      <Box
        sx={{
          height: 500,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={[...columns, ...this.column_actions]}
          editMode={editMode}
          pageSizeOptions={[25, 50, 100]}
          paginationMode={"client"}
          rowModesModel={rowModesModel}
          onRowModesModelChange={this.handleRowModesModelChange}
          onRowEditStop={this.handleRowEditStop}
          processRowUpdate={this.processRowUpdate}
          slots={{
            toolbar: this.EditToolbar,
          }}
          slotProps={{
            toolbar: {addButtonLabel, addButtonIcon},
          }}
          density={"compact"}
          sx={{"--DataGrid-overlayHeight": "500px"}}
        />
      </Box>
    );

  }
}

PagedDataTable.propTypes = {
  editMode: PropTypes.string,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  addButtonLabel: PropTypes.string,
  addButtonIcon: PropTypes.element,
  editButtonIcon: PropTypes.element,
  deleteButtonIcon: PropTypes.element,
  saveButtonIcon: PropTypes.element,
  cancelButtonIcon: PropTypes.element,
  onDataChanged: PropTypes.func,
}

PagedDataTable.defaultProps = {
  editMode: "row",
  addButtonLabel: "Add Record",
  addButtonIcon: <AddIcon/>,
  editButtonIcon: <EditIcon/>,
  deleteButtonIcon: <DeleteIcon/>,
  saveButtonIcon: <SaveIcon/>,
  cancelButtonIcon: <CancelIcon/>,
  onDataChanged: (state, rows) => {
  },
}

export default PagedDataTable;