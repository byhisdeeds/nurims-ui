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

const LOGWINDOW_REF = "LogWindow";


// function createClassNameString(classNames) {
//   return classNames.join(' ');
// }
//
// // this comment is here to demonstrate an extremely long line length, well beyond what you should probably allow in your own code, though sometimes you'll be highlighting code you can't refactor, which is unfortunate but should be handled gracefully
//
// function createChildren(style, useInlineStyles) {
//   let childrenCount = 0;
//   return children => {
//     childrenCount += 1;
//     return children.map((child, i) => createElement({
//       node: child,
//       style,
//       useInlineStyles,
//     }));
//   }
// }
//
// function createElement({ node, style, useInlineStyles, key }) {
//   const { properties, type, tagName, value } = node;
//   if (type === 'text') {
//     return value;
//   } else if (tagName) {
//     const TagName = tagName;
//     const childrenCreator = createChildren(style, useInlineStyles);
//     const props = (
//       useInlineStyles
//       ? { style: createStyleObject(properties.className, style) }
//       : { className: createClassNameString(properties.className) }
//     );
//     const children = childrenCreator(node.children);
//     return <TagName key={key} {...props}>{children}</TagName>;
//   }
// }
//   `;

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
      this.ref.current.updateScroll(true);
      // this.ref.current.forceUpdate();
    }
  }

  highlight = (code, className) => {
    return highlight_logs(code, className);
  }

  setCode = (code) => {
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
          <ScrollableList
            ref={this.ref}
            theme={theme}
            className={"hl-window"}
            items={logs}
            highlight={this.highlight}
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
