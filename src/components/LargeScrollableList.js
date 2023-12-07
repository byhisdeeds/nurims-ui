import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  withTheme
} from "@mui/styles";
import {
  UserContext
} from "../utils/UserContext";
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
    this.scrollToLastItem = true;
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

  getItemHeight = (item) => {
    const itemText = this.props.items.length === 0 ? "&nbsp;" : this.props.items[item];
    const {width, height} = this.getReactElementSize(
      <div className={this.props.className} style={{fontSize: "inherit"}}>{itemText}</div>
    )
    console.log("-- getItemHeight --", height, itemText)
    return height - 8;
  }

  renderListItem = (item) => {
    console.log("-- renderListItem --", item.index, item.data[item.index])
    return (
      <div key={item} style={item.style} className={this.props.className}>
        {this.props.highlight(item.data[item.index])}
      </div>
    )
  }

  onScroll = (scrollObject) => {
    // console.log("=======")
    // console.log("scrollObject:",scrollObject)
    // console.log("items.length:",this.props.items.length)
    // console.log("scrollToLastItem:", this.scrollToLastItem)
    if (this.scrollToLastItem && this.listRef.current) {
      this.listRef.current.scrollToItem(this.props.items.length);
    }
    // console.log("=======")
  }

  onItemsRendered = ({overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex}) => {
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@")
    // console.log("overscanStartIndex:", overscanStartIndex)
    // console.log("overscanStopIndex:", overscanStopIndex)
    // console.log("visibleStartIndex:", visibleStartIndex)
    // console.log("visibleStopIndex:", visibleStopIndex)
    // console.log("items.length:",this.props.items.length)
    // console.log("forceScrollHysterisis:",this.props.forceScrollHysterisis)
    // console.log("forceScroll:",this.props.forceScroll)
    // this.scrollToLastItem = this.props.forceScroll && Math.abs(this.props.items.length - visibleStopIndex) < this.props.forceScrollHysterisis
    this.scrollToLastItem = Math.abs(this.props.items.length - visibleStopIndex) < this.props.forceScrollHysterisis
    // console.log("scrollToLastItem:", this.scrollToLastItem)
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@")
  }

  render() {
    const {theme, forceScroll, items, lineHeight, fontSize, height, maxItems} = this.props;
    if (this.scrollToLastItem && this.listRef.current) {
      // console.log("scroll to ", items.length)
      this.listRef.current.scrollToItem(items.length);
    }
    return (
      <div
        data-color-mode={theme.palette.mode}
        style={{
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.light,
          overflowY: "auto",
          width: "100%",
          fontSize: fontSize,
          height: this.props.height
        }}
      >
        <AutoSizer>
          {({height, width}) => (
            <List
              ref={this.listRef}
              onScroll={this.onScroll}
              onItemsRendered={this.onItemsRendered}
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
  highlight: PropTypes.func,
  theme: PropTypes.object.isRequired,
  forceScroll: PropTypes.bool,
  classname: PropTypes.string.isRequired,
  items: PropTypes.array,
  height: PropTypes.string,
  fontSize: PropTypes.number,
  lineHeight: PropTypes.number,
  forceScrollHysterisis: PropTypes.number,
}

LargeScrollableList.defaultProps = {
  highlight: () => {},
  forceScroll: true,
  className: "",
  items: [],
  height: "calc(100% - 0px)",
  fontSize: 14,
  lineHeight: 16,
  forceScrollHysterisis: 5,
}

export default withTheme(LargeScrollableList)
