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
  enqueueErrorSnackbar,
  enqueueWarningSnackbar
} from "../utils/SnackbarVariants";
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";
import {
  messageResponseStatusOk,
  isCommandResponse,
  encryptMessage,
} from "../utils/WebsocketUtils";
import {
  withTheme
} from "@mui/styles";
import {
  CMD_VERIFY_USER_PASSWORD
} from "../utils/constants";
import {
  record_uuid
} from "../utils/MetadataUtils";

const StyledAvatar = styled(Avatar)({
  margin: 2,
});

const StyledButton = styled(Button)({
  margin: 2,
});

export const SIGNIN_REF = "Signin";

class Signin extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.authService = props.authService;
    this._mounted = false;
    this.Module = SIGNIN_REF;
    this.state = {
      NavigateToPreviousRoute: false,
      theme: localStorage.getItem("theme") || "light",
      username: '',
      password: '',
      remember: false,
      session_id: "",
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

  submit = (event) => {
    console.log("11111111111111111111111111111111111111", this.props.online)
    if (this.props.online) {
      console.log("11111111111111111111111111111111111111", this.props.puk.length)
      if (this.props.puk.length === 0) {
        enqueueErrorSnackbar("No encryption key available.");
      } else {
        console.log("22222222222222222")
        const session_uuid = record_uuid();
        console.log("333333333333333", session_uuid)
        console.log("444444444444444", this.props.puk[0])
        console.log("5555555555555555555", this.props.puk[0])
        const session_id = encryptMessage(this.props.puk[0], session_uuid);
        console.log("sending ...", session_id)
        this.props.send({
          cmd: CMD_VERIFY_USER_PASSWORD,
          session_id: session_id,
          username: encryptMessage(this.props.puk[0], this.state.username),
          password: encryptMessage(this.props.puk[0], this.state.password),
          module: this.Module,
        }, true, false);
        this.setState({session_id: session_id})
      }
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
    const response = message.response;
    if (messageResponseStatusOk(message)) {
      if (isCommandResponse(message, CMD_VERIFY_USER_PASSWORD)) {
        if (response.valid) {
          // if Remember Me selected then save the username
          if (this.state.remember) {
            localStorage.setItem('rememberme', this.state.username);
          } else {
            localStorage.removeItem('rememberme');
          }
          this.props.onValidAuthentication(this.state.session_id)
        } else {
          enqueueWarningSnackbar(response.message);
        }
        this.authService.authenticate(response.valid, response.profile);
      }
    } else {
      enqueueWarningSnackbar(response.message);
    }
  }

  render() {
    const {remember, username} = this.state;
    const {theme, online} = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "online", online, "authService", this.authService);
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
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.submit}
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
  puk: PropTypes.array.isRequired,
  online: PropTypes.bool.isRequired,
  send: PropTypes.func.isRequired,
  onValidAuthentication: PropTypes.func.isRequired,
}

export default withTheme(Signin);