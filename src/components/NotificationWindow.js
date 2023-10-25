import React, {Component} from "react";
import PropTypes from "prop-types";
import {darkTheme, lightTheme} from "../utils/Theme";
import {
  Popover,
  ListItemButton,
  ListItemIcon,
  IconButton,
  ListItem,
  List,
  ListItemText,
  Typography
} from "@mui/material";
import {
  withTheme
} from "@mui/styles";
import dayjs from 'dayjs';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import DeleteIcon from '@mui/icons-material/HighlightOff';
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";
import {
  CMD_DELETE_USER_NOTIFICATION_MESSAGE,
  CMD_GET_USER_NOTIFICATION_MESSAGES
} from "../utils/constants";


const NOTIFICATIONS_REF = "Notifications";

class NotificationWindow extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.Module = NOTIFICATIONS_REF;
  }

  since = (date) => {
    console.log("DATE=", date)
    const now = dayjs()
    const then = dayjs(date+"Z")
    console.log("NOW=", now.toISOString())
    console.log("THEN=", then.toISOString())
    console.log("DIFF=", now.diff(then, "s"))

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

  sender_icon = (message) => {
    if (message.sender === "__sys__") {
      return (<EmailIcon />)
    }
    return (<MarkEmailUnreadIcon />)
  }

  archive_message = (event) => {
    if (event.currentTarget.dataset.message) {
      const id = Number.parseInt(event.currentTarget.dataset.message);
      let count = 0;
      const messages = this.state.messages;
      for (const message of messages) {
        if (message.id === id) {
          message.archived = 1;
        }
        count += message.archived === 0 ? 1 : 0;
      }
      this.props.onChangeUnreadMessages(count);
      this.setState({messages: messages});
    }
  }

  message_background = (message) => {
    if (message.archived === 0) {
      return ("action.disabled")
    } else {
      return ("background.paper1")
    }
  }

  delete_message = (event) => {
    console.log("== delete_message == id", event.currentTarget.dataset.message)
    if (event.currentTarget.dataset.message) {
      const _messages = [];
      const id = Number.parseInt(event.currentTarget.dataset.message);
      const messages = this.state.messages;
      for (const message of messages) {
        if (message.id === id) {
          this.props.send({
            cmd: CMD_DELETE_USER_NOTIFICATION_MESSAGE,
            id: message.id,
          }, false);
        } else {
          _messages.push(message);
        }
      }
      this.props.onChangeNumMessages(_messages.length);
      this.setState({messages: _messages});
    }
  }

  updateMessages = (messages) => {
    if (this.context.debug) {
      ConsoleLog(this.Module, "updateMessages", "messages", messages);
    }
    // Append messages to user messages list
    const _messages = this.state.messages;
    for (const m of messages) {
      let found = false;
      for (const message of _messages) {
        if (message.id === m.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        _messages.push(m);
      }
    }
    this.setState({messages: _messages});
  }

  render() {
    const {anchorEl, id, visible, onClose, width, height, theme} = this.props;
    const {messages} = this.state;
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
        <List sx={{width: '100%'}}>
          {messages.map((message) => {
            const labelId = `checkbox-list-label-${message.index}`;
            return (
              <ListItem
                key={message.index}
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
                    primary={message.sender}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="div"
                          variant="body2"
                          color="text.secondary"
                        >
                          {message.message}
                        </Typography>
                        <Typography
                          sx={{display: 'inline', fontStyle: 'italic'}}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {this.since(message.timestamp)} ago
                        </Typography>
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
  onChangeUnreadMessages: PropTypes.func.isRequired,
  onChangeNumMessages: PropTypes.func.isRequired,
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
