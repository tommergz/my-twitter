import React, {useEffect, useState} from 'react'
import './Users.css'
import axios from "axios"
import Avatar from '@material-ui/core/Avatar'
import Loading from '../Loading/Loading'

const Users = () => {

  const [users, setUsers] = useState(null)

  useEffect(() => {
    const loadData = async function() {
      const url = 'http://localhost:5000/users'
      const {data} = await axios.get(url)
      setUsers(data)
    }

    loadData()
  }, [])

  const allUsers = !users ? <Loading /> :
  <div className="user-list">
    {users.sort((a, b) => a.username.localeCompare(b.username)).map((user, index) => {
      return (
        <div key={+Date.now().toString() + index} className="content">
          <div className="some-user">
            <Avatar 
              alt="User Profile" 
              src={user.profile_pic} 
              className="user-avatar"
            />
            <h3>{user.username}</h3>
          </div>
        </div>
      )
    })}
  </div>
  
  return (
    <div className="users-container">
      <div className="users-header">
        <h1>Users</h1>
      </div>
      {allUsers}
    </div> 
  )
}

export default Users
