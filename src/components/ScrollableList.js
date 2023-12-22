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
    // const prevChildren = previousProps.children;
    // const newChildren = newProps.children;
    const prevChildrenCount = React.Children.count(previousProps.children);
    const newChildrenCount = React.Children.count(newProps.children);
    console.log("### changeDetectionFilter ###", prevChildrenCount, newChildrenCount)

    return prevChildrenCount !== newChildrenCount;
    // return prevChildrenCount !== newChildrenCount
    //   && prevChildren[prevChildren.length - 1] !== newChildren[newChildren.length - 1];
  }

  updateIsAtBottomState = (atBottom) => {
    console.log("### updateIsAtBottomState ###", atBottom)
    this.setState({
      isAtBottom: atBottom
    });
  }

  render() {
    const {theme, forceScroll, className, items, highlight, height, maxItems} = this.props;
    // trim messages array size to maximum
    if (items.length > maxItems) {
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
          className={className}
          forceScroll={forceScroll}
          onScroll={this.updateIsAtBottomState}
        >
          {items.map((item, i) => <div key={i}>{highlight(item)}</div>)}
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
  forceScroll: PropTypes.bool,
  classname: PropTypes.string.isRequired,
  items: PropTypes.array,
  maxItems: PropTypes.number,
}

ScrollableList.defaultProps = {
  highlight: (text) => {return text},
  forceScroll: false,
  className: "",
  items: [],
  maxItems: 100,
  height: "calc(100% - 0px)",
}

export default withTheme(ScrollableList)
