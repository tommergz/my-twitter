import React from 'react'
import {Link} from 'react-router-dom'
import TwitterIcon from '@material-ui/icons/Twitter';
import SubjectIcon from '@material-ui/icons/Subject';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import TweetToggle from './TweetToggle';
import './SideBar.css';
import Avatar from '@material-ui/core/Avatar';

const SideBar = ({myTweets, setMyTweets}) => {
  const currentUser = localStorage.getItem("username")
  const profile_image = localStorage.getItem("profile-image") || ''
  const signOut = () => {
    localStorage.setItem("username", '')
  }

  return (
    <div className="tweet-toggle-container">
      <div className="tweet-toggle-home-icon">
        <TwitterIcon style={{ fontSize: 40 }} className="tweet-toggle-twitter-icon" />
      </div>
      <div className="tweet-toggles">
        <div className="profile-img-wrapper">
          <Avatar src={profile_image} className="tweet-toggle-profile-img" />
        </div>
        <div className="nikname-wrapper">
          <h3 className="nikname">{currentUser}</h3>
        </div>
        <div className='toggles'>
          <TweetToggle 
            myTweets={myTweets}
            setMyTweets={setMyTweets}
            boolean={false}
            Icon={SubjectIcon} 
            text={`Tweets`}
          />
          <TweetToggle 
            myTweets={myTweets}
            setMyTweets={setMyTweets}
            boolean={true}
            Icon={PermIdentityIcon} 
            text={`My tweets`}
          />
        </div>
        {
          currentUser ? 
          <div className="signin-container">
            <div className="sign-out">
              <Link to="/user-signin">
                <button 
                  className="sign-out-button"
                  onClick={signOut}
                >
                  Log out
                </button>
              </Link>  
            </div>
          </div> :
            <div className="signin-container">
              <div className="sign-out">
                <Link to="/user-signin">
                  <button 
                    className="sign-out-button"
                  >
                    Log in
                  </button>
                </Link>  
              </div>
              <div className="sign-out signout">
                <Link to="/user-signup">
                  <button 
                    className="sign-out-button"
                  >
                    Sign up
                  </button>
                </Link>  
              </div>
            </div>
        }

      </div>
    </div>
  )
}

export default SideBar
