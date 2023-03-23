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
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Checkbox from "@mui/material/Checkbox";
import {Person} from "@mui/icons-material";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import {visuallyHidden} from "@mui/utils";
import Floater from 'react-floater';
import {toBoolean} from "../utils/MetadataUtils";

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
    <Box sx={{ width: 300, height: 100, backgroundColor: 'rgba(121,152,223,0.1)', color: '#dadada' }}>
      <h4 align="center">
        I'm a custom component acting as modal. No arrow and centered
      </h4>
      <ButtonBase
        onClick={closeFn}
        padding="sm"
        style={{ position: 'absolute', right: 16, top: 16 }}
      >
        <Person name="close" size={24} />
      </ButtonBase>
    </Box>
  );
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

export function SelectFormControlWithTooltip({id, label, value, onChange, options, disabled, tooltip, placement,
                                              padding, multiple}) {
  return (
    <FormControl style={{paddingRight: padding, marginTop: padding, width: '100%'}} variant="outlined">
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
        required
        fullWidth
        multiple={multiple}
        labelId={id}
        label={label}
        id={id}
        name={id}
        value={typeof value === 'string' ? value.split(",") : value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
      >
        {options.map((option) => {
          if (typeof option === 'object') {
            return (
              <MenuItem disabled={option.disabled||false} value={option["id"]}>{option["title"]}</MenuItem>
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

export function TextFieldWithTooltip({id, label, value, onChange, disabled, tooltip, placement, required, lines,
                                       padding, readOnly}) {
  return (
    <Box style={{paddingRight: padding, marginTop: padding, width: '100%'}}>
      <TextField
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
            // callback={cb}
            // component={TooltipContent}
            // target={".tooltip-root div"}
            // offset={40}
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

export function DatePickerWithTooltip({label, value, onChange, disabled, tooltip, placement, inputFormat, padding, width}) {
  return (
    <Box style={{paddingRight: padding, marginTop: padding, width: '100%'}}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{'& .MuiTextField-root': {width: width}}}>
          <DatePicker
            disabled={disabled}
            label={
              <Floater
                // callback={cb}
                // component={TooltipContent}
                // target={target}
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
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  placement: PropTypes.string,
  inputFormat: PropTypes.string,
  padding: PropTypes.number,
  width: PropTypes.string,
}

export function MonitorTypeSelect({value, onChange, monitorTypes}) {
  const label='Monitor Type';
  const labelId='monitor-type-select-label';
  return (
    <SelectFormControl id={labelId} label={label}>
      <Select
        style={{width: 180}}
        labelId={labelId}
        value={value}
        onChange={onChange}
        label={label}
      >
        {monitorTypes.map(monitor => (
          <MenuItem key={monitor.name} value={monitor}>{monitor.name}</MenuItem>
        ))}
      </Select>
    </SelectFormControl>
  );
}

MonitorTypeSelect.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  monitorTypes: PropTypes.array.isRequired
}

export function DateRangePicker({from, to, fromLabel, toLabel, disabled, onToChange, onFromChange, inputFormat,
                                  width, views}) {
  return (
    <Box sx={{display: 'flex'}}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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
  onToChange: (date) => {},
  onFromChange: (date) => {},
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
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


export function PageableTable({theme, title, minWidth, cells, defaultOrder, defaultOrderBy, rows, rowsPerPage,
                               rowHeight, onRowSelection, selectedRow, disabled, renderCell, filterElement,
                               selectionMetadataField, filterRows, enableRowFilter}) {

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

        <Tooltip title="Include archived records">
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
            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
            {/*{this.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).sort(getComparator(order, orderBy))*/}
            {rows.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                // const isItemSelected = selected.hasOwnProperty("item_id") && selected.item_id === row.item_id;
                const isItemSelected = selected.hasOwnProperty(selectionMetadataField) &&
                                       selected[selectionMetadataField] === row[selectionMetadataField];
                return (
                  <TableRow
                    hover
                    onClick={()=>rowSelectionHandler(row)}
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
  onRowSelection: (row) => {},
  rows: [],
  renderCell: (row, cell) => { return (
    <TableCell align={cell.align} padding={cell.disablePadding ? 'none' : 'normal'}>{row[cell.id]}</TableCell>
  )},
  filterElement: <div/>,
  enableRowFilter: true,
  filterRows: (value) => {},
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
  enableRowFilter: PropTypes.bool,
  filterRows: PropTypes.func,
  selectionMetadataField: PropTypes.string.isRequired,
}

export function SwitchComponent({id, label, placement, onChange, value}) {
  return (
    <Box display="flex" justifyContent="flex-end" sx={{height: '100%'}}>
      <FormControlLabel
        control={<Switch id={id} checked={toBoolean(value)} color="primary" onChange={onChange}/>}
        label={label}
        labelPlacement={placement}
      />
    </Box>
  )
}

SwitchComponent.defaultProps = {
  placement: "start",
}

SwitchComponent.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placement: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export function AutoCompleteComponent({isOpen, onOpen, onClose, filterOptions, getOptionLabel, options, loading,
                                       label, busy, onSelected, onChange, freeInput, defaultValue, disabled,
                                       optionId}) {
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
  onChange: (event) => {},
  onSelected: (event, value) => {},
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function DateSelect({value, onChange, disabled, label}) {
  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          renderInput={(props) => <TextField
            style={{width: '20ch', paddingRight: 8, marginTop: 8}} {...props} />}
          label={label}
          value={value}
          inputFormat={'yyyy-MM-dd'}
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
}

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
  const labelId='analysis-engine-select-label';
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
  const labelId='nuclide-library-select-label';
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
  const labelId='encal-file-select-label';
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
  const labelId='decay-during-acquisition-select-label';
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
  const labelId='decay-correction-select-label';
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
  const labelId='wpc-tables-select-label';
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
            <ListItemText primary={table.name} />
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
  const labelId='data-types-select-label';
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
            <Checkbox checked={value.includes(dt.name)} />
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
  const labelId='performance-metric-select-label';
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