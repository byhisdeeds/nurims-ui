import {enqueueSnackbar} from "notistack";

export function enqueueWarningSnackbar(message, duration, auto_close) {
  const hideAfter = (auto_close || false) ? (duration || 2000) : 10000
  enqueueSnackbar(message, {
    variant: 'warning',
    autoHideDuration: hideAfter,
  });
}

export function enqueueInfoSnackbar(message, duration, auto_close) {
  const hideAfter = (auto_close || false) ? (duration || 2000) : 10000
  enqueueSnackbar(message, {
    variant: 'info',
    autoHideDuration: hideAfter,
  });
}

export function enqueueErrorSnackbar(message, duration, auto_close) {
  const hideAfter = (auto_close || false) ? (duration || 2000) : 10000
  enqueueSnackbar(message, {
    variant: 'error',
    autoHideDuration: hideAfter,
  });
}

export function enqueueSuccessSnackbar(message, duration, auto_close) {
  const hideAfter = (auto_close || false) ? (duration || 2000) : 10000
  enqueueSnackbar(message, {
    variant: 'success',
    autoHideDuration: hideAfter,
  });
}

export function enqueueLostConnectionSnackbar() {
  return enqueueSnackbar("Lost connection ...", {
    variant: 'error',
    persist: true
  });
}
