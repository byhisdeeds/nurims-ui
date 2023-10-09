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
import DrawerMenu from "./components/DrawerMenu";

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
          items={props.menuItems}
          reverse={false}
          activeItem={"chat.bot"}
          collapse={true}
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