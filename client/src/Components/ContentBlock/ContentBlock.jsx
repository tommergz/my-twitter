import React, {useEffect, useState} from 'react'
import './ContentBlock.css'
import TweetBox from '../TweetBox/TweetBox'
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MessageIcon from '@material-ui/icons/Message';
import ReplayIcon from '@material-ui/icons/Replay';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const ContentBlock = () => {

  const currentUser = localStorage.getItem("username")
  const [tweets, setTweets] = useState([])
  const [tweetInfo, setTweetInfo] = useState({
    tweet: '',
    tweetId: '',
    fileId: '',
    editTweetBlock: false
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

  useEffect(() => {
    const loadData = async function() {
      const url = 'http://localhost:5000/tweets'
      const {data} = await axios.get(url)
      setTweets(data)
    }

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
        setTweets(data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const comments = (id) => {
    const url = `http://localhost:5000/comments/${id}`

    const comment = prompt("Enter a comment")

    const data = new FormData()
    data.append('comment', comment)

    axios
      .post(url, data)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return (
    <div className="content-container">
      <TweetBox 
        setTweets={setTweets}
      />
      {
        tweetInfo.editTweetBlock ? 
          <EditTweet 
            tweetInfo={tweetInfo}
            setTweetInfo={setTweetInfo}
            setTweets={setTweets}
          /> :
          null
      }
      <div className="content-wrapper">
        {tweets && (
            <div className="tweet-content">
              {tweets.reverse().map((tweet, index) => {
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
                        <div className="comments">
                          <MessageIcon onClick={() => comments(tweet._id)} />
                          <h5>{tweet.comments.length}</h5>
                        </div>
                        <ReplayIcon className="retweet" />
                        <div className="likes">
                          <FavoriteIcon />
                          <h5>{tweet.likes}</h5>
                        </div>
                        <GetAppIcon className="download" />
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

const EditTweet = ({tweetInfo, setTweetInfo, setTweets}) => {
  const {tweetId, fileId} = tweetInfo
  const profile_image = localStorage.getItem("profile-image") || ''
  const [tweet, setTweet] = useState(tweetInfo.tweet)
  const [file, setFile] = useState(fileId)

  const Save = async (e) => {
    const url = "http://localhost:5000/tweet-update"
    // const token = localStorage.getItem("sid")

    const data = new FormData()
    data.append("tweet", tweet)
    data.append("tweetId", tweetId)
    data.append("file", file)
    data.append("fileId", file)


    setTweetInfo({
      tweet: '',
      tweetId: '',
      fileId: '',
      editTweetBlock: false
    })

    axios
      .put(url, data)
      .then(async (response) => {
        const url = 'http://localhost:5000/tweets'
        const {data} = await axios.get(url)
        setTweets(data)
      })
      .catch((error) => {
        console.log(error);
      })
  }
  return (
    <div className="edit-tweet-box-wrapper">
      <div className="edit-tweet-box-container">
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
            {
              file ? 
                <button onClick={() => setFile('')}>
                  Change file
                </button> :
                <input 
                  type="file"
                  onChange={
                    (e) => setFile(e.target.files[0])
                  }
                />             
            }
          </div>
          <div className="tweet-button">
            <button disabled={tweet === ''} onClick={Save}>
              SAVE
            </button>
          </div>
        </div>
        <HighlightOffIcon 
          className="close-edit-tweet" 
          onClick={
            () => {
              setTweetInfo({
                tweet: '',
                tweetId: '',
                fileId: '',
                publicId: '',
                editTweetBlock: false
              })
            }
          }
        />
      </div>
    </div>
  )
}

export default ContentBlock
