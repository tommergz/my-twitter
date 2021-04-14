import './App.css';
import React from 'react'
import Home from '../Home/Home';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import SignUp from '../SignUp/SignUp';
import SignIn from '../SignIn/SignIn';

function App() {

  const currentUser = localStorage.getItem("username")

  return (
    <Router className="app">
      <Switch>
        <Route path="/user-signup">
          <SignUp />
        </Route>
        <Route path="/user-signin">
          <SignIn />
        </Route>
        <Route path="/">
          {
            currentUser ? <Home /> : <SignIn />
          }          
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
