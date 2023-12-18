import React from 'react';
import {
  enqueueErrorSnackbar
} from "../utils/SnackbarVariants";
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
    // const { rows, rowModesModel} = props;
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={addButtonIcon} onClick={this.handleClick}>
          {addButtonLabel}
        </Button>
      </GridToolbarContainer>
    );
  }

  handleClick = () => {
    const id = nanoid();
    // setRows((oldRows) => [...oldRows, { id, sample_id: "0000", samples: '', timein: '', timeout: '', site: '', type: '', isNew: true }]);
    this.setState({
      rows: [...this.state.rows, {
        id,
        sample_id: "0000",
        samples: '',
        timein: '',
        timeout: '',
        site: '',
        type: '',
        isNew: true
      }]
    });
    this.setState({
      rowModesModel: this.state.rowModesModel,
      [id]: {mode: GridRowModes.Edit, fieldToFocus: "sample_id"},
    });
    // setRowModesModel((oldModel) => ({
    //   ...oldModel,
    //   [id]: { mode: GridRowModes.Edit, fieldToFocus: "sample_id"},
    // }));
  };

  handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  handleEditClick = (id) => () => {
    this.setState({rowModesModel: {...this.state.rowModesModel, [id]: {mode: GridRowModes.Edit}}});
    // setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
  };

  handleSaveClick = (id) => () => {
    this.setState({rowModesModel: {...this.state.rowModesModel, [id]: {mode: GridRowModes.View}}});
    // setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
  };

  handleDeleteClick = (id) => () => {
    this.setState({rows: this.state.rows.filter((row) => row.id !== id)});
    // setRows(rows.filter((row) => row.id !== id));
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
      this.setState({rows: this.state.rows.filter((row) => row.id !== id)});
      // setRows(rows.filter((row) => row.id !== id));
    }
  };

  processRowUpdate = (newRow) => {
    const updatedRow = {...newRow, isNew: false};
    this.setState({rows: this.state.rows.map((row) => (row.id === newRow.id ? updatedRow : row))});
    // setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  handleRowModesModelChange = (newRowModesModel) => {
    this.setState({rowModesModel: newRowModesModel});
    // setRowModesModel(newRowModesModel);
  };

  addRow = (row) => {
    this.setState({rows: [...this.state.rows, row]});
  }

  render() {
    const {rowModesModel, rows} = this.state;
    const {columns, addButtonLabel, addButtonIcon, editMode} = this.props;
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
  columns: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  addButtonLabel: PropTypes.string,
  addButtonIcon: PropTypes.element,
  editButtonIcon: PropTypes.element,
  deleteButtonIcon: PropTypes.element,
  saveButtonIcon: PropTypes.element,
  cancelButtonIcon: PropTypes.element,
}

PagedDataTable.defaultProps = {
  editMode: "row",
  addButtonLabel: "Add Record",
  addButtonIcon: <AddIcon/>,
  editButtonIcon: <EditIcon/>,
  deleteButtonIcon: <DeleteIcon/>,
  saveButtonIcon: <SaveIcon/>,
  cancelButtonIcon: <CancelIcon/>,
}

export default PagedDataTable;