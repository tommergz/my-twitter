import React, { Component } from 'react'
import "../../StyleSheet/Form.css"
import Axios from 'axios'

export default class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      vPassword: '',
      image: null
    }
    this.handleForm = this.handleForm.bind(this)
    this.signUp = this.signUp.bind(this)
  }

  handleForm(e) {
    this.setState({
      [e.target.id]: e.target.files ? e.target.files[0] : e.target.value,
    })
  }
  signUp(e) {
    e.preventDefault()
    
    const data = new FormData()
    data.append('username', this.state.username)
    data.append('password', this.state.password)
    data.append('verifiedPassword', this.state.vPassword)
    data.append('profileImage', this.state.image)

    const url = "http://localhost:5000/user-register";
    Axios
      .post(url, data)
      .then((response) => {
        console.log(response.data.msg)
      })
      .catch((error) => {
        console.log(error);
      })
  }
  render() {
    return (
      <div className="form-container">
        <form className="Form">
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
          <label>Verify Password</label>
          <input onChange={this.handleForm} type="password" id="vPassword"/>
          <label>Profile Picture</label>
          <input onChange={this.handleForm} type="file" id="image"/>
          <button onClick={this.signUp}>SignUp</button>
        </form>
      </div>
    )
  }
}
