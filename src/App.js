import React, {Suspense, lazy} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import PropTypes from 'prop-types'
import {
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import AccountMenu from "./user/AccountMenu";
import {styled} from '@mui/material/styles';
import MenuDrawer from "./MenuDrawer";
import {darkTheme, lightTheme} from "./utils/Theme";
import {ThemeProvider} from "@mui/material/styles";
import {MenuData} from "./menudata";
import {SnackbarProvider} from "notistack";
import metadata from './metadata.json';
import BusyIndicator from "./components/BusyIndicator";
import "./App.css"
import {setPropertyValue} from "./utils/PropertyUtils";
import {
  CMD_GET_SYSTEM_PROPERTIES,
  CMD_GET_ORGANISATION,
  CMD_SET_SYSTEM_PROPERTIES,
  CMD_BACKGROUND_TASKS, CMD_PING
} from "./utils/constants";
import {ConsoleLog, UserDebugContext} from "./utils/UserDebugContext";
import {
  SSCPackages,
  SysAdminResourcePackages,
  HumanResourcePackages,
  ControlledMaterialPackages,
  RadiationProtectionPackages,
  IcensPackages,
  SupportPackages,
  RasaPackages
} from "./pages/pagepackages";
import {MONITORDOSIMETRYMEASUREMENT_REF} from "./pages/radiationprotection/MonitorDosimetryMeasurement"
import {PERSONNELDOSIMETRYMEASUREMENT_REF} from "./pages/radiationprotection/PersonnelDosimetryMeasurement"
import {PERSONNELDOSIMETRYREPORT_REF} from "./pages/radiationprotection/PersonnelDosimetryReport"
import {MANUFACTURER_REF} from "./pages/controlledmaterials/Manufacturer"
import {MATERIAL_REF} from "./pages/controlledmaterials/Material"
import {STORAGE_REF} from "./pages/controlledmaterials/Storage"
import {OWNER_REF} from "./pages/controlledmaterials/Owner"
import {ADDEDITPERSONNEL_REF} from "./pages/personnel/AddEditPersonnel"
import {VIEWPERSONNELRECORDS_REF} from "./pages/personnel/ViewPersonnelRecords"
import {ADDEDITSSC_REF} from "./pages/maintenance/AddEditSSC"
import {ADDEDITAMP_REF} from "./pages/maintenance/AddEditAMP"
import {VIEWSSCRECORDS_REF} from "./pages/maintenance/ViewSSCRecords"
import {GENERATEMATERIALSURVEILLANCESHEET_REF} from "./pages/controlledmaterials/GenerateMaterialSurveillanceSheet"
import {ADDEDITREACTORWATERSAMPLES_REF} from "./pages/operation/AddEditReactorWaterSamples"
import {ADDEDITIRRADIATEDSAMPLES_REF} from "./pages/operation/AddEditIrradiatedSamples"
import {REACTOROPERATIONSREPORT_REF} from "./pages/operation/ReactorOperationsReport"
import {ADDEDITREACTOROPERATINGRUNS_REF} from "./pages/operation/AddEditReactorOperatingRuns"
import {UPDATEMONITORINGSTATUS_REF} from "./pages/personnel/UpdateMonitoringStatus"
import {ADDEDITMONITORS_REF} from "./pages/radiationprotection/AddEditMonitors"
import {PERSONNELDOSIMETRYEVALUATION_REF} from "./pages/radiationprotection/PersonnelDosimetryEvaluation"
import {VIEWMATERIALSLIST_REF} from "./pages/controlledmaterials/ViewMaterialsList"
import {MANAGEUSERS_REF} from "./pages/sysadmin/ManageUsers"
import {
  ADD_EDIT_CORRECTIVE_MAINTENANCE_ISSUE_RECORD_REF
} from "./pages/maintenance/AddEditCorrectiveMaintenanceIssueRecord"
import {GENERATESSCMAINTENANCEREPORT_REF} from "./pages/maintenance/GenerateSSCMaintenanceReport"
import {
  ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF
} from "./pages/operation/AddEditReactorSampleIrradiationAuthorization"
import {
  GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF
} from "./pages/operation/GenerateReactorSampleIrradiationAuthorizationPdf"
import {CHATBOT_REF} from "./pages/rasa/ChatBot"
import {TERMSANDDEFINITIONS_REF} from "./pages/support/TermsAndDefinitions"
import LogWindow from "./components/LogWindow";
import {
  BackgroundTasks,
  LogWindowButton,
  NetworkConnection
} from "./components/CommonComponents";
import {DeviceUUID} from 'device-uuid';
import {enqueueWarningSnackbar} from "./utils/SnackbarVariants";

const Constants = require('./utils/constants');
const MyAccount = lazy(() => import('./pages/account/MyAccount'));
const Settings = lazy(() => import('./pages/settings/Settings'));

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
      log_window_visible: false,
    };
    this.debug = window.location.href.includes("debug");
    this.properties = [];
    this.menuTitle = "";
    this.ws = null;
    this.mounted = false;
    this.user = this.props.authService;
    this.uuid = new DeviceUUID().get();
    this.logRef = React.createRef();
    this.crefs = {};
    this.crefs["MyAccount"] = React.createRef();
    this.crefs["Settings"] = React.createRef();
    this.crefs["ImportICENSPersonnel"] = React.createRef();
    this.crefs["ImportICENSControlledMaterialManufacturers"] = React.createRef();
    this.crefs["ImportICENSControlledMaterialStorageLocations"] = React.createRef();
    this.crefs["ImportICENSControlledMaterials"] = React.createRef();
    this.crefs[MONITORDOSIMETRYMEASUREMENT_REF] = React.createRef();
    this.crefs[PERSONNELDOSIMETRYMEASUREMENT_REF] = React.createRef();
    this.crefs[PERSONNELDOSIMETRYREPORT_REF] = React.createRef();
    this.crefs[MANUFACTURER_REF] = React.createRef();
    this.crefs[OWNER_REF] = React.createRef();
    this.crefs[MATERIAL_REF] = React.createRef();
    this.crefs[STORAGE_REF] = React.createRef();
    this.crefs[ADDEDITPERSONNEL_REF] = React.createRef();
    this.crefs[VIEWPERSONNELRECORDS_REF] = React.createRef();
    this.crefs[ADDEDITSSC_REF] = React.createRef();
    this.crefs[ADD_EDIT_CORRECTIVE_MAINTENANCE_ISSUE_RECORD_REF] = React.createRef();
    this.crefs[ADDEDITAMP_REF] = React.createRef();
    this.crefs[VIEWSSCRECORDS_REF] = React.createRef();
    this.crefs[GENERATEMATERIALSURVEILLANCESHEET_REF] = React.createRef();
    this.crefs[ADDEDITREACTORWATERSAMPLES_REF] = React.createRef();
    this.crefs[ADDEDITIRRADIATEDSAMPLES_REF] = React.createRef();
    this.crefs[REACTOROPERATIONSREPORT_REF] = React.createRef();
    this.crefs[ADDEDITREACTOROPERATINGRUNS_REF] = React.createRef();
    this.crefs[UPDATEMONITORINGSTATUS_REF] = React.createRef();
    this.crefs[ADDEDITMONITORS_REF] = React.createRef();
    this.crefs[PERSONNELDOSIMETRYEVALUATION_REF] = React.createRef();
    this.crefs[VIEWMATERIALSLIST_REF] = React.createRef();
    this.crefs[MANAGEUSERS_REF] = React.createRef();
    this.crefs[GENERATESSCMAINTENANCEREPORT_REF] = React.createRef();
    this.crefs[ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF] = React.createRef();
    this.crefs[GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF] = React.createRef();
    this.crefs[GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF] = React.createRef();
    this.crefs[TERMSANDDEFINITIONS_REF] = React.createRef();
    this.crefs[CHATBOT_REF] = React.createRef();
  }


  componentDidMount() {
    this.mounted = true;
    ConsoleLog("App", "componentDidMount", `uuid: ${this.uuid}`);
    // Everything here is fired on component mount.
    // this.ws = new ReconnectingWebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}/nurimsws`);
    this.ws = new ReconnectingWebSocket(this.props.wsep+"?uuid="+this.uuid);
    this.ws.onopen = (event) => {
      if (this.debug) {
        ConsoleLog("App", "ws.onopen", "websocket connection established");
      }
      this.appendLog("Websocket connection established.");
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
      this.appendLog("Websocket error: " + JSON.stringify(error));
      this.setState({ready: false});
    };
    this.ws.onclose = (event) => {
      if (this.debug) {
        ConsoleLog("App", "ws.onclose", "websocket connection closed", event);
      }
      this.appendLog("Websocket connection closed: " + JSON.stringify(event));
      if (this.mounted) {
        this.setState({ready: false, busy: 0, background_tasks_active: false});
      }
    };
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.debug) {
        ConsoleLog("App", "onmessage", data);
      }
      if (data.hasOwnProperty("log_message") && data.log_message === "true") {
        this.appendLog(data.response);
        return;
      }
      if (data.cmd === CMD_PING) {
        this.send_pong();
      } else if (data.hasOwnProperty('module')) {
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
        this.setState({background_tasks_active: data.hasOwnProperty("tasks_active"), busy: 0});
        return;
      }
      if (data.show_busy) {
        this.setState({busy: this.state.busy - 1});
      }
    };
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.state.ready) {
      this.ws.close();
    }
  }

  send_pong = () => {
    const msg = {cmd: "pong"};
    if (this.ws && this.ws.readyState === 1) {
      if (this.debug) {
        ConsoleLog("App", "send", msg);
      }
      this.ws.send(JSON.stringify({
        ...msg
      }));
    }
  };

  send = (msg, show_busy) => {
    console.log("***** SEND *****", msg)
    if (this.debug) {
      ConsoleLog("App", "send", "ws.readyState",
        this.ws && this.ws.readyState ? this.ws.readyState : "undefined", "msg", msg);
    }
    if (this.ws && this.ws.readyState === 1) {
      const _show_busy = (show_busy === undefined) ? true : show_busy;
      this.ws.send(JSON.stringify({
        uuid: this.uuid,
        user: this.user,
        show_busy: _show_busy,
        ...msg
      }));
      if (_show_busy) {
        this.setState(pstate => {
          return {busy: pstate.busy + 1}
        });
      }
    } else {
      enqueueWarningSnackbar("NURIMS server connection broken!")
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

  toggleLogWindow = () => {
    this.setState({log_window_visible: !this.state.log_window_visible});
  }

  closeLogWindow = () => {
    this.setState({log_window_visible: false});
  }

  appendLog = (msg) => {
    if (this.logRef.current) {
      this.logRef.current.log(msg);
    }
  }

  render() {
    const {theme, org, ready, menuData, actionid, open, busy, background_tasks_active, log_window_visible} = this.state;
    console.log("App.render, actionid", actionid)
    return (
      <UserDebugContext.Provider value={{debug: window.location.href.includes("debug"), user: this.user}}>
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
          <Box sx={{flexGrow: 1, height: "100%"}}>
            <SnackbarProvider
              autoHideDuration={2000}
              maxSnack={5}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
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
                <BackgroundTasks active={background_tasks_active}/>
                <NetworkConnection ready={ready}/>
                <LogWindowButton onClick={this.toggleLogWindow}/>
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
                    />
                  }
                  {RasaPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {SupportPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {SysAdminResourcePackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {SSCPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {ControlledMaterialPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {HumanResourcePackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {RadiationProtectionPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  {IcensPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                  <LogWindow
                    ref={this.logRef}
                    onClose={this.closeLogWindow}
                    visible={log_window_visible}
                    width={`${drawerWidth}px`}
                    height={350}
                  />
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
