import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import {
  ITEM_ID,
  NURIMS_TITLE
} from "./constants";

export const ConfirmRemoveDialog = (props) => (
  <div>
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Delete record for ${props.selection.hasOwnProperty(NURIMS_TITLE) ? props.selection[NURIMS_TITLE] : ""}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the record
          for {props.selection.hasOwnProperty(NURIMS_TITLE) ? props.selection[NURIMS_TITLE] : ""} (
          {props.selection.hasOwnProperty(ITEM_ID) ? props.selection[ITEM_ID] : ""})?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>No</Button>
        <Button onClick={props.onProceed} autoFocus>Yes</Button>
      </DialogActions>
    </Dialog>
  </div>
)

export const isValidSelection = (selection) => {
  return (selection.hasOwnProperty(ITEM_ID) && selection.item_id !== -1);
}
