import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  withTheme
} from "@mui/styles";
import {
  UserContext
} from "../utils/UserContext";
import { ViewportList } from 'react-viewport-list';

const LARGESCROLLABLELIST_REF = "LargeScrollableList";

class LargeScrollableList extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.Module = LARGESCROLLABLELIST_REF;
    this.ref = React.createRef();
    // this.items = [{id: 1, title: 'wwww'},{ id: 2, title: 'www3rt435w'},{id: 3, title: 'wwccvww'}]
  }

  getItemBoundingClientRect = (element) => {
    console.log("--->", element)
    return element.getBoundingClientRect()
  }

  render() {
    const {theme, forceScroll, items, className, highlight, height, maxItems} = this.props;
    // trim messages array size to maximum
    // if (items.length > maxItems) {
    //   items.splice(0, items.length - maxItems);
    // }
    console.log(">>>>>", items)
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
        <ViewportList
          // viewportRef={this.ref}
          items={items}
          // itemSize={20}
          // getItemBoundingClientRect={this.getItemBoundingClientRect}
          // itemMinSize={40}
          // margin={8}
          // forceScroll={forceScroll}
          // className={className}
        >
          {(item, id) => <div className={className} key={id}>{highlight(item)}</div>}
        </ViewportList>
      </div>    )
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
}

LargeScrollableList.defaultProps = {
  highlight: () => {},
  forceScroll: false,
  className: "",
  items: [],
  maxItems: 100,
  height: "calc(100% - 0px)",
}

export default withTheme(LargeScrollableList)
