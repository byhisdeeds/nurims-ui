import * as React from 'react';
import {withTheme} from "@mui/styles";
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppMenuItem from "./AppMenuItem";
import PropTypes from 'prop-types'
// import SideMenu from "react-sidemenu/dist/SideMenu";
import DrawerMenu from "./components/DrawerMenu";
import {MenuItems} from "./menudata";

const drawerWidth = 300;

const openedMixin = (theme) => ({
  width: drawerWidth,
  top: 64,
  height: 'calc(100vh - 64px)',
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
  height: 'calc(100vh - 64px)',
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

MenuDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  menuItems: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  organisation: PropTypes.object.isRequired,
}


// =========================================================================================================

const items = [
  {divider: true, label: 'Segment 1', value: 'segment1'},
  {label: 'Item 1', value: 'item1', icon: 'fa-search',
    children: [
      {label: 'Item 1.1', value: 'item1.1', icon: 'fa-snapchat',
        children: [
          {label: 'Item 1.1.1', value: 'item1.1.1', icon: 'fa-anchor'},
          {label: 'Item 1.1.2', value: 'item1.1.2', icon: 'fa-bar-chart'}]},
      {label: 'Item 1.2', value: 'item1.2'}]},
  {label: 'Item 2', value: 'item2', icon: 'fa-automobile',
    children: [
      {label: 'Item 2.1', value: 'item2.1',
        children: [
          {label: 'Item 2.1.1', value: 'item2.1.1'},
          {label: 'Item 2.1.2', value: 'item2.1.2'}]},
      {label: 'Item 2.2', value: 'item2.2'}]},
  {divider: true, label: 'Segment 2', value: 'segment2'},
  {label: 'Item 3', value: 'item3', icon: 'fa-beer'}
];

function onMenuItemClicked(item, extras) {
  console.log("$$$$$$$$$ ON MENU ITEM CLICKED $$$$$$$$$$$$$$$")
  console.log(item, extras)
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$")
}
// =========================================================================================================


function MenuDrawer(props) {

  return (
    <Box sx={{ display: 'flex', overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={props.open}
        style={{top: 64}}
      >
        {/*<List component="nav" disablePadding>*/}
        {/*  {props.menuItems.map((item, index) => (*/}
        {/*    <AppMenuItem*/}
        {/*      {...item}*/}
        {/*      root={item.hasOwnProperty("root")}*/}
        {/*      key={index}*/}
        {/*      user={props.user}*/}
        {/*      organisation={props.organisation}*/}
        {/*      onClick={props.onClick}*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</List>*/}
        <DrawerMenu
          items={MenuItems}
          reverse={false}
          // onMenuItemClick={onMenuItemClicked}
          onMenuItemClick={props.onClick}
        />
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, }}>
        {props.children}
      </Box>
    </Box>
  );
}

export default withTheme(MenuDrawer)