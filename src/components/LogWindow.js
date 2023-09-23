import React, {Component} from "react";
import PropTypes from "prop-types";
import {darkTheme, lightTheme} from "../utils/Theme";
import {Drawer} from "@mui/material";
import {withTheme} from "@mui/styles";
import {LogViewer, LogViewerSearch} from '@patternfly/react-log-viewer';
import {Toolbar, ToolbarContent, Checkbox, ToolbarItem} from "@patternfly/react-core";
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
    const logs = this.state.logs + (this.state.logs === "" ? "" : "\n") + (typeof msg === 'object' ? JSON.stringify(msg) : msg);
    const scrollToRow = logs.split("\n").length;
    this.setState({ logs: logs, scrollToRow: scrollToRow })
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
            height={200}
            data={logs}
            scrollToRow={scrollToRow}
            theme={'dark'}
            toolbar={
              <Toolbar>
                <ToolbarContent>
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
