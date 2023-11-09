import React, {useState} from "react";
import PropTypes from 'prop-types'
import {
  Paper,
  FormControl,
  Toolbar,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  CircularProgress,
  ButtonBase,
  FormControlLabel,
  Switch,
  OutlinedInput,
  useTheme,
  ListItemText,
  ListItemIcon,
  Checkbox,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  Tooltip,
  IconButton,
  TableHead,
  TableSortLabel,
  Fab, Button, Badge
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider
} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import {visuallyHidden} from "@mui/utils";
import Floater from 'react-floater';
import {
  getRecordData,
  isRecordArchived,
  isRecordChanged,
  isRecordCreatedBy,
  isRecordEmpty,
  toBoolean
} from "../utils/MetadataUtils";
import {
  NotificationImportant,
  HourglassEmpty,
  HourglassFull,
  NetworkCheck,
  Person,
  DeleteForever, People
} from '@mui/icons-material';
import {isValidUserRole} from "../utils/UserUtils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PublishIcon from '@mui/icons-material/Publish';
import {
  ITEM_ID,
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB,
  NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST,
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVER,
  NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_DATE,
  NURIMS_OPERATION_DATA_IRRADIATIONAUTHORIZER,
  NURIMS_OPERATION_DATA_IRRADIATIONDURATION,
  NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES,
  NURIMS_OPERATION_DATA_NEUTRONFLUX,
  NURIMS_OPERATION_DATA_PROPOSED_IRRADIATION_DATE,
  UNDEFINED_DATE_STRING
} from "../utils/constants";
import DoneIcon from "@mui/icons-material/Done";
import ArchiveIcon from "@mui/icons-material/Archive";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import DeleteIcon from "@mui/icons-material/Delete";


export function TitleComponent({title}) {
  return (
    <Typography variant="h5" component="div" sx={{paddingLeft: 2}}>{title}</Typography>
  );
}

TitleComponent.propTypes = {
  title: PropTypes.string.isRequired
}


function TooltipContent(closeFn) {
  return (
    <Box sx={{width: 300, height: 100, backgroundColor: 'rgba(121,152,223,0.1)', color: '#dadada'}}>
      <h4 align="center">
        I'm a custom component acting as modal. No arrow and centered
      </h4>
      <ButtonBase
        onClick={closeFn}
        padding="sm"
        style={{position: 'absolute', right: 16, top: 16}}
      >
        <Person name="close" size={24}/>
      </ButtonBase>
    </Box>
  );
}


export function BackgroundTasks(props) {
  const theme = useTheme();
  if (props.active) {
    return (
      <Tooltip title="Background tasks active.">
        {<HourglassFull
          sx={{
            color: theme.palette.warning.light,
            paddingLeft: '10px',
            marginLeft: '10px',
            width: 32,
            height: 32
          }}
        />
        }
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title="No background tasks active.">
        {<HourglassEmpty
          sx={{
            color: theme.palette.text.disabled,
            paddingLeft: '10px',
            marginLeft: '10px',
            width: 32,
            height: 32
          }}
        />
        }
      </Tooltip>
    )
  }
}

BackgroundTasks.propTypes = {
  active: PropTypes.bool.isRequired
}

export function NetworkConnection(props) {
  const theme = useTheme();
  return (
    <Tooltip title={props.ready ? "Online" : "Offline"}>
      <NetworkCheck sx={{
        color: props.ready ? theme.palette.success.main : theme.palette.error.main,
        paddingLeft: '10px',
        marginLeft: '10px',
        width: 32,
        height: 32
      }}/>
    </Tooltip>
  )
}

NetworkConnection.propTypes = {
  ready: PropTypes.bool.isRequired
}

export function LogWindowButton(props) {
  const theme = useTheme();
  return (
    <Tooltip title="Toggle Log window">
      <ReceiptLongOutlinedIcon sx={{
        color: theme.palette.text.disabled,
        paddingLeft: '10px',
        marginLeft: '10px',
        width: 32,
        height: 32
      }} onClick={props.onClick}/>
    </Tooltip>
  )
}

LogWindowButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export function NotificationsButton(props) {
  const theme = useTheme();
  return (
    <Badge
      sx={{
        marginLeft: "10px",
        paddingLeft: "10px"
      }}
      variant={"dot"}
      aria-describedby={props.id}
      onClick={props.onClick}
      badgeContent={props.numUnreadMessages}
      showZero={false}
      overlap={"circular"}
      color={props.numMessages > 0 ? "primary" : "secondary"}
    >
      <NotificationsIcon
        sx={{color: props.numUnreadMessages === 0 ? props.numMessages === 0 ? "#7e7d7d" : "#e3c69d" : "#e3c69d"}}
      />
    </Badge>
  )
}

NotificationsButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  numUnreadMessages: PropTypes.number.isRequired,
  numMessages: PropTypes.number.isRequired
}

export function BasePaper(props) {
  return (
    <Paper style={{height: 'calc(100vh - 20px)'}}>
      {props.children}
    </Paper>
  );
}

BasePaper.propTypes = {
  children: PropTypes.element.isRequired
}


export function BasicToolbar(props) {
  return (
    <Toolbar style={{paddingLeft: 8, marginTop: 9, paddingRight: 8}}>
      {props.children}
    </Toolbar>
  );
}

BasicToolbar.propTypes = {
  children: PropTypes.element.isRequired
}

export function SelectFormControl({id, label, children}) {
  return (
    <FormControl style={{paddingRight: 8, marginTop: 8}} variant="outlined">
      <InputLabel id={id}>
        {label}
      </InputLabel>
      {children}
    </FormControl>
  );
}

SelectFormControl.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
}

export function CheckboxWithTooltip({id, label, checked, onChange, disabled, tooltip, padding, required}) {
  return (
    <FormControl style={{paddingLeft: padding, marginTop: padding, width: '100%'}} variant="outlined">
      <FormControlLabel
        control={
          <Checkbox
            required={required}
            checked={toBoolean(checked)}
            onChange={onChange}
            name={id}
            disabled={disabled}
          />
        }
        label={label}
      />
    </FormControl>
  );
}

CheckboxWithTooltip.defaultProps = {
  padding: 8,
  tooltip: "",
  disabled: false,
  checked: false,
  required: false,
};

