import React, { useState, useRef } from 'react'
import Avatar from '@material-ui/core/Avatar'
import './TweetBox.css'
import axios from "axios"
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

const TweetBox = ({socket, myTweets}) => {
  const currentUser = localStorage.getItem("username")
  const profile_image = localStorage.getItem("profile-image") || ''
  const [tweet, setTweet] = useState('')
  const [file, setFile] = useState('')

  const uploadImageButtonRef = useRef(null)
  
  const uploadImg = () => {
    uploadImageButtonRef.current.click()
  }

  const Tweet = (e) => {
    if (!currentUser) {
      alert('Log in or sign up')
      return
    }
    const url = "http://localhost:5000/tweet-upload"
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
        const url = 'http://localhost:5000/tweets'
        const {data} = await axios.get(url)
        socket.emit('tweets', data)
        setTweet("")
        setFile("")
      })
      .catch((error) => {
        console.log(error);
      })
  }

  let fileName = ''
  if (file && file.name.length > 20) {
    let fullFileName = file.name
    fileName = fullFileName.slice(0,9) + '...' + fullFileName.slice(-9)
  } else if (file) {
    fileName = file.name
  }

  return (
    <div className="tweet-box-container">
      <div className="tweet-box-title">
        <h1>{myTweets ? 'My tweets' : 'Tweets'}</h1>   
      </div>
      <div className="tweet-box">
        <Avatar src={profile_image} />
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
            ref={uploadImageButtonRef}
            type="file" 
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
          <SystemUpdateAltIcon className="upload-image" onClick={uploadImg} />
          <span className="image-name">{fileName}</span>
        </div>
        <div className="tweet-button">
          <button disabled={!tweet && !file} onClick={Tweet}>
            TWEET
          </button>
        </div>
      </div>
    </div>
  )
}

export default TweetBox
