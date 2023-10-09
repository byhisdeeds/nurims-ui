import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from "@mui/material";
import {isValidUserRole} from "../utils/UserUtils";


// A fork of react-sidemenu, a lightweight side menu component written in React.js. No jQuery, just CSS3.
//   Pure React.js, no external dependencies
// 	 Configure with JSON or via React components</li>
// 	 Packed with default ready-to-use styling</li>
// 	 Easy to customize styling guide</li>
// 	 Support of custom properties</li>
// 	 Detailed <a href="https://github.com/banomaster/react-sidemenu">documentation</a>

export default class DrawerMenu extends Component {
  static defaultProps = {
    collapse: true,
    rtl: false,
    theme: 'default'
  }

  static propTypes = {
    items: PropTypes.array,
    onMenuItemClick: PropTypes.func,
    renderMenuItemContent: PropTypes.func,
    theme: PropTypes.string,
    collapse: PropTypes.bool,
    rtl: PropTypes.bool,
    activeItem: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = { itemTree: [], componentStateTree: [] }
  }

  componentWillMount () {
  }

  componentDidMount () {
    if (this.props.children) {
      this.setState(pstate => {
        return {componentStateTree: this.buildComponentStateTree(this.props.children, null)}
      });
    }
    if (this.props.items) {
      this.setState(pstate => {
        return {itemTree: this.buildTree(this.props.items, null)}
      });
     }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.items && prevProps.items !== this.props.items) {
      this.setState({ itemTree: this.buildTree(this.props.items, null) })
    }
    // We rebuild the whole component tree if activeItem prop changes
    if (this.props.activeItem && this.props.activeItem !== prevProps.activeItem) {
      if (this.props.items) {
        this.setState({ itemTree: this.buildTree(this.props.items, null) })
      } else if (this.props.children) {
        this.setState({
          componentStateTree: this.buildComponentStateTree(this.props.children, null)
        })
      }
    }
  }

  //
  // methods for DrawerMenu using COMPONENT structure
  //
  buildComponentStateTree (children, parent) {
    const { activeItem } = this.props

    // return React.Children.map(children, (child) => {
    return React.Children.map((child) => {
      const newChild = {}
      let subTree = []

      newChild.active = false
      newChild.parent = parent

      if (activeItem === child.props.value) {
        this.activateParentsComponentTree(newChild, false)
      }

      if (child.props.children) {
        subTree = this.buildComponentStateTree(child.props.children, newChild)
      }
      newChild.children = subTree

      return newChild
    })
  }

  handleComponentClick (item) {
    const { collapse } = this.props
    const { componentStateTree } = this.state
    const activeBefore = item.active
    if (collapse) {
      this.deactivateComponentTree(componentStateTree)
    } else {
      this.deactivateComponentTreeLeaves(componentStateTree)
    }
    this.activateParentsComponentTree(item, activeBefore)
    this.setState({ componentStateTree: componentStateTree })
  }

  activateParentsComponentTree (item, activeBefore) {
    if (item) {
      const isLeaf = !item.children || item.children.length === 0
      // We don't want to inacivate an active leaf item
      if (isLeaf && activeBefore) {
        item.active = true
      } else if (!activeBefore) {
        item.active = true
      }
      this.activateParentsComponentTree(item.parent, false)
    }
  }

  deactivateComponentTree (componentStateTree) {
    if (!componentStateTree) {
      return null
    }
    return componentStateTree.map((child) => {
      child.active = false
      if (child.children) {
        child.children = this.deactivateComponentTree(child.children)
      }

      return child
    })
  }

  deactivateComponentTreeLeaves (componentStateTree) {
    if (!componentStateTree) {
      return null
    }
    return componentStateTree.map((child) => {
      if (!child.children || child.children.length === 0) {
        child.active = false
      } else {
        child.children = this.deactivateComponentTreeLeaves(child.children)
      }
      return child
    })
  }

  //
  // methods for DrawerMenu using JSON structure
  //
  buildTree (children, parent) {
    const { activeItem } = this.props
    if (!Array.isArray(children)) {
      return null
    }
    return children.map((child) => {
      let newChild = {
        ...child,
        active: false,
        parent: parent,
        children: null
      }
      let subTree = []

      if (newChild.value === activeItem) {
        newChild.active = true
        this.activeParentPath(newChild)
      }

      if (Array.isArray(child.children)) {
        //  $FlowFixMe
        subTree = this.buildTree(child.children, newChild)
      }
      newChild.children = subTree

      return newChild
    })
  }

  deactivateTree (itemTree) {
    if (!itemTree) {
      return null
    }
    itemTree.forEach((item) => {
      item.active = false
      if (item.children) {
        this.deactivateTree(item.children)
      }
    })
  }

  deactivateTreeLeaves (itemTree) {
    if (!itemTree) {
      return null
    }
    itemTree.forEach((item) => {
      if (!item.children) {
        item.active = false
      } else {
        this.deactivateTreeLeaves(item.children)
      }
    })
  }

  activeParentPath (item) {
    let curItem = item
    while (curItem) {
      curItem.active = true
      curItem = curItem.parent
    }
  }

  onItemClick (item) {
    const { itemTree } = this.state
    const { onMenuItemClick, collapse, shouldTriggerClickOnParents } = this.props
    const self = this
    return (e) => {
      if (e) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
      }

      const isLeaf = !item.children || item.children.length === 0
      // handle UI changes
      if (!item.active) {
        // if menu is in collapse mode, close all items
        if (collapse) {
          self.deactivateTree(itemTree)
        } else {
          self.deactivateTreeLeaves(itemTree)
        }
        item.active = true
        self.activeParentPath(item)
        self.setState({ itemTree })
        // eslint-disable-next-line
      }
      // we deactivate the item if it is active and does not have children
      else if (!isLeaf) {
        item.active = false
        // if menu is in collapse mode, close only
        if (item.children) {
          self.deactivateTree(item.children)
        }
        if (item.parent) {
          self.activeParentPath(item.parent)
        }
        self.setState({ itemTree })
      }

      // check if item has an onClick method defined
      if (item.onClick) {
        item.onClick(item.value)
        // handle what happens if the item is a leaf node
      } else if (isLeaf || shouldTriggerClickOnParents) {
        if (onMenuItemClick) {
          // onMenuItemClick(item.value, item.extras)
          onMenuItemClick(item.value, item.title, item.tooltip, item.authmodlevel, item.extras)
        } else {
          window.location.href = `#${item.value}`
        }
      }

      this.setState({ ...this.state })
    }
  }

  renderChevron (item, rtl) {
    if (item.children && item.children.length > 0) {
      if (item.active) {
        return (<i className="fa fa-chevron-down" />)
      } else if (rtl) {
        return (<i className="fa fa-chevron-right" />)
      }
      return (<i className="fa fa-chevron-left" />)
    }
    return null
  }

  handleRenderMenuItemContent (item) {
    const { renderMenuItemContent, rtl } = this.props
    if (renderMenuItemContent) {
      return renderMenuItemContent({
        icon: item.icon,
        value: item.value,
        label: item.label,
        tooltip: item.tooltip,
        title: item.title,
        authmodlevel: item.authmodlevel,
      })
    }
    return (
      <span>
        {/*{item.icon &&  <i className={`fa ${item.icon} item-icon`} />*/}
        { item.icon && <item.icon /> }
        {/* render a simple label */}
        <span className="item-label"> { item.label } </span>
        { this.renderChevron(item, rtl) }
      </span>
    )
  }

  menu_disabled(organisation, modver, sysadmin) {
    if (sysadmin) {
      return false;
    } else if (modver === 'basic') {
      return false
    } else if (organisation && organisation.hasOwnProperty('authorized_module_level')) {
      return !(organisation.authorized_module_level === modver)
    }
    return true;
  }

  renderItem (item, level) {
    // console.log("== renderItem ==", item)
    // console.log("== renderItem.props ==", this.props)
    if (item.divider) {
      return (
        <div key={item.value} className={`divider divider-level-${level}`}>
          { item.label }
        </div>
      )
    }
    const disabled = this.menu_disabled(this.props.organisation,
      item.authmodlevel, isValidUserRole(this.props.user, "sysadmin"));
    return (
      <div key={item.value} className={`item item-level-${level} ${disabled?"item-disabled":""} ${item.active ? 'active' : ''}`}>
        <Tooltip title={item.tooltip} placement={'right-end'} arrow>
          <div
            title={item.tooltip}
            className="item-title"
            onClick={this.onItemClick(item)}>
            { this.handleRenderMenuItemContent(item) }
          </div>
        </Tooltip>
        {/* render children */}
        <div className={`children ${item.active ? 'active' : 'inactive'}`}>
          {item.children && item.children.map((child) =>
            this.renderItem(child, level + 1)
          )}
        </div>
      </div>
    )
  }

  render () {
    const { itemTree, componentStateTree } = this.state
    const { theme, onMenuItemClick, rtl, renderMenuItemContent, shouldTriggerClickOnParents } = this.props
    const sidemenuComponent = this
    if (!componentStateTree || componentStateTree.length === 0) {
      // menu constructed from json
      return (
        <div className={`Side-menu Side-menu-${theme} ${rtl ? 'rtl' : ''} children active`}>
          {itemTree && itemTree.map((item) =>
            this.renderItem(item, 1)
          )}
        </div>
      )
    }
    // menu constructed with react components
    return (
      <div className={`Side-menu  Side-menu-${theme} ${rtl ? 'rtl' : ''} children active`}>
        { React.Children.map(this.props.children, (child, index) => {
          return React.cloneElement(child, {
            activeState: componentStateTree[index],
            handleComponentClick: this.handleComponentClick.bind(this),
            renderMenuItemContent: renderMenuItemContent,
            onMenuItemClick: onMenuItemClick,
            shouldTriggerClickOnParents: shouldTriggerClickOnParents,
            rtl: rtl,
            level: 1,
            sidemenuComponent: sidemenuComponent
          })
        })}
      </div>
    )
  }
}

