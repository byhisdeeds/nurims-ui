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
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import {styled} from '@mui/material/styles';
import MenuDrawer from "./MenuDrawer";
import {darkTheme, lightTheme} from "./utils/Theme";
import {ThemeProvider} from "@mui/material/styles";
import {MenuData} from "./menudata";
import {NetworkCheck} from "@mui/icons-material";
import metadata from './metadata.json';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import BusyIndicator from "./components/BusyIndicator";
import "./App.css"
import {setPropertyValue} from "./utils/PropertyUtils";
import {
  CMD_GET_SYSTEM_PROPERTIES,
  CMD_GET_ORGANISATION,
  CMD_SET_SYSTEM_PROPERTIES,
  CMD_BACKGROUND_TASKS
} from "./utils/constants";
import {ConsoleLog, UserDebugContext} from "./utils/UserDebugContext";

const {v4: uuid} = require('uuid');
const Constants = require('./utils/constants');
const MyAccount = lazy(() => import('./pages/account/MyAccount'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const AddEditPersonnel = lazy(() => import('./pages/personnel/AddEditPersonnel'));
const UpdateMonitoringStatus = lazy(() => import('./pages/personnel/UpdateMonitoringStatus'));
const ViewPersonnelRecords = lazy(() => import('./pages/personnel/ViewPersonnelRecords'));
const PersonnelDosimetryMeasurement = lazy(() => import('./pages/radiationprotection/PersonnelDosimetryMeasurement'));
const MonitorDosimetryMeasurement = lazy(() => import('./pages/radiationprotection/MonitorDosimetryMeasurement'));
const Manufacturer = lazy(() => import('./pages/controlledmaterials/Manufacturer'));
const Storage = lazy(() => import('./pages/controlledmaterials/Storage'));
const Material = lazy(() => import('./pages/controlledmaterials/Material'));
const ViewMaterialsList = lazy(() => import('./pages/controlledmaterials/ViewMaterialsList'));
const GenerateMaterialSurveillanceSheet = lazy(() => import('./pages/controlledmaterials/GenerateMaterialSurveillanceSheet'));
const AddEditSSC = lazy(() => import('./pages/maintenance/AddEditSSC'));
const AddEditAMP = lazy(() => import('./pages/maintenance/AddEditAMP'));
const ViewSSCRecords = lazy(() => import('./pages/maintenance/ViewSSCRecords'));
const AddEditMonitors = lazy(() => import('./pages/radiationprotection/AddEditMonitors'));
const ManageUsers = lazy(() => import('./pages/sysadmin/ManageUsers'));
const ImportICENSPersonnel = lazy(() => import('./pages/packages/icens/ImportICENSPersonnel'));
const ImportICENSControlledMaterialManufacturers = lazy(() => import('./pages/packages/icens/ImportICENSControlledMaterialManufacturers'));
const ImportICENSControlledMaterials = lazy(() => import('./pages/packages/icens/ImportICENSControlledMaterials'));
const ImportICENSControlledMaterialStorageLocations = lazy(() => import('./pages/packages/icens/ImportICENSControlledMaterialStorageLocations'));
const ImportICENSMonitors = lazy(() => import('./pages/packages/icens/ImportICENSMonitors'));
const AddEditReactorOperatingRuns = lazy(() => import('./pages/packages/icens/AddEditReactorOperatingRuns'));
const AddEditIrradiatedSamples = lazy(() => import('./pages/packages/icens/AddEditIrradiatedSamples'));
const ReactorOperationsReport = lazy(() => import('./pages/packages/icens/ReactorOperationsReport'));
const AddEditReactorWaterSamples = lazy(() => import('./pages/packages/icens/AddEditReactorWaterSamples'));

const drawerWidth = 300;
const DEBUG_LEVEL = 9;

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

const NetworkConnection = (ready) => {
  return (
    <Tooltip title="Network connection to system server">
      <NetworkCheck sx={{
        color: ready ? '#4CAF50' : '#F44336',
        paddingLeft: '10px',
        marginLeft: '10px',
        width: 32,
        height: 32
      }}/>
    </Tooltip>
  )
}

const BackgroundTasks = (background_tasks_active) => {
  if (background_tasks_active) {
    return (
      <Tooltip title="Background tasks active.">
        { <HourglassFullIcon sx={{color: '#ffb431', paddingLeft: '10px', marginLeft: '10px', width: 32, height: 32}}/> }
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title="No background tasks active.">
        { <HourglassEmptyIcon sx={{color: '#838383', paddingLeft: '10px', marginLeft: '10px', width: 32, height: 32}}/> }
      </Tooltip>
    )
  }
}

const SysAdminResourcePackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.SYSADMIN_MANAGE_USERS) {
    return (<ManageUsers
      ref={crefs["ManageUsers"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

const HumanResourcePackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.HR_ADD_EDIT_PERSONNEL) {
    return (<AddEditPersonnel
      ref={crefs["AddEditPersonnel"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.HR_UPDATE_MONITORING_STATUS) {
    return (<UpdateMonitoringStatus
      ref={crefs["UpdateMonitoringStatus"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.HR_VIEW_PERSONNEL_RECORDS) {
    return (<ViewPersonnelRecords
      ref={crefs["ViewPersonnelRecords"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

const ControlledMaterialPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.CM_VIEW_CONTROLLED_MATERIALS_LIST) {
    return (<ViewMaterialsList
      ref={crefs["ViewMaterialsList"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL) {
    return (<Material
      ref={crefs["Material"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL_STORAGE_LOCATION) {
    return (<Storage
      ref={crefs["Storage"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.CM_REGISTER_CONTROLLED_MATERIAL_MANUFACTURER) {
    return (<Manufacturer
      ref={crefs["Manufacturer"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.CM_GENERATE_MATERIAL_SURVEILLANCE_SHEET) {
    return (<GenerateMaterialSurveillanceSheet
      ref={crefs["GenerateMaterialSurveillanceSheet"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

const SSCPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.SSC_VIEW_SSC_RECORDS) {
    return (<ViewSSCRecords
      ref={crefs["ViewSSCRecords"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.SSC_ADD_EDIT_SSC_AMP) {
    return (<AddEditAMP
      ref={crefs["AddEditAMP"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.SSC_ADD_EDIT_SSC) {
    return (<AddEditSSC
      ref={crefs["AddEditSSC"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

const RadiationProtectionPackages = (actionid, crefs, menuTitle, user, handleMenuAction, send, properties) => {
  if (actionid === Constants.BASIC_RP_ADD_EDIT_MONITORS) {
    return (<AddEditMonitors
      ref={crefs["AddEditMonitors"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RP_ADD_EDIT_PERSONNEL_DOSIMETRY_MEASUREMENTS) {
    return (<PersonnelDosimetryMeasurement
      ref={crefs["PersonnelDosimetryMeasurement"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RP_ADD_EDIT_MONITOR_DOSIMETRY_MEASUREMENTS) {
    return (<MonitorDosimetryMeasurement
      ref={crefs["MonitorDosimetryMeasurement"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
}

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
  else if (actionid === Constants.PRO_IMPORT_ICENS_CONTROLLED_MATERIAL_STORAGE_LOCATIONS) {
    return (<ImportICENSControlledMaterialStorageLocations
      ref={crefs["ImportICENSControlledMaterialStorageLocations"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.PRO_IMPORT_ICENS_CONTROLLED_MATERIALS) {
    return (<ImportICENSControlledMaterials
      ref={crefs["ImportICENSControlledMaterials"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.PRO_IMPORT_ICENS_MONITORS) {
    return (<ImportICENSMonitors
      ref={crefs["ImportICENSMonitors"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_ADD_EDIT_REACTOR_OPERATING_RUN_RECORDS) {
    return (<AddEditReactorOperatingRuns
      ref={crefs["AddEditReactorOperatingRuns"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_ADD_EDIT_IRRADIATED_SAMPLES_DATA) {
    return (<AddEditIrradiatedSamples
      ref={crefs["AddEditIrradiatedSamples"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_REACTOR_OPERATIONS_REPORT) {
    return (<ReactorOperationsReport
      ref={crefs["ReactorOperationsReport"]}
      title={menuTitle}
      user={user}
      onClick={handleMenuAction}
      send={send}
      properties={properties}
    />)
  }
  else if (actionid === Constants.RO_ADD_EDIT_REACTOR_WATER_SAMPLES) {
    return (<AddEditReactorWaterSamples
      ref={crefs["AddEditReactorWaterSamples"]}
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
      background_tasks_active: false,
    };
    this.properties = [];
    this.menuTitle = "";
    this.ws = null;
    this.mounted = false;
    this.user = this.props.authService;
    this.crefs = {
      "MyAccount": React.createRef(),
      "Settings": React.createRef(),
      "ManageUsers": React.createRef(),
      "AddEditPersonnel": React.createRef(),
      "UpdateMonitoringStatus": React.createRef(),
      "ViewPersonnelRecords": React.createRef(),
      "MonitorDosimetryMeasurement": React.createRef(),
      "PersonnelDosimetryMeasurement": React.createRef(),
      "Manufacturer": React.createRef(),
      "Storage": React.createRef(),
      "Material": React.createRef(),
      "ViewMaterialsList": React.createRef(),
      "GenerateMaterialSurveillanceSheet": React.createRef(),
      "AddEditSSC": React.createRef(),
      "AddEditAMP": React.createRef(),
      "ViewSSCRecords": React.createRef(),
      "AddEditMonitors": React.createRef(),
      "ImportICENSPersonnel": React.createRef(),
      "ImportICENSControlledMaterialManufacturers": React.createRef(),
      "ImportICENSControlledMaterialStorageLocations": React.createRef(),
      "ImportICENSControlledMaterials": React.createRef(),
      "AddEditReactorOperatingRuns": React.createRef(),
      "AddEditIrradiatedSamples": React.createRef(),
      "ReactorOperationsReport": React.createRef(),
      "AddEditReactorWaterSamples": React.createRef(),
    };
  }


  componentDidMount() {
    this.mounted = true;
    // Everything here is fired on component mount.
    // this.ws = new ReconnectingWebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}/nurimsws`);
    this.ws = new ReconnectingWebSocket(this.props.wsep);
    this.ws.onopen = (event) => {
      if (DEBUG_LEVEL > 2) {
        ConsoleLog("App", "ws.onopen", "websocket connection established");
      }
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
      ConsoleLog("App", "ws.onerror", error);
      this.setState({ready: false});
    };
    this.ws.onclose = (event) => {
      if (DEBUG_LEVEL > 2) {
        ConsoleLog("App", "ws.onclose", "websocket connection closed", event);
      }
      if (this.mounted) {
        this.setState({ready: false, busy: 0});
      }
    };
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (DEBUG_LEVEL > 5) {
        ConsoleLog("App", "onmessage", data);
      }
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
      } else if (data.cmd === CMD_BACKGROUND_TASKS) {
        this.setState({background_tasks_active: data.hasOwnProperty("tasks_active")});
        return;
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
    const {theme, org, ready, menuData, actionid, open, busy, background_tasks_active} = this.state;
    return (
      <UserDebugContext.Provider value={{debug: DEBUG_LEVEL, user: this.user}}>
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
                { BackgroundTasks(background_tasks_active) }
                { NetworkConnection(ready) }
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
                  {SysAdminResourcePackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {SSCPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {ControlledMaterialPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {HumanResourcePackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {RadiationProtectionPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {IcensPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  <Typography paragraph>
                    {actionid}
                  </Typography>
                </Box>
              </Suspense>
            </MenuDrawer>
          </Box>
        </ThemeProvider>
      </UserDebugContext.Provider>
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
