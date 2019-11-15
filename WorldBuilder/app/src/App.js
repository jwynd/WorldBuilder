import React from 'react';
import './App.scss';
import logo from './icons/logo.png';
import download from './icons/download.svg';
import menu from './icons/menu.svg';
import Login from './Login.js';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './js/main.js';

class App extends React.Component {
  download=()=>{
    debugger
    let data =document.getElementById("downloadpic").children[0].children[0].toDataURL().replace("image/png", "image/octet-stream;")
    let filename="download.png"
    let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    save_link.href = data
    save_link.download = filename
    let event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    save_link.dispatchEvent(event)
  }
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
                  <img src={download} className="App-download" alt="download" onClick={this.download.bind(this)} height="50"/>
                  <img src={menu} className="App-menu" alt="menu" height="50"/>
                  <Login />
                  <div id="downloadpic">
                    <P5Wrapper sketch={sketch} />
                  </div>
              </header>
          </div>
      )
  }
}

export default App;