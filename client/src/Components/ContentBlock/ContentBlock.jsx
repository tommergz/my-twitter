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
        setTweets(data)
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
      {
        commentInfo.commentBlock ? 
          <Comment 
            id={commentInfo.id} 
            currentUser={currentUser} 
            setCommentInfo={setCommentInfo}
            loadData={loadData}
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
                        <div className="comments" onClick={() => comments(tweet._id)}>
                          <MessageIcon />
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

  const save = async (e) => {
    const url = "http://localhost:5000/tweet-update"

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
            <button disabled={tweet === ''} onClick={save}>
              SAVE
            </button>
          </div>
        </div>
        <HighlightOffIcon 
          className="close-edit-tweet icon" 
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

const Comment = ({id, currentUser, setCommentInfo, loadData}) => {
  const profile_image = localStorage.getItem("profile-image") || ''
  const [commentText, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [file, setFile] = useState('')

  const [editCommentInfo, setEditCommentInfo] = useState({
    commentText: '',
    fileId: '',
    commentId: '',
    editCommentBlock: false
  })

  useEffect(() => {
    const loadData = async function() {
      const url = `http://localhost:5000/comments/${id}`    

      axios
        .get(url)
        .then((res) => {
          setComments(res.data.comments)
        })
        .catch((error) => {
          console.log(error);
        })
    }

    loadData()
  }, [id])

  const addComment = () => {
    const url = `http://localhost:5000/comments/${id}`

    const data = new FormData()
    data.append('currentUser', currentUser)
    data.append('commentText', commentText)
    data.append('file', file)

    axios
      .post(url, data)
      .then((res) => {
        setComments(res.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const removeComment = (commentId) => {
    const url = `http://localhost:5000/comment-remove`
  
    axios
      .delete(url, {params: {
        tweetId: id,
        commentId: commentId
      }})
      .then(async (response) => {
        setComments(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return(
    <div className="comments-box-wrapper">
      {
        editCommentInfo.editCommentBlock ? 
          <EditComment 
            id={id} 
            editCommentInfo={editCommentInfo} 
            setComments={setComments} 
            setEditCommentInfo={setEditCommentInfo}
          /> :
          null
      }
      <div className="comments-box-container">
        <div className="tweet-box">
          <Avatar alt="Avatar" src={profile_image} />
          <input 
            type="text" 
            placeholder="Your comment" 
            onChange={(e) => setComment(e.target.value)}
            value={commentText}
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
            <button disabled={commentText === ''} onClick={addComment}>
              Comment
            </button>
          </div>
        </div>
        <HighlightOffIcon 
            className="close-edit-tweet icon" 
            onClick={
              () => {
                setCommentInfo({
                  id: '',
                  commentBlock: false
                })
                loadData()
              }
            }
          />
        <div className="tweet-content">
          {comments.map(({id, profile, user, text, file}, index) => {
            return (
              <div key={+Date.now().toString() + index} className="content">
                <div className="user-profile">
                  <Avatar alt="User Profile" src={profile} />
                </div>
                <div className="tweet">
                  <div className="user">
                    <h3 className="user-name">{user}</h3>
                    <h3 className="user-tag">{`@${user}`}</h3>
                  </div>
                  <h4>{text}</h4>       
                  {file ? <img src={file} className="comment-img" alt="File" /> : null}
                  {
                    user === currentUser ? 
                      <div className="tweet-settings">
                        <DeleteForeverIcon 
                          className="remove-tweet" 
                          onClick={() => removeComment(id)}
                        />
                        <EditIcon 
                          className="edit-tweet" 
                          onClick={
                            () => setEditCommentInfo({
                              commentText: text,
                              fileId: file,
                              commentId: id,
                              editCommentBlock: true
                            })}
                        />
                      </div> : 
                      ''
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const EditComment = ({id, editCommentInfo, setComments, setEditCommentInfo}) => {
  const {commentText, fileId, commentId} = editCommentInfo
  const profile_image = localStorage.getItem("profile-image") || ''
  const [comment, setComment] = useState(commentText)
  const [file, setFile] = useState(fileId)

  const save = async (e) => {
    const url = "http://localhost:5000/comment-update"

    const data = new FormData()
    data.append("tweetId", id)
    data.append("commentId", commentId)
    data.append("comment", comment)
    data.append("fileId", file)
    data.append("file", file)

    setEditCommentInfo({
      commentText: '',
      fileId: '',
      commentId: '',
      editCommentBlock: false
    })

    axios
      .put(url, data)
      .then(async (response) => {
        const url = `http://localhost:5000/comments/${id}`
        const {data} = await axios.get(url)
        setComments(data.comments)
      })
      .catch((error) => {
        console.log(error);
      })
  }
  return (
    <div className="edit-comment-box-wrapper">
      <div className="edit-comment-box-container">
        <div className="tweet-box">
          <Avatar alt="Avatar" src={profile_image} />
          <input 
            type="text" 
            placeholder="What's happening?" 
            onChange={(e) => setComment(e.target.value)}
            value={comment}
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
            <button disabled={comment === ''} onClick={save}>
              SAVE
            </button>
          </div>
        </div>
        <HighlightOffIcon 
          className="close-edit-tweet icon" 
          onClick={
            () => {
              setEditCommentInfo({
                commentText: '',
                fileId: '',
                commentId: '',
                editCommentBlock: false
              })
            }
          }
        />
      </div>
    </div>
  )
}

export default ContentBlock