// Because component version of menu is built using cloning and adding some props,
// we need to silence errors related to these added props.
export class Item extends Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    activeState: PropTypes.object,
    level: PropTypes.number,
    icon: PropTypes.string,
    rtl: PropTypes.bool,
    onMenuItemClick: PropTypes.func,
    handleComponentClick: PropTypes.func,
    renderMenuItemContent: PropTypes.func,
    divider: PropTypes.bool
  }

  onItemClick () {
    const {
      onMenuItemClick,
      children,
      value,
      extras,
      tooltip,
      title,
      authmodlevel,
      handleComponentClick,
      activeState,
      shouldTriggerClickOnParents,
      disabled,
      onClick
    } = this.props

    const isLeaf = !children || children.length === 0
    if (onClick) {
      onClick(value)
    } else if (isLeaf || shouldTriggerClickOnParents) {
      if (onMenuItemClick) {
        onMenuItemClick(value, extras)
      } else {
        window.location.href = `#${value}`
      }
    }

    handleComponentClick(activeState)
  }

  renderChevron (children, activeState, rtl) {
    if (children) {
      if (activeState.active) {
        return (<i className="fa fa-chevron-down" />)
      } else if (rtl) {
        return (<i className="fa fa-chevron-right" />)
      }
      return (<i className="fa fa-chevron-left" />)
    }
    return null
  }

  handleRenderMenuItemContent () {
    const {
      renderMenuItemContent,
      children,
      value,
      label,
      icon,
      tooltip,
      title,
      authmodlevel,
      activeState,
      rtl
    } = this.props
    if (renderMenuItemContent) {
      return renderMenuItemContent({
        icon: icon,
        value: value,
        label: label,
        tooltip: tooltip,
        title: title,
        authmodlevel: authmodlevel,
      })
    }
    return (
      <span>
        {/* render icon if provided */}
        {icon && <i className={`fa ${icon} item-icon`} /> }
        {/* render a simple label */}
        <span className="item-label"> {label} </span>
        { this.renderChevron(children, activeState, rtl) }
      </span>
    )
  }

  render () {
    const {
      label,
      onMenuItemClick,
      divider,
      children,
      activeState,
      level,
      rtl,
      renderMenuItemContent,
      shouldTriggerClickOnParents,
      sidemenuComponent,
      handleComponentClick
    } = this.props

    if (divider) {
      return (
        <div className={`divider divider-level-${level}`}>{label} </div>
      )
    }
    return (
      <div className={`item item-level-${level} ${activeState.active ? 'active' : ''}`}>
        <div className="item-title" onClick={this.onItemClick.bind(this)}>
          {this.handleRenderMenuItemContent()}
        </div>
        {children &&
          <div className={`children ${activeState.active ? 'active' : 'inactive'}`}>
            {React.Children.map(children, (child, index) => {
              return React.cloneElement(child, {
                handleComponentClick: handleComponentClick,
                activeState: activeState.children != null ? activeState.children[index] : null,
                renderMenuItemContent: renderMenuItemContent,
                onMenuItemClick: onMenuItemClick,
                shouldTriggerClickOnParents: shouldTriggerClickOnParents,
                rtl: rtl,
                level: level + 1,
                sidemenuComponent: sidemenuComponent
              })
            })}
          </div>
        }
      </div>
    )
  }
}
