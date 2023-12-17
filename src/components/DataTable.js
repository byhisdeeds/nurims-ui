import * as React from 'react';
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
// import {
//   RemoveCircle as RemoveCircleIcon,
//   AddCircleOutline as AddCircleOutlineIcon,
//   Visibility as VisibilityIcon,
//   VisibilityOff as VisibilityOffIcon
// } from "@mui/icons-material";
import {nanoid} from "nanoid";

const MODULE = "DataTable";

function EditToolbar(props) {
  const {addButtonLabel, addButtonIcon, setRows, setRowModesModel} = props;

  const handleClick = () => {
    const id = nanoid();
    setRows((oldRows) => [...oldRows, { id, sample_id: "0000", samples: '', timein: '', timeout: '', site: '', type: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'id'},
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={addButtonIcon} onClick={handleClick}>
        {addButtonLabel}
      </Button>
    </GridToolbarContainer>
  );
}

export default function DataTable({columns,
                                   data,
                                   addButtonLabel,
                                   addButtonIcon,
                                   cancelButtonIcon,
                                   saveButtonIcon,
                                   deleteButtonIcon,
                                   editButtonIcon}) {
  const [rows, setRows] = React.useState(data);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: {mode: GridRowModes.View, ignoreModifications: true},
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.hasOwnProperty("isNew") && editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = {...newRow, isNew: false};
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const column_actions = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({id}) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={saveButtonIcon}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={cancelButtonIcon}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={editButtonIcon}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={deleteButtonIcon}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    }
  ];

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
        columns={[...columns, ...column_actions]}
        editMode="table"
        pageSizeOptions={[25,50,100]}
        paginationMode={"client"}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: {addButtonLabel, addButtonIcon, setRows, setRowModesModel},
        }}
        density={"compact"}
        sx={{ "--DataGrid-overlayHeight": "500px" }}
      />
    </Box>
  );
}

DataTable.propTypes = {
  columns: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  addButtonLabel: PropTypes.string,
  addButtonIcon: PropTypes.element,
  editButtonIcon: PropTypes.element,
  deleteButtonIcon: PropTypes.element,
  saveButtonIcon: PropTypes.element,
  cancelButtonIcon: PropTypes.element,
}

DataTable.defaultProps = {
  addButtonLabel: "Add Record",
  addButtonIcon: <AddIcon/>,
  editButtonIcon: <EditIcon/>,
  deleteButtonIcon: <DeleteIcon/>,
  saveButtonIcon: <SaveIcon/>,
  cancelButtonIcon: <CancelIcon/>,
}