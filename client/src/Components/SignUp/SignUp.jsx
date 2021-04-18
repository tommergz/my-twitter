import React, { Component } from 'react'
import { Redirect } from "react-router"
import "../../StyleSheet/Form.css"
import axios from 'axios'
import {Link} from 'react-router-dom'

export default class SignUp extends Component {
    state = {
      username: '',
      mail: '',
      password: '',
      vPassword: '',
      image: null,
      redirect: false
    }

  handleForm = (e) => {
    this.setState({
      [e.target.id]: e.target.files ? e.target.files[0] : e.target.value,
    })
  }

  signUp = (e) => {
    e.preventDefault()
    
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
        console.log(error);
      })
  }
  render() {
    const redirect = this.state.redirect
    return (
      redirect ? 
      <Redirect to="/" /> : 
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
            <input onChange={this.handleForm} type="file" id="image"/>
            <button onClick={this.signUp}>Sign up</button>
          </form>
          <span className="or">Or</span>
          <Link to="/user-signin">
            <button className="sign-up-button">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    )
  }
}
