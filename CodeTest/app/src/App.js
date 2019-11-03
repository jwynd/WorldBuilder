import React from 'react';
import './App.scss';
import logo from './icons/logo.png';
import download from './icons/download.svg';
import menu from './icons/menu.svg';
import Login from './Login.js';
import loginModal from './Login.js';


class App extends React.Component {
  render() {
      /*
      const logIn = isUserAuthorized ? (
          <h2>Welcome!</h2>
      ) : (
          <button type="button">Register/Log In</button> 
      );
      */

      return (
          <div className ="App">
              <header className="App-header">
                  <div className="fill"></div>
                  <h1 className="App-title">WorldBuilder</h1>
                  <img src={logo} className="App-logo" alt="logo" height="100"/>
                  <img src={download} className="App-download" alt="download" height="50"/>
                  <img src={menu} className="App-menu" alt="menu" height="50"/>
                  <Login />
              </header>
          </div>
      )
  }
}

export default App;