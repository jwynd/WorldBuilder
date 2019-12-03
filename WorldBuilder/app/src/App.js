import React from 'react';
import './App.scss';
import logo from './icons/logo.png';
import download from './icons/download.svg';
import Menu from './menu.js';
import Login from './Login.js';
import Map from './Map.js';
import Setting from './Setting.js';
class App extends React.Component {
  constructor(props){
    super(props)
    this.state={
      seed: ''
    }
  }
  componentWillMount () {

  }
  download=()=>{
    debugger
    let data =document.getElementById("downloadpic").children[1].children[0].toDataURL().replace("image/png", "image/octet-stream;")
    let filename="download.png"
    let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    save_link.href = data
    save_link.download = filename
    let event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    save_link.dispatchEvent(event)
  }
  setSelfState = () => {
    this.setState({
      seed: document.getElementById('worldseed').value
    })
    this.forceUpdate()
  }
  setSelfState1 = () => {
    this.setState({
      seed: document.getElementById('worldseed1').value
    })
    this.forceUpdate()
  }
  componentDidMount(){
    let loading = document.getElementById('i-loading')
    if (loading) {
      let myVar=setInterval(() => {
        loading.setAttribute('class', 'i-loading-out')
        loading.style.display = 'none'
        clearTimeout(myVar)
      }, 1000)
    }
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

                <input type="text" hidden id="size"/>
                <input type="text" hidden id="ConastSmoothness"/>
                <input type="text" hidden id="inland"/>
                <input type="text" hidden id="beachHeight"/>
                <input type="text" hidden id="coastUniformity"/>
                <input type="text" hidden id="numRivers"/>
                <input type="text" hidden id="numMountainRanges"/>
                <input type="text" hidden id="widthMountainRange"/>
                <input type="text" hidden id="maxHeightMountainRange"/>
                <input type="text" hidden id="squiggliness"/>
                <input type="text" hidden id="mountainSmoothness"/>
                <input type="text" hidden id="islandArea"/>
        
                  <div className="fill"></div>
                  <h1 className="App-title">WorldBuilder</h1>
                  <img src={logo} className="App-logo" alt="logo" height="100"/>
                  <img src={download} className="App-download" alt="download" onClick={this.download.bind(this)} height="50"/>
                  <Menu  setParentState={this.setSelfState} setParentState1={this.setSelfState1}/>
                  <Login />
                  <div id="downloadpic">
                    <div id="i-loading">
                      <div className="loading-center">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                    </div>
                    <Map key={this.state.seed}/>
                  </div>
              </header>
          </div>
      )
  }
}

export default App;