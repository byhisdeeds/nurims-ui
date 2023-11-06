import React from 'react';
import PropTypes from 'prop-types'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Typography,
  Container,
  Box
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  styled
} from "@mui/material/styles";
import {
  enqueueWarningSnackbar
} from "../utils/SnackbarVariants";
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";
import {
  messageHasResponse,
  messageResponseStatusOk,
  isCommandResponse
} from "../utils/WebsocketUtils";
import {
  withTheme
} from "@mui/styles";

const Constants = require('../utils/constants');

const StyledAvatar = styled(Avatar)({
  margin: 2,
});

const StyledButton = styled(Button)({
  margin: 2,
});

export const SIGNIN_REF = "Signin";

function encryptPassword(pubKey, text) {
  const jsEncrypt = new window.JSEncrypt();
  jsEncrypt.setPublicKey(pubKey);
  return jsEncrypt.encrypt(text);
}

class Signin extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.authService = props.authService;
    this._mounted = false;
    this.debug = window.location.href.includes("debug");
    this.Module = SIGNIN_REF;
    this.state = {
      NavigateToPreviousRoute: false,
      theme: localStorage.getItem("theme") || "light",
      username: '',
      password: '',
      remember: false,
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
    if (this.props.online) {
      this.props.send({
        cmd: Constants.CMD_VERIFY_USER_PASSWORD,
        username: this.state.username,
        password: encryptPassword(this.props.puk[0], this.state.password),
        module: this.Module,
      }, false);
    }
  };

  componentWillUnmount() {
    this._mounted = false;
  }

  componentDidMount () {
    this._mounted = true;
  }


  ws_message(message) {
    if (this.context.debug) {
      ConsoleLog(this.Module, "ws_message", "message", message);
    }
    if (messageHasResponse(message)) {
      const response = message.response;
      if (messageResponseStatusOk(message)) {
        if (isCommandResponse(message, Constants.CMD_VERIFY_USER_PASSWORD)) {
          if (response.valid) {
            // if Remember Me selected then save the username
            if (this.state.remember) {
              localStorage.setItem('rememberme', this.state.username);
            } else {
              localStorage.removeItem('rememberme');
            }
          } else {
            enqueueWarningSnackbar(response.message);
          }
          this.authService.authenticate(response.valid, response.profile);
          this.props.onValidAuthentication()
        }
      } else {
        enqueueWarningSnackbar(response.message);
      }
    }
  }

  render() {
    const {remember, username} = this.state;
    const {theme} = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "username", username);
    }
    return (
      <Container
        component="main"
        maxWidth="xs"
        style={{
          backgroundColor: this.props.online ? theme.palette.background.default : theme.palette.action.disabledBackground,
          borderRadius: theme.shape.borderRadius
        }}
      >
        <CssBaseline/>
        <Box sx={{p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <StyledAvatar>
            <LockOutlinedIcon/>
          </StyledAvatar>
          <Typography component="h1" variant="h5">
            {this.props.online && <div>Sign in</div>}
            {!this.props.online && <div>Off-Line</div>}
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
              InputLabelProps={{style:{color: this.props.online ? theme.palette.primary.main : theme.palette.primary.light}}}
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
              InputLabelProps={{
                style: {color: this.props.online ? theme.palette.primary.main : theme.palette.primary.light}
            }}
            />
            <FormControlLabel
              control={<Checkbox onChange={this.onRememberMe} checked={remember}/>}
              label="Remember me"
              style={{
                color: this.props.online ? theme.palette.primary.main : theme.palette.primary.light
            }}
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
    );
  }
}

Signin.propTypes = {
  authService: PropTypes.object.isRequired,
  puk: PropTypes.object.isRequired,
  online: PropTypes.bool.isRequired,
  send: PropTypes.func.isRequired,
  onValidAuthentication: PropTypes.func.isRequired,
}

export default withTheme(Signin);