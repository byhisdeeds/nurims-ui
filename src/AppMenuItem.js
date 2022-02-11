import React from 'react'
// import PropTypes from 'prop-types'
import { createStyles } from '@mui/material/styles'
import {makeStyles} from '@mui/styles';

import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'

import IconExpandLess from '@mui/icons-material/ExpandLess'
import IconExpandMore from '@mui/icons-material/ExpandMore'
import {ListItemButton, Tooltip} from "@mui/material";

// React runtime PropTypes
// export const AppMenuItemPropTypes = {
//   name: PropTypes.string.isRequired,
//   link: PropTypes.string,
//   Icon: PropTypes.elementType,
//   items: PropTypes.array,
// }

// TypeScript compile-time props type, infered from propTypes
// https://dev.to/busypeoples/notes-on-typescript-inferring-react-proptypes-1g88
// type AppMenuItemPropTypes = PropTypes.InferProps<typeof AppMenuItemPropTypes>
//   type AppMenuItemPropsWithoutItems = Omit<AppMenuItemPropTypes, 'items'>

// Improve child items declaration
// export type AppMenuItemProps = AppMenuItemPropsWithoutItems & {
//   items?: AppMenuItemProps[]
// }

const useStyles = makeStyles(theme =>
  createStyles({
    menuItem: {},
    menuItemIcon: {
      color: 'rgba(155,101,7,0.5)',
    },
  }),
)

export default function AppMenuItem(props) {
  const { name, link, Icon, tooltip, authmodlevel, items = [] } = props
  const classes = useStyles()
  const isExpandable = items && items.length > 0
  const [open, setOpen] = React.useState(false)

  function handleClick(id) {
    setOpen(!open)
    props.onClick(id)
  }

  function menu_disabled(organisation, modver) {
    if (modver === 'basic') {
      return false
    } else if (organisation && organisation.hasOwnProperty('authorized_module_level')) {
      return !(organisation.authorized_module_level === modver)
    }
    return true;
  }

  const MenuItemRoot = (
    <ListItemButton className={classes.menuItem} disabled={menu_disabled(props.organisation, authmodlevel)} onClick={()=>handleClick(link)}>
      {/* Display an icon if any */}
      {!!Icon && (
        <ListItemIcon className={classes.menuItemIcon}>
          <Icon />
        </ListItemIcon>
      )}
      <Tooltip title={tooltip} placement={'right-end'} arrow>
        <ListItemText primary={name} inset={!Icon} style={{whiteSpace: 'pre'}}/>
      </Tooltip>
      {/* Display the expand menu if the item has children */}
      {isExpandable && !open && <IconExpandMore />}
      {isExpandable && open && <IconExpandLess />}
    </ListItemButton>
  )

  const MenuItemChildren = isExpandable ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Divider />
      <List component="div" disablePadding>
        {items.map((item, index) => (
          <AppMenuItem {...item} key={index} user={props.user} onClick={props.onClick}/>
        ))}
      </List>
    </Collapse>
  ) : null

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  )
}
