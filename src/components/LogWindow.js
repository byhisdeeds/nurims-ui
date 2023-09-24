import React, {Component} from "react";
import PropTypes from "prop-types";
import {darkTheme, lightTheme} from "../utils/Theme";
import {Drawer} from "@mui/material";
import {withTheme} from "@mui/styles";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {LogViewer, LogViewerSearch} from '@patternfly/react-log-viewer';
import {
  Toolbar,
  ToolbarContent,
  Checkbox,
  ToolbarItem,
  ToolbarGroup,
  Tooltip,
  Button
} from "@patternfly/react-core";
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/components/LogViewer/log-viewer.css';
import '@patternfly/patternfly/components/Toolbar/toolbar.css';

const LOGWINDOW_REF = "LogWindow";

class LogWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollToRow: 0,
      isTextWrapped: false,
      logs: "",
    };
    this.Module = LOGWINDOW_REF;
  }

  toggleTextWrapping = (wrapped) => {
    this.setState({ isTextWrapped: !this.state.isTextWrapped });
  }

  log = (msg) => {
    const message = typeof msg === 'object' ? msg.hasOwnProperty("message") ? msg.message : JSON.stringify(msg) : msg;
    const logs = this.state.logs + (this.state.logs === "" ? "" : "\n") + message;
    const scrollToRow = logs.split("\n").length + 1;
    this.setState({ logs: logs, scrollToRow: scrollToRow })
  }

  onDownloadClick = () => {
    const element = document.createElement('a');
    const dataToDownload = [this.state.logs];
    const file = new Blob(dataToDownload, { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'log-window.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  onClearLogsClick = () => {
    this.setState({ logs: '' });
  }

  render() {
    const {visible, onClose, width, height, theme} = this.props;
    const {logs, isTextWrapped, scrollToRow} = this.state;
    return (
      <Drawer
        variant="temporary"
        anchor={"bottom"}
        open={visible}
        onClose={onClose}
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { boxSizing: 'border-box', backgroundColor: 'inherit', backgroundImage: 'inherit' },
        }}
      >
        <div
          style={{
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            padding: 20,
            height: height,
            marginLeft: 'auto',
            width: `calc(100vw - ${width})`
          }}
        >
          <LogViewer
            isTextWrapped={isTextWrapped}
            hasLineNumbers={true}
            height={height}
            data={logs}
            scrollToRow={scrollToRow}
            theme={'dark'}
            toolbar={
              <Toolbar>
                <ToolbarContent>
                  <ToolbarGroup align={{ default: 'alignLeft' }}>
                    <ToolbarItem>
                      <LogViewerSearch
                        minSearchChars={2}
                        placeholder="Search"
                      />
                    </ToolbarItem>
                    <ToolbarItem alignSelf='center'>
                      <Checkbox
                        label="Wrap text"
                        aria-label="wrap text checkbox"
                        isChecked={isTextWrapped}
                        id="wrap-text-checkbox"
                        onChange={this.toggleTextWrapping}
                      />
                    </ToolbarItem>
                  </ToolbarGroup>
                  <ToolbarGroup align={{ default: 'alignRight' }} variant="icon-button-group">
                    <ToolbarItem>
                      <Tooltip position="top" content={<div>Download</div>}>
                        <Button onClick={this.onDownloadClick} variant="plain" aria-label="Download logs">
                          <DownloadIcon />
                        </Button>
                      </Tooltip>
                    </ToolbarItem>
                    <ToolbarItem>
                      <Tooltip position="top" content={<div>Clear</div>}>
                        <Button onClick={this.onClearLogsClick} variant="plain" aria-label="Clear logs">
                          <DeleteForeverIcon />
                        </Button>
                      </Tooltip>
                    </ToolbarItem>
                  </ToolbarGroup>
                </ToolbarContent>
              </Toolbar>
            }
          />
        </div>
      </Drawer>
    )
  }
}

LogWindow.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.number,
}

LogWindow.defaultProps = {
  onClose: () => {},
  width: '100%',
  height: 200,
}

export default withTheme(LogWindow)
