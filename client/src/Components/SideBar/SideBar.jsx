import React from 'react'
import {Link} from 'react-router-dom'
import TwitterIcon from '@material-ui/icons/Twitter';
import AppsIcon from '@material-ui/icons/Apps';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EmailIcon from '@material-ui/icons/Email';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import SubjectIcon from '@material-ui/icons/Subject';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import HomeIcon from '@material-ui/icons/Home';
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
        <SideBarLayout Icon={HomeIcon} text={`Home`}/>
        <SideBarLayout Icon={AppsIcon} text={`Explore`}/>
        <SideBarLayout Icon={NotificationsIcon} text={`Notofications`}/>
        <SideBarLayout Icon={EmailIcon} text={`Messages`}/>
        <SideBarLayout Icon={BookmarkBorderIcon} text={`Bookmark`}/>
        <SideBarLayout Icon={SubjectIcon} text={`List`}/>
        <SideBarLayout Icon={PermIdentityIcon} text={`Profile`}/>
        <SideBarLayout Icon={MoreHorizIcon} text={`More`}/>
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
