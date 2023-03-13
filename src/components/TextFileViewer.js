import React, {Component} from "react";
import PropTypes from "prop-types";
import {withTheme} from "@mui/styles";
import {ConsoleLog, UserDebugContext} from "../utils/UserDebugContext";

class TextFileViewer extends Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.state = {
      file: props.file,
    }
    this.Module = "TextFileViewer";
  }

  getText = (file) => {
    if (file.uri.startsWith("data:application/analysis-report;")) {
      const index = file.uri.substring(0, 64).indexOf("base64,");
      if (index !== -1) {
        const s = atob(file.uri.substring(index+7));
        return this.renderHtml(s);
      }
    }
    return this.renderHtml(file.uri);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.file !== this.props.file) {
      // Re-render for every update
      this.setState({
        file: this.props.file,
      });
    }
  }

  renderHtml(line) {
    return "<pre>" + line.replace(/\\n/g,"<br/>") + "<br/></pre>";
  }

  render() {
    const {stdout} = this.state;
    const {style} = this.props;
    if (this.context.debug) {
      ConsoleLog(this.Module, "render", "stdout", stdout);
    }
    return (
      <div
        style={Object.assign({
          fontSize: 12,
          backgroundColor: "#000000",
          color: "#cbcbcb",
          whiteSpace: "pre",
          overflowX: "hidden",
          overflowY: "auto"
        }, style)}
        dangerouslySetInnerHTML={{__html: this.getText(this.props.file)}}
      />
    )
  }
}

TextFileViewer.propTypes = {
  style: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
}

export default withTheme(TextFileViewer)
