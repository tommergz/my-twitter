import React from 'react'
import {Link} from 'react-router-dom'
import TwitterIcon from '@material-ui/icons/Twitter';
import SubjectIcon from '@material-ui/icons/Subject';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import SideBarLayout from './SideBarLayout';
import './SideBar.css';

const SideBar = () => {
  const signOut = () => {
    localStorage.setItem("username", '')
  }
  return (
    <div className="side-bar-container">
      <div className="side-bar-home-icon">
        <TwitterIcon style={{ fontSize: 40 }} className="side-bar-twitter-icon" />
      </div>
      <div className="side-bar">
        <SideBarLayout Icon={SubjectIcon} text={`Tweets`}/>
        <SideBarLayout Icon={PermIdentityIcon} text={`My tweets`}/>
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
      </div>
    </div>
  )
}

export default SideBar
