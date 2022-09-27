import * as React from 'react';
import PagedRecordList from "../../components/PagedRecordList";

class StorageList extends React.Component {
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

  getListRecords = () => {
    return (this.ref.current) ? this.ref.current.getRecords() : [];
  }

  updateListRecord = (record) => {
    if (this.ref.current) {
      this.ref.current.updateRecord(record);
    }
  }

  setListRecords = (records) => {
    if (this.ref.current) {
      this.ref.current.setRecords(records);
    }
  }

  render() {
    return (
      <PagedRecordList
        ref={this.ref}
        onListItemSelection={this.props.onSelection}
        // requestListUpdate={this.props.requestListUpdate}
        includeArchived={this.props.includeArchived}
        title={this.props.title}
        enableRecordArchiveSwitch={true}
      />
    )
  }
}

export default StorageList
