import React from 'react'
import ContentBlock from '../ContentBlock/ContentBlock'
import SideBar from '../SideBar/SideBar'
import Users from '../Users/Users'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <SideBar />
      <ContentBlock />
      <Users />
    </div>
  )
}

export default Home
