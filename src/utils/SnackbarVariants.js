import {enqueueSnackbar} from "notistack";

export function enqueueWarningSnackbar(message, duration) {
  enqueueSnackbar(message, { variant: 'warning', autoHideDuration: duration|| 2000 });
}

export function enqueueInfoSnackbar(message, duration) {
  enqueueSnackbar(message, { variant: 'info', autoHideDuration: duration || 1000 });
}

export function enqueueErrorSnackbar(message, duration) {
  enqueueSnackbar(message, { variant: 'error', autoHideDuration: duration|| 2000 });
}

export function enqueueSuccessSnackbar(message, duration) {
  enqueueSnackbar(message, { variant: 'success', autoHideDuration: duration|| 1000 });
}
