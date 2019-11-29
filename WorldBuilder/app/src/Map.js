import React from 'react';
import './App.scss';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './js/main.js';

class Map extends React.Component {
  constructor(){
    super();
    this.state = { }
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
    return (
      <>
      <P5Wrapper sketch={sketch} />
      </>
    );
  }
}
export default Map;