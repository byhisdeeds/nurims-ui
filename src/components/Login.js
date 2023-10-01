import React from 'react';
import {Navigate} from "react-router-dom";
import PropTypes from 'prop-types'
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
import ReconnectingWebSocket from "reconnecting-websocket";
import Box from "@mui/material/Box";
import {SnackbarProvider} from "notistack";
import {enqueueWarningSnackbar} from "../utils/SnackbarVariants";
import {DeviceUUID} from "device-uuid";

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
    this.uuid = new DeviceUUID().get();
    this.state = {
      NavigateToPreviousRoute: false,
      theme: localStorage.getItem("theme") || "light",
      username: '',
      password: '',
      remember: false,
      online: false,
    }
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
    if (this.state.online) {
      this.ws.send(JSON.stringify({
        uuid: this.uuid,
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
    this.ws = new ReconnectingWebSocket(this.props.wsep+"?uuid="+this.uuid);
    this.ws.onopen = () => {
      console.log(`${MODULE} websocket connection established.`);
      // get public key as base64 string
      this.ws.send(JSON.stringify({uuid: this.uuid, cmd: Constants.CMD_GET_PUBLIC_KEY}));
      // get list of all registered users
      this.ws.send(JSON.stringify({uuid: this.uuid, cmd: Constants.CMD_GET_USER_RECORDS}));
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
      const message = JSON.parse(event.data);
      if (commandResponseEquals(message, Constants.CMD_GET_PUBLIC_KEY) && message.response.status === 0) {
        this.puk = message.response.public_key;
        this.setState({ online: true });
      } else if (commandResponseEquals(message, Constants.CMD_GET_USER_RECORDS) && message.response.status === 0) {
        for (const u of message.response.users) {
          if (u.hasOwnProperty("metadata")) {
            this.authService.users.push(u.metadata.username);
          }
        }
      } else if (commandResponseEquals(message, Constants.CMD_VERIFY_USER_PASSWORD)) {
        console.log(message)
        if (message.hasOwnProperty("response") && message.response.hasOwnProperty('status') && message.response.status === 0) {
          if (message.response.valid) {
            // if Remember Me selected then save the username
            if (this.state.remember) {
              localStorage.setItem('rememberme', this.state.username);
            } else {
              localStorage.removeItem('rememberme');
            }
          } else {
            enqueueWarningSnackbar(message.response.message);
          }
          this.authService.authenticate(message.response.valid, message.response.profile);
          this.setState({ NavigateToPreviousRoute: message.response.valid });
        } else {
          enqueueWarningSnackbar(message.response.message);
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
    const { NavigateToPreviousRoute, remember, username, online } = this.state;
    const theme = this.state.theme === 'light' ? lightTheme : darkTheme
    if (NavigateToPreviousRoute) {
      return <Navigate to={from} replace={true} />;
    }
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            autoHideDuration={2000}
            maxSnack={5}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          />
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

Login.propTypes = {
  authService: PropTypes.object.isRequired,
  wsep: PropTypes.string.isRequired,
}

export default Login;