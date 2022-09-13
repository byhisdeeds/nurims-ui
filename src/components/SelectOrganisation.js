import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Box, FormControl, InputLabel, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

export default function SelectOrganisation(props) {
  const [open, setOpen] = React.useState(props.open);
  const [org, setOrg] = React.useState({name: "", authorized_module_level: "", role: ""});

  const userOrganisations = (user) => {
    for (const [key, value] of Object.entries(user)) {
      if (key.endsWith('user_metadata')) {
        for (const [k, v] of Object.entries(value)) {
          if (k === 'organisation') {
            return v
          }
        }
      }
    }
    return []
  };

  const handleClose = (e) => {
    setOpen(false);
    props.onSelect(org)
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setOrg(e.target.value)
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Organisation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the organisation from the listbox.
          </DialogContentText>
          <Box sx={{ minWidth: 120, paddingTop: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Organisation</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={org}
                label="Organisation"
                onChange={handleChange}
              >
                {/*{userOrganisations(props.user).map(org => {*/}
                {props.orgs.map(org => {
                  return (
                    <MenuItem key={org.id} value={org}>{org.organisation}</MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
