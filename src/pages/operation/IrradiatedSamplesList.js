import React, {Component} from "react";
import PagedRecordList from "../../components/PagedRecordList";
import PropTypes from "prop-types";
import {
  ITEM_ID,
  NURIMS_TITLE,
  NURIMS_TITLE_SUBTITLE
} from "../../utils/constants";

class IrradiatedSamplesList extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  removeRecord = (record) => {
    if (this.ref.current) {
      this.ref.current.removeRecord(record);
    }
  }

  addRecords = (records, skipIfRecordInList) => {
    if (this.ref.current) {
      this.ref.current.addRecords(records, skipIfRecordInList);
    }
  }

  getRecords = () => {
    return (this.ref.current) ? this.ref.current.getRecords() : [];
  }

  updateRecord = (record) => {
    if (this.ref.current) {
      this.ref.current.updateRecord(record);
    }
  }

  setRecords = (records) => {
    // fixup subtitle date field
    console.log("$$$$", typeof records, Array.isArray(records), records.length)
    for (const record of records) {
      console.log("==>", record)
      record[NURIMS_TITLE_SUBTITLE] = record[NURIMS_TITLE_SUBTITLE].substring(0, 10);
    }
    if (this.ref.current) {
      this.ref.current.setRecords(records);
    }
  }

  render() {
    return (
      <PagedRecordList
        ref={this.ref}
        height={this.props.height}
        onListItemSelection={this.props.onSelection}
        requestGetRecords={this.props.requestGetRecords}
        includeArchived={this.props.includeArchived}
        title={this.props.title}
        enableRecordArchiveSwitch={this.props.enableRecordArchiveSwitch}
      />
    )
  }
}

IrradiatedSamplesList.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default IrradiatedSamplesList
