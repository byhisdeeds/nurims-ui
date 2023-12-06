import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  withTheme
} from "@mui/styles";
import {
  UserContext
} from "../utils/UserContext";
import { ViewportList } from 'react-viewport-list';
import {VariableSizeList as List} from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import ReactDOMServer from "react-dom/server";

const LARGESCROLLABLELIST_REF = "LargeScrollableList";

class LargeScrollableList extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.Module = LARGESCROLLABLELIST_REF;
    this.listRef = React.createRef();
    this.ref = React.createRef();
  }

  /**
   * @description Retrieve the width and/or heigh of a React element without rendering and committing the element to the DOM.
   *
   * @param {object} elementJSX - The target React element written in JSX.
   * @return {object}
   * @public
   * @function
   *
   * @example
   *
   * const { width, height } = getReactElementSize( <div style={{ width: "20px", height: "40px" }} ...props /> );
   * console.log(`W: ${width}, H: ${height});  // W: 20, H: 40
   *
   */
  getReactElementSize = (elementJSX) => {

    const elementString = ReactDOMServer.renderToStaticMarkup(elementJSX);
    const elementDocument = new DOMParser().parseFromString(elementString, "text/html");
    const elementNode = elementDocument.getRootNode().body.firstChild;
    const container = document.createElement("div");
    const containerStyle = {
      display: "block",
      position: "absolute",
      boxSizing: "border-box",
      margin: "0",
      padding: "0",
      visibility: "hidden"
    };
    Object.assign(container.style, containerStyle);

    container.appendChild(elementNode);
    document.body.appendChild(container);
    const width = container.clientWidth;
    const height = container.clientHeight;
    container.removeChild(elementNode);
    document.body.removeChild(container);

    return {
      width,
      height
    };
  }

  // scroll = () => {
  //   this.forceUpdate()
  //   // if (this.ref.current) {
  //   //   // this.ref.current.scrollToIndex({
  //   //   //   index: this.props.items.length,
  //   //   // });
  //   //   // console.log("-- SCROLL --", this.props.items.length)
  //   //   this.forceUpdate()
  //   // }
  // }

  getItemHeight = (item) => {
    const {width, height} = this.getReactElementSize(
      <div className={this.props.className} style={{width: "100%"}}>{this.props.items[item]}</div>
    )
    return height;
  }

  renderListItem = (item) => {
    return (
      <div key={item} style={item.style} className={this.props.className}>
        {this.props.highlight(item.data[item.index])}
      </div>
    )
  }

  render() {
    const {theme, forceScroll, items, lineHeight, highlight, height, maxItems} = this.props;
    return (
      <div
        ref={this.listRef}
        data-color-mode={theme.palette.mode}
        style={{
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.light,
          overflowY: "auto",
          width: "100%",
          height: this.props.height
        }}
      >
        <AutoSizer>
          {({height, width}) => (
            <List
              height={height}
              itemCount={items.length}
              itemSize={this.getItemHeight}
              width={width}
              estimatedItemSize={lineHeight}
              itemData={items}
            >
              {this.renderListItem}
            </List>
          )}
        </AutoSizer>
      </div>
    )
  }
}

LargeScrollableList.propTypes = {
  height: PropTypes.string,
  highlight: PropTypes.func,
  theme: PropTypes.object.isRequired,
  logs: PropTypes.array.isRequired,
  forceScroll: PropTypes.bool,
  classname: PropTypes.string.isRequired,
  items: PropTypes.array,
  maxItems: PropTypes.number,
  lineHeight: PropTypes.number,
}

LargeScrollableList.defaultProps = {
  highlight: () => {},
  forceScroll: false,
  className: "",
  items: [],
  maxItems: 100,
  lineHeight: 16,
  height: "calc(100% - 0px)",
}

export default withTheme(LargeScrollableList)
