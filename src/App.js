import React, { Suspense, lazy } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useAuth0, withAuthenticationRequired} from '@auth0/auth0-react'
import 'react-json-pretty/themes/monikai.css';
import {Box, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import AccountMenu from "./user/AccountMenu";
import { styled } from '@mui/material/styles';
import MenuDrawer from "./MenuDrawer";
import LazyLoadingIndicator from './components/LazyLoadingIndicator';
import { darkTheme, lightTheme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { MenuData } from "./menudata";
import Settings from "./pages/settings/Settings";
import SelectOrganisation from "./components/SelectOrganisation";
import {NetworkCheck} from "@mui/icons-material";
import metadata from './metadata.json';

const {v4: uuid} = require('uuid');
const Constants = require('./constants');
// const MenuData = require('./menudata');

const MyAccount = lazy(() => import('./pages/account/MyAccount'));

const drawerWidth = 300;

const MODULE = "APP";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const organisation =
  {
    "name": "",
    "authorized_module_level": "",
    "role": ""
  }


const App = () => {
  const { user } = useAuth0()
  const [open, setOpen] = React.useState(true);
  const [actionid, setActionid] = React.useState("");
  const [theme, setTheme] = React.useState("light");
  const [menuData, setMenuData] = React.useState([]);
  const [org, setOrg] = React.useState(organisation);
  const [ready, setReady] = React.useState(false);
  const [wsock, setWsock] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [crefs, setCrefs] = React.useState({
    "MyAccount": React.createRef(),
    "Settings": React.createRef()
  });

  const handleMenuAction = (e) => {
    // console.log("menu action->", e.target.id)
    // console.log("menu action dataset->", e)
    // console.log("+++", typeof e)
    if (typeof e === "object") {
      setActionid(e.target.id)
    } else if (typeof e === "string") {
      if (e === 'set-light-theme') {
        setTheme('light')
      } else if (e === 'set-dark-theme') {
        setTheme('dark')
      } else {
        setActionid(e)
      }
    }
  };

  const toggleMenuDrawer = () => {
    console.log("OPEN=", open)
    setOpen(!open);
  };

  const handleOrganisationSelected = (_org) => {
    if (typeof org === 'object') {
      setMenuData(MenuData)
      setOrg(_org)
      // load server db with organisation database
      send({
        cmd: 'set_org_db',
        org: _org.name,
      })
    }
  };

  // Similar to componentDidMount/componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    setMounted(true);
    // Everything here is fired on component mount.
    const ws = new ReconnectingWebSocket(`${window.location.protocol === 'https:'?'wss':'ws'}://${window.location.hostname}:5000/nurimsws`);
    ws.onopen = (event) => {
      console.log('websocket connection established.');
      setReady(true);
    };
    ws.onerror = (error) => {
      console.log(`websocket error - ${error}`);
      setReady(false);
    };
    ws.onclose = (event) => {
      console.log('websocket connection closed.');
      if (mounted) {
        setReady(false);
      }
    };
    ws.onmessage = (event) => {
      // console.log("RESPONSE >>>", event.data)
      let data = JSON.parse(event.data);
      // console.log("RESPONSE-DATA >>>", data)
      for (const [k, v] of Object.entries(crefs)) {
        if (k === data.module) {
          if (v.current) {
            v.current.ws_message(data)
          }
        }
      }
    };
    setWsock(ws)
    return () => {
      // Everything here is fired on component unmount.
      setMounted(false);
    }
  }, [])

  const send = (msg) => {
    if (wsock && wsock.readyState === 1) {
      wsock.send(JSON.stringify({
        uuid: uuid(),
        module: MODULE,
        ...msg
      }));
    }
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={toggleMenuDrawer}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              NURIMS
            </Typography>
            <Typography variant="h6" component="div">
              Organisation: {org.name.toUpperCase()}
            </Typography>
            <AccountMenu user={user} onClick={handleMenuAction}/>
            <Tooltip title="Network connection to system server">
              <NetworkCheck sx={{ color: ready ? '#4CAF50' : '#F44336', paddingLeft: '10px', marginLeft: '10px', width: 32, height: 32 }} />
            </Tooltip>
          </Toolbar>
        </AppBar>
        {organisation.name === '' && <SelectOrganisation open={true} user={user} onSelect={handleOrganisationSelected}/>}
        <MenuDrawer open={open} onClick={handleMenuAction} menuItems={menuData} user={user} organisation={org}>
          <Suspense fallback={<LazyLoadingIndicator />}>
            { actionid === Constants.MY_ACCOUNT && <MyAccount ref={crefs["MyAccount"]} user={user} send={send}/> }
            { actionid === Constants.SETTINGS && <Settings ref={crefs["Settings"]} theme={theme} user={user} onClick={handleMenuAction} send={{send}}/> }
            <Typography paragraph>
              {actionid}
              PARAGRAPH 1 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
              enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
              imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
              Convallis convallis tellus id interdum velit laoreet id donec ultrices.
              Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
              adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
              nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
              leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
              feugiat vivamus at augue. At augue eget arcu dictum varius duis at
              consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
              sapien faucibus et molestie ac.
            </Typography>
          </Suspense>
        </MenuDrawer>
      </Box>
    </ThemeProvider>
  )
}

export default withAuthenticationRequired(App, {
  onRedirecting: () => <div> loading ...</div>,
});