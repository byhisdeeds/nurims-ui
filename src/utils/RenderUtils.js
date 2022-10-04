import React from "react";
import {
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon
} from "@mui/icons-material";
import {
  NURIMS_WITHDRAWN
} from "./constants";

export function ArchiveRecordLabel(record, label) {
  return (record.hasOwnProperty(NURIMS_WITHDRAWN) && record[NURIMS_WITHDRAWN] === 1) ?
    <React.Fragment><UnarchiveIcon sx={{mr: 1}}/>Restore {label} Record</React.Fragment> :
    <React.Fragment><ArchiveIcon sx={{mr: 1}}/>Archive {label} Record</React.Fragment>
}