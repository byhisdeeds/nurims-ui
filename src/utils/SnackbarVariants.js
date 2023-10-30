import {enqueueSnackbar} from "notistack";
import {NotificationManager} from "react-notifications";
import toast, { Toaster } from 'react-hot-toast';

export function enqueueWarningSnackbar(message, duration, auto_close) {
  const hideAfter = (auto_close || false) ? (duration || 2000) : 10000
  // enqueueSnackbar(message, {
  //   variant: 'warning',
  //   autoHideDuration: hideAfter,
  // });
  toast.success(message);
}

export function enqueueInfoSnackbar(message, duration, auto_close) {
  // const hideAfter = (auto_close || false) ? (duration || 2000) : 10000
  // enqueueSnackbar(message, {
  //   variant: 'info',
  //   autoHideDuration: hideAfter,
  // });
  toast.success(message);
}

export function enqueueErrorSnackbar(message, duration, auto_close) {
  // const hideAfter = (auto_close || false) ? (duration || 2000) : 10000
  // enqueueSnackbar(message, {
  //   variant: 'error',
  //   autoHideDuration: hideAfter,
  // });
  toast.error(message);
}

export function enqueueSuccessSnackbar(message, duration, auto_close) {
  // const hideAfter = (auto_close || false) ? (duration || 2000) : 10000
  // enqueueSnackbar(message, {
  //   variant: 'success',
  //   autoHideDuration: hideAfter,
  // });
  toast.success('Info message');
}
