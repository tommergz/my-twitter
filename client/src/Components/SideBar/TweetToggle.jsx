import React from 'react'
import './TweetToggle.css'

const TweetToggle = ({myTweets, setMyTweets, boolean, Icon, text}) => {
  const lighting = myTweets === boolean ? 'lighting' : ''
  return (
    <div 
      className="tweet-toggle"
      onClick={() => setMyTweets(boolean)}
    >
      <Icon />
      <h4 className={"tweet-toggle-text " + lighting}>{text}</h4>
    </div>
  )
}

export default TweetToggle
