import {enqueueSnackbar} from "notistack";

export function enqueueWarningSnackbar(message, duration, auto_close) {
  const hideAfter =  (duration || 2000) * ((auto_close || false) ? 5 : 1)
  enqueueSnackbar(message,  {
    variant: 'warning',
    autoHideDuration: hideAfter,
  });
}

export function enqueueInfoSnackbar(message, duration, auto_close) {
  const hideAfter =  (duration || 2000) * ((auto_close || false) ? 5 : 1)
  enqueueSnackbar(message,  {
    variant: 'info',
    autoHideDuration: hideAfter,
  });
}

export function enqueueErrorSnackbar(message, duration, auto_close) {
  const hideAfter =  (duration || 2000) * ((auto_close || false) ? 5 : 1)
  enqueueSnackbar(message,  {
    variant: 'error',
    autoHideDuration: hideAfter,
  });
}

export function enqueueSuccessSnackbar(message, duration, auto_close) {
  const hideAfter = (duration || 2000) * ((auto_close || false) ? 5 : 1)
  enqueueSnackbar(message, {
      variant: 'success',
      autoHideDuration: hideAfter,
    });
}
