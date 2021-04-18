import React, {useEffect, useState} from 'react'
import './ContentBlock.css'
import TweetBox from '../TweetBox/TweetBox'
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MessageIcon from '@material-ui/icons/Message';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import io from 'socket.io-client'
import EditTweet from '../EditTweet/EditTweet'
import Comment from '../Comment/Comment'

const socket = io.connect('http://localhost:5000')

const ContentBlock = () => {

  const currentUser = localStorage.getItem("username")
  const [tweets, setTweets] = useState([])
  const [selectedTweetsObj, setSelectedTweets] = useState({
    search: false,
    tweets: []
  })
  const [tweetInfo, setTweetInfo] = useState({
    tweet: '',
    tweetId: '',
    fileId: '',
    editTweetBlock: false
  })
  const [commentInfo, setCommentInfo] = useState({
    id: '',
    commentBlock: false
  })

  const editTweet = (tweet, tweetId, fileId, publicId) => {
    setTweetInfo({
      tweet: tweet,
      tweetId: tweetId,
      fileId: fileId,
      publicId: publicId,
      editTweetBlock: true
    })
  }

  const loadData = async function() {
    const url = 'http://localhost:5000/tweets'
    const {data} = await axios.get(url)
    setTweets(data)
  }

  socket.on('tweets', (tweets) => {
    setTweets(tweets)
  })

  useEffect(() => { 
    loadData()
  }, [])

  const removeTweet = (id, file) => {
    const url = `http://localhost:5000/tweet-remove`
  
    axios
      .delete(url, {params: {
        id: id,
        file: file
      }})
      .then(async (response) => {
        const url = 'http://localhost:5000/tweets'
        const {data} = await axios.get(url)
        socket.emit('tweets', data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const comments = (id) => {
    setCommentInfo({
      id: id,
      commentBlock: true
    })
  }

  const searchTweets = (value) => {
    if (value) {
      let allTweets = [...tweets]
      let choosenTweets = allTweets.filter(tweet => tweet.tweet.toLowerCase().indexOf(value.toLowerCase()) > -1)
      setSelectedTweets({
        search: true,
        selectedTweets: choosenTweets
      })
    } else {
      setSelectedTweets({
        search: false,
        selectedTweets: []
      })
    }    
  }

  const like = (currentUser, tweetId) => {

    const url = "http://localhost:5000/tweet-like"

    const data = {
      currentUser,
      tweetId
    }

    axios
    .put(url, data)
    .then(async (response) => {
      const url = 'http://localhost:5000/tweets'
      const {data} = await axios.get(url)
      socket.emit('tweets', data)
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const {search, selectedTweets} = selectedTweetsObj
  const currentTweets = search ? selectedTweets : tweets
  currentTweets.sort((prev, next) => next.date - prev.date)
  return (
    <div className="content-container">
      <TweetBox 
        socket={socket}
        setTweets={setTweets}
      />
      {
        tweetInfo.editTweetBlock ? 
          <EditTweet 
            socket={socket}
            tweetInfo={tweetInfo}
            setTweetInfo={setTweetInfo}
            setTweets={setTweets}
          /> :
          null
      }
      {
        commentInfo.commentBlock ? 
          <Comment 
            socket={socket}
            id={commentInfo.id} 
            currentUser={currentUser} 
            setCommentInfo={setCommentInfo}
            loadData={loadData}
          /> :
          null
      }
      <div className="search-block">
        <input 
          type="text" 
          placeholder="SEARCH" 
          className="search-input"
          onChange={(e) => searchTweets(e.target.value)}
        />
      </div>
      <div className="content-wrapper">
        {currentTweets && (
            <div className="tweet-content">
              {currentTweets.map((tweet, index) => {
                const likeIndex = tweet.likes.indexOf(currentUser)
                const liked = likeIndex < 0 ? '' : 'liked'
                return (
                  <div key={+Date.now().toString() + index} className="content">
                    <div className="user-profile">
                      <Avatar alt="User Profile" src={tweet.profile} />
                    </div>
                    <div className="tweet">
                      <div className="user">
                        <h3 className="user-name">{tweet.user}</h3>
                        <h3 className="user-tag">{`@${tweet.user}`}</h3>
                      </div>
                      <h4>{tweet.tweet}</h4>       
                      {tweet.file ? <img src={tweet.file} alt="File" /> : null}
                      
                      <div className="tweet-icons">
                        <div className="comments" onClick={() => comments(tweet._id)}>
                          <MessageIcon />
                          <h5>{tweet.comments.length}</h5>
                        </div>
                        <div className={"likes " + liked} onClick={() => like(currentUser, tweet._id)}>
                          <FavoriteIcon />
                          <h5>{tweet.likes.length}</h5>
                        </div>
                      </div>
                      {
                        tweet.user === currentUser ? 
                          <div className="tweet-settings">
                            <DeleteForeverIcon 
                              className="remove-tweet" 
                              onClick={() => removeTweet(tweet._id, tweet.file_id)}
                            />
                            <EditIcon 
                              className="edit-tweet" 
                              onClick={() => editTweet(tweet.tweet, tweet._id, tweet.file, tweet.file_id)}
                            />
                          </div> : 
                          ''
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          )  
        }
      </div>
    </div>
  )
}

export default ContentBlock
