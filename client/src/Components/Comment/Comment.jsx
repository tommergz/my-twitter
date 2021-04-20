import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

const Comment = ({socket, id, currentUser, setCommentInfo, loadData}) => {
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

  socket.on('comments', (comments) => {
    setComments(comments)
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

  useEffect(() => {
    const updateTweets = async function() {
      const url = 'http://localhost:5000/tweets'
      const {data} = await axios.get(url)
      socket.emit('tweets', data)
    }
    updateTweets()    
  }, [comments, socket])

  const addComment = () => {

    const url = `http://localhost:5000/comments/${id}`

    const data = new FormData()
    data.append('currentUser', currentUser)
    data.append('commentText', commentText)
    data.append('file', file)

    axios
      .post(url, data)
      .then((res) => {
        socket.emit('comments', res.data)
        setComment('')
        setFile('')
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
        socket.emit('comments', response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const uploadImageButtonRef = useRef(null)
  
  const uploadImg = () => {
    uploadImageButtonRef.current.click()
  }

  let fileName = ''
  if (file && file.name.length > 20) {
    let fullFileName = file.name
    fileName = fullFileName.slice(0,9) + '...' + fullFileName.slice(-9)
  } else if (file) {
    fileName = file.name
  }

  return(
    <div className="comments-box-wrapper">
      {
        editCommentInfo.editCommentBlock ? 
          <EditComment 
            socket={socket}
            id={id} 
            editCommentInfo={editCommentInfo} 
            setComments={setComments} 
            setEditCommentInfo={setEditCommentInfo}
          /> :
          null
      }
      <div className="comments-box-container">
        <div className="tweet-box">
          <Avatar src={profile_image} />
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
              ref={uploadImageButtonRef}
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
            <SystemUpdateAltIcon className="upload-image" onClick={uploadImg} />
            <span className="image-name">{fileName}</span>
          </div>
          <div className="tweet-button">
            <button disabled={!commentText && !file} onClick={addComment}>
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

const EditComment = ({socket, id, editCommentInfo, setComments, setEditCommentInfo}) => {
  const {commentText, fileId, commentId} = editCommentInfo
  const profile_image = localStorage.getItem("profile-image") || ''
  const [comment, setComment] = useState(commentText)
  const [file, setFile] = useState(fileId)

  const save = async (e) => {
    const url = "http://localhost:5000/comment-update"

    let currentFile = file
    if (file === undefined) currentFile = ''
    const data = new FormData()
    data.append("tweetId", id)
    data.append("commentId", commentId)
    data.append("comment", comment)
    data.append("fileId", currentFile)
    data.append("file", currentFile)

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
        // setComments(data.comments)
        socket.emit('comments', data.comments)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const uploadImageButtonRef = useRef(null)
  
  const uploadImg = () => {
    uploadImageButtonRef.current.click()
  }

  let fileName = ''
  let string = typeof file === "string" || file instanceof String
  if (!string && file && file.name.length > 20) {
    let fullFileName = file.name
    fileName = fullFileName.slice(0,9) + '...' + fullFileName.slice(-9)
  } else if (file) {
    fileName = file.name
  }

  return (
    <div className="edit-comment-box-wrapper">
      <div className="edit-comment-box-container">
        <div className="tweet-box">
          <Avatar alt="User" src={profile_image} />
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
              string && file ? 
                <button onClick={() => setFile('')} className="change-file">
                  Change file
                </button> :
                <div>
                  <input 
                    type="file"
                    ref={uploadImageButtonRef}
                    hidden
                    onChange={
                      (e) => setFile(e.target.files[0])
                    }
                  /> 
                  <SystemUpdateAltIcon className="upload-image" onClick={uploadImg} />
                  <span className="image-name">{fileName}</span>
                </div>            
            }
          </div>
          <div className="tweet-button">
            <button disabled={!comment && !file} onClick={save}>
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

export default Comment