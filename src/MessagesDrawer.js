// import * as React from 'react';
// import {styled} from '@mui/material/styles';
// // import {makeStyles} from '@mui/styles';
// import Box from '@mui/material/Box';
// import MuiDrawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import CssBaseline from '@mui/material/CssBaseline';
// import Divider from '@mui/material/Divider';
// import AppMenuItem from "./AppMenuItem";
// import Button from "@mui/material/Button";
// import {AppBar, Grid, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography} from "@mui/material";
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import ExpandIcon from '@mui/icons-material/Expand';
//
// const drawerHeight = 300;
// const shortWindowHeight = 48;
// const tallWindowHeight = 300;
//
// // const useStyles = makeStyles(theme =>
// //   createStyles({
// //     appMenu: {
// //       width: '100%',
// //     },
// //     navList: {
// //       width: drawerWidth,
// //     },
// //     menuItem: {
// //       width: drawerWidth,
// //     },
// //     menuItemIcon: {
// //       color: '#97c05c',
// //     },
// //   }),
// // )
//
// const openedMixin = (theme) => ({
//   height: tallWindowHeight,
//   // transition: theme.transitions.create('height', {
//   //   easing: theme.transitions.easing.sharp,
//   //   duration: theme.transitions.duration.enteringScreen,
//   // }),
//   overflowX: 'hidden',
// });
//
// const closedMixin = (theme) => ({
//   height: shortWindowHeight,
//   // transition: theme.transitions.create('height', {
//   //   easing: theme.transitions.easing.sharp,
//   //   duration: theme.transitions.duration.leavingScreen,
//   // }),
//   overflowX: 'hidden',
// });
//
// const Drawer = styled(MuiDrawer)(
//   ({ theme, opened }) => ({
//     flexShrink: 0,
//     whiteSpace: 'nowrap',
//     boxSizing: 'border-box',
//     ...(opened && {
//       ...openedMixin(theme),
//       '& .MuiDrawer-paper': openedMixin(theme),
//     }),
//     ...(!opened && {
//       ...closedMixin(theme),
//       '& .MuiDrawer-paper': closedMixin(theme),
//     }),
//   }),
// );
//
// export default function MessagesDrawer(props) {
//   const [opened, setOpened] = React.useState(true);
//
//   const toggleWindow = () => {
//     console.log("toggle", !opened)
//     setOpened(!opened)
//   }
//
//   return (
//     <Drawer variant="permanent"
//             anchor="bottom"
//             ModalProps={{
//               keepMounted: true,
//             }}
//             open={true}
//             opened={opened}
//     >
//       <Box component={"main"} sx={{ display: 'flex' }}>
//         <CssBaseline />
//         <Box
//           component="main"
//           sx={{ flexGrow: 1,  p: 1 }}
//         >
//           {props.children}
//         </Box>
//         <Box>
//           <List>
//             <ListItemButton sx={{ m: 0, p: 0 }} onClick={toggleWindow}>
//               <ListItemIcon sx={{ minWidth: 0 }}>
//                 <ExpandIcon />
//               </ListItemIcon>
//             </ListItemButton>
//           </List>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// }
