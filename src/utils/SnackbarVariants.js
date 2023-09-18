import {enqueueSnackbar} from "notistack";

export function enqueueWarningSnackbar(message, duration, auto_close) {
  const hideAfter = (duration ? duration : 3500) * (auto_close ? 5 : 1)
  enqueueSnackbar(message,  {
    variant: 'warning',
    autoHideDuration: hideAfter,
  });
}

export function enqueueInfoSnackbar(message, duration, auto_close) {
  const hideAfter = (duration ? duration : 2000) * (auto_close ? 5 : 1)
  enqueueSnackbar(message,  {
    variant: 'info',
    autoHideDuration: hideAfter,
  });
}

export function enqueueErrorSnackbar(message, duration, auto_close) {
  const hideAfter = (duration ? duration : 5000) * (auto_close ? 5 : 1)
  enqueueSnackbar(message,  {
    variant: 'error',
    autoHideDuration: hideAfter,
  });
}

export function enqueueSuccessSnackbar(message, duration, auto_close) {
  const hideAfter = (duration ? duration : 2000) * (auto_close ? 5 : 1)
  enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: hideAfter,
    });
}