CheckboxWithTooltip.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  checked: PropTypes.bool,
  tooltip: PropTypes.string,
  disabled: PropTypes.bool,
  padding: PropTypes.number,
}

export function SelectFormControlWithTooltip({
                                               id, label, value, onChange, options, disabled, tooltip, placement,
                                               padding, multiple
                                             }) {
  return (
    <FormControl style={{paddingRight: padding, marginTop: padding, marginLeft: padding, width: '100%'}}
                 variant="outlined">
      <Floater
        content={tooltip}
        showCloseButton={true}
        hideArrow
        placement={placement}
        styles={{
          options: {
            zIndex: 1000,
          },
          floater: {
            filter: 'none',
          },
          close: {
            color: '#ffffff',
          },
          container: {
            backgroundColor: 'rgba(14,14,14,0.87)',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#dedede',
            borderStyle: 'solid',
            color: '#dedede',
            filter: 'none',
            maxWidth: 400,
            minHeight: 40,
            padding: '4px 30px 4px 8px',
            textAlign: 'left',
            top: 8,
          },
          content: {
            fontSize: 16,
          },
          arrow: {
            color: '#000',
            length: 8,
            spread: 10,
          },
        }}
      >
        <InputLabel id={id}>{label}</InputLabel>
      </Floater>
      <Select
        disabled={disabled}
        margin={"none"}
        required
        fullWidth
        multiple={multiple}
        labelId={id}
        label={label}
        id={id}
        name={id}
        value={typeof value === 'string' ? value.split(",") : value}
        onChange={onChange}
        input={<OutlinedInput label={label}/>}
      >
        {options.map((option) => {
          if (typeof option === 'object') {
            return (
              <MenuItem disabled={option.disabled || false} value={option["id"]}>{option["title"]}</MenuItem>
            )
          } else {
            const t = option.split(',');
            if (t.length === 1) {
              return (
                <MenuItem value={t[0]}>{t[0]}</MenuItem>
              )
            } else if (t.length === 2) {
              return (
                <MenuItem value={t[0]}>{t[1]}</MenuItem>
              )
            }
          }
        })}
      </Select>
    </FormControl>
  );
}

SelectFormControlWithTooltip.defaultProps = {
  placement: "left-start",
  padding: 8,
  multiple: false,
};

SelectFormControlWithTooltip.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  disabled: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  placement: PropTypes.string,
  padding: PropTypes.number,
  multiple: PropTypes.bool,
}

export function TextFieldWithTooltip({
                                       id, label, value, onChange, disabled, tooltip, placement, required, lines,
                                       padding, readOnly
                                     }) {
  return (
    <Box style={{paddingRight: padding, marginTop: padding, width: '100%'}}>
      <TextField
        margin={"none"}
        defaultValue={" "}
        disabled={disabled}
        required={required}
        fullWidth
        multiline={lines > 1}
        minRows={lines}
        id={id}
        InputProps={readOnly ? {readOnly: true} : {}}
        label={
          <Floater
            content={tooltip}
            showCloseButton={true}
            hideArrow
            placement={placement}
            styles={{
              options: {
                zIndex: 1000,
              },
              floater: {
                filter: 'none',
              },
              close: {
                color: '#ffffff',
              },
              container: {
                backgroundColor: 'rgba(14,14,14,0.87)',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#dedede',
                borderStyle: 'solid',
                color: '#dedede',
                filter: 'none',
                maxWidth: 400,
                minHeight: 40,
                padding: '4px 30px 4px 8px',
                textAlign: 'left',
                top: 8,
              },
              content: {
                fontSize: 16,
              },
              arrow: {
                color: '#000',
                length: 8,
                spread: 10,
              },
            }}
          >
            {label}
          </Floater>
        }
        value={value}
        onChange={onChange}
      />
    </Box>
  );
}

TextFieldWithTooltip.defaultProps = {
  placement: "left-start",
  required: false,
  lines: 1,
  padding: 8,
  readOnly: false,
};

TextFieldWithTooltip.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  placement: PropTypes.string,
  required: PropTypes.bool,
  lines: PropTypes.number,
  padding: PropTypes.number,
  readOnly: PropTypes.bool,
}

