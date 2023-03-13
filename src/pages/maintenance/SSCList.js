import * as React from 'react';
import PagedRecordList from "../../components/PagedRecordList";
import PropTypes from "prop-types";
import {ConsoleLog, UserDebugContext} from "../../utils/UserDebugContext";

export const SSCLIST_REF = "SSCList";

class SSCList extends React.Component {
  static contextType = UserDebugContext;

  constructor(props) {
    super(props);
    this.selection = {};
    this.pref=React.createRef();
    this.module = SSCLIST_REF;
  }

  removeRecord = (record) => {
    if (this.pref.current) {
      this.pref.current.removeRecord(record);
    }
  }

  addRecords = (records, skipIfRecordInList) => {
    if (this.pref.current) {
      this.pref.current.addRecords(records, skipIfRecordInList);
    }
  }

  getRecords = () => {
    return (this.pref.current) ? this.pref.current.getRecords() : [];
  }

  updateRecord = (record) => {
    if (this.pref.current) {
      this.pref.current.updateRecord(record);
    }
  }

  setRecords = (records) => {
    if (this.pref.current) {
      this.pref.current.setRecords(records);
    }
  }

  render() {
    if (this.context.debug) {
      ConsoleLog(this.module, "render");
    }
    return (
      <PagedRecordList
        ref={this.pref}
        onListItemSelection={this.props.onSelection}
        requestGetRecords={this.props.requestGetRecords}
        includeArchived={this.props.includeArchived}
        title={this.props.title}
        enableRecordArchiveSwitch={this.props.enableRecordArchiveSwitch}
        enableRowFilter={this.props.enableRowFilter}
      />
    )
  }
}

SSCList.defaultProps = {
  enableRowFilter: true,
}

SSCList.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
  enableRowFilter: PropTypes.bool,
}

export default SSCList
