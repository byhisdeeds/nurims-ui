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

const LARGESCROLLABLELIST_REF = "LargeScrollableList";

class LargeScrollableList extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.Module = LARGESCROLLABLELIST_REF;
    this.listRef = React.createRef();
    this.ref = React.createRef();
  }

  scroll = () => {
    this.forceUpdate()
    // if (this.ref.current) {
    //   // this.ref.current.scrollToIndex({
    //   //   index: this.props.items.length,
    //   // });
    //   // console.log("-- SCROLL --", this.props.items.length)
    //   this.forceUpdate()
    // }
  }

  getItemHeight = (item) => {
    console.log("-- getItemHeight --", item, this.props.items[item])
    return this.props.lineHeight;
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
    // trim messages array size to maximum
    // if (items.length > maxItems) {
    //   items.splice(0, items.length - maxItems);
    // }
    // if (this.ref.current) {
    //   const scrollToIndex = items.length - 1;
    //   this.ref.current.scrollToIndex({
    //     index: scrollToIndex < 0 ? 0 : scrollToIndex,
    //   });
    // }
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
        {/*<ViewportList*/}
        {/*  ref={this.ref}*/}
        {/*  viewportRef={this.listRef}*/}
        {/*  items={items}*/}
        {/*>*/}
        {/*  {(item, id) => <div className={className} key={id}>{highlight(item)}</div>}*/}
        {/*</ViewportList>*/}
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
