import React, {Suspense, lazy} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import PropTypes from 'prop-types'
import {
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import AccountMenu from "./user/AccountMenu";
import {styled} from '@mui/material/styles';
import MenuDrawer from "./MenuDrawer";
import {darkTheme, lightTheme} from "./utils/Theme";
import {ThemeProvider} from "@mui/material/styles";
import {MenuData} from "./menudata";
import SelectOrganisation from "./components/SelectOrganisation";
import {NetworkCheck} from "@mui/icons-material";
import metadata from './metadata.json';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import BusyIndicator from "./components/BusyIndicator";
import "./App.css"
import {grey} from "@mui/material/colors";
import {setPropertyValue} from "./utils/PropertyUtils";
import {
  CMD_GET_SYSTEM_PROPERTIES,
  CMD_GET_ORGANISATION,
  CMD_SET_SYSTEM_PROPERTIES
} from "./utils/constants";
import {SelectFormControl} from "./components/CommonComponents";

const {v4: uuid} = require('uuid');
const Constants = require('./utils/constants');
const MyAccount = lazy(() => import('./pages/account/MyAccount'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const AddEditPersonnel = lazy(() => import('./pages/personnel/AddEditPersonnel'));
const UpdateMonitoringStatus = lazy(() => import('./pages/personnel/UpdateMonitoringStatus'));
const ViewPersonnelRecords = lazy(() => import('./pages/personnel/ViewPersonnelRecords'));
const AddDosimetryMeasurement = lazy(() => import('./pages/radiationprotection/AddDosimetryMeasurement'));
const Manufacturer = lazy(() => import('./pages/controlledmaterials/Manufacturer'));
const Storage = lazy(() => import('./pages/controlledmaterials/Storage'));
const Material = lazy(() => import('./pages/controlledmaterials/Material'));
const ViewMaterialsList = lazy(() => import('./pages/controlledmaterials/ViewMaterialsList'));
const SSC = lazy(() => import('./pages/maintenance/SSC'));
const AMP = lazy(() => import('./pages/maintenance/AMP'));
const ViewSSCRecords = lazy(() => import('./pages/maintenance/ViewSSCRecords'));
const ImportICENSPersonnel = lazy(() => import('./pages/packages/icens/ImportICENSPersonnel'));
const ImportICENSControlledMaterialManufacturers = lazy(() => import('./pages/packages/icens/ImportICENSControlledMaterialManufacturers'));

const drawerWidth = 300;


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
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

const StyledBox = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({theme}) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

const IcensPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.PRO_IMPORT_ICENS_PERSONNEL) {
    return (<ImportICENSPersonnel
      ref={crefs["ImportICENSPersonnel"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_MANUFACTURERS) {
    return (<ImportICENSControlledMaterialManufacturers
      ref={crefs["ImportICENSControlledMaterialManufacturers"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actionid: '',
      open: true,
      theme: localStorage.getItem("theme") || "light",
      menuData: MenuData,
      org: {name: "", authorized_module_level: ""},
      ready: false,
      busy: 0,
    };
    this.properties = [];
    this.menuTitle = "";
    this.ws = null;
    this.mounted = false;
    this.user = this.props.authService;
    this.crefs = {
      "MyAccount": React.createRef(),
      "Settings": React.createRef(),
      "AddEditPersonnel": React.createRef(),
      "UpdateMonitoringStatus": React.createRef(),
      "ViewPersonnelRecords": React.createRef(),
      "AddDosimetryMeasurement": React.createRef(),
      "Manufacturer": React.createRef(),
      "Storage": React.createRef(),
      "Material": React.createRef(),
      "ViewMaterialsList": React.createRef(),
      "SSC": React.createRef(),
      "AMP": React.createRef(),
      "ViewSSCRecords": React.createRef(),
      "ImportICENSPersonnel": React.createRef(),
      "ImportICENSControlledMaterialManufacturers": React.createRef(),
    };
  }


  componentDidMount() {
    this.mounted = true;
    // Everything here is fired on component mount.
    // this.ws = new ReconnectingWebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}/nurimsws`);
    this.ws = new ReconnectingWebSocket(this.props.wsep);
    this.ws.onopen = (event) => {
      console.log('websocket connection established.');
      this.setState({ready: true});
      // load organisation database on server
      this.send({
        cmd: CMD_GET_ORGANISATION,
      })
      // load system properties
      this.send({
        cmd: CMD_GET_SYSTEM_PROPERTIES,
      })
    };
    this.ws.onerror = (error) => {
      console.log(`websocket error - ${JSON.stringify(error)}`);
      this.setState({ready: false});
    };
    this.ws.onclose = (event) => {
      console.log('websocket connection closed.', JSON.stringify(event));
      if (this.mounted) {
        this.setState({ready: false, busy: 0});
      }
    };
    this.ws.onmessage = (event) => {
      // console.log("RESPONSE >>>", event.data)
      const data = JSON.parse(event.data);
      console.log("RESPONSE-DATA >>>", data)
      if (data.hasOwnProperty('module')) {
        for (const [k, v] of Object.entries(this.crefs)) {
          if (k === data.module) {
            if (v.current) {
              v.current.ws_message(data)
            }
          }
        }
      } else if (data.cmd === CMD_GET_ORGANISATION) {
        this.setState({org: data.response.org});
      } else if (data.cmd === CMD_GET_SYSTEM_PROPERTIES) {
        if (data.hasOwnProperty("response")) {
          for (const property of data.response.properties) {
            setPropertyValue(this.properties, property.name, property.value);
          }
        }
      } else if (data.cmd === CMD_SET_SYSTEM_PROPERTIES) {
        if (data.hasOwnProperty("response")) {
          const property = data.response.property;
          setPropertyValue(this.properties, property.name, property.value);
        }
      }
      this.setState({busy: this.state.busy - 1});
    };
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.state.ready) {
      this.ws.close();
    }
  }

  send = (msg) => {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify({
        uuid: uuid(),
        ...msg
      }));
      // this.setState({ busy: this.state.busy + 1 });
      this.setState(pstate => {
        return {busy: pstate.busy + 1}
      });
    }
  };

  handleMenuAction = (link, title) => {
    // console.log("menu action link, title->", link, title)
    // console.log("+++ typeof link, typeof title", typeof link, typeof title)
    if (link && typeof link === "object") {
      this.menuTitle = link.target.dataset.title ? link.target.dataset.title : "";
      this.setState({actionid: link.target.id});
    } else if (link && typeof link === "string") {
      if (link === 'set-light-theme') {
        this.setState({theme: 'light'});
        localStorage.setItem("theme", 'light');
      } else if (link === 'set-dark-theme') {
        this.setState({theme: 'dark'});
        localStorage.setItem("theme", 'dark');
      } else if (link && title) {
        // console.log(">> link, title", link, title)
        this.menuTitle = title ? title : "";
        this.setState({actionid: link});
      }
    }
  };

  toggleMenuDrawer = () => {
    this.setState({open: !this.state.open});
  };

  // handleOrganisationSelected = (_org) => {
  //   if (typeof _org === 'object') {
  //     this.setState({ menuData: MenuData, org: _org });
  //     // load organisation database on server
  //     this.send({
  //       cmd: CMD_SET_ORG_DB,
  //       org: _org,
  //     })
  //     // load system properties
  //     this.send({
  //       cmd: CMD_GET_SYSTEM_PROPERTIES,
  //     })
  //   }
  // };

  render() {
    const {theme, org, ready, menuData, actionid, open, busy} = this.state;
    return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <Box sx={{flexGrow: 1}}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            theme={'dark'}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <AppBar position="static">
            <Toolbar>
              <IconButton
                onClick={this.toggleMenuDrawer}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{mr: 2}}
              >
                <MenuIcon/>
              </IconButton>
              <Tooltip
                title={`Build ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`}
                placement={"bottom-start"}
                arrow
              >
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                  NURIMS
                </Typography>
              </Tooltip>
              <Typography variant="h6" component="div">
                Organisation: {org.name.toUpperCase()}
              </Typography>
              <AccountMenu user={this.user} onClick={this.handleMenuAction}/>
              <Tooltip title="Network connection to system server">
                <NetworkCheck sx={{
                  color: ready ? '#4CAF50' : '#F44336',
                  paddingLeft: '10px',
                  marginLeft: '10px',
                  width: 32,
                  height: 32
                }}/>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <MenuDrawer open={open} onClick={this.handleMenuAction} menuItems={menuData} user={this.user}
                      organisation={org}>
            <Suspense fallback={<BusyIndicator open={true} loader={"pulse"} size={30}/>}>
              <Box sx={{p: 3}}>
                <BusyIndicator open={busy > 0} loader={"pulse"} size={40}/>
                {actionid === Constants.MY_ACCOUNT &&
                  <MyAccount
                    ref={this.crefs["MyAccount"]}
                    title={this.menuTitle}
                    user={this.user}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.SETTINGS &&
                  <Settings
                    ref={this.crefs["Settings"]}
                    title={this.menuTitle}
                    user={this.user}
                    theme={theme}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.HR_ADD_EDIT_PERSONNEL &&
                  <AddEditPersonnel
                    ref={this.crefs["AddEditPersonnel"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.RP_ADD_DOSIMETRY_MEASUREMENT &&
                  <AddDosimetryMeasurement
                    ref={this.crefs["AddDosimetryMeasurement"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.HR_UPDATE_MONITORING_STATUS &&
                  <UpdateMonitoringStatus
                    ref={this.crefs["UpdateMonitoringStatus"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.HR_VIEW_PERSONNEL_RECORDS &&
                  <ViewPersonnelRecords
                    ref={this.crefs["ViewPersonnelRecords"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL_MANUFACTURER &&
                  <Manufacturer
                    ref={this.crefs["Manufacturer"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL_STORAGE_LOCATION &&
                  <Storage
                    ref={this.crefs["Storage"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL &&
                  <Material
                    ref={this.crefs["Material"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.CM_VIEW_CONTROLLED_MATERIALS_LIST &&
                  <ViewMaterialsList
                    ref={this.crefs["ViewMaterialsList"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.SSC_ADD_EDIT_SSC &&
                  <SSC
                    ref={this.crefs["SSC"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.SSC_ADD_EDIT_SSC_AMP &&
                  <AMP
                    ref={this.crefs["AMP"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {actionid === Constants.SSC_VIEW_SSC_RECORDS &&
                  <ViewSSCRecords
                    ref={this.crefs["ViewSSCRecords"]}
                    title={this.menuTitle}
                    user={this.user}
                    onClick={this.handleMenuAction}
                    send={this.send}
                    properties={this.properties}
                  />}
                {IcensPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                {/*{actionid === Constants.PRO_IMPORT_ICENS_PERSONNEL &&*/}
                {/*  <ImportICENSPersonnel*/}
                {/*    ref={this.crefs["ImportICENSPersonnel"]}*/}
                {/*    title={this.menuTitle}*/}
                {/*    user={this.user}*/}
                {/*    onClick={this.handleMenuAction}*/}
                {/*    send={this.send}*/}
                {/*    properties={this.properties}*/}
                {/*  />}*/}
                <Typography paragraph>
                  {actionid}
                </Typography>
              </Box>
            </Suspense>
          </MenuDrawer>
        </Box>
      </ThemeProvider>
    )
  }
}

App.propTypes = {
  authService: PropTypes.object.isRequired,
  wsep: PropTypes.string.isRequired,
}

export default App
// export default withAuth0(withAuthenticationRequired(App, {
//   onRedirecting: () => <BusyIndicator open={true} loader={"ring"}/>,
// }));