export function DatePickerWithTooltip({
                                        label,
                                        value,
                                        onChange,
                                        disabled,
                                        tooltip,
                                        placement,
                                        inputFormat,
                                        padding,
                                        width
                                      }) {
  return (
    <Box style={{paddingRight: padding, marginTop: padding, display: 'inline-flex'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
        <Box sx={{'& .MuiTextField-root': {width: width}}}>
          <DatePicker
            disabled={disabled}
            label={
              <Floater
                content={tooltip}
                showCloseButton={true}
                hideArrow
                placement={placement}
                styles={{
                  options: {
                    zIndex: 1000,
                  },
                  floater: {
                    filter: 'none',
                  },
                  close: {
                    color: '#ffffff',
                  },
                  container: {
                    backgroundColor: 'rgba(14,14,14,0.87)',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#dedede',
                    borderStyle: 'solid',
                    color: '#dedede',
                    filter: 'none',
                    maxWidth: 400,
                    minHeight: 40,
                    padding: '4px 30px 4px 8px',
                    textAlign: 'left',
                    top: 8,
                  },
                  content: {
                    fontSize: 16,
                  },
                  arrow: {
                    color: '#000',
                    length: 8,
                    spread: 10,
                  },
                }}
              >
                {label}
              </Floater>
            }
            inputFormat={inputFormat}
            value={value}
            onChange={onChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

DatePickerWithTooltip.defaultProps = {
  placement: "left-start",
  inputFormat: "yyyy-MM-dd",
  padding: 0,
  width: "18ch",
};

DatePickerWithTooltip.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  placement: PropTypes.string,
  inputFormat: PropTypes.string,
  padding: PropTypes.number,
  width: PropTypes.string,
}

export function MonitorTypeSelect({value, onChange, monitorTypes, width}) {
  const label = 'Monitor Type';
  const labelId = 'monitor-type-select-label';
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        style={{width: width}}
        labelId={labelId}
        value={value}
        onChange={onChange}
        label={label}
      >
        {monitorTypes.map(monitor => {
          const t = monitor.split(',');
          if (t.length === 1) {
            return (
              <MenuItem value={t[0]}>{t[0]}</MenuItem>
            )
          } else if (t.length === 2) {
            return (
              <MenuItem value={t[0]}>{t[1]}</MenuItem>
            )
          }
        })}
      </Select>
    </SelectFormControl>
  );
}

MonitorTypeSelect.propTypes = {
  width: PropTypes.string,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  monitorTypes: PropTypes.array.isRequired
}

MonitorTypeSelect.defaultProps = {
  width: "30ch",
}

export function DateRangePicker({
                                  from, to, fromLabel, toLabel, disabled, onToChange, onFromChange, inputFormat,
                                  width, views
                                }) {
  return (
    <Box sx={{display: 'flex'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
        <DatePicker
          renderInput={(props) => <TextField style={{paddingRight: 8, marginTop: 8}} {...props} />}
          label={fromLabel}
          value={from}
          views={views}
          inputFormat={inputFormat}
          onChange={onFromChange}
          disabled={disabled}
        />
        <DatePicker
          renderInput={(props) => <TextField style={{paddingRight: 8, marginTop: 8}} {...props} />}
          label={toLabel}
          value={to}
          views={views}
          inputFormat={inputFormat}
          onChange={onToChange}
          disabled={disabled}
        />
      </LocalizationProvider>
    </Box>
  )
}

DateRangePicker.defaultProps = {
  inputFormat: "yyyy-MM-dd",
  width: "20ch",
  views: ['year', 'month', 'day'],
  fromLabel: " Start ",
  endLabel: " End ",
  onToChange: (date) => {
  },
  onFromChange: (date) => {
  },
  renderInput: (props) => <TextField style={{paddingRight: 8, marginTop: 8}} {...props} />,
};

DateRangePicker.propTypes = {
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onToChange: PropTypes.func,
  renderInput: PropTypes.func,
  onFromChange: PropTypes.func,
  inputFormat: PropTypes.string,
  fromLabel: PropTypes.string,
  toLabel: PropTypes.string,
  views: PropTypes.array,
}

export function SameYearDateRangePicker({year, from, to, disabled, onYearChange, onToChange, onFromChange}) {
  return (
    <Box sx={{display: 'flex'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
        <DatePicker
          renderInput={(props) => <TextField
            style={{width: "12ch", paddingRight: 8, marginTop: 8}} {...props} />}
          label=" Year "
          value={year}
          views={["year"]}
          inputFormat={"yyyy"}
          onChange={onYearChange}
          disabled={disabled}
        />
        <DatePicker
          renderInput={(props) => <TextField
            style={{width: "18ch", paddingRight: 8, marginTop: 8}} {...props} />}
          label=" Start Month "
          value={from}
          views={["month"]}
          inputFormat={"MMMM"}
          onChange={onFromChange}
          disabled={disabled}
        />
        <DatePicker
          renderInput={(props) => <TextField
            style={{width: "18ch", paddingRight: 8, marginTop: 8}} {...props} />}
          label=" End Month "
          value={to}
          views={["month"]}
          inputFormat={"MMMM"}
          onChange={onToChange}
          disabled={disabled}
        />
      </LocalizationProvider>
    </Box>
  )
}

SameYearDateRangePicker.propTypes = {
  year: PropTypes.object.isRequired,
  from: PropTypes.object.isRequired,
  to: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onToChange: PropTypes.func.isRequired,
  onFromChange: PropTypes.func.isRequired,
}


export function PageableTable({
                                theme, title, minWidth, cells, defaultOrder, defaultOrderBy, rows, rowsPerPage,
                                rowHeight, onRowSelection, selectedRow, disabled, renderCell, filterElement,
                                selectionMetadataField, filterRows, enableRowFilter, filterTooltip
                              }) {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [selected, setSelected] = useState(selectedRow);
  const [rowFilterValue, setRowFilterValue] = useState("");

  function PageableTableHead(props) {
    const {rowCount, onRequestSort, cells} = props;

    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {cells.map((cell) => (
            <TableCell
              style={{width: cell.width}}
              key={cell.id}
              align={"center"} // {cell.align}
              padding={cell.disablePadding ? 'none' : 'normal'}
              sortDirection={cell.sortField ? order : false}
            >
              <TableSortLabel
                active={cell.sortField}
                hideSortIcon={true}
                direction={orderBy === cell.id ? order : 'asc'}
                onClick={createSortHandler(cell.id)}
              >
                {cell.label}
                {cell.sortField &&
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                }
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function handleSort(event, property) {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  function rowSelectionHandler(row) {
    setSelected(row);
    onRowSelection(row);
  }

  function emptyRows() {
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function onFilterRows(event) {
    console.log("@@@ onFilterRows @@@", event.target.value);
    setRowFilterValue(event.target.value);
    filterRows(event.target.value);
  }

  return (
    <Box>
      <Toolbar
        sx={{
          pl: {sm: 2},
          pr: {xs: 1, sm: 1},
          // bgColor: 'red', //theme.palette.primary.main,
          // opacity: theme.palette.action.activatedOpacity,
          // bgColor: alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }}
      >
        <Typography
          sx={{flex: '1 1 100%'}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>

        {enableRowFilter && <TextField
          id={"name-filter"}
          label={"Filter"}
          onChange={onFilterRows}
          value={rowFilterValue}
          defaultValue={""}
          InputLabelProps={{
            shrink: true,
            transform: 'translate(14px, 4px) scale(1)',
          }}
          inputProps={{
            style: {
              height: 32,
              padding: '0 8px',
            },
          }}
        />}

        <Tooltip title={filterTooltip}>
          <IconButton>
            {filterElement}
          </IconButton>
        </Tooltip>
      </Toolbar>
      <TableContainer>
        <Table
          sx={{minWidth: minWidth}}
          aria-labelledby="tableTitle"
          size={'small'}
        >
          <PageableTableHead
            // numSelected={0}
            // order={order}
            // orderBy={orderBy}
            onRequestSort={handleSort}
            rowCount={rows.length}
            cells={cells}
          />
          <TableBody>
            {rows.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                // const isItemSelected = selected.hasOwnProperty("item_id") && selected.item_id === row.item_id;
                const isItemSelected = selected.hasOwnProperty(selectionMetadataField) &&
                  selected[selectionMetadataField] === row[selectionMetadataField];
                return (
                  <TableRow
                    hover
                    onClick={() => rowSelectionHandler(row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.item_id}
                    selected={isItemSelected}
                    sx={{height: rowHeight}}
                  >{cells.map((cell) => {
                    return (renderCell(row, cell))
                  })}
                    {/*<TableCell align="center" padding="none">{row["item_id"]}</TableCell>*/}
                    {/*<TableCell align="left" padding="none">{row["nurims.title"]}</TableCell>*/}
                  </TableRow>
                );
              })}
            {emptyRows() > 0 && (
              <TableRow
                style={{
                  height: (rowHeight * emptyRows()),
                }}
              >
                <TableCell colSpan={6}/>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[rowsPerPage]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        // onRowsPerPageChange={this.handleChangeRowsPerPage}
      />
    </Box>
  )
}

PageableTable.defaultProps = {
  title: "",
  order: "asc",
  rowsPerPage: 20,
  rowHeight: 24,
  selectedRow: {},
  onRowSelection: (row) => {
  },
  rows: [],
  renderCell: (row, cell) => {
    return (
      <TableCell align={cell.align} padding={cell.disablePadding ? 'none' : 'normal'}>{row[cell.id]}</TableCell>
    )
  },
  filterElement: <div/>,
  enableRowFilter: true,
  filterTooltip: "Include archived records",
  filterRows: (value) => {
  },
};

PageableTable.propTypes = {
  minWidth: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  theme: PropTypes.object,
  title: PropTypes.string,
  cells: PropTypes.array.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string.isRequired,
  rows: PropTypes.array,
  rowsPerPage: PropTypes.number,
  rowHeight: PropTypes.number,
  selectedRow: PropTypes.object,
  onRowSelection: PropTypes.func,
  renderCell: PropTypes.func,
  filterElement: PropTypes.object,
  filterTooltip: PropTypes.string,
  enableRowFilter: PropTypes.bool,
  filterRows: PropTypes.func,
  selectionMetadataField: PropTypes.string.isRequired,
}

export function SwitchComponent({id, label, placement, onChange, value, disabled}) {
  return (
    <Box display="flex" justifyContent="flex-end" sx={{height: '100%'}}>
      <FormControlLabel
        control={<Switch id={id} checked={toBoolean(value)} color="primary" onChange={onChange}/>}
        label={label}
        labelPlacement={placement}
        disabled={disabled}
      />
    </Box>
  )
}

SwitchComponent.defaultProps = {
  placement: "start",
  disabled: false,
}

SwitchComponent.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placement: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

export function AutoCompleteComponent({
                                        isOpen, onOpen, onClose, filterOptions, getOptionLabel, options, loading,
                                        label, busy, onSelected, onChange, freeInput, defaultValue, disabled,
                                        optionId
                                      }) {
  return (
    <Autocomplete
      disabled={disabled}
      style={{width: '100%', paddingRight: 8, marginTop: 8}}
      freeSolo={freeInput}
      autoSelect={true}
      value={defaultValue}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      // filterOptions={filterOptions}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      openOnFocus={false}
      onChange={onSelected}
      renderOption={(props, option) => (
        <li component="li" {...props}>
          {option[optionId]}
        </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          disabled={disabled}
          fullWidth
          variant="outlined"
          onChange={onChange}
          InputLabelProps={{className: 'autocomplete-input-label'}}
          InputProps={{
            ...params.InputProps,
            className: 'autocomplete-input',
            endAdornment: (
              <React.Fragment>
                {loading && busy > 0 ? <CircularProgress color="inherit" size={20}/> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}

AutoCompleteComponent.defaultProps = {
  filterOptions: createFilterOptions({
    matchFrom: 'start',
    stringify: option => option.name,
  }),
  onChange: (event) => {
  },
  onSelected: (event, value) => {
  },
  freeInput: false,
  disabled: false,
  optionId: "name",
  busy: false,
}

AutoCompleteComponent.propTypes = {
  // value: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  isOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  onSelected: PropTypes.func,
  onChange: PropTypes.func,
  getOptionLabel: PropTypes.func.isRequired,
  filterOptions: PropTypes.func,
  options: PropTypes.array.isRequired,
  optionId: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  freeInput: PropTypes.bool,
}

export function DateSelect({value, onChange, disabled, label, inputFormat}) {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en-gb'}>
        <DatePicker
          renderInput={(props) => <TextField
            style={{width: '20ch', paddingRight: 8, marginTop: 8}} {...props} />}
          label={label}
          value={value}
          inputFormat={inputFormat}
          onChange={onChange}
          disabled={disabled}
        />
      </LocalizationProvider>
    </Box>
  )
}

DateSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  inputFormat: PropTypes.string
}

DateSelect.defaultProps = {
  inputFormat: "yyyy-MM-dd"
}


export function AddRemoveArchiveSaveSubmitProvenanceButtonPanel({
                                                                  THIS,
                                                                  user,
                                                                  archiveRecordButtonLabel,
                                                                  unarchiveRecordButtonLabel,
                                                                  archiveRecordIcon,
                                                                  unarchiveRecordIcon,
                                                                  onClickRemoveRecord,
                                                                  removeRecordButtonLabel,
                                                                  onClickSaveRecordChanges,
                                                                  onClickAddRecord,
                                                                  addRecordButtonLabel,
                                                                  onClickChangeRecordArchivalStatus,
                                                                  onClickViewProvenanceRecords,
                                                                  removeRecordIcon,
                                                                  addRecordIcon,
                                                                  addRole,
                                                                  archiveRole,
                                                                  sysadminRole,
                                                                  removeRole,
                                                                  saveRole,
                                                                  submitRole,
                                                                  onClickSubmitRecord,
                                                                  submitRecordButtonLabel,
                                                                  submitRecordIcon,
                                                                  submitDisabled,
                                                                  ignoreSaveDisabledIfNotCreator,
                                                                }) {
  const {selection} = THIS.state;
  const isSysadmin = isValidUserRole(user, sysadminRole);
  const recordHasChanged = isRecordChanged(selection);
  const userIsCreator = ignoreSaveDisabledIfNotCreator ? true : isRecordCreatedBy(selection, user);
  const emptyRecord = Object.keys(selection).length === 0;
  const archiveButtonLabel = THIS.isRecordArchived(selection) ? unarchiveRecordButtonLabel : archiveRecordButtonLabel;
  const archiveIcon = THIS.isRecordArchived(selection) ? unarchiveRecordIcon : archiveRecordIcon;

  console.log("-------------")
  console.log("-- userIsCreator", userIsCreator, "submitDisabled", submitDisabled, "recordHasChanged", recordHasChanged,
    "submitRole", submitRole, "sysadminRole", sysadminRole, "isSelectableByRoles(valid_item_id=false)",
    THIS.isSelectableByRoles(selection, [submitRole, sysadminRole], false), "emptyRecord", emptyRecord)
  console.log("-------------")
  return (
    <Box sx={{'& > :not(style)': {m: 1}}} style={{textAlign: 'center'}}>
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="add"
        onClick={onClickAddRecord}
        // disabled={!THIS.isSelectableByRoles(selection, [addRole, sysadminRole], false)}
        disabled={!THIS.isSelectableByRoles(selection, [addRole, sysadminRole], false)}
      >
        &#160; {addRecordButtonLabel} &#160;
        {addRecordIcon}
      </Fab>
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="remove"
        onClick={onClickRemoveRecord}
        disabled={emptyRecord || !THIS.isSelectableByRoles(selection, [removeRole, sysadminRole], true)}
      >
        &#160; {removeRecordButtonLabel} &#160;
        {removeRecordIcon}
      </Fab>
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="save"
        onClick={onClickSaveRecordChanges}
        // disabled={((!isCreator && submitDisabled) && !recordHasChanged) || !THIS.isSelectableByRoles(selection, [submitRole, sysadminRole], false)}
        // disabled if no record is not changed
        // disabled={submitDisabled || (!(userIsCreator && THIS.isSelectableByRoles(selection, [submitRole, sysadminRole], false)))}
        disabled={emptyRecord || !userIsCreator || !recordHasChanged ||
          !THIS.isSelectableByRoles(selection, [submitRole, sysadminRole], false)}
      >
        &#160; Save Changes &#160;
        <SaveIcon sx={{mr: 1}}/>
      </Fab>
      {isSysadmin &&
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="view-provenance"
          onClick={onClickViewProvenanceRecords}
          disabled={emptyRecord || !THIS.isValidSelection(selection)}
        >
          &#160; View Provenance Records &#160;
          <VisibilityIcon sx={{mr: 1}}/>
        </Fab>
      }
      {submitRecordButtonLabel &&
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="submit"
          onClick={onClickSubmitRecord}
          // disabled={(!userIsCreator && submitDisabled) || !THIS.isSelectableByRoles(selection, [submitRole, sysadminRole], false)}
          disabled={emptyRecord || !userIsCreator ||
            !THIS.isSelectableByRoles(selection, [submitRole, sysadminRole], true)}
        >
          &#160; {submitRecordButtonLabel} &#160;
          {submitRecordIcon}
        </Fab>
      }
      <Fab
        variant="extended"
        size="small"
        color="primary"
        aria-label="archive"
        component={"span"}
        onClick={onClickChangeRecordArchivalStatus}
        disabled={emptyRecord || !THIS.isSelectableByRoles(selection, [archiveRole, sysadminRole], true)}
      >
        &#160; {archiveButtonLabel} &#160;
        {archiveIcon}
      </Fab>
    </Box>
  )
}

AddRemoveArchiveSaveSubmitProvenanceButtonPanel.propTypes = {
  THIS: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onClickRemoveRecord: PropTypes.func.isRequired,
  onClickSaveRecordChanges: PropTypes.func.isRequired,
  onClickAddRecord: PropTypes.func.isRequired,
  archiveRecordButtonLabel: PropTypes.string,
  archiveRecordIcon: PropTypes.element,
  unarchiveRecordButtonLabel: PropTypes.string,
  unarchiveRecordIcon: PropTypes.element,
  archiveRole: PropTypes.string,
  addRecordButtonLabel: PropTypes.string,
  addRecordIcon: PropTypes.element,
  onClickChangeRecordArchivalStatus: PropTypes.func.isRequired,
  onClickViewProvenanceRecords: PropTypes.func.isRequired,
  removeRecordIcon: PropTypes.element,
  removeRecordButtonLabel: PropTypes.string,
  addRole: PropTypes.string,
  sysadminRole: PropTypes.string,
  removeRole: PropTypes.string,
  saveRole: PropTypes.string,
  submitRole: PropTypes.string,
  onClickSubmitRecord: PropTypes.func,
  submitRecordButtonLabel: PropTypes.element,
  submitRecordIcon: PropTypes.element,
  submitDisabled: PropTypes.bool,
  saveOnlyByCreator: PropTypes.bool,
  submitOnlyByCreator: PropTypes.bool,
  ignoreSaveDisabledIfNotCreator: PropTypes.bool,
}

AddRemoveArchiveSaveSubmitProvenanceButtonPanel.defaultProps = {
  removeRecordIcon: <RemoveCircleIcon sx={{mr: 1}}/>,
  addRecordIcon: <AddCircleOutlineIcon sx={{mr: 1}}/>,
  archiveRecordButtonLabel: "Archive Record",
  archiveRecordIcon: <VisibilityIcon sx={{mr: 1}}/>,
  unarchiveRecordButtonLabel: "Restore Record",
  unarchiveRecordIcon: <VisibilityOffIcon sx={{mr: 1}}/>,
  archiveRole: "",
  submitRecordIcon: null,
  addRecordButtonLabel: "Add Record",
  removeRecordButtonLabel: "Remove Record",
  addRole: "",
  sysadminRole: "sysadmin",
  removeRole: "",
  saveRole: "",
  submitRole: "",
  submitRecordButtonLabel: null,
  onClickSubmitRecord: () => {
  },
  submitDisabled: false,
  saveOnlyByCreator: false,
  submitOnlyByCreator: false,
  ignoreSaveDisabledIfNotCreator: false,
}

export function AddRemoveArchiveSaveProvenanceButtonPanel({
                                                            THIS,
                                                            user,
                                                            sysadminRole,
                                                            onClickDeleteRecord,
                                                            deleteRecordIcon,
                                                            deleteRecordButtonLabel,
                                                            deleteRecordRole,
                                                            disableDeleteRecordButton,
                                                            onClickSaveRecord,
                                                            saveRecordIcon,
                                                            saveRecordButtonLabel,
                                                            saveRecordRole,
                                                            disableSaveRecordButton,
                                                            onClickAddRecord,
                                                            addRecordIcon,
                                                            addRecordButtonLabel,
                                                            addRecordRole,
                                                            disableAddRecordButton,
                                                            showViewProvenanceRecordButton,
                                                            onClickViewProvenanceRecords,
                                                            viewProvenanceRecordIcon,
                                                            viewProvenanceRecordButtonLabel,
                                                            viewProvenanceRecordRole,
                                                            disableViewProvenanceRecordButton,
                                                            showArchiveRecordButton,
                                                            onClickArchiveRecords,
                                                            archiveRecordIcon,
                                                            unarchiveRecordIcon,
                                                            archiveRecordButtonLabel,
                                                            unarchiveRecordButtonLabel,
                                                            archiveRecordRole,
                                                            disableArchiveRecordButton,
                                                            ignoreSaveDisabledIfNotCreator,
                                                          }) {
  const {selection} = THIS.state;
  const isSysadmin = isValidUserRole(user, sysadminRole);
  const recordHasChanged = isRecordChanged(selection);
  const userIsCreator = ignoreSaveDisabledIfNotCreator ? true : isRecordCreatedBy(selection, user);
  const emptyRecord = isRecordEmpty(selection);
  const archiveButtonLabel = isRecordArchived(selection) ? unarchiveRecordButtonLabel : archiveRecordButtonLabel;
  const archiveIcon = isRecordArchived(selection) ? unarchiveRecordIcon : archiveRecordIcon;

  console.log("===")
  console.log("= userIsCreator", userIsCreator)
  console.log("= recordHasChanged", recordHasChanged)
  console.log("= sysadminRole", sysadminRole)
  console.log("= addRecordRole", addRecordRole)
  console.log("= archiveRecordRole", archiveRecordRole)
  console.log("= isSelectableByRoles(selection, [addRecordRole, sysadminRole], false)",
    THIS.isSelectableByRoles(selection, [addRecordRole, sysadminRole], false))
  console.log("= isSelectableByRoles(selection, [archiveRecordRole, sysadminRole], false)",
    THIS.isSelectableByRoles(selection, [archiveRecordRole, sysadminRole], true))
  console.log("= emptyRecord", emptyRecord)
  console.log("= selection", selection)
  console.log("===")
  return (
    <Box style={{textAlign: 'center', display: 'flex', justifyContent: 'space-around'}}>
      <Button
        size={"small"}
        disabled={!THIS.isSelectableByRoles(selection, [deleteRecordRole, sysadminRole], true) ||
          disableDeleteRecordButton}
        variant="outlined"
        endIcon={deleteRecordIcon}
        onClick={onClickDeleteRecord}
      >
        {deleteRecordButtonLabel}
      </Button>
      <Button
        size={"small"}
        disabled={!recordHasChanged || disableSaveRecordButton}
        variant="outlined"
        endIcon={saveRecordIcon}
        onClick={onClickSaveRecord}
      >
        {saveRecordButtonLabel}
      </Button>
      <Button
        size={"small"}
        disabled={!THIS.isSelectableByRoles(selection, [addRecordRole, sysadminRole], false) ||
          disableAddRecordButton}
        variant="outlined"
        endIcon={addRecordIcon}
        onClick={onClickAddRecord}
      >
        {addRecordButtonLabel}
      </Button>
      {showViewProvenanceRecordButton &&
        <Button
          size={"small"}
          disabled={!THIS.isSelectableByRoles(selection, [viewProvenanceRecordRole, sysadminRole], true) ||
            disableViewProvenanceRecordButton}
          variant="outlined"
          endIcon={viewProvenanceRecordIcon}
          onClick={onClickViewProvenanceRecords}
        >
          {viewProvenanceRecordButtonLabel}
        </Button>
      }
      {showArchiveRecordButton &&
        <Button
          size={"small"}
          disabled={!THIS.isSelectableByRoles(selection, [archiveRecordRole, sysadminRole], true) ||
            disableArchiveRecordButton}
          variant="outlined"
          endIcon={archiveRecordIcon}
          onClick={onClickArchiveRecords}
        >
          {archiveButtonLabel}
          {archiveIcon}
        </Button>
      }
    </Box>
  )
}

AddRemoveArchiveSaveProvenanceButtonPanel.propTypes = {
  THIS: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  sysadminRole: PropTypes.string,
  onClickDeleteRecord: PropTypes.func.isRequired,
  onClickViewProvenanceRecords: PropTypes.func,
  onClickAddRecord: PropTypes.func.isRequired,
  onClickArchiveRecord: PropTypes.func,
  onClickSaveRecord: PropTypes.func.isRequired,
  deleteRecordIcon: PropTypes.element,
  saveRecordIcon: PropTypes.element,
  viewProvenanceRecordIcon: PropTypes.element,
  archiveRecordIcon: PropTypes.element,
  unarchiveRecordIcon: PropTypes.element,
  addRecordIcon: PropTypes.element,
  deleteRecordButtonLabel: PropTypes.string,
  saveRecordButtonLabel: PropTypes.string,
  viewProvenanceRecordButtonLabel: PropTypes.string,
  addRecordButtonLabel: PropTypes.string,
  archiveRecordButtonLabel: PropTypes.string,
  unarchiveRecordButtonLabel: PropTypes.string,
  deleteRecordRole: PropTypes.string,
  addRecordRole: PropTypes.string,
  viewProvenanceRecordRole: PropTypes.string,
  saveRecordRole: PropTypes.string,
  archiveRecordRole: PropTypes.string,
  disableDeleteRecordButton: PropTypes.bool,
  disableSaveRecordButton: PropTypes.bool,
  disableAddRecordButton: PropTypes.bool,
  disableViewProvenanceRecordButton: PropTypes.bool,
  disableArchiveRecordButton: PropTypes.bool,
  showViewProvenanceRecordButton: PropTypes.bool,
  showArchiveRecordButton: PropTypes.bool,
  ignoreSaveDisabledIfNotCreator: PropTypes.bool,
}

AddRemoveArchiveSaveProvenanceButtonPanel.defaultProps = {
  sysadminRole: "sysadmin",
  deleteRecordButtonLabel: "Delete Record",
  deleteRecordRole: "",
  disableAddRecordButton: false,
  disableDeleteRecordButton: false,
  disableSaveRecordButton: false,
  disableViewProvenanceRecordButton: false,
  disableArchiveRecordButton: false,
  addRecordIcon: <AddCircleOutlineIcon sx={{mr: 1}}/>,
  deleteRecordIcon: <RemoveCircleIcon sx={{mr: 1}}/>,
  archiveRecordIcon: <VisibilityIcon sx={{mr: 1}}/>,
  unarchiveRecordIcon: <VisibilityOffIcon sx={{mr: 1}}/>,
  saveRecordIcon: <SaveIcon sx={{mr: 1}}/>,
  viewProvenanceRecordIcon: <VisibilityIcon sx={{mr: 1}}/>,
  saveRecordButtonLabel: "Save Record",
  saveRecordRole: "",
  addRecordButtonLabel: "Add Record",
  addRecordRole: "",
  viewProvenanceRecordButtonLabel: "View Provenance",
  viewProvenanceRecordRole: "sysadmin",
  showViewProvenanceRecordButton: false,
  archiveRecordButtonLabel: "Archive Record",
  archiveRecordRole: "sysadmin",
  showArchiveRecordButton: false,
  unarchiveRecordButtonLabel: "Restore Record",
  ignoreSaveDisabledIfNotCreator: false,
}

export function ApproveIrradiationMessageComponent({
                                                     record, user, disabled, onClickApproveRequest, theme,
                                                     approverRole, buttonLabel
                                                   }) {
  const approver = getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_APPROVER, "");
  // if (approver !== "") {
  //   const fullname = user.users.reduce((prev, obj) => {
  //     if (obj[0] === approver) {
  //       prev = obj[1];
  //     }
  //     return prev;
  //   }, "");
  //   return (
  //     <Button
  //       variant={"outlined"}
  //       // endIcon={<DoneIcon/>}
  //       style={{color: theme.palette.success.contrastText, backgroundColor: theme.palette.success.light}}
  //       aria-label={"authorize"}
  //       disableRipple={true}
  //       fullWidth
  //       sx={{marginTop: 1}}
  //     >
  //       {`Approved by ${fullname}`}
  //     </Button>
  //   )
  // }
  const can_authorize = isValidUserRole(user, approverRole);
  if (can_authorize) {
    let _disabled = false;
    let disabled_hint = "";
    if (Object.keys(record).length === 0) {
      _disabled = true;
    } else if (getRecordData(record, NURIMS_OPERATION_DATA_NEUTRONFLUX,
      "") === "") {
      _disabled = true;
      disabled_hint = "Disabled because no neutron flux specified!";
    } else if (getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONDURATION,
      "") === "") {
      _disabled = true;
      disabled_hint = "Disabled because no irradiation duration specified!";
    } else if (getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_LIST,
      "") === "") {
      _disabled = true;
      disabled_hint = "Disabled because no irradiation sample list specified!";
    } else if (getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATIONSAMPLETYPES,
      []).size === 0) {
      _disabled = true;
      disabled_hint = "Disabled because no irradiation sample types specified!";
    } else if (getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATEDSAMPLE_JOB,
      {name: ""}).name === "") {
      _disabled = true;
      disabled_hint = "Disabled because no irradiation sample job specified!";
    } else if (getRecordData(record, NURIMS_OPERATION_DATA_PROPOSED_IRRADIATION_DATE,
      UNDEFINED_DATE_STRING) === UNDEFINED_DATE_STRING) {
      _disabled = true;
      disabled_hint = "Disabled because no proposed irradiation date specified!";
    } else if (getRecordData(record, NURIMS_OPERATION_DATA_IRRADIATION_AUTHORIZATION_SUBMISSION_DATE,
      UNDEFINED_DATE_STRING) === UNDEFINED_DATE_STRING) {
      _disabled = true;
      disabled_hint = "Disabled because the request has not been submitted for approval.";
    }
    return (
      <Tooltip title={disabled_hint}>
        <span>
          <Button
            disabled={disabled || _disabled}
            variant={"contained"}
            // endIcon={<ArchiveIcon/>}
            onClick={onClickApproveRequest}
            color={"primary"}
            aria-label={"authorize"}
            fullWidth
            sx={{marginTop: 1}}
          >
            {buttonLabel}
          </Button>
        </span>
      </Tooltip>
    )
  } else {
    return (
      <Button
        variant={"outlined"}
        style={{color: theme.palette.warning.contrastText, backgroundColor: theme.palette.warning.light}}
        endIcon={<DoNotDisturbAltIcon/>}
        aria-label={"authorize"}
        disableRipple={true}
        fullWidth
        sx={{marginTop: 1}}
      >
        {`YOU IS NOT AUTHORIZED TO APPROVE IRRADIATIONS.`}
      </Button>
    )
  }
}

ApproveIrradiationMessageComponent.propTypes = {
  record: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClickApproveRequest: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  approverRole: PropTypes.string,
  buttonLabel: PropTypes.element.isRequired,
}

ApproveIrradiationMessageComponent.defaultProps = {
  approverRole: "irradiation_authorizer",
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function AnalyticalIDAutoComplete(props) {
  return (
    <Autocomplete
      style={{width: '40ch', paddingRight: 8, marginTop: 8}}
      open={props.isOpen}
      onOpen={props.onOpen}
      onClose={props.onClose}
      filterOptions={props.filterOptions}
      getOptionLabel={props.getOptionLabel}
      options={props.options}
      loading={props.loading}
      openOnFocus={true}
      onChange={props.onWorkingDirectoryChange}
      renderOption={(p, option) => (
        <Box component="li" {...p}>
          {option.name} [Dir: {option.path.split(props.selectedAnalysisSystem.name)[1]}]
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={"Analytical ID's"}
          fullWidth
          variant="outlined"
          onChange={props.onAnalysisFilesChange}
          InputLabelProps={{className: 'autocomplete-input-label'}}
          InputProps={{
            ...params.InputProps,
            className: 'autocomplete-input',
            endAdornment: (
              <React.Fragment>
                {props.loading && props.busy > 0 ? <CircularProgress color="inherit" size={20}/> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}

export function OutlinedText({value, width, label}) {
  return (
    <TextField
      aria-readonly={true}
      style={{width: width, paddingRight: 8, marginTop: 8,}}
      label={label}
      value={value}
    />
  )
}

OutlinedText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
}

export function OutlinedTextField({id, label, value, width, onChange}) {
  return (
    <TextField
      id={id}
      variant={'outlined'}
      style={{width: width, paddingRight: 8, marginTop: 8,}}
      label={label}
      value={value}
      onChange={onChange}
    />
  )
}

OutlinedTextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  width: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
}

export function AnalysisEngineSelect({value, onChange, engines}) {
  const label = 'Analysis Engine';
  const labelId = 'analysis-engine-select-label';
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        style={{width: 180}}
        labelId={labelId}
        value={value}
        onChange={onChange}
        label={label}
      >
        {engines.map(engine => (
          <MenuItem key={engine.id} value={engine} title={engine.description}>{engine.name}</MenuItem>
        ))}
      </Select>
    </SelectFormControl>
  )
}

AnalysisEngineSelect.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  engines: PropTypes.array.isRequired
}

export function NuclideLibrarySelect({value, onChange, libraryFiles}) {
  const label = 'Nuclide Library';
  const labelId = 'nuclide-library-select-label';
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        style={{width: 300}}
        labelId={labelId}
        value={value}
        onChange={onChange}
        label={label}
      >
        {libraryFiles.map(library => (
          <MenuItem key={library.file_id} value={library}>{library.name}</MenuItem>
        ))}
      </Select>
    </SelectFormControl>
  )
}

NuclideLibrarySelect.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  libraryFiles: PropTypes.array.isRequired
}

export function EnergyCalibrationFileSelect({value, onChange, encalFiles}) {
  const label = 'Energy Calibration File';
  const labelId = 'encal-file-select-label';
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        style={{width: 300}}
        labelId={labelId}
        value={value}
        onChange={onChange}
        label={label}
      >
        {encalFiles.map(file => (
          <MenuItem key={file.file_id} value={file}>{file.name}</MenuItem>
        ))}
      </Select>
    </SelectFormControl>
  )
}

EnergyCalibrationFileSelect.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  encalFiles: PropTypes.array.isRequired
}

export function DecayDuringAcquisitionSelect({value, onChange}) {
  const label = 'Decay During Acquisition';
  const labelId = 'decay-during-acquisition-select-label';
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        style={{width: 350}}
        labelId={labelId}
        value={value}
        onChange={onChange}
        label={label}
      >
        <MenuItem key={'dda-on'} value={true}>Decay During Acquisition Correction</MenuItem>
        <MenuItem key={'dda-off'} value={false}>No Decay During Acquisition Correction</MenuItem>
      </Select>
    </SelectFormControl>
  )
}

DecayDuringAcquisitionSelect.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export function DecayCorrectionSelect({value, onChange}) {
  const label = 'Decay Correction';
  const labelId = 'decay-correction-select-label';
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        style={{width: 350}}
        labelId={labelId}
        value={value}
        onChange={onChange}
        label={label}
      >
        <MenuItem key={'dc-on'} value={true}>Decay During Counting Correction</MenuItem>
        <MenuItem key={'dc-off'} value={false}>No Decay During Counting Correction</MenuItem>
      </Select>
    </SelectFormControl>
  )
}

DecayCorrectionSelect.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export function WpcTableSelect({value, onChange, onOpen, onDelete, disabled, wpcTables, selectedWPCTable}) {
  const label = 'Weight Per Count Table';
  const labelId = 'wpc-tables-select-label';
  console.log("WPC TABLES", wpcTables)
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        style={{width: 500}}
        labelId={labelId}
        value={value}
        onOpen={onOpen}
        disabled={disabled}
        onChange={onChange}
        label={label}
        renderValue={(value) => selectedWPCTable.name}
      >
        {wpcTables.map(table => (
          <MenuItem
            key={table.name}
            value={`${table.path}/${table.file}`}
          >
            <ListItemText primary={table.name}/>
            <ListItemIcon>
              <DeleteForever data-table={JSON.stringify(table)} onClick={onDelete}/>
            </ListItemIcon>
          </MenuItem>
        ))}
      </Select>
    </SelectFormControl>
  )
}

WpcTableSelect.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  wpcTables: PropTypes.array.isRequired,
}

export function AnalysisDataTypesSelect({value, onChange, dataTypes}) {
  const label = 'Data Types';
  const labelId = 'data-types-select-label';
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        multiline
        style={{width: 350}}
        labelId={labelId}
        value={value}
        onChange={onChange}
        label={label}
        renderValue={(selected) => selected.join(', ')}
      >
        {dataTypes.map(dt => (
          <MenuItem key={dt.id} value={dt.name}>
            <Checkbox checked={value.includes(dt.name)}/>
            <ListItemText primary={dt.name} title={dt.info}/>
          </MenuItem>
        ))}
      </Select>
    </SelectFormControl>
  )
}

AnalysisDataTypesSelect.propTypes = {
  value: PropTypes.object.isRequired,
  dataTypes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export function SelectedAnalysisSystemPerformanceMetricSelect({value, onChange, metrics}) {
  const label = 'Performance Metric';
  const labelId = 'performance-metric-select-label';
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        style={{width: 350}}
        labelId={labelId}
        value={value}
        onChange={onChange}
        label={label}
      >
        {metrics.map(m => (
          <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
        ))}
      </Select>
    </SelectFormControl>
  )
}

SelectedAnalysisSystemPerformanceMetricSelect.propTypes = {
  value: PropTypes.object.isRequired,
  metrics: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export function AnalysisJobAutoComplete(props) {
  return (
    <Autocomplete
      style={{width: '40ch', paddingRight: 8, marginTop: 8}}
      open={props.isOpen}
      onOpen={props.onOpen}
      onClose={props.onClose}
      filterOptions={props.filterOptions}
      getOptionLabel={props.getOptionLabel}
      options={props.options}
      loading={props.loading}
      openOnFocus={true}
      onChange={props.onWorkingDirectoryChange}
      renderOption={(p, option) => (
        <Box component="li" {...p}>
          {option.name} [Dir: {option.path.split(props.selectedAnalysisSystem.name)[1]}]
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={"Analytical Job"}
          fullWidth
          variant="outlined"
          onChange={props.onAnalysisFilesChange}
          InputLabelProps={{className: 'autocomplete-input-label'}}
          InputProps={{
            ...params.InputProps,
            className: 'autocomplete-input',
            endAdornment: (
              <React.Fragment>
                {props.loading && props.busy > 0 ? <CircularProgress color="inherit" size={20}/> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}
