import React, {Suspense, lazy} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import PropTypes from 'prop-types'
import {
  AppBar as MuiAppBar,
  Box,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountMenu from "./user/AccountMenu";
import {
  styled,
  ThemeProvider
} from '@mui/material/styles';
import MenuDrawer from "./components/MenuDrawer";
import {
  darkTheme,
  lightTheme
} from "./utils/Theme";
import BusyIndicator from "./components/BusyIndicator";
import {
  setPropertyValue
} from "./utils/PropertyUtils";
import {
  CMD_GET_SYSTEM_PROPERTIES,
  CMD_GET_ORGANISATION,
  CMD_SET_SYSTEM_PROPERTIES,
  CMD_BACKGROUND_TASKS,
  CMD_GET_SERVER_INFO,
  CMD_GET_USER_NOTIFICATION_MESSAGES,
  CMD_DELETE_USER_NOTIFICATION_MESSAGE,
  CMD_GET_USER_RECORDS,
  CMD_GET_SESSION_INFO,
  MY_ACCOUNT,
  SETTINGS,
  CMD_GET_GLOSSARY_TERMS,
  CMD_SET_LOGGING_LEVEL,
  CMD_INTERRUPT_BACKGROUND_TASK
} from "./utils/constants";
import {
  ConsoleLog,
  UserContext,
  UUID
} from "./utils/UserContext";
import {
  SSCPackages,
  SysAdminResourcePackages,
  HumanResourcePackages,
  ControlledMaterialPackages,
  RadiationProtectionPackages,
  IcensPackages,
  SupportPackages,
  OrgPackages,
  EmergencyPreparednessPackages
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
import {ADDEDITROUTINEMAINTENANCERECORDS_REF} from "./pages/maintenance/AddEditRoutineMaintenanceRecords"
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
import {MAINTENANCESCHEDULE_REF} from "./pages/maintenance/MaintenanceSchedule"
import {GENERATESSCMAINTENANCEREPORT_REF} from "./pages/maintenance/GenerateSSCMaintenanceReport"
import {
  ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF
} from "./pages/operation/AddEditReactorSampleIrradiationAuthorization"
import {
  GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF
} from "./pages/operation/GenerateReactorSampleIrradiationAuthorizationPdf"
import {TERMSANDDEFINITIONS_REF} from "./pages/support/TermsAndDefinitions"
import {UNDERDEVELOPMENT_REF} from "./components/UnderDevelopment"
import LogWindow from "./components/LogWindow";
import {VIEWAMPRECORDS_REF} from "./pages/maintenance/ViewAMPRecords";
import {CLEANUPLARGEOBJECTSTORE_REF} from "./pages/sysadmin/CleanupLargeObjectStore";
import {DISCOVERORPHANEDMETADATA_REF} from "./pages/sysadmin/DiscoverOrphanedMetadata";
import {ADDEDITMODIFICATIONRECORD_REF} from "./pages/maintenance/AddEditModificationRecord";
import {ADDEDITMAINTENANCERECORD_REF} from "./pages/maintenance/AddEditMaintenanceRecord";
import {SIGNIN_REF} from "./components/Signin";
import {SYSTEMCONFIGURATION_REF} from "./pages/sysadmin/SystemConfiguration";
import {OPERATINGRUNDATAMETRICS_REF} from "./pages/operation/OperatingRunDataMetrics";
import NotificationWindow from "./components/NotificationWindow";
import SystemInfoBadges from "./components/SystemInfoBadges";
import {
  BackgroundTasks,
  LogWindowButton,
  NetworkConnection,
  NotificationsButton
} from "./components/CommonComponents";
import {
  enqueueErrorSnackbar,
  enqueueConnectionSnackbar,
  enqueueWarningSnackbar
} from "./utils/SnackbarVariants";
import {
  closeSnackbar,
  SnackbarProvider
} from 'notistack'
import "./css/App.css"
import {
  MenuItems
} from "./menudata";
import metadata from './metadata.json';
import {
  isValidUserRole
} from "./utils/UserUtils";
import {
  getErrorMessage,
  isCommandResponse,
  isModuleMessage,
  isValidMessageSignature,
  messageResponseStatusOk
} from "./utils/WebsocketUtils";
import {
  setGlossaryTerms
} from "./utils/GlossaryUtils";
import {
  ConfirmInterruptBackgroundTaskDialog,
} from "./components/UtilityDialogs";
import LazyLoaderIndicator from "./components/LazyLoaderIndicator";

const MyAccount = lazy(() => import('./pages/account/MyAccount'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const SignIn = lazy(() => import("./components/Signin"));

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

// const AuthService = {
//   isAuthenticated: false,
//   from: "",
//   profile: {
//     id: -1,
//     username: "",
//     fullname: "",
//     authorized_module_level: "",
//     role: []
//   },
//   users: [],
//   authenticate(valid, profile) {
//     this.isAuthenticated = valid;
//     if (valid && profile) {
//       this.profile = profile;
//     }
//   },
//   logout() {
//     this.isAuthenticated = false;
//   }
// };

class App extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    console.log("INSIDE CONSTRUCTOR ......")
    super(props);
    this.state = {
      actionid: '',
      open: true,
      theme: localStorage.getItem("theme") || "light",
      menuData: MenuItems,
      ready: false,
      online: false,
      busy: 0,
      confirm_interrupt_background_task: false,
      background_tasks_active: false,
      log_window_visible: false,
      notification_window_visible: false,
      notification_window_anchor: null,
      num_unread_messages: 0,
      num_messages: 0,
    };
    // this.debug = window.location.href.includes("debug");
    this.puk = [];
    this.session_id = "";
    this.properties = [];
    this.glossary = {};
    this.menuTitle = "";
    this.ws = null;
    this.mounted = false;
    this.conn_snackbar_id = null;
    this.logs = []
    // this.user = AuthService;
    this.org = {name: "", authorized_module_level: ""};
    this.uuid = UUID(window.location.href.includes("renew"));
    this.logRef = React.createRef();
    this.notificationRef = React.createRef();
    this.sysinfoRef = React.createRef();
    this.crefs = {};
    this.crefs["MyAccount"] = React.createRef();
    this.crefs["Settings"] = React.createRef();
    this.crefs["ImportICENSPersonnel"] = React.createRef();
    this.crefs["ImportICENSControlledMaterialManufacturers"] = React.createRef();
    this.crefs["ImportICENSControlledMaterialStorageLocations"] = React.createRef();
    this.crefs["ImportICENSControlledMaterials"] = React.createRef();
    this.crefs[SIGNIN_REF] = React.createRef();
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
    this.crefs[ADDEDITAMP_REF] = React.createRef();
    this.crefs[VIEWSSCRECORDS_REF] = React.createRef();
    this.crefs[VIEWAMPRECORDS_REF] = React.createRef();
    this.crefs[ADDEDITROUTINEMAINTENANCERECORDS_REF] = React.createRef();
    this.crefs[GENERATEMATERIALSURVEILLANCESHEET_REF] = React.createRef();
    this.crefs[ADDEDITREACTORWATERSAMPLES_REF] = React.createRef();
    this.crefs[ADDEDITIRRADIATEDSAMPLES_REF] = React.createRef();
    this.crefs[ADDEDITMODIFICATIONRECORD_REF] = React.createRef();
    this.crefs[ADDEDITMAINTENANCERECORD_REF] = React.createRef();
    this.crefs[REACTOROPERATIONSREPORT_REF] = React.createRef();
    this.crefs[ADDEDITREACTOROPERATINGRUNS_REF] = React.createRef();
    this.crefs[UPDATEMONITORINGSTATUS_REF] = React.createRef();
    this.crefs[ADDEDITMONITORS_REF] = React.createRef();
    this.crefs[PERSONNELDOSIMETRYEVALUATION_REF] = React.createRef();
    this.crefs[VIEWMATERIALSLIST_REF] = React.createRef();
    this.crefs[MANAGEUSERS_REF] = React.createRef();
    this.crefs[SYSTEMCONFIGURATION_REF] = React.createRef();
    this.crefs[CLEANUPLARGEOBJECTSTORE_REF] = React.createRef();
    this.crefs[DISCOVERORPHANEDMETADATA_REF] = React.createRef();
    this.crefs[GENERATESSCMAINTENANCEREPORT_REF] = React.createRef();
    this.crefs[ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF] = React.createRef();
    this.crefs[GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF] = React.createRef();
    this.crefs[GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF] = React.createRef();
    this.crefs[TERMSANDDEFINITIONS_REF] = React.createRef();
    this.crefs[UNDERDEVELOPMENT_REF] = React.createRef();
    this.crefs[MAINTENANCESCHEDULE_REF] = React.createRef();
    this.crefs[OPERATINGRUNDATAMETRICS_REF] = React.createRef();
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.log(error, info.componentStack);
  }

  componentDidMount() {
    this.mounted = true;
    if (this.context.debug) {
      ConsoleLog("App", "componentDidMount", `uuid: ${this.uuid}`);
    }
    // Everything here is fired on component mount.
    if (this.ws === null || this.ws === undefined) {
      this.conn_snackbar_id = enqueueConnectionSnackbar(false);
      const ws_url = this.props.wsep + "?uuid=" + this.uuid
      if (this.context.debug) {
        ConsoleLog("App", "componentDidMount", `connecting to ${ws_url}`);
      }
      this.ws = new ReconnectingWebSocket(ws_url);
      this.ws.onopen = (event) => {
        const msg = `Websocket connection to server established for client ${this.uuid}`;
        console.log("aaaaaaaaaaaaaa")
        if (this.context.debug) {
          ConsoleLog("App", "ws.onopen", msg);
        }
        this.appendLog(msg);
        if (this.conn_snackbar_id) {
          closeSnackbar("__connection_snackbar__");
          this.conn_snackbar_id = null;
        }
        this.setState({ready: true, online: true});
      };
      this.ws.onerror = (error) => {
        ConsoleLog("App", "ws.onerror", error, this.conn_snackbar_id);
        if (this.conn_snackbar_id === null) {
          this.conn_snackbar_id = enqueueConnectionSnackbar(true);
        }
        this.appendLog("Websocket error: " + JSON.stringify(error));
        this.setState({ready: false, online: false});
      };
      this.ws.onclose = (event) => {
        console.log(event)
        console.log(this.mounted)
        // enqueueConnectionSnackbar(true)
        const msg =
          `"Websocket connection with server closed: wasClean = ${event.hasOwnProperty("wasClean") ? event.wasClean : false}, reason = ${getErrorMessage(event.code)}`;
        if (this.context.debug) {
          ConsoleLog("App", "ws.onclose", msg);
        }
        this.appendLog(msg);
        if (this.conn_snackbar_id === null) {
          this.conn_snackbar_id = enqueueConnectionSnackbar(true);
        }
        if (this.mounted) {
          this.setState({ready: false, busy: 0, online: false, background_tasks_active: false});
        }
      };
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (this.context.debug) {
          ConsoleLog("App", "onmessage", message);
        }
        if (message.hasOwnProperty("log_message")) {
          this.appendLog(message.response);
          if (message.log_message === "only_logging_system") {
            return;
          }
        }
        if (isValidMessageSignature(message)) {
          if (isModuleMessage(message)) {
            for (const [k, v] of Object.entries(this.crefs)) {
              if (k === message.module) {
                if (v.current) {
                  v.current.ws_message(message)
                }
              }
            }
          } else {
            if (messageResponseStatusOk(message)) {
              if (isCommandResponse(message, "gpk")) {
                this.puk.length = 0;
                this.puk.push(message.response.data);
                this.context.user.isAuthenticated = false;
                this.setState({online: true});
              } else if (isCommandResponse(message, CMD_GET_ORGANISATION)) {
                this.org = message.response.org;
              } else if (isCommandResponse(message, CMD_GET_USER_RECORDS)) {
                for (const u of message.response.users) {
                  if (u.hasOwnProperty("metadata")) {
                    this.context.user.users.push([u.metadata.username, u.metadata.fullname]);
                  }
                }
              } else if (isCommandResponse(message, CMD_GET_SERVER_INFO)) {
                if (this.sysinfoRef.current) {
                  this.sysinfoRef.current.setServerInfo(message.response);
                }
              } else if (isCommandResponse(message, CMD_BACKGROUND_TASKS)) {
                this.setState(pstate => {
                  return {
                    background_tasks_active: message.hasOwnProperty("tasks_active") && message.tasks_active === "true",
                  }
                });
              } else if (isCommandResponse(message, CMD_GET_SESSION_INFO)) {
                this.context.user.isAuthenticated = message.response.session.valid;
                if (!message.response.session.valid) {
                  enqueueErrorSnackbar(message.response.message);
                }
                this.forceUpdate();
              } else if (isCommandResponse(message, CMD_GET_GLOSSARY_TERMS)) {
                setGlossaryTerms(this.glossary, message.response.terms)
                // this.forceUpdate();
              } else if (isCommandResponse(message, CMD_GET_SYSTEM_PROPERTIES)) {
                for (const property of message.response.properties) {
                  setPropertyValue(this.properties, property.name, property.value);
                }
              } else if (isCommandResponse(message, CMD_SET_SYSTEM_PROPERTIES)) {
                const property = message.response.property;
                setPropertyValue(this.properties, property.name, property.value);
              } else if (isCommandResponse(message, [CMD_GET_USER_NOTIFICATION_MESSAGES,
                CMD_DELETE_USER_NOTIFICATION_MESSAGE])) {
                if (this.notificationRef.current) {
                  if (message.response.hasOwnProperty("notifications")) {
                    this.notificationRef.current.updateMessages(message.response.notifications);
                    let count = 0;
                    for (const m of message.response.notifications) {
                      if (m.archived === 0) {
                        count++;
                      }
                    }
                    this.setState(pstate => {
                      return {
                        num_unread_messages: count,
                        num_messages: message.response.notifications.length,
                      }
                    });
                  }
                }
              }
            } else {
              enqueueErrorSnackbar(message.response.message);
            }
          }
          if (message.hasOwnProperty("show_busy") && message.show_busy) {
            this.setState(pstate => {
              return {
                busy: pstate.busy - 1
              }
            });
          }
        } else {
          enqueueErrorSnackbar(
            `message is missing ${message.hasOwnProperty("cmd") ?
              "" : "cmd"}${message.hasOwnProperty("response") ? "" : "response"} field.`
          );
        }
      };
    }
  }

  componentWillUnmount() {
    console.log("################## C O M P O N E N T W I L L U N M O U N T #################", this.context.debug)
    if (this.context.debug) {
      ConsoleLog("App", "componentWillUnmount", "mounted", this.mounted);
    }
    this.mounted = false;
    // if (this.state.ready) {
    //   this.ws.close();
    // }
  }

  // send_pong = () => {
  //   const msg = {cmd: "pong"};
  //   if (this.ws && this.ws.readyState === 1) {
  //     if (this.context.debug) {
  //       ConsoleLog("App", "send", msg);
  //     }
  //     this.ws.send(JSON.stringify({
  //       ...msg
  //     }));
  //   }
  // };

  send = (msg, show_busy, include_user) => {
    // if (this.context.debug) {
    //   ConsoleLog("App", "send", "ws.readyState",
    //     this.ws && this.ws.readyState ? this.ws.readyState : "undefined");
    // }
    if (this.ws && this.ws.readyState === 1) {
      const run_in_background = msg.hasOwnProperty("run_in_background") && msg.run_in_background;
      const _show_busy = (show_busy === undefined) ? true : show_busy;
      const _include_user = (include_user === undefined) ? true : include_user;
      const _msg = {
        session_id: this.session_id,
        uuid: this.uuid,
        // user: this.context.user,
        ...msg
      };
      if (_show_busy && !run_in_background) {
        _msg["show_busy"] = _show_busy
      }
      if (_include_user) {
        _msg["user"] = this.context.user
      }
      if (this.context.debug) {
        ConsoleLog("App", "send", "msg", _msg);
      }
      this.ws.send(JSON.stringify(_msg));
      if (_show_busy && !run_in_background) {
        this.setState(pstate => {
          return {
            busy: pstate.busy + 1
          }
        });
      }
    } else {
      enqueueWarningSnackbar("NURIMS server offline!")
    }
  };

  handleMenuAction = (link, title) => {
    console.log("&&&&&&&&&&&&& menu action link, title->", link, title)
    console.log("+++ typeof link, typeof title", typeof link, typeof title)
    if (link && typeof link === "object") {
      this.menuTitle = link.target.dataset.title ? link.target.dataset.title : "";
      if (link.target.id === "logout") {
        this.context.user.isAuthenticated = false;
        this.setState({actionid: ""});
      } else {
        this.setState({actionid: link.target.id});
      }
    } else if (link && typeof link === "string") {
      if (link === 'set-light-theme') {
        this.setState({theme: 'light'});
        localStorage.setItem("theme", 'light');
      } else if (link === 'set-dark-theme') {
        this.setState({theme: 'dark'});
        localStorage.setItem("theme", 'dark');
      } else if (link === 'show-debug-messages') {
        this.send({
          cmd: CMD_SET_LOGGING_LEVEL,
          level: "debug"
        }, false, false);
        this.setState(pstate => {
          return {
            debug: true
          }
        });
        ConsoleLog("App", "handleMenuAction", "enabling debug messages.");
      } else if (link === 'hide-debug-messages') {
        ConsoleLog("App", "handleMenuAction", "disabling debug messages.");
        this.send({
          cmd: CMD_SET_LOGGING_LEVEL,
          level: "warning"
        }, false, false);
        this.setState(pstate => {
          return {
            debug: false
          }
        });
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

  toggleLogWindow = () => {
    this.setState({log_window_visible: !this.state.log_window_visible});
  }

  closeLogWindow = () => {
    this.setState({log_window_visible: false});
  }

  appendLog = (msg) => {
    let message = typeof msg === 'object' ?
      msg.hasOwnProperty("message") ? msg.message : JSON.stringify(msg) : msg;
    if (!message.startsWith("[")) {
      message = "[" + new Date().toISOString().substring(0, 19).replace("T", " ") + "] " +
        message;
    }
    this.logs.push(message);
    if (this.logRef.current) {
      this.logRef.current.updateLogWindow();
    }
  }

  interruptBackgroundTask = (active) => {
    if (active) {
      this.setState({confirm_interrupt_background_task: true});
    }
  }

  proceedWithInterruptBackgroundTask = () => {
    this.send({
      cmd: CMD_INTERRUPT_BACKGROUND_TASK,
    }, false, false);
    enqueueWarningSnackbar("Background task interrupt request sent ...");
    this.setState({confirm_interrupt_background_task: false});
  }

  cancelInterruptBackgroundTask = () => {
    this.setState({confirm_interrupt_background_task: false});
  }


  toggleNotificationsWindow = (event) => {
    if (this.state.num_messages > 0) {
      this.setState({
        notification_window_visible: !this.state.notification_window_visible,
        notification_window_anchor: event.currentTarget,
      });
    }
  }

  closeNotificationWindow = () => {
    this.setState({notification_window_visible: false});
  }

  onChangeUnreadMessages = (num_unread_messages) => {
    this.setState({num_unread_messages: num_unread_messages});
  }

  onChangeNumMessages = (num_messages) => {
    this.setState({num_messages: num_messages});
  }

  onValidAuthentication = (session_id) => {
    // save session id. This is the encrypted session id that we send with each request
    this.session_id = session_id;
    // get system properties
    this.send({
      cmd: CMD_GET_SYSTEM_PROPERTIES,
    }, true, false);
    this.send({
      cmd: CMD_GET_GLOSSARY_TERMS,
    }, true, false);
    // get list of all registered users
    this.send({
      cmd: CMD_GET_USER_RECORDS,
    }, true, false);
    // update number of connected clients etc info.
    this.send({
      cmd: CMD_GET_SERVER_INFO,
    }, false, false);
    this.send({
      cmd: CMD_GET_USER_NOTIFICATION_MESSAGES,
    }, false, true);
  }

  render() {
    const {
      theme, ready, menuData, actionid, open, busy, background_tasks_active, num_unread_messages,
      log_window_visible, notification_window_visible, notification_window_anchor, num_messages, online,
      confirm_interrupt_background_task
    } = this.state;
    const isSysadmin = isValidUserRole(this.context.user, "sysadmin");
    if (this.context.debug) {
      ConsoleLog("App", "render", "actionid", actionid, "busy", busy,
        "num_unread_messages", num_unread_messages, "num_messages", num_messages, "user.isAuthenticated",
        this.context.user.isAuthenticated)
    }
    return (
        <SnackbarProvider maxSnack={6} anchorOrigin={{vertical: 'bottom', horizontal: 'center',}}>
          <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <Box sx={{flexGrow: 1, height: "100%"}}>
              {this.context.user.isAuthenticated ?
                <React.Fragment>
                  <ConfirmInterruptBackgroundTaskDialog open={confirm_interrupt_background_task}
                                                        onProceed={this.proceedWithInterruptBackgroundTask}
                                                        onCancel={this.cancelInterruptBackgroundTask}
                  />
                  <AppBar position="static">
                    <Toolbar>
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
                        Organisation: {this.org.name.toUpperCase()}
                      </Typography>
                      <AccountMenu
                        title={this.context.user.profile.username === "" ? this.menuTitle : this.context.user.profile.username}
                        user={this.context.user}
                        onClick={this.handleMenuAction}
                      />
                      <BackgroundTasks active={background_tasks_active} onClick={this.interruptBackgroundTask}/>
                      <LogWindowButton onClick={this.toggleLogWindow}/>
                      <NetworkConnection ready={ready}/>
                      {isSysadmin && <SystemInfoBadges ref={this.sysinfoRef}/>}
                      <NotificationsButton
                        numMessages={num_messages}
                        numUnreadMessages={num_unread_messages}
                        id={"notification-window"}
                        onClick={this.toggleNotificationsWindow}
                      />
                    </Toolbar>
                  </AppBar>
                  <MenuDrawer open={open} onClick={this.handleMenuAction} menuItems={menuData} user={this.context.user}
                              organisation={this.org}>
                    <Suspense fallback={<div/>}>
                      <Box sx={{p: 3}}>
                        <BusyIndicator open={busy > 0} loader={"pulse"} size={40}/>
                        {actionid === MY_ACCOUNT &&
                          <MyAccount
                            ref={this.crefs["MyAccount"]}
                            user={this.context.user}
                            send={this.send}
                            properties={this.properties}
                          />
                        }
                        {actionid === SETTINGS &&
                          <Settings
                            ref={this.crefs["Settings"]}
                            title={this.menuTitle}
                            theme={theme}
                            onClick={this.handleMenuAction}
                            send={this.send}
                            properties={this.properties}
                          />
                        }
                        {
                          SupportPackages(actionid, this.crefs, this.menuTitle, this.context.user, this.handleMenuAction,
                            this.send, this.properties, this.glossary, this.puk)
                        }
                        {
                          SysAdminResourcePackages(actionid, this.crefs, this.menuTitle, this.context.user, this.handleMenuAction,
                            this.send, this.properties, this.glossary, this.puk)
                        }
                        {
                          SSCPackages(actionid, this.crefs, this.menuTitle, this.context.user, this.handleMenuAction,
                            this.send, this.properties, this.glossary, this.puk)
                        }
                        {
                          ControlledMaterialPackages(
                            actionid, this.crefs, this.menuTitle, this.context.user, this.handleMenuAction,
                            this.send, this.properties, this.glossary, this.puk)
                        }
                        {
                          HumanResourcePackages(actionid, this.crefs, this.menuTitle, this.context.user, this.handleMenuAction,
                            this.send, this.properties, this.glossary, this.puk)
                        }
                        {
                          RadiationProtectionPackages(actionid, this.crefs, this.menuTitle, this.context.user,
                            this.handleMenuAction, this.send, this.properties, this.glossary, this.puk)
                        }
                        {
                          IcensPackages(actionid, this.crefs, this.menuTitle, this.context.user, this.handleMenuAction,
                            this.send, this.properties, this.glossary, this.puk)
                        }
                        {
                          OrgPackages(actionid, this.crefs, this.menuTitle, this.context.user, this.handleMenuAction,
                            this.send, this.properties, this.glossary, this.puk)
                        }
                        {
                          EmergencyPreparednessPackages(actionid, this.crefs, this.menuTitle, this.context.user,
                            this.handleMenuAction, this.send, this.properties, this.glossary, this.puk)
                        }
                        <LogWindow
                          ref={this.logRef}
                          onClose={this.closeLogWindow}
                          visible={log_window_visible}
                          width={`${drawerWidth}px`}
                          height={250}
                          logs={this.logs}
                        />
                        <NotificationWindow
                          ref={this.notificationRef}
                          anchorEl={notification_window_anchor}
                          id={"notification-window"}
                          send={this.send}
                          onClose={this.closeNotificationWindow}
                          onChangeUnreadMessages={this.onChangeUnreadMessages}
                          onChangeNumMessages={this.onChangeNumMessages}
                          visible={notification_window_visible}
                          width={500}
                          height={600}
                        />
                      </Box>
                    </Suspense>
                  </MenuDrawer>
                </React.Fragment> :
                <Suspense fallback={<BusyIndicator open={true} loader={"pulse"} size={30}/>}>
                  <SignIn
                    ref={this.crefs[SIGNIN_REF]}
                    authService={this.context.user}
                    puk={this.puk}
                    send={this.send}
                    online={online}
                    onValidAuthentication={this.onValidAuthentication}
                  />
                </Suspense>
              }
            </Box>
          </ThemeProvider>
        </SnackbarProvider>
    )
  }
}

App.propTypes = {
  wsep: PropTypes.string.isRequired,
}

export default App
