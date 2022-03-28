import React from "react";
import {makeStyles} from "@mui/styles";
import {FormControl, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export const SelectField = (props) => {
  const { id, value, api, field, options, row } = props;
  const classes = useStyles();
  const menuOptions = options ? options.split("|") : [];
  // const [age, setAge] = React.useState("");
  console.log("@@@@@@@@@@@@@@")
  // console.log("PROPS", props)
  console.log("FIELD", field)
  console.log("OPTIONS", options)
  console.log("ROW", row)
  console.log("@@@@@@@@@@@@@@")
  // const handleChange = (event) => {
  //   setAge(event.target.value);
  // };

  const handleChange = React.useCallback(
    (event) => {
      const editProps = {
        value: event.target.value
      };
      console.log("setting new value", event.target.value)
      row[field] = editProps.value;
      api.setCellMode(id, field, "edit");
      api.commitCellChange({ id, field, props: editProps });
      api.setCellMode(id, field, "view");
      event.stopPropagation();
    }
  );

  return (
    <FormControl className={classes.formControl} sx={{width: '100%'}}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        onChange={handleChange}
      >
        {menuOptions.map((option) => {
          const t = option.split(',');
          if (t.length === 2) {
            return (
              <MenuItem value={t[0]}>{t[1]}</MenuItem>
            )
          }
        })}
      </Select>
    </FormControl>
  );
};
