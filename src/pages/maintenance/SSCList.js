import * as React from 'react';
import PagedRecordList from "../../components/PagedRecordList";
import PropTypes from "prop-types";

class SSCList extends React.Component {
  constructor(props) {
    super(props);
    this.pref=React.createRef();
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
    return (
      <PagedRecordList
        ref={this.pref}
        onListItemSelection={this.props.onSelection}
        requestListUpdate={this.props.requestListUpdate}
        includeArchived={this.props.includeArchived}
        title={this.props.title}
        enableRecordArchiveSwitch={this.props.enableRecordArchiveSwitch}
      />
    )
  }
}

SSCList.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default SSCList
