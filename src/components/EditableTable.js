import React, {useState} from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import {withStyles} from '@mui/styles';
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import "./EditableTable.css";
import classNames from "classnames";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import {getDateFromDateString, getMetadataValue} from "../utils/MetadataUtils";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import {isDisabled} from "@testing-library/user-event/dist/utils";

const Input = ({
                 name,
                 error,
                 validation,
                 childHasError,
                 columnDataArr,
                 value,
                 classes,
                 tableName,
                 ...props
               }) => {
  const [hasError, setError] = useState(false);
  const handleOnChange = e => {
    const hasError = validation(e, columnDataArr);
    if (!hasError) {
      childHasError(true);
      setError(true);
    } else {
      childHasError(false);
      setError(false);
    }
    props.onChange(e);
  };

  return (
    <>
      <div
        // className={classNames(
        //   classes.inputWrapperDiv,
        //   `inputWrapperDiv${tableName}`
        // )}
      >
        <input
          // className={classNames(classes.input, `input${tableName}`)}
          name={name}
          value={value || ""}
          onChange={handleOnChange}
        />
        {/*<p className={classNames(classes.error, `error${tableName}`)}>*/}
        <p>
          {hasError && error}
        </p>
      </div>
    </>
  );
};

const OurSelect = ({name, value, selectMessage, options,  classes, width, tableName, disabled, ...props }) => {
  const handleSelect = e => {
    props.onChange(e);
  };
  return (
    <FormControl
      sx={{minWidth: width}}
      // className={classNames(
      //   classes.selectFormControl,
      //   `selectFormControl_${tableName}`
      // )}
    >
      <InputLabel
        // className={classNames(
        //   classes.selectInputLabel,
        //   `selectInputLabel_${tableName}`
        // )}
        htmlFor={name}
      >
        {selectMessage}
      </InputLabel>
      <Select
        disabled={disabled}
        // className={classNames(classes.select, `select_${tableName}`)}
        value={value || ""}
        onChange={handleSelect}
        inputProps={{
          name: name,
          id: name
        }}
      >
        {(options || []).map(item => {
          return (
            <MenuItem
              // className={classNames(
              //   classes.selectMenuItem,
              //   `selectMenutItem_${tableName}`
              // )}
              key={item.value}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
const EditableRow = ({
                       fieldsArr = [],
                       editData = {},
                       allRowsData,
                       tableName,
                       disabled,
                       classes = {},
                       editingIndex,
                       isEditing,
                       selectClasses,
                       inputClasses,
                       ...props
                     }) => {
  let initializeObj = {};
  fieldsArr.forEach(item => {
    initializeObj[item.name] = "";
  });
  const [rowHasError, setRowHasError] = useState(false);
  const [rowData, setRowData] = useState(
    editData ? Object.assign({}, initializeObj, editData) : initializeObj
  );
  const handleSave = () => {
    props.handleSave(rowData);
  };
  const handleOnChange = e => {
    const updatedData = Object.assign({}, rowData, {
      [e.target.name]: e.target.value
    });
    setRowData(updatedData);
  };
  const handleOnChangeDate = d => {
    const updatedData = Object.assign({}, rowData, {
      ["date"]: d.toISOString().substring(0,10)
    });
    setRowData(updatedData);
  };
  const handleCancel = () => {
    if (isEditing) {
      props.handleCancel(editingIndex);
    } else {
      props.handleCancel();
    }
  };
  return (
    <TableRow
      // className={classNames(classes.tableBodyRow, `tableBodyRow_${tableName}`)}
    >
      {fieldsArr.map((item, i) => {
        return (
          <TableCell
            // className={classNames(
            //   classes.tableBodyCell,
            //   `tableBodyCell_${tableName}`
            // )}
            key={i}
          >
            {item.type === "select" ? (
              <OurSelect
                disabled={disabled}
                tableName={tableName}
                width={item.width}
                // classes={{
                //   ...selectClasses
                // }}
                name={item.name}
                onChange={handleOnChange}
                options={item.options}
                value={rowData[item.name]}
                childHasError={bool => setRowHasError(bool)}
                error={item.error}
                selectMessage={item.selectMessage}
                validation={item.validation}
              />
            ) : item.type === "date" ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{'& .MuiTextField-root': {width: item.width}}}>
                  <DatePicker
                    disabled={disabled}
                    label="Date Of Birth"
                    inputFormat={"yyyy-MM-dd"}
                    name={item.name}
                    value={rowData[item.name]}
                    onChange={handleOnChangeDate}
                    // onChange={this.handleDobChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </LocalizationProvider>
            ) : (
              <Input
                disabled={disabled}
                columnDataArr={(allRowsData || []).map(
                  obj => obj.rowData[item.name]
                )}
                tableName={tableName}
                sx={{minWidth: item.width}}
                // classes={{...inputClasses}}
                type={item.type}
                name={item.name}
                onChange={handleOnChange}
                value={rowData[item.name]}
                item={item.name}
                childHasError={bool => setRowHasError(bool)}
                error={item.error}
                validation={item.validation}
              />
            )}
          </TableCell>
        );
      })}
      <TableCell
        // className={classNames(
        //   classes.tableBodyCell,
        //   `tableBodyCell_${tableName}`
        // )}
      >
        <Button
          // className={classNames(classes.saveBtn, `saveBtn${tableName}`)}
          disabled={rowHasError || disabled}
          type="button"
          onClick={handleSave}
        >
          <SaveIcon />
        </Button>

        <Button
          disabled={disabled}
          // className={classNames(classes.cancelBtn, `cancelBtn${tableName}`)}
          onClick={handleCancel}
        >
          <CancelIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};

const Row = ({
               data,
               handleEditRow,
               fieldsArr,
               classes,
               tableName,
               disabled,
               handleDeleteRow,
               isAdding,
               isEditing
             }) => {
  return (
    <TableRow
      // className={classNames(classes.tableBodyRow, `tableBodyRow_${tableName}`)}
    >
      {Object.keys(data).map(key => {
        // console.log("FIELDS-ATTR", fieldsArr)
        // console.log("KEY", key, data)
        let width = 32;
        for (const f of fieldsArr) {
          if (f.name === key) {
            width = f.width;
            break;
          }
        }
        return (
          <TableCell
            sx={{minWidth: width}}
            // className={classNames(
            //   classes.tableBodyCell,
            //   `tableBodyCell_${tableName}`
            // )}
          >
            {data[key]}
          </TableCell>
        );
      })}
      <TableCell
        // className={classNames(
        //   classes.tableBodyCell,
        //   `tableBodyCell_${tableName}`
        // )}
      >
        <Button
          disabled={isAdding || isEditing || disabled}
          // className={classNames(classes.editBtn, `editBtn_${tableName}`)}
          onClick={handleEditRow}
        >
          <EditIcon />
        </Button>

        <Button
          disabled={isAdding || isEditing || disabled}
          // className={classNames(classes.deleteBtn, `deleteBtn_${tableName}`)}
          onClick={handleDeleteRow}
        >
          <DeleteIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allRowsData: (this.props.defaultData || []).map(item => ({
        isEditing: false,
        rowData: item
      })),
      isAdding: false,
      isEditing: false,
      editingIndex: null
    };
  }

  setRowData = (data) => {
    const allRowsData = this.state.allRowsData;
    allRowsData.length = 0;
    for (const d of data) {
      allRowsData.push({
        isEditing: false,
        rowData: d
      });
    }
    // allRowsData = (data || []).map(item => ({
    //   isEditing: false,
    //   rowData: item
    // }));
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    console.log(data)
    console.log(allRowsData)
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    this.setState({ allRowsData: allRowsData });
  }

  handleSave = row => {
    if (this.state.isEditing) {
      const arr = this.state.allRowsData.map((item, i) => {
        if (i === this.state.editingIndex) {
          return {
            isEditing: false,
            rowData: row
          };
        } else return item;
      });
      this.setState({allRowsData: arr, editingIndex: null, isEditing: false}, this.setToParent);
    } else {
      this.setState(
        {
          allRowsData: [
            ...this.state.allRowsData,
            {isEditing: false, rowData: row}
          ],
          isAdding: false
        },
        this.setToParent
      );
    }
  };
  setToParent = () => {
    const formatedData = this.state.allRowsData.map(
      ({rowData}, i) => rowData
    );
    this.props.getData(formatedData);
  };
  handleCancel = index => {
    if (this.state.isEditing) {
      const arr = this.state.allRowsData.map((item, i) => {
        if (i === index) {
          return {
            isEditing: false,
            rowData: item.rowData
          };
        } else return item;
      });
      this.setState({allRowsData: arr, editingIndex: null, isEditing: false});
    } else {
      this.setState({isAdding: false});
    }
  };

  handleDeleteRow = index => {
    const arr = this.state.allRowsData.filter((item, i) => i !== index);
    this.setState(
      {
        allRowsData: arr
      },
      this.setToParent
    );
  };
  handleEditRow = index => {
    const arr = this.state.allRowsData.map((item, i) => {
      if (i === index) {
        return {
          isEditing: true,
          rowData: item.rowData
        };
      } else return item;
    });
    this.setState({allRowsData: arr, editingIndex: index, isEditing: true});
  };

  render() {
    const {
      disabled = false,
      fieldsArr = [],
      classes = {},
      tableName,
      addRowBtnText,
      initWithoutHead
    } = this.props;
    const {allRowsData = [], isAdding, editingIndex, isEditing} = this.state;
    let headRow = [
      ...fieldsArr.map(item => ({label: item.label, name: item.name, align: item.align})), {label: "Actions", name: "actions", align: 'left'}
    ];
    const showHeader =
      initWithoutHead && !allRowsData.length && !isAdding ? false : true;
    return (
      <>
        {/*<Table className={classNames(classes.table, `table_${tableName}`)}>*/}
        <Table>
          {showHeader && (
            // <TableHead className={classNames(classes.tableHead)}>
            <TableHead>
              <TableRow
                // className={classNames(
                //   classes.tableHeadRow,
                //   `tableHeadRow_${tableName}`
                // )}
              >
                {headRow.map(({label, name, align}, i) => (
                  <TableCell
                    sx={{textAlign: align}}
                    // className={classNames(
                    //   classes.tableHeadCell,
                    //   classes[`tableHeadCell${name}`],
                    //   `tableHeadCell_${tableName} tableHeadCell_${name}`
                    // )}
                    key={i}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}
          <TableBody
            // className={classNames(classes.tableBody, `tableBody_${tableName}`)}
          >
            {!!allRowsData.length && allRowsData.map(({isEditing, rowData}, i) => {
              return isEditing ? (
                <EditableRow
                  disabled={disabled}
                  tableName={tableName}
                  isEditing={isEditing}
                  editingIndex={editingIndex}
                  // selectClasses={{
                  //   selectFormControl: classes.selectFormControl,
                  //   selectInputLabel: classes.selectInputLabel,
                  //   select: classes.select,
                  //   selectMenuItem: classes.selectMenuItem
                  // }}
                  // inputClasses={{
                  //   inputWrapperDiv: classes.inputWrapperDiv,
                  //   input: classes.input,
                  //   error: classes.error
                  // }}
                  // classes={{
                  //   tableBodyRow: classes.tableBodyRow,
                  //   tableBodyCell: classes.tableBodyCell,
                  //   tableCellRow: classes.tableCellRow,
                  //   saveBtn: classes.saveBtn,
                  //   cancelBtn: classes.cancelBtn
                  // }}
                  allRowsData={this.state.allRowsData}
                  editData={rowData}
                  handleSave={this.handleSave}
                  handleCancel={this.handleCancel}
                  fieldsArr={fieldsArr}
                />
              ) : (
                <Row
                  disabled={disabled}
                  key={i}
                  tableName={tableName}
                  fieldsArr={fieldsArr}
                  // classes={{
                  //   tableBodyRow: classes.tableBodyRow,
                  //   tableBodyCell: classes.tableBodyCell,
                  //   tableCellRow: classes.tableCellRow,
                  //   editBtn: classes.editBtn,
                  //   deleteBtn: classes.deleteBtn
                  // }}
                  isAdding={isAdding}
                  isEditing={this.state.isEditing}
                  handleEditRow={() => this.handleEditRow(i)}
                  handleDeleteRow={() => this.handleDeleteRow(i)}
                  data={rowData}
                />
              );
            })}
            {isAdding && (
              <EditableRow
                disabled={disabled}
                tableName={tableName}
                allRowsData={this.state.allRowsData}
                // selectClasses={{
                //   selectFormControl: classes.selectFormControl,
                //   selectInputLabel: classes.selectInputLabel,
                //   select: classes.select,
                //   selectMenuItem: classes.selectMenuItem
                // }}
                // inputClasses={{
                //   inputWrapperDiv: classes.inputWrapperDiv,
                //   input: classes.input,
                //   error: classes.error
                // }}
                // classes={{
                //   tableBodyRow: classes.tableBodyRow,
                //   tableBodyCell: classes.tableBodyCell,
                //   saveBtn: classes.saveBtn,
                //   cancelBtn: classes.cancelBtn,
                //   tableCellRow: classes.tableCellRow
                // }}
                handleSave={this.handleSave}
                handleCancel={this.handleCancel}
                fieldsArr={fieldsArr}
              />
            )}
          </TableBody>
        </Table>
        <Box sx={{pt:2}}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            // className={classNames(classes.addBtn, `addBtn_${tableName}`)}
            disabled={isAdding || isEditing || disabled}
            onClick={() => this.setState({isAdding: true})}
          >
            {addRowBtnText || "Add Row"}
          </Button>
        </Box>
      </>
    );
  }
}

const styles = () => ({
  table: {},
  tableHead: {},
  tableHeadRow: {},
  tableHeadCell: {},
  tableBody: {},
  tableBodyRow: {},
  tableBodyCell: {},
  inputWrapperDiv: {},
  input: {},
  error: {},
  selectFormControl: {},
  selectInputLabel: {},
  select: {},
  selectMenuItem: {},
  saveBtn: {},
  cancelBtn: {},
  addBtn: {},
  deleteBtn: {},
  editBtn: {}
});

export default withStyles(styles)(EditableTable);
