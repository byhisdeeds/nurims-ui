import {enqueueSnackbar} from "notistack";

export function enqueueWarningSnackbar(message, duration, auto_close) {
  enqueueSnackbar(message,  {
    variant: 'warning',
    autoHideDuration: duration || 2000,
    autoClose: auto_close
  });
}

export function enqueueInfoSnackbar(message, duration, auto_close) {
  enqueueSnackbar(message,  {
    variant: 'info',
    autoHideDuration: duration || 1000,
    autoClose: auto_close
  });
}

export function enqueueErrorSnackbar(message, duration, auto_close) {
  enqueueSnackbar(message,  {
    variant: 'error',
    autoHideDuration: duration || 2000,
    autoClose: auto_close
  });
}

export function enqueueSuccessSnackbar(message, duration, auto_close) {
  enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: duration || 2000,
      autoClose: auto_close
    });
}
