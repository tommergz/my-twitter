import React, { Component } from 'react'
import { Redirect } from "react-router"
import "../../StyleSheet/Form.css"
import axios from 'axios'
import {Link} from 'react-router-dom'
import Loading from '../Loading/Loading'

export default class SignIn extends Component {

  state = {
    username: '',
    password: '',
    redirect: false,
    loading: false
  }
  
  handleForm = (e) => {
    this.setState({
      [e.target.id]: e.target.files ? e.target.files[0] : e.target.value,
    })
  }

  signIn = (e) => {
    e.preventDefault()

    this.setState({
      loading: true
    })
        
    const data = new FormData()
    data.append('username', this.state.username)
    data.append('password', this.state.password)

    const url = "http://localhost:5000/user-login"
    axios
      .post(url, data)
      .then((response) => {
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
        alert('Wrong login or password')
        console.log(error);
      })
  }
  render() {
    const {redirect, loading} = this.state
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
              <label>Password</label>
              <input 
                onChange={this.handleForm} 
                type="password" 
                name="" 
                id="password"
              />
              <button onClick={this.signIn}>Log in</button>
            </form>
              <span className="or">Or</span>
              <Link to="/user-signup">
                <button className="sign-up-button">
                  Sign up
                </button>
              </Link>
          </div>
          {loading ? <Loading /> : null}
        </div>
    )
  }
}
