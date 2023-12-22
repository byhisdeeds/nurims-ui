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
// import LargeScrollableList from "./LargeScrollableList";
// import SyntaxHighlighter from "react-syntax-highlighter/src/light";
// import Editor from "react-simple-code-editor";
// import {highlight, languages} from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-log';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism.css'; //Example style, you can use another
// import Highlight from 'react-highlight'

const LOGWINDOW_REF = "LogWindow";


// export default [
//   'a11y-dark',
//   'a11y-light',
//   'agate',
//   'an-old-hope',
//   'androidstudio',
//   'arduino-light',
//   'arta',
//   'ascetic',
//   'atelier-cave-dark',
//   'atelier-cave-light',
//   'atelier-dune-dark',
//   'atelier-dune-light',
//   'atelier-estuary-dark',
//   'atelier-estuary-light',
//   'atelier-forest-dark',
//   'atelier-forest-light',
//   'atelier-heath-dark',
//   'atelier-heath-light',
//   'atelier-lakeside-dark',
//   'atelier-lakeside-light',
//   'atelier-plateau-dark',
//   'atelier-plateau-light',
//   'atelier-savanna-dark',
//   'atelier-savanna-light',
//   'atelier-seaside-dark',
//   'atelier-seaside-light',
//   'atelier-sulphurpool-dark',
//   'atelier-sulphurpool-light',
//   'atom-one-dark',
//   'atom-one-dark-reasonable',
//   'atom-one-light',
//   'brown-paper',
//   'codepen-embed',
//   'color-brewer',
//   'darcula',
//   'dark',
//   'default-style',
//   'docco',
//   'dracula',
//   'far',
//   'foundation',
//   'github',
//   'github-gist',
//   'gml',
//   'googlecode',
//   'gradient-dark',
//   'gradient-light',
//   'grayscale',
//   'gruvbox-dark',
//   'gruvbox-light',
//   'hopscotch',
//   'hybrid',
//   'idea',
//   'ir-black',
//   'isbl-editor-dark',
//   'isbl-editor-light',
//   'kimbie.dark',
//   'kimbie.light',
//   'lightfair',
//   'lioshi',
//   'magula',
//   'mono-blue',
//   'monokai',
//   'monokai-sublime',
//   'night-owl',
//   'nnfx',
//   'nnfx-dark',
//   'nord',
//   'obsidian',
//   'ocean',
//   'paraiso-dark',
//   'paraiso-light',
//   'pojoaque',
//   'purebasic',
//   'qtcreator_dark',
//   'qtcreator_light',
//   'railscasts',
//   'rainbow',
//   'routeros',
//   'school-book',
//   'shades-of-purple',
//   'solarized-dark',
//   'solarized-light',
//   'srcery',
//   'stackoverflow-dark',
//   'stackoverflow-light',
//   'sunburst',
//   'tomorrow',
//   'tomorrow-night',
//   'tomorrow-night-blue',
//   'tomorrow-night-bright',
//   'tomorrow-night-eighties',
//   'vs',
//   'vs2015',
//   'xcode',
//   'xt256',
//   'zenburn'
// ];


const initialCodeString = `function createStyleObject(classNames, style) {
  return classNames.reduce((styleObject, className) => {
    return {...styleObject, ...style[className]};
  }, {});
}

function createClassNameString(classNames) {
  return classNames.join(' ');
}

// this comment is here to demonstrate an extremely long line length, well beyond what you should probably allow in your own code, though sometimes you'll be highlighting code you can't refactor, which is unfortunate but should be handled gracefully

function createChildren(style, useInlineStyles) {
  let childrenCount = 0;
  return children => {
    childrenCount += 1;
    return children.map((child, i) => createElement({
      node: child,
      style,
      useInlineStyles,
    }));
  }
}

function createElement({ node, style, useInlineStyles, key }) {
  const { properties, type, tagName, value } = node;
  if (type === 'text') {
    return value;
  } else if (tagName) {
    const TagName = tagName;
    const childrenCreator = createChildren(style, useInlineStyles);
    const props = (
      useInlineStyles
      ? { style: createStyleObject(properties.className, style) }
      : { className: createClassNameString(properties.className) }
    );
    const children = childrenCreator(node.children);
    return <TagName key={key} {...props}>{children}</TagName>;
  }
}
  `;

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
      this.ref.current.forceUpdate();
    }
  }

  highlight = (code) => {
    return highlight_logs(code);
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
            forceScroll={true}
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
