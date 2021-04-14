import React from 'react'
import './SideBarLayout.css'

const SideBarLayout = ({Icon, text}) => {
  return (
    <div className="side-bar-layout">
      <Icon />
      <h4 className="side-bar-layout-text">{text}</h4>
    </div>
  )
}

export default SideBarLayout
