import React, {Suspense, lazy} from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import PropTypes from 'prop-types'
import {
  Box,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiAppBar from '@mui/material/AppBar';
import AccountMenu from "./user/AccountMenu";
import {
  styled,
  ThemeProvider
} from '@mui/material/styles';
import MenuDrawer from "./MenuDrawer";
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
  CMD_PING,
  CMD_GET_SERVER_INFO,
  CMD_GET_USER_NOTIFICATION_MESSAGES,
  CMD_DELETE_USER_NOTIFICATION_MESSAGE,
  CMD_GET_PUBLIC_KEY,
  CMD_GET_USER_RECORDS
} from "./utils/constants";
import {
  ConsoleLog,
  UserContext
} from "./utils/UserContext";
import {
  SSCPackages,
  SysAdminResourcePackages,
  HumanResourcePackages,
  ControlledMaterialPackages,
  RadiationProtectionPackages,
  IcensPackages,
  SupportPackages,
  RasaPackages,
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
import {UNDERDEVELOPMENT_REF} from "./components/UnderDevelopment"
import LogWindow from "./components/LogWindow";
import {VIEWAMPRECORDS_REF} from "./pages/maintenance/ViewAMPRecords";
import {CLEANUPLARGEOBJECTSTORE_REF} from "./pages/sysadmin/CleanupLargeObjectStore";
import {ADDEDITTODORECORD_REF} from "./pages/maintenance/AddEditTodoRecord";
import {SIGNIN_REF} from "./components/Signin";
import NotificationWindow from "./components/NotificationWindow";
import SystemInfoBadges from "./components/SystemInfoBadges";
import Signin from "./components/Signin";
import {
  BackgroundTasks,
  LogWindowButton,
  NetworkConnection,
  NotificationsButton
} from "./components/CommonComponents";
import {DeviceUUID} from 'device-uuid';
import {
  enqueueWarningSnackbar
} from "./utils/SnackbarVariants";
import {
  deviceDetect
} from 'react-device-detect';
import {SnackbarProvider} from 'notistack'
import "./App.css"
import {MenuItems} from "./menudata";
import metadata from './metadata.json';


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

const AuthService = {
  isAuthenticated: false,
  from: "",
  profile: {
    id: -1,
    username: "",
    fullname: "",
    authorized_module_level: "",
    role: []
  },
  users: [],
  authenticate(valid, profile) {
    this.isAuthenticated = valid;
    if (valid && profile) {
      this.profile = profile;
    }
  },
  logout() {
    this.isAuthenticated = false;
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actionid: '',
      open: true,
      theme: localStorage.getItem("theme") || "light",
      menuData: MenuItems,
      org: {name: "", authorized_module_level: ""},
      ready: false,
      online: false,
      busy: 0,
      background_tasks_active: false,
      log_window_visible: false,
      notification_window_visible: false,
      notification_window_anchor: null,
      num_unread_messages: 0,
      num_messages: 0,
    };
    this.debug = window.location.href.includes("debug");
    this.puk = [];
    this.properties = [];
    this.menuTitle = "";
    this.ws = null;
    this.mounted = false;
    // this.user = this.props.authService;
    this.user = AuthService;
    this.uuid = `${deviceDetect()["browserName"].toLowerCase()}-${new DeviceUUID().get()}`;
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
    this.crefs[ADD_EDIT_CORRECTIVE_MAINTENANCE_ISSUE_RECORD_REF] = React.createRef();
    this.crefs[ADDEDITAMP_REF] = React.createRef();
    this.crefs[VIEWSSCRECORDS_REF] = React.createRef();
    this.crefs[VIEWAMPRECORDS_REF] = React.createRef();
    this.crefs[GENERATEMATERIALSURVEILLANCESHEET_REF] = React.createRef();
    this.crefs[ADDEDITREACTORWATERSAMPLES_REF] = React.createRef();
    this.crefs[ADDEDITIRRADIATEDSAMPLES_REF] = React.createRef();
    this.crefs[ADDEDITTODORECORD_REF] = React.createRef();
    this.crefs[REACTOROPERATIONSREPORT_REF] = React.createRef();
    this.crefs[ADDEDITREACTOROPERATINGRUNS_REF] = React.createRef();
    this.crefs[UPDATEMONITORINGSTATUS_REF] = React.createRef();
    this.crefs[ADDEDITMONITORS_REF] = React.createRef();
    this.crefs[PERSONNELDOSIMETRYEVALUATION_REF] = React.createRef();
    this.crefs[VIEWMATERIALSLIST_REF] = React.createRef();
    this.crefs[MANAGEUSERS_REF] = React.createRef();
    this.crefs[CLEANUPLARGEOBJECTSTORE_REF] = React.createRef();
    this.crefs[GENERATESSCMAINTENANCEREPORT_REF] = React.createRef();
    this.crefs[ADDEDITREACTORSAMPLEIRRADIATIONAUTHORIZATION_REF] = React.createRef();
    this.crefs[GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF] = React.createRef();
    this.crefs[GENERATEREACTORSAMPLEIRRADIATIONAUTHORIZATIONPDF_REF] = React.createRef();
    this.crefs[TERMSANDDEFINITIONS_REF] = React.createRef();
    this.crefs[CHATBOT_REF] = React.createRef();
    this.crefs[UNDERDEVELOPMENT_REF] = React.createRef();
    this.crefs[MAINTENANCESCHEDULE_REF] = React.createRef();
  }


  componentDidMount() {
    this.mounted = true;
    if (this.debug) {
      ConsoleLog("App", "componentDidMount", `uuid: ${this.uuid}`);
    }
    // Everything here is fired on component mount.
    this.ws = new ReconnectingWebSocket(this.props.wsep + "?uuid=" + this.uuid);
    this.ws.onopen = (event) => {
      if (this.debug) {
        ConsoleLog("App", "ws.onopen", "websocket connection established");
      }
      this.appendLog("Websocket connection established.");
      this.setState({ready: true});
      // get public key as base64 string
      this.send({
        cmd: CMD_GET_PUBLIC_KEY,
      })
      // get list of all registered users
      this.send({
        cmd: CMD_GET_USER_RECORDS,
      })
      // load organisation database on server
      this.send({
        cmd: CMD_GET_ORGANISATION,
      })
      // load system properties
      this.send({
        cmd: CMD_GET_SYSTEM_PROPERTIES,
      })
      // load system properties
      this.send({
        cmd: CMD_GET_SERVER_INFO,
      }, false)
      // get user notification messages
      this.send({
        cmd: CMD_GET_USER_NOTIFICATION_MESSAGES,
      }, false);
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
      if (data.hasOwnProperty("log_message")) {
        this.appendLog(data.response);
        if (data.log_message === "only_logging_system") {
          return;
        }
      }
      if (data.cmd === CMD_GET_PUBLIC_KEY) {
        this.puk.length = 0;
        this.puk.push(data.response.public_key);
        this.setState({online: true});
      } else if (data.cmd === CMD_GET_USER_RECORDS && data.module === SIGNIN_REF) {
        for (const u of data.response.users) {
          if (u.hasOwnProperty("metadata")) {
            this.user.users.push([u.metadata.username, u.metadata.fullname]);
          }
        }
      } else if (data.cmd === CMD_PING) {
        this.send_pong();
      } else if (data.cmd === CMD_GET_SERVER_INFO) {
        if (this.sysinfoRef.current) {
          this.sysinfoRef.current.setServerInfo(data.response);
        }
      } else if (data.cmd === CMD_GET_USER_NOTIFICATION_MESSAGES || data.cmd === CMD_DELETE_USER_NOTIFICATION_MESSAGE) {
        if (this.notificationRef.current) {
          if (data.response.hasOwnProperty("notifications")) {
            this.notificationRef.current.updateMessages(data.response.notifications);
            let count = 0;
            for (const m of data.response.notifications) {
              if (m.archived === 0) {
                count++;
              }
            }
            this.setState(pstate => {
              return {
                num_unread_messages: count,
                num_messages: data.response.notifications.length,
              }
            });
          }
        }
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
        this.setState(pstate => {
          return {busy: this.state.busy - 1}
        });
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
    if (this.debug) {
      ConsoleLog("App", "send", "ws.readyState",
        this.ws && this.ws.readyState ? this.ws.readyState : "undefined", "msg", msg, "show_busy",
        (show_busy === undefined) ? true : show_busy);
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

  onValidAuthentication = () => {
    this.setState({busy: 0});
  }

  render() {
    const {
      theme, org, ready, menuData, actionid, open, busy, background_tasks_active, num_unread_messages,
      log_window_visible, notification_window_visible, notification_window_anchor, num_messages, online
    } = this.state;
    const isSysadmin = false; //isValidUserRole(this.user, "sysadmin");
    if (this.debug) {
      ConsoleLog("App", "render", "user", this.user, "actionid", actionid, "busy", busy,
        "num_unread_messages", num_unread_messages, "num_messages", num_messages)
    }
    return (
      <UserContext.Provider value={{debug: window.location.href.includes("debug"), user: this.user}}>
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
          <Box sx={{flexGrow: 1, height: "100%"}}>
            {this.user.isAuthenticated ?
              <React.Fragment>
                <SnackbarProvider maxSnack={5} anchorOrigin={{vertical: 'bottom', horizontal: 'center',}}/>
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
                      Organisation: {org.name.toUpperCase()}
                    </Typography>
                    <AccountMenu user={this.user} onClick={this.handleMenuAction}/>
                    <BackgroundTasks active={background_tasks_active}/>
                    <NetworkConnection ready={ready}/>
                    <LogWindowButton onClick={this.toggleLogWindow}/>
                    {isSysadmin && <SystemInfoBadges ref={this.sysinfoRef}/>}
                    <NotificationsButton
                      numMessages={num_messages}
                      numUnreadMessages={num_unread_messages}
                      id={"notification-window"}
                      onClick={this.toggleNotificationsWindow}
                    />
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
                      {OrgPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                      {EmergencyPreparednessPackages(actionid, this.crefs, this.menuTitle, this.user, this.handleMenuAction, this.send, this.properties)}
                      <LogWindow
                        ref={this.logRef}
                        onClose={this.closeLogWindow}
                        visible={log_window_visible}
                        width={`${drawerWidth}px`}
                        height={350}
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
              <Signin
                ref={this.crefs[SIGNIN_REF]}
                authService={this.user}
                puk={this.puk}
                send={this.send}
                online={online}
                onValidAuthentication={this.onValidAuthentication}
              />
            }
          </Box>
        </ThemeProvider>
      </UserContext.Provider>
    )
  }
}

App.propTypes = {
  wsep: PropTypes.string.isRequired,
}

export default App
