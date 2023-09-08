import {enqueueSnackbar} from "notistack";

export function enqueueWarningSnackbar(message) {
  enqueueSnackbar(message, { variant: 'warning' });
}

export function enqueueInfoSnackbar(message) {
  enqueueSnackbar(message, { variant: 'info' });
}

export function enqueueErrorSnackbar(message) {
  enqueueSnackbar(message, { variant: 'error' });
}

export function enqueueSuccessSnackbar(message) {
  enqueueSnackbar(message, { variant: 'success' });
}
