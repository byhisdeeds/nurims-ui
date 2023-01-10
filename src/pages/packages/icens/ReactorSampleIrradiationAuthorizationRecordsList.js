import * as React from 'react';
import PagedRecordList from "../../../components/PagedRecordList";
import PropTypes from "prop-types";

class ReactorSampleIrradiationAuthorizationRecordsList extends React.Component {
  constructor(props) {
    super(props);
    this.ref=React.createRef();
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
    if (this.ref.current) {
      this.ref.current.setRecords(records);
    }
  }

  render() {
    return (
      <PagedRecordList
        ref={this.ref}
        onListItemSelection={this.props.onSelection}
        requestGetRecords={this.props.requestGetRecords}
        includeArchived={this.props.includeArchived}
        title={this.props.title}
        enableRecordArchiveSwitch={this.props.enableRecordArchiveSwitch}
      />
    )
  }
}

ReactorSampleIrradiationAuthorizationRecordsList.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default ReactorSampleIrradiationAuthorizationRecordsList
