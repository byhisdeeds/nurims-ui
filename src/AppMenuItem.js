import React from 'react'
// import PropTypes from 'prop-types'
import {createStyles, styled} from '@mui/material/styles'
import {makeStyles} from '@mui/styles';

import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'

import IconExpandLess from '@mui/icons-material/ExpandLess'
import IconExpandMore from '@mui/icons-material/ExpandMore'
import {ListItemButton, Tooltip, Typography} from "@mui/material";
import {getGlossaryValue} from "./utils/GlossaryUtils";
import {tooltipClasses} from "@mui/material/Tooltip";

import {HtmlTooltip} from "./utils/TooltipUtils";

const useStyles = makeStyles(theme =>
  createStyles({
    menuItem: {},
    menuItemIcon: {
      color: 'rgba(155,101,7,0.5)',
    },
  }),
)

export default function AppMenuItem(props) {
  const { name, link, title, Icon, tooltip, authmodlevel, items = [] } = props
  const classes = useStyles()
  const isExpandable = items && items.length > 0
  const [open, setOpen] = React.useState(false)

  function handleClick(title, link) {
    setOpen(!open)
    props.onClick(link, title)
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
    <ListItemButton className={classes.menuItem} disabled={menu_disabled(props.organisation, authmodlevel)} onClick={()=>handleClick(title, link)}>
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
