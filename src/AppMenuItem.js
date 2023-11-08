// import React, {useEffect} from 'react'
// import PropTypes from 'prop-types'
// import {createStyles} from '@mui/material/styles'
// import {makeStyles} from '@mui/styles';
// import List from '@mui/material/List'
// import ListItemIcon from '@mui/material/ListItemIcon'
// import ListItemText from '@mui/material/ListItemText'
// import Divider from '@mui/material/Divider'
// import Collapse from '@mui/material/Collapse'
// import IconExpandLess from '@mui/icons-material/ExpandLess'
// import IconExpandMore from '@mui/icons-material/ExpandMore'
// import {ListItemButton, Tooltip} from "@mui/material";
// import eventBus from "./EventBus";
// import {isValidUserRole} from "./utils/UserUtils";
//
//
// const useStyles = makeStyles(theme =>
//   createStyles({
//     menuItem: {},
//     menuItemIcon: {
//       color: 'rgba(155,101,7,0.5)',
//     },
//   }),
// )
//
// AppMenuItem.propTypes = {
//   key: PropTypes.string.isRequired,
//   user: PropTypes.object.isRequired,
//   organisation: PropTypes.object.isRequired,
//   onClick: PropTypes.func.isRequired,
//   root: PropTypes.bool.isRequired,
// }
//
// export default function AppMenuItem(props) {
//   const { name, link, title, root, Icon, tooltip, user, authmodlevel, items = []} = props
//   const classes = useStyles()
//   const isExpandable = items && items.length > 0
//   const isSysadmin = isValidUserRole(user, "sysadmin");
//   // const isSysadmin = user.hasOwnProperty("profile") && (user.profile["role"].includes("'sysadmin'"));
//   // const isSysadmin = user.hasOwnProperty("profile") && (user.profile["role"] === "sysadmin");
//   const isVisible = (isSysadmin) || (authmodlevel !== "sysadmin")
//   const [open, setOpen] = React.useState(false)
//
//   function handleClick(menuTitle, menuLink) {
//     setOpen(!open)
//     console.log("APP-MENUITEM.onClick - title, link, open, root", menuTitle, menuLink, open, root)
//     if (root) {
//       eventBus.dispatch("menuClick", {
//         link: menuLink,
//         title: menuTitle,
//         open: open,
//       });
//     }
//     props.onClick(menuLink, menuTitle)
//   }
//
//   function menu_disabled(organisation, modver, sysadmin) {
//     if (sysadmin) {
//       return false;
//     } else if (modver === 'basic') {
//       return false
//     } else if (organisation && organisation.hasOwnProperty('authorized_module_level')) {
//       return !(organisation.authorized_module_level === modver)
//     }
//     return true;
//   }
//
//   useEffect(() => {
//     // Equivalent of componentDidMount.
//     eventBus.on("menuClick", (data) => {
//       console.log("ON-MENU-CLICK data..., link, open)", data, link, open);
//       // if (data && data.link && data.link !== link) {
//       //   setOpen( true)
//       // }
//       // // if (data && data.link && data.link !== link && data.link.indexOf('\\.') === -1 && open) {
//       // //   setOpen(false)
//       // // }
//     })
//   }, []);
//
//   const MenuItemRoot = isVisible ? (
//     <Tooltip title={tooltip} placement={'right-end'} arrow>
//       <ListItemButton className={classes.menuItem} disabled={menu_disabled(props.organisation, authmodlevel, isSysadmin)} onClick={()=>handleClick(title, link)}>
//         {/* Display an icon if any */}
//         {!!Icon && (
//           <ListItemIcon className={classes.menuItemIcon}>
//             <Icon />
//           </ListItemIcon>
//         )}
//         <ListItemText primary={name} inset={!Icon} style={{whiteSpace: 'pre'}}/>
//         {/* Display the expand menu if the item has children */}
//         {isExpandable && !open && <IconExpandMore />}
//         {isExpandable && open && <IconExpandLess />}
//       </ListItemButton>
//     </Tooltip>
//   ) : null
//
//   const MenuItemChildren = isExpandable ? (
//     <Collapse in={open} timeout="auto" unmountOnExit>
//       <Divider />
//       <List component="div" disablePadding>
//         {items.map((item, index) => (
//           <AppMenuItem {...item} key={index} user={props.user} onClick={props.onClick}/>
//         ))}
//       </List>
//     </Collapse>
//   ) : null
//
//   return (
//     <>
//       {MenuItemRoot}
//       {MenuItemChildren}
//     </>
//   )
// }
