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
import dayjs from 'dayjs';
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

  since = (date) => {
    const now = dayjs()
    const then = dayjs(date)
    console.log("NOW=", now.toISOString())
    console.log("THEN=", then.toISOString())
    console.log("DIFF=", now.diff(then, "d"))

    // Find the right difference measure
    // How many seconds ago
    let lapsed = now.diff(then, "s");
    let units = "seconds";
    if (lapsed > 60) {
      lapsed = now.diff(then, "m");
      units = "minutes";
      if (lapsed > 60) {
        lapsed = now.diff(then, "h");
        units = "hours";
        if (lapsed > 24) {
          lapsed = now.diff(then, "d");
          units = "days";
          if (lapsed > 31) {
            lapsed = now.diff(then, "M");
            units = "months";
            if (lapsed > 31) {
              lapsed = now.diff(then, "y");
              units = "years";
            }
          }
        }
      }
    }

    return `${lapsed} ${units}`;
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
    console.log("== archive_message == id", event.target)
    console.log("== archive_message == id", event.currentTarget)
    if (event.currentTarget.dataset.message) {
      const id = event.currentTarget.dataset.message;
      const messages = this.state.messages;
      for (const message in messages) {
        if (message.id === id) {
          message.archived = 1;
          break;
        }
      }
      this.setState({ messages: messages });
    }
  }

  message_background = (message) => {
    if (message.archived === 0) {
      return ("red")
    } else {
      return ("inherit")
    }
  }

  delete_message = (event) => {
    console.log("== delete_message == id", event.currentTarget.dataset.message)
  }

  dd = (event) => {
    console.log("== dd == e", event.currentTarget.dataset.message)
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
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    size={"small"}
                    data-message={message.id}
                    onClick={this.delete_message}
                  >
                    <DeleteIcon/>
                  </IconButton>
                }
                disablePadding
                sx={{bgcolor: this.message_background(message)}}
              >
                <ListItemButton
                  dense
                  data-message={message.id}
                  onClick={this.archive_message}
                >
                  <ListItemIcon>
                    {this.sender_icon(message)}
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={message.message}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{display: 'inline', fontStyle: 'italic'}}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {this.since(message.timestamp)} ago
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
