import React, {useState} from 'react'
import ContentBlock from '../ContentBlock/ContentBlock'
import SideBar from '../SideBar/SideBar'
import Users from '../Users/Users'
import './Home.css'

const Home = () => {
  const [myTweets, setMyTweets] = useState(false)
  return (
    <div className="home-container">
      <SideBar 
        myTweets={myTweets}
        setMyTweets={setMyTweets}
      />
      <ContentBlock 
        myTweets={myTweets}
      />
      <Users />
    </div>
  )
}

export default Home
