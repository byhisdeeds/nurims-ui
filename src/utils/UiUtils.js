import React from "react";
import {Box, Fab} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArchiveIcon from "@mui/icons-material/Archive";
import SaveIcon from "@mui/icons-material/Save";
import {isValidUserRole} from "./UserUtils";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PropTypes from "prop-types";


export function AddEditButtonPanel ({THIS, user, onClickRemoveRecord, removeRecordButtonLabel,
                                      onClickSaveRecordChanges, onClickAddRecord, addRecordButtonLabel,
                                      onClickChangeRecordArchivalStatus, onClickViewProvenanceRecords,
                                      removeRecordIcon, addRecordIcon}) {
  const {selection} = THIS.state;
  const isSysadmin = isValidUserRole(user, "sysadmin");
  const has_changed_records = THIS.hasChangedRecords();
  return (
    <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="remove"
        onClick={onClickRemoveRecord}
        disabled={!THIS.isSysadminButtonAccessible(selection)}
      >
        {removeRecordIcon}
        {removeRecordButtonLabel}
      </Fab>
      { isSysadmin &&
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="save"
          onClick={onClickViewProvenanceRecords}
          disabled={!selection.hasOwnProperty("item_id")}
        >
          <VisibilityIcon sx={{mr: 1}}/>
          View Provenance Records
        </Fab>
      }
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="archive"
        component={"span"}
        onClick={onClickChangeRecordArchivalStatus}
        disabled={!THIS.isSelectableByRole(selection, "dataentry")}
      >
        {THIS.isRecordArchived(selection) ?
          <React.Fragment><VisibilityIcon sx={{mr: 1}}/> "Restore Record"</React.Fragment> :
          <React.Fragment><VisibilityOffIcon sx={{mr: 1}}/> "Archive Record"</React.Fragment>}
      </Fab>
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="save"
        onClick={onClickSaveRecordChanges}
        disabled={!has_changed_records}
      >
        <SaveIcon sx={{mr: 1}}/>
        Save Changes
      </Fab>
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="add"
        onClick={onClickAddRecord}
        disabled={!THIS.isSelectableByRoles(selection, ["dataentry", "sysadmin"], false)}
      >
        {addRecordIcon}
        {addRecordButtonLabel}
      </Fab>
    </Box>
  )
}

AddEditButtonPanel.propTypes = {
  THIS: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onClickRemoveRecord: PropTypes.func.isRequired,
  onClickSaveRecordChanges: PropTypes.func.isRequired,
  onClickAddRecord: PropTypes.func.isRequired,
  addRecordButtonLabel: PropTypes.string,
  addRecordIcon: PropTypes.element,
  onClickChangeRecordArchivalStatus: PropTypes.func.isRequired,
  onClickViewProvenanceRecords: PropTypes.func.isRequired,
  removeRecordIcon: PropTypes.element,
  removeRecordButtonLabel: PropTypes.string,
}

AddEditButtonPanel.defaultProps = {
  removeRecordIcon: <RemoveCircleIcon sx={{mr: 1}}/>,
  addRecordIcon: <AddCircleOutlineIcon sx={{mr: 1}}/>,
  addRecordButtonLabel: "Add Record",
  removeRecordButtonLabel: "Remove Record",
}