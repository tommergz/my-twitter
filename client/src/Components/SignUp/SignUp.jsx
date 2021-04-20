import React, { Component } from 'react'
import { Redirect } from "react-router"
import "../../StyleSheet/Form.css"
import axios from 'axios'
import {Link} from 'react-router-dom'
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import Loading from '../Loading/Loading'

export default class SignUp extends Component {
    state = {
      username: '',
      mail: '',
      password: '',
      vPassword: '',
      image: null,
      redirect: false,
      loading: false
    }

  handleForm = (e) => {
    this.setState({
      [e.target.id]: e.target.files ? e.target.files[0] : e.target.value,
    })
  }

  signUp = (e) => {
    e.preventDefault()
    
    this.setState({
      loading: true
    })

    const data = new FormData()
    data.append('username', this.state.username)
    data.append('mail', this.state.mail)
    data.append('password', this.state.password)
    data.append('verifiedPassword', this.state.vPassword)
    data.append('profileImage', this.state.image)

    const url = "http://localhost:5000/user-register";
    axios
      .post(url, data)
      .then((response) => {
        console.log(response);
        localStorage.setItem("sid", response.data.token)
        localStorage.setItem("username", this.state.username)
        localStorage.setItem("profile-image", response.data.profile_pic)
        this.setState({
          redirect: true
        })
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
        alert(error.response.data.msg)
        console.log(error);
      })
  }

  uploadImageButtonRef = React.createRef()
  
  uploadImg = () => {
    this.uploadImageButtonRef.current.click()
  }

  render() {
    const {redirect, image, loading} = this.state
    let fileName = ''
    if (image && image.name.length > 20) {
      let fullFileName = image.name
      fileName = fullFileName.slice(0,9) + '...' + fullFileName.slice(-9)
    } else if (image) {
      fileName = image.name
    }
    return (
      redirect ? 
      <Redirect to="/home" /> : 
      <div className="form-container-wrapper">
        <div className="form-container">
          <form className="form">
            <label>Username</label>
            <input 
              onChange={this.handleForm} 
              type="text" 
              placeholder="Username" 
              id="username" 
            />
            <label>Mail</label>
              <input 
                onChange={this.handleForm} 
                type="text" 
                placeholder="Mail" 
                id="mail" 
              />
            <label>Password</label>
            <input 
              onChange={this.handleForm} 
              type="password" 
              name="" 
              id="password"
            />
            <label>Verify Password</label>
            <input onChange={this.handleForm} type="password" id="vPassword"/>
            <label>Profile Picture</label>
            <div className="file">
              <input 
                ref={this.uploadImageButtonRef}
                type="file" 
                hidden
                onChange={this.handleForm}
                id="image"
              />
              <SystemUpdateAltIcon className="upload-image" onClick={this.uploadImg} />
              <span className="image-name">{fileName}</span>
            </div>
            <button onClick={this.signUp}>Sign up</button>
          </form>
          <span className="or">Or</span>
          <Link to="/user-signin">
            <button className="sign-up-button">
              Log in
            </button>
          </Link>
        </div>
        {loading ? <Loading /> : null}
      </div>
    )
  }
}
