import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  withTheme
} from "@mui/styles";
import {
  UserContext
} from "../utils/UserContext";
import ScrollableFeed from "react-scrollable-feed";


const SCROLLABLELIST_REF = "ScrollableList";

class ScrollableList extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      isAtBottom: true,
    };
    this.Module = SCROLLABLELIST_REF;
  }

  changeDetectionFilter = (previousProps, newProps) => {
    const prevChildrenCount = React.Children.count(previousProps.children);
    const newChildrenCount = React.Children.count(newProps.children);
    return prevChildrenCount !== newChildrenCount;
  }

  updateIsAtBottomState = (atBottom) => {
    console.log("### updateIsAtBottomState ###", atBottom)
    this.setState({
      isAtBottom: atBottom
    });
  }

  updateScroll = (updateWhenAtBottom) => {
    if (updateWhenAtBottom && this.state.isAtBottom) {
      this.setState({
        isAtBottom: true
      });
    }
  }

  render() {
    const {theme, forceScroll, className, items, highlight, height, maxItems} = this.props;
    // trim messages array size to maximum
    if (maxItems !== -1 && items.length > maxItems) {
      items.splice(0, items.length - maxItems);
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
          height: height,
          textWrap: "balance"
        }}
      >
        <ScrollableFeed
          className={"feed"}
          forceScroll={false}
          onScroll={this.updateIsAtBottomState}
          changeDetectionFilter={this.changeDetectionFilter}
        >
          {items.map((item, i) => <div key={i}>{highlight(item, className)}</div>)}
        </ScrollableFeed>
      </div>
    )
  }
}

ScrollableList.propTypes = {
  height: PropTypes.string,
  highlight: PropTypes.func,
  theme: PropTypes.object.isRequired,
  logs: PropTypes.array.isRequired,
  classname: PropTypes.string,
  items: PropTypes.array,
  maxItems: PropTypes.number,
}

ScrollableList.defaultProps = {
  highlight: (text) => {return text},
  className: "",
  items: [],
  maxItems: 5000,
  height: "calc(100% - 0px)",
}

export default withTheme(ScrollableList)
