import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  List, Box
} from "@mui/material";
import {
  withTheme
} from "@mui/styles";
import {
  Download as DownloadIcon,
  DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import {
  UserContext
} from "../utils/UserContext";
import {
  highlight_logs,
} from "../utils/HighlightUtils";
import dayjs from 'dayjs';
import ScrollableList from "./ScrollableList";
import LargeScrollableList from "./LargeScrollableList";

const LOGWINDOW_REF = "LogWindow";

class LogWindow extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {};
    this.Module = LOGWINDOW_REF;
    this.ref = React.createRef();
  }

  onDownloadClick = () => {
    const element = document.createElement('a');
    const dataToDownload = [this.props.logs.join("\n")];
    const file = new Blob(dataToDownload, {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    const d = dayjs();
    const zeroPad = (n, digits) => n.toString().padStart(digits, '0');
    element.download = "nurims-" + zeroPad(d.year(),4) + zeroPad(d.month(), 2) +
      zeroPad(d.day(), 2) + "-" + zeroPad(d.hour(), 2) + zeroPad(d.minute(), 2) + ".log";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  onClearLogsClick = () => {
    this.props.logs.length = 0;
    this.forceUpdate();
  }

  updateLogWindow = () => {
    if (this.ref.current) {
      this.ref.current.scroll();
    }
  }

  highlight = (code) => {
    return highlight_logs(code);
  }

  render() {
    const {visible, onClose, width, height, theme, logs} = this.props;
    return (
      <Drawer
        variant="temporary"
        anchor={"bottom"}
        open={visible}
        onClose={onClose}
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {boxSizing: 'border-box', backgroundColor: 'inherit', backgroundImage: 'inherit'},
        }}
      >
        <div
          style={{
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            display: "flex",
            flexGrow: 1,
            padding: 20,
            height: height,
            marginLeft: 'auto',
            width: `calc(100vw - ${width})`
          }}
        >
          <List dense>
            <ListItem>
              <ListItemButton
                sx={{padding: 0}}
                onClick={this.onDownloadClick}
                title={"Download logs"}
                aria-label={"Download logs"}
              >
                <ListItemIcon style={{color: theme.palette.background.paper1, minWidth: 0}}>
                  <DownloadIcon/>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton
                sx={{padding: 0}}
                onClick={this.onClearLogsClick}
                title={"Clear logs"}
                aria-label={"Clear logs"}
              >
                <ListItemIcon style={{color: theme.palette.background.paper1, minWidth: 0}}>
                  <DeleteForeverIcon/>
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
          <LargeScrollableList
            ref={this.ref}
            theme={theme}
            forceScroll={false}
            className={"hl-window"}
            items={logs}
            highlight={this.highlight}
            maxItems={500}
          />
        </div>
      </Drawer>
    )
  }
}

LogWindow.propTypes = {
  logs: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  width: PropTypes.string,
}

LogWindow.defaultProps = {
  onClose: () => {},
  width: '100%',
}

export default withTheme(LogWindow)
