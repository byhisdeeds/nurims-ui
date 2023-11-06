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
import ReactQuill from "react-quill";
import JoditEditor from "jodit-react";
// import Jodit from "jodit";
import {
  ConsoleLog,
  UserContext
} from "../utils/UserContext";

const LOGWINDOW_REF = "LogWindow";

class LogWindow extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      // scrollToRow: 0,
      // isTextWrapped: true,
      // logs: "",
    };
    this.Module = LOGWINDOW_REF;
    this.editorRef = React.createRef();
    // all options from https://xdsoft.net/jodit/docs/,
    this.config = {
      readonly: true,
      width: "100%",
      height: "auto",
      spellcheck: false,
      i18n: "en",
      toolbar: true,
      useSplitMode: false,
      defaultMode: 2, // Source editor
      buttons: [
        'copyformat', '|',
        'print',
      ],
    };
    // this.modules = {
    //   toolbar: false
    //   // [
    //   //   [{'header': [1, 2, false]}],
    //   //   // [{'header': '1'}, {'header': '2'}, {'font': Font.whitelist}],
    //   //   ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    //   //   [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    //   //   ['link', 'image'],
    //   //   ['clean']
    //   // ]
    // };
    // this.formats = [
    //   'header',
    //   'bold', 'italic', 'underline', 'strike', 'blockquote',
    //   'list', 'bullet', 'indent',
    //   'link', 'image'
    // ];
  }

  toggleTextWrapping = (wrapped) => {
    this.setState({ isTextWrapped: !this.state.isTextWrapped });
  }

  // log = (msg) => {
  //   let message = typeof msg === 'object' ? msg.hasOwnProperty("message") ? msg.message : JSON.stringify(msg) : msg;
  //   if (!message.startsWith("[")) {
  //     message = "[" + new Date().toISOString().substring(0, 19).replace("T", " ") + "] " + message;
  //   }
  //   const logs = this.state.logs + (this.state.logs === "" ? "" : "\n") + message;
  //   const scrollToRow = logs.split("\n").length + 1;
  //   this.setState({ logs: logs, scrollToRow: scrollToRow })
  // }

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

  handleChange = (value) => {
    this.setState({logs: value});
  }

  render() {
    const {visible, onClose, width, height, theme, logs} = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "logs", logs, "width", width, "height", height);
    }
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
          <JoditEditor
            ref={this.editorRef}
            value={logs}
            config={this.config}
            tabIndex={-1} // tabIndex of textarea
            // onBlur={newContent => setContent(logs)} // preferred to use only this option to update the content for performance reasons
            // onChange={newContent => {}}
          />
          {/*<LogViewer*/}
          {/*  isTextWrapped={isTextWrapped}*/}
          {/*  hasLineNumbers={true}*/}
          {/*  height={height}*/}
          {/*  data={logs}*/}
          {/*  scrollToRow={scrollToRow}*/}
          {/*  theme={'dark'}*/}
          {/*  toolbar={*/}
          {/*    <Toolbar>*/}
          {/*      <ToolbarContent>*/}
          {/*        <ToolbarGroup align={{ default: 'alignLeft' }}>*/}
          {/*          <ToolbarItem>*/}
          {/*            <LogViewerSearch*/}
          {/*              minSearchChars={2}*/}
          {/*              placeholder="Search"*/}
          {/*            />*/}
          {/*          </ToolbarItem>*/}
          {/*          <ToolbarItem alignSelf='center'>*/}
          {/*            <Checkbox*/}
          {/*              label="Wrap text"*/}
          {/*              aria-label="wrap text checkbox"*/}
          {/*              isChecked={isTextWrapped}*/}
          {/*              id="wrap-text-checkbox"*/}
          {/*              onChange={this.toggleTextWrapping}*/}
          {/*            />*/}
          {/*          </ToolbarItem>*/}
          {/*        </ToolbarGroup>*/}
          {/*        <ToolbarGroup align={{ default: 'alignRight' }} variant="icon-button-group">*/}
          {/*          <ToolbarItem>*/}
          {/*            <Tooltip position="top" content={<div>Download</div>}>*/}
          {/*              <Button onClick={this.onDownloadClick} variant="plain" aria-label="Download logs">*/}
          {/*                <DownloadIcon />*/}
          {/*              </Button>*/}
          {/*            </Tooltip>*/}
          {/*          </ToolbarItem>*/}
          {/*          <ToolbarItem>*/}
          {/*            <Tooltip position="top" content={<div>Clear</div>}>*/}
          {/*              <Button onClick={this.onClearLogsClick} variant="plain" aria-label="Clear logs">*/}
          {/*                <DeleteForeverIcon />*/}
          {/*              </Button>*/}
          {/*            </Tooltip>*/}
          {/*          </ToolbarItem>*/}
          {/*        </ToolbarGroup>*/}
          {/*      </ToolbarContent>*/}
          {/*    </Toolbar>*/}
          {/*  }*/}
          {/*/>*/}
        </div>
      </Drawer>
    )
  }
}

LogWindow.propTypes = {
  visible: PropTypes.bool.isRequired,
  logs: PropTypes.string.isRequired,
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
