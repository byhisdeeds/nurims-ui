import React, {Component} from "react";
import PropTypes from "prop-types";
import {darkTheme, lightTheme} from "../utils/Theme";
import {
  Popover,
  ListItemButton,
  ListItemIcon,
  List,
  Checkbox,
  IconButton,
  ListItem,
  ListItemText, Typography
} from "@mui/material";
import {
  withTheme
} from "@mui/styles";
import CommentIcon from '@mui/icons-material/Comment'
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import DeleteIcon from '@mui/icons-material/HighlightOff';

const NOTIFICATIONS_REF = "Notifications";

class NotificationWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollToRow: 0,
      isTextWrapped: true,
      logs: "",
      messages: [
        {id: 1, timestamp: "2023-10-12T12:03:45", message: "first message", archived: 0, sender: "__sys__"},
        {id: 2, timestamp: "2023-10-12T12:03:45", message: "second message", archived: 0, sender: "__sys__"}
      ],
    };
    this.Module = NOTIFICATIONS_REF;
    this.messagesRef = React.createRef();
  }

  // toggleTextWrapping = (wrapped) => {
  //   this.setState({ isTextWrapped: !this.state.isTextWrapped });
  // }

  // log = (msg) => {
  //   let message = typeof msg === 'object' ? msg.hasOwnProperty("message") ? msg.message : JSON.stringify(msg) : msg;
  //   if (!message.startsWith("[")) {
  //     message = "[" + new Date().toISOString().substring(0, 19).replace("T", " ") + "] " + message;
  //   }
  //   const logs = this.state.logs + (this.state.logs === "" ? "" : "\n") + message;
  //   const scrollToRow = logs.split("\n").length + 1;
  //   this.setState({ logs: logs, scrollToRow: scrollToRow })
  // }

  // onDownloadClick = () => {
  //   const element = document.createElement('a');
  //   const dataToDownload = [this.state.logs];
  //   const file = new Blob(dataToDownload, { type: 'text/plain' });
  //   element.href = URL.createObjectURL(file);
  //   element.download = 'log-window.txt';
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // }

  // handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
  //   setOpen(true);
  //   setScroll(scrollType);
  // };

  sender_icon = (message) => {
    if (message.sender === "__sys__") {
      return (<EmailIcon />)
    }
    return (<MarkEmailUnreadIcon />)
  }

  archive_message = (event) => {
    console.log("== archive_message == e", event.target)
    console.log("== archive_message == e", event.target.dataset.message)
    console.log("== archive_message == e", event.target.parentNode.getAttribute('data-message'))
    if (event.target) {
      // const message = event.target.getAttribute('data-message');
      // message.archived = message.archived === 0 ? 1 : 0
    }
  }

  message_background = (message) => {
    if (message.archived === 0) {
      return ("red")
    } else {
      return ("inherit")
    }
  }

  render() {
    const {anchorEl, id, visible, onClose, width, height, theme} = this.props;
    const {messages, isTextWrapped, scrollToRow} = this.state;
    return (
      <Popover
        id={id}
        anchorEl={anchorEl}
        open={visible}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          flexShrink: 0,
          [`& .MuiPopover-paper`]: {
            width: width,
            height: height,
            boxSizing: 'border-box',
          },
        }}
      >
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {messages.map((message) => {
            const labelId = `checkbox-list-label-${message.id}`;
            return (
              <ListItem
                key={message.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" size={"small"} >
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
                sx={{bgcolor: this.message_background(message)}}
              >
                <ListItemButton
                  dense
                  data-message={message}
                  onClick={this.archive_message}
                >
                  <ListItemIcon>
                    {this.sender_icon(message)}
                    {/*<Checkbox*/}
                    {/*  edge="start"*/}
                    {/*  checked={false}*/}
                    {/*  tabIndex={-1}*/}
                    {/*  disableRipple*/}
                    {/*  inputProps={{*/}
                    {/*    'aria-labelledby': labelId*/}
                    {/*  }}*/}
                    {/*/>*/}
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={message.message}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {message.timestamp}
                        </Typography>
                        {" — I'll be in your neighborhood doing errands this…"}
                      </React.Fragment>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Popover>
    )
  }
}

NotificationWindow.propTypes = {
  visible: PropTypes.bool.isRequired,
  anchorEl: PropTypes.element.isRequired,
  onClose: PropTypes.func,
  send: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
}

NotificationWindow.defaultProps = {
  send: () => {},
  onClose: () => {},
  width: 300,
  height: 200,
}

export default withTheme(NotificationWindow)
