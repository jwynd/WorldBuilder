import React from 'react';
import './App.css';
import logo from './icons/logo.png';
import download from './icons/download.svg';
import menu from './icons/menu.svg';


class App extends React.Component{
  constructor(props){
      super(props);
      this.state = {isUserAuthorized: false};
  }
  render() {
      const {isUserAuthorized} = this.state;
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
                  <div className="login-button">Register/Log In</div> 
              </header>
          </div>
      )
  }
}

export default App;