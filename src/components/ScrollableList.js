import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  withTheme
} from "@mui/styles";
import {
  UserContext
} from "../utils/UserContext";
import Highlight from "react-highlight";
import 'highlight.js/styles/agate.css'


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
        <Highlight className='accesslog' language="accesslog">
          {`::1 - - [18/Dec/2023:07:23:42 -0500] "GET /nurims/css/leaflet.css HTTP/1.1" 200 14657 "http://localhost/nurims/?debug" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
          function foo() { return 'bar' }`}
        </Highlight>
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
  highlight: () => {},
  forceScroll: false,
  className: "",
  items: [],
  maxItems: 100,
  height: "calc(100% - 0px)",
}

export default withTheme(ScrollableList)
