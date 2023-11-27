import {enqueueSnackbar} from "notistack";
import {NURIMS_TITLE} from "./constants";

export function enqueueWarningSnackbar(message, duration, auto_close) {
  const hideAfter = (auto_close || false) ? (duration || 2000) : 8000
  enqueueSnackbar(message, {
    variant: 'warning',
    autoHideDuration: hideAfter,
  });
}

export function enqueueInfoSnackbar(message, duration, auto_close) {
  const hideAfter = (auto_close || false) ? (duration || 2000) : 8000
  enqueueSnackbar(message, {
    variant: 'info',
    autoHideDuration: hideAfter,
  });
}

export function enqueueErrorSnackbar(message, duration, auto_close) {
  const hideAfter = (auto_close || false) ? (duration || 2000) : 8000
  enqueueSnackbar(message, {
    variant: 'error',
    autoHideDuration: hideAfter,
  });
}

export function enqueueSuccessSnackbar(message, duration, auto_close) {
  const hideAfter = (auto_close || false) ? (duration || 2000) : 8000
  enqueueSnackbar(message, {
    variant: 'success',
    autoHideDuration: hideAfter,
  });
}

export function enqueueConnectionSnackbar(lost_connection) {
  return enqueueSnackbar(
    lost_connection ? "Lost connection to server, trying to reconnect ..." : "Connecting to server, please wait ...", {
      style: {
        fontFamily: 'robotoslabregular, consola',
        fontSize: 18,
        width: 500,
        height: 50,
        backgroundColor: "#93000A",
        color: "#FFFFFF",
      },
      key: "__connection_snackbar__",
      transitionDuration: 0,
      variant: 'error',
      persist: true
    });
}

export function successfullyUpdatedSSCRecord(record) {
  const record_type_text = record.hasOwnProperty("record_type") ?
    (record.record_type === "ssc_modification_record" ? "modification" :
    record.record_type === "ssc_maintenance_record" ? "maintenance" :
    record.record_type === "ssc_record" ? "" : "?") : "?";
  const title = record.hasOwnProperty(NURIMS_TITLE) ? record[NURIMS_TITLE] : "";
  enqueueSuccessSnackbar(
    `Successfully updated ssc ${record_type_text} record '${title}'.`);
}