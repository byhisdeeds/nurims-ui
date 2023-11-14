import {enqueueSnackbar} from "notistack";

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
        backgroundColor: "rgb(253,172,172)",
        color: "rgb(180,180,180)",
      },
      transitionDuration: 0,
      variant: 'error',
      persist: true
    });
}
