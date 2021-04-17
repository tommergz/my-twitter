import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import './TweetBox.css'
import axios from "axios"
import io from 'socket.io-client'

const socket = io.connect('https://tommern.herokuapp.com')

const TweetBox = ({setTweets}) => {
  const profile_image = localStorage.getItem("profile-image") || ''
  const [tweet, setTweet] = useState('')
  const [file, setFile] = useState('')

  socket.on('tweets', (tweets) => {
    setTweets(tweets)
  })
  
  const Tweet = (e) => {
    const url = "https://tommern.herokuapp.com/tweet-upload"
    const token = localStorage.getItem("sid")

    const data = new FormData()
    data.append("tweet", tweet)
    data.append("file", file)

    axios
      .post(url, data, {
        headers: {
          "x-auth-token": token,
        },
      })
      .then(async (response) => {
        const url = 'https://tommern.herokuapp.com/tweets'
        const {data} = await axios.get(url)
        // setTweets(data)
        socket.emit('tweets', data)
        setTweet("")
        setFile("")
      })
      .catch((error) => {
        console.log(error);
      })
  }
  return (
    <div className="tweet-box-container">
      <div className="tweet-box-title">
        <h1>Home</h1>   
      </div>
      <div className="tweet-box">
        <Avatar alt="Avatar" src={profile_image} />
        <input 
          type="text" 
          placeholder="What's happening?" 
          onChange={(e) => setTweet(e.target.value)}
          value={tweet}
        />
      </div>
      <div className="tweet-file-upload">
        <div className="file">
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="tweet-button">
          <button disabled={tweet === ''} onClick={Tweet}>
            TWEET
          </button>
        </div>
      </div>
    </div>
  )
}

export default TweetBox
