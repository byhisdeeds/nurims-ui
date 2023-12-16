import {
  useMemo,
  useState
} from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
// import {
//   QueryClient,
//   QueryClientProvider,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query';
// import { fakeData, usStates } from './makeData';
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import PropTypes from "prop-types";
// import DataTable from "./DataTable";

const PagedEditableTable = ({cols, columnEditProps, data, addButtonLabel}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [tableData, setTableData] = useState(data);

  // fill out column properties object
  for (const props of columnEditProps) {
    console.log("---->", props);
    for (const c of cols) {
      if (c.accessorKey === props.accessorKey) {
        if (c.hasOwnProperty("muiEditTextFieldProps") && props.hasOwnProperty("muiEditTextFieldProps")) {
          const columnEditProps = c.muiEditTextFieldProps;
          const p = props.muiEditTextFieldProps;
          for (const [key, value] of Object.entries(p)) {
            console.log(`+++${key}: ${value}`);
            if (key === "error") {
              columnEditProps.error = !!validationErrors[value];
            } else if (key === "helperText") {
              columnEditProps.helperText = validationErrors[value];
            } else if (key === "onFocus") {
              columnEditProps.onFocus = () =>
                setValidationErrors({
                  ...validationErrors, ...value
                })
            } else {
              columnEditProps[key] = value;
            }
          }
        }
      }
    }
  }

  console.log("===============================")
  console.log(cols)
  console.log("===============================")

  const columns = useMemo(
    () => cols,
    [],
  );

  // call CREATE hook
  // const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  // //call READ hook
  // const {
  //   data: fetchedUsers = [],
  //   isError: isLoadingUsersError,
  //   isFetching: isFetchingUsers,
  //   isLoading: isLoadingUsers,
  // } = useGetUsers();
  // //call UPDATE hook
  // const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  // //call DELETE hook
  // const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  // CREATE action
  const handleCreateUser = ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    // createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUser = ({ values, table }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    // updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    data,
    columns,
    // enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: true,
    enableSorting: true,
    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.background.default, //change default background color
    }),
    // muiTableBodyRowProps: { hover: false },
    muiTableProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
        fontStyle: 'italic',
        fontWeight: 'normal',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
      },
    },
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    createDisplayMode: 'row', //default ('modal', 'row', and 'custom' are also available)
    editDisplayMode: 'table', //default ('modal', 'row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: true
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        {addButtonLabel}
      </Button>
    ),
    state: {
      isLoading: false,
      isSaving: false,
      showAlertBanner: false,
      showProgressBars: false,
      // isLoading: isLoadingUsers,
      // isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      // showAlertBanner: isLoadingUsersError,
      // showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default PagedEditableTable;

PagedEditableTable.propTypes = {
  cols: PropTypes.object.isRequired,
  columnEditProps: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  addButtonLabel: PropTypes.object.isRequired,
}


//CREATE hook (post new user to api)
// function useCreateUser() {
//   // const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       //send api update request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
//       return Promise.resolve();
//     },
//     //client side optimistic update
//     onMutate: (newUserInfo) => {
//       queryClient.setQueryData(['users'], (prevUsers) => [
//         ...prevUsers,
//         {
//           ...newUserInfo,
//           id: (Math.random() + 1).toString(36).substring(7),
//         },
//       ]);
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
//   });
// }
//
// //READ hook (get users from api)
// function useGetUsers() {
//   return useQuery({
//     queryKey: ['users'],
//     queryFn: async () => {
//       //send api request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
//       return Promise.resolve(fakeData);
//     },
//     refetchOnWindowFocus: false,
//   });
// }
//
// //UPDATE hook (put user in api)
// function useUpdateUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (user) => {
//       //send api update request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
//       return Promise.resolve();
//     },
//     //client side optimistic update
//     onMutate: (newUserInfo) => {
//       queryClient.setQueryData(['users'], (prevUsers) =>
//         prevUsers?.map((prevUser) =>
//           prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
//         ),
//       );
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
//   });
// }
//
// //DELETE hook (delete user in api)
// function useDeleteUser() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (userId) => {
//       //send api update request here
//       await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
//       return Promise.resolve();
//     },
//     //client side optimistic update
//     onMutate: (userId) => {
//       queryClient.setQueryData(['users'], (prevUsers) =>
//         prevUsers?.filter((user) => user.id !== userId),
//       );
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
//   });
// }
//
// const queryClient = new QueryClient();

// const ExampleWithProviders = () => (
//   //Put this with your other react-query providers near root of your app
//   <QueryClientProvider client={queryClient}>
//     <PagedEditableTable />
//   </QueryClientProvider>
// );

// export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUser(user) {
  return {
    firstName: !validateRequired(user.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
    email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
  };
}
