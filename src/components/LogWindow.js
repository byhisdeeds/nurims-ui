import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  List
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
import Editor from 'react-simple-code-editor';
import {
  highlight_logs,
} from "../utils/HighlightUtils";
import dayjs from 'dayjs';


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

  highlight = (code) => {
    return highlight_logs(code);
  }

  scrollToEnd = () => {
    this.ref.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
    this.forceUpdate();
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
          <Editor
            ref={this.ref}
            className={"hl-editor"}
            readOnly={true}
            fullwidth={true}
            value={logs.join("\n")}
            data-color-mode={theme.palette.mode}
            onValueChange={code => {
            }}
            highlight={this.highlight}
            padding={10}
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.primary.light,
              fontSize: 12,
              fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              width: "100%",
              overflowY: "auto",
            }}
          />
        </div>
      </Drawer>
    )
  }
}

LogWindow.propTypes = {
  visible: PropTypes.bool.isRequired,
  logs: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  width: PropTypes.string,
  // height: PropTypes.number,
}

LogWindow.defaultProps = {
  onClose: () => {},
  width: '100%',
  // height: 200,
}

export default withTheme(LogWindow)
