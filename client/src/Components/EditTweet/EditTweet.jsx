import React, {useState, useRef} from 'react'
import axios from 'axios'
import Avatar from '@material-ui/core/Avatar';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

const EditTweet = ({socket, tweetInfo, setTweetInfo, setTweets}) => {
  const {tweetId, fileId} = tweetInfo
  const profile_image = localStorage.getItem("profile-image") || ''
  const [tweet, setTweet] = useState(tweetInfo.tweet)
  const [file, setFile] = useState(fileId)

  const uploadImageButtonRef = useRef(null)
  
  const uploadImg = () => {
    uploadImageButtonRef.current.click()
  }

  const save = async (e) => {
    const url = "http://localhost:5000/tweet-update"

    let currentFile = file
    if (file === undefined) currentFile = ''
    const data = new FormData()
    data.append("tweet", tweet)
    data.append("tweetId", tweetId)
    data.append("file", currentFile)
    data.append("fileId", currentFile)

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
        socket.emit('tweets', data)
      })
      .catch((error) => {
        console.log(error);
      })
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
    <div className="edit-tweet-box-wrapper">
      <div className="edit-tweet-box-container">
        <div className="tweet-box">
          <Avatar alt="User" src={profile_image} />
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
              string && file ? 
                <button onClick={() => setFile('')} className="change-file">
                  Change file
                </button> :
                <div>
                  <input 
                    ref={uploadImageButtonRef}
                    type="file"
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
            <button disabled={!tweet && !file} onClick={save}>
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

export default EditTweet