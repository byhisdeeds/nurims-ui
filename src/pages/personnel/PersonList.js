import * as React from 'react';
import PagedRecordList from "../../components/PagedRecordList";
import PropTypes from "prop-types";
import {
  ConsoleLog,
  UserContext
} from "../../utils/UserContext";

class PersonList extends React.Component {
  static contextType = UserContext;

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
    if (this.context.debug) {
      ConsoleLog("PersonList", "render");
    }
    return (
      <PagedRecordList
        ref={this.ref}
        rowsPerPage={15}
        onListItemSelection={this.props.onSelection}
        requestGetRecords={this.props.requestGetRecords}
        title={this.props.title}
        filterTooltip={"Include unmonitored personnel records"}
        includeArchived={this.props.includeArchived}
        enableRecordArchiveSwitch={this.props.enableRecordArchiveSwitch}
      />
    )
  }
}

PersonList.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default PersonList