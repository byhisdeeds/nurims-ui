import React from 'react';
import {Navigate} from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import {darkTheme, lightTheme} from "../utils/Theme";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {styled} from "@mui/material/styles";
import Container from '@mui/material/Container';
import {toast, Zoom} from "react-toastify";
import ReconnectingWebSocket from "reconnecting-websocket";
import Box from "@mui/material/Box";
import {JSEncrypt} from "jsencrypt";

const { v4: uuid } = require('uuid');
const Constants = require('../utils/constants');
const MODULE = 'Login';

const StyledAvatar = styled(Avatar)({
  margin: 2,
});

const StyledButton = styled(Button)({
  margin: 2,
});

function commandResponseEquals(msg, cmd) {
  return  msg.hasOwnProperty('cmd') && msg.cmd === cmd;
}

function encryptPassword(pubKey, text) {
  const jsEncrypt = new window.JSEncrypt();
  jsEncrypt.setPublicKey(pubKey);
  return jsEncrypt.encrypt(text);
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.authService = props.authService;
    this.ws = null;
    this.puk = null;
    this.uuid = uuid();
    this._mounted = false;
    this.state = {
      NavigateToPreviousRoute: false,
      theme: localStorage.getItem("theme") || "light" === "light" ? lightTheme : darkTheme,
      username: '',
      password: '',
      remember: false,
      online: false,
    }
    // Call it once in your app. At the root of your app is the best place
    toast.configure({
      className: 'naa-toast',
      autoClose: 3000,
      draggable: false,
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnVisibilityChange: true,
      rtl: false,
      newestOnTop: true,
      pauseOnHover: true,
      transition: Zoom,
    });
  }

  onUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  onRememberMe = (event) => {
    this.setState({ remember: event.target.checked });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("HANDLE-SUBMIT")
    if (this.state.online) {
      console.log(JSON.stringify({
        uuid:this.uuid,
        cmd: Constants.CMD_VERIFY_USER_PASSWORD,
        username:this.state.username,
        password:encryptPassword(this.puk, this.state.password),
      }));
      this.ws.send(JSON.stringify({
        uuid:this.uuid,
        cmd: Constants.CMD_VERIFY_USER_PASSWORD,
        username:this.state.username,
        password:encryptPassword(this.puk, this.state.password),
      }));
    }
  };

  componentWillUnmount() {
    this._mounted = false;
    if (this.ws) {
      this.ws.close();
    }
  }

  componentDidMount () {
    this._mounted = true;
    this.ws = new ReconnectingWebSocket(this.props.wsep);
    this.ws.onopen = () => {
      console.log(`${MODULE} websocket connection established.`);
      // get public key as base64 string
      this.ws.send(JSON.stringify({uuid:this.uuid, cmd: Constants.CMD_GET_PUBLIC_KEY}));
    };
    this.ws.onerror = (error) => {
      console.log(`${MODULE} websocket error - ${error}`);
    };
    this.ws.onclose = () => {
      console.log(`${MODULE} websocket connection closed.`);
      if (this._mounted) {
        this.setState({ online: false });
      }
    };
    this.ws.onmessage = (event) => {
      const ev_data = JSON.parse(event.data);
      if (commandResponseEquals(ev_data, Constants.CMD_GET_PUBLIC_KEY) && ev_data.data.status === 0) {
        this.puk = ev_data.data.public_key;
        this.setState({ online: true });
      } else if (commandResponseEquals(ev_data, Constants.CMD_VERIFY_USER_PASSWORD)) {
        console.log(ev_data)
        if (ev_data.hasOwnProperty("response") && ev_data.response.hasOwnProperty('status') && ev_data.response.status === 0) {
          if (ev_data.response.valid) {
            // if Remember Me selected then save the username
            if (this.state.remember) {
              localStorage.setItem('rememberme', this.state.username);
            } else {
              localStorage.removeItem('rememberme');
            }
          } else {
            toast.warn(ev_data.response.message);
          }
          this.authService.authenticate(ev_data.response.valid, ev_data.response.profile);
          this.setState({ NavigateToPreviousRoute: ev_data.response.valid });
        } else {
          toast.warn(ev_data.response.message);
          this.setState({ NavigateToPreviousRoute: false });
        }
      }
    };
    // if remember me enabled then populate username box with last authenticated username
    if (localStorage.getItem('rememberme')) {
      this.setState({ username: localStorage.getItem('rememberme'), remember: true });
    }
  }

  render() {
    if (this.state === null) return ('');
    const from = this.authService.from;
    const { NavigateToPreviousRoute, remember, username, online, theme } = this.state;
    if (NavigateToPreviousRoute) {
      return <Navigate to={from} replace={true} />;
    }
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Container
            component="main"
            maxWidth="xs"
            style={{
              backgroundColor: online ? theme.palette.background.default : theme.palette.action.disabledBackground,
              borderRadius: theme.shape.borderRadius
            }}
          >
            <CssBaseline/>
            <Box sx={{p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <StyledAvatar>
                <LockOutlinedIcon/>
              </StyledAvatar>
              <Typography component="h1" variant="h5">
                { online && <div>Sign in</div> }
                { !online && <div>Off-Line</div> }
              </Typography>
              <Box component="form" sx={{'& .MuiInputBase-root': {ml: 0, mb: 0}, }} noValidate autoComplete="off">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  value={username}
                  id="email"
                  onChange={this.onUsernameChange}
                  label="Username / Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  InputLabelProps={{style:{color: online ? theme.palette.primary.main : theme.palette.primary.light}}}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={this.onPasswordChange}
                  autoComplete="current-password"
                  InputLabelProps={{style:{color: online ? theme.palette.primary.main : theme.palette.primary.light}}}
                />
                <FormControlLabel
                  control={<Checkbox onChange={this.onRememberMe} checked={remember}/>}
                  label="Remember me"
                  style={{color: online ? theme.palette.primary.main : theme.palette.primary.light}}
                />
                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  Sign In
                </StyledButton>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      <span>Forgot password?</span>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      <span>"Don't have an account? Sign Up"</span>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
}

Login.defaultProps = {
  wsep: `ws://${window.location.hostname}/onaaws`,
};

export default Login;