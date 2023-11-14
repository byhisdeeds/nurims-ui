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
    lost_connection ? "Lost connection, trying to reconnect ..." : "Connecting to server. Please wait ...", {
      style: {
        width: 500,
        height: 50,
        backgroundColor: "rgba(255,210,126,0.66)",
        color: "#d2d2d2",
      },
      preventDuplicate: true,
      transitionDuration: 0,
      variant: 'error',
      persist: true
    });
}
