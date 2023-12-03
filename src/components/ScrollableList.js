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
    this.Module = SCROLLABLELIST_REF;
  }

  render() {
    const {theme, forceScroll, className, items, highlight, height, maxItems} = this.props;
    // trim messages array size to maximum
    if (items.length > maxItems) {
      items.splice(0, items.length - maxItems);
      console.log("++++ trimming ", items.length)
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
          height: height
        }}
      >
        <ScrollableFeed
          forceScroll={forceScroll}
          className={className}
        >
          {items.map((item, i) => <div key={i}>{highlight(item)}</div>)}
        </ScrollableFeed>
      </div>    )
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
  highlight: () => {},
  forceScroll: false,
  className: "",
  items: [],
  maxItems: 100,
  height: "calc(100% - 0px)",
}

export default withTheme(ScrollableList)
