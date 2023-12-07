import * as React from 'react';
import PagedRecordList from "../../components/PagedRecordList";
import PropTypes from "prop-types";
import {
  ITEM_ID,
  NURIMS_TITLE
} from "../../utils/constants";

class RoutineMaintenanceList extends React.Component {
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
        height={this.props.height}
        onListItemSelection={this.props.onSelection}
        requestGetRecords={this.props.requestGetRecords}
        includeArchived={this.props.includeArchived}
        title={this.props.title}
        enableRecordArchiveSwitch={this.props.enableRecordArchiveSwitch}
        cells={[
          {
            id: ITEM_ID,
            align: 'center',
            disablePadding: true,
            label: 'ID',
            width: '10%',
            sortField: true,
          },
          {
            id: NURIMS_TITLE,
            align: 'left',
            disablePadding: true,
            label: 'Name',
            width: '60%',
            sortField: true,
          },
          {
            id: "nurims.title.subtitle",
            align: 'center',
            disablePadding: true,
            label: 'Date',
            width: '30%',
            sortField: true,
            format: (v) => {return v.replace("T", " ").substring(0, 19)},
          },
        ]}
      />
    )
  }
}

RoutineMaintenanceList.propTypes = {
  ref: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired,
  properties: PropTypes.func.isRequired,
  enableRecordArchiveSwitch: PropTypes.bool.isRequired,
}

export default RoutineMaintenanceList
