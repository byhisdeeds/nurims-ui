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
        {timestamp: "2023-10-12T12:03:45", message: "first message", archived: 0},
        {timestamp: "2023-10-12T12:03:45", message: "second message", archived: 0}
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
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => {
            const labelId = `checkbox-list-label-${value}`;
            return (
              <ListItem
                key={value}
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" size={"small"}>
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={false}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        'aria-labelledby': labelId
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={`Line item as asdf adf a asf a fas f fa f  fa f f a  ${value + 1}`}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Ali Connors
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
  width: PropTypes.number,
  height: PropTypes.number,
}

NotificationWindow.defaultProps = {
  onClose: () => {},
  width: 300,
  height: 200,
}

export default withTheme(NotificationWindow)
