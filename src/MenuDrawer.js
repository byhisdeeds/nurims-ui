import * as React from 'react';
import {styled} from '@mui/material/styles';
// import {makeStyles} from '@mui/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppMenuItem from "./AppMenuItem";

const drawerWidth = 300;

// const useStyles = makeStyles(theme =>
//   createStyles({
//     appMenu: {
//       width: '100%',
//     },
//     navList: {
//       width: drawerWidth,
//     },
//     menuItem: {
//       width: drawerWidth,
//     },
//     menuItemIcon: {
//       color: '#97c05c',
//     },
//   }),
// )

const openedMixin = (theme) => ({
  width: drawerWidth,
  top: 64,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  top: 64,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MenuDrawer(props) {
  // const classes = useStyles()

  // const toggleSubMenu = () => {
  //   setOpen(!open);
  // };
  //
  // const handleMenuClose = () => {
  //   setOpen(false);
  // };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={props.open} style={{top: 64}}>
        <List component="nav" disablePadding>
          {props.menuItems.map((item, index) => (
            <AppMenuItem {...item} key={index} user={props.user} organisation={props.organisation} onClick={props.onClick} />
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {props.children}
      </Box>
    </Box>
  );
}
