import React from "react";
import ArchiveIcon from "@mui/icons-material/Archive";
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import DoneIcon from '@mui/icons-material/Done';
import {
  Box,
  Button,
  ButtonBase
} from "@mui/material";
import {
  isValidUserRole
} from "./UserUtils";
import {
  getRecordData,
  setRecordData
} from "./MetadataUtils";
import {
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB,
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST,
  NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER,
  NURIMS_OPERATION_DATA_IRRADIATIONDURATION,
  NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES,
  NURIMS_OPERATION_DATA_NEUTRONFLUX
} from "./constants";


export function approveIrradiationMessageComponent(record, user, disabled, approveRequest, theme) {
  const approver = getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER, "");
  if (approver !== "") {
    const fullname = getUserFullname(user, approver)
    return (
      <Button
        variant={"outlined"}
        endIcon={<DoneIcon />}
        style={{color: theme.palette.success.contrastText, backgroundColor: theme.palette.success.light}}
        aria-label={"authorize"}
        disableRipple={true}
        fullWidth
        sx={{marginTop: 1}}
      >
        {`Approved by ${fullname}`}
      </Button>
    )
  }
  const can_authorize = isValidUserRole(user, "irradiation_authorizer");
  if (can_authorize) {
    const disabled =
      Object.keys(record).length === 0 ||
      getRecordData(record, NURIMS_OPERATION_DATA_NEUTRONFLUX, "") === "" ||
      getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONDURATION, "") === "" ||
      getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST, "") === "" ||
      getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES, []).size === 0 ||
      getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB, {name: ""}).name === "";
    return (
      <Button
        disabled={disabled}
        variant={"contained"}
        endIcon={<ArchiveIcon />}
        onClick={approveRequest}
        color={"primary"}
        aria-label={"authorize"}
        fullWidth
        sx={{marginTop: 1}}
      >
        {"Approve Irradiation Request"}
      </Button>
    )
  } else {
    return (
      <Button
        variant={"outlined"}
        style={{color: theme.palette.warning.contrastText, backgroundColor: theme.palette.warning.light}}
        endIcon={<DoNotDisturbAltIcon />}
        aria-label={"authorize"}
        disableRipple={true}
        fullWidth
        sx={{marginTop: 1}}
      >
        {`YOU IS NOT AUTHORIZED TO APPROVE IRRADIATIONS.`}
      </Button>
    )
  }
}

export function getUserFullname(users, user) {
  return users.users.reduce((prev, obj) => {
    if (obj[0] === user) {
      prev = obj[1];
    }
    return prev;
  }, "");
}