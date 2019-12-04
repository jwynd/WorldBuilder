import React from 'react';
import ReactDOM from 'react-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import InputRange from 'react-input-range';
import './App.scss';
import 'react-rangeslider/lib/index.css'; 
import 'react-input-range/lib/css/index.css';
import {worldSeed}from './js/main.js';
//import { mWidth, mHeight, mapName, size, coastSmoothness, islandArea, islandCircumference,
//         inland, beachHeight, coastUniformity, numRivers, numMountainRanges, widthMountainRange,
//         squiggliness, mountainSmoothness, worldSeed} from './js/main.js';

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

        Size: 5,
        ConastSmoothness: 4,
        Inland: 3,
        BeachHeight: 5,
        CoastUniformity: 3,
        NumRivers: 0,
        NumMountainRanges: 10,
        WidthMountainRange: 10,
        Squiggliness: 1,
        MountainSmoothness: 50,
        WorldSeed: worldSeed,
    };
  }
    //console.log('islandArea is ' + this.state.islandArea);
    //console.log('numMountainRange is ' + numMountainRanges)
    //console.log('numMountainRange percentage is ' + this.state.numMountainRangesPercentage)
    
  //}
    newset=()=>{
      debugger
        let width =  document.getElementById("mWidth").value
        let height =  document.getElementById("mHeight").value
        let temp = this.state.Size/100* Math.ceil((width * height))
        document.getElementById("size").value = this.state.Size
        document.getElementById("coastSmoothness").value = this.state.ConastSmoothness
        document.getElementById("inland").value = this.state.Inland
        document.getElementById("beachHeight").value = this.state.BeachHeight
        document.getElementById("coastUniformity").value = this.state.CoastUniformity
        document.getElementById("numRivers").value = this.state.NumRivers
        document.getElementById("numMountainRanges").value = this.state.NumMountainRanges
        document.getElementById("widthMountainRange").value = this.state.WidthMountainRange
        document.getElementById("squiggliness").value = this.state.Squiggliness
        document.getElementById("mountainSmoothness").value = this.state.MountainSmoothness
   
        
      //worldSeed.value = 1234;
      this.props.setParentState()
    }

   /* setSeed = (e) => {
      this.setState({
        worldSeed: e.target.value
      })
      console.log('seed ' + this.state.worldSeed)
    }
    */

  render() {
    return (
   
      <form className="form">
        <input type="text" hidden id="mWidth" value={1280}/>
        <input type="text" hidden id="mHeight" value={720}/>
        <Scrollbars
                style={{width: 450, height: '95vh' }}>
       <p> Set for Map seed number </p>
          <InputRange
          maxValue={1000000}
          minValue={1}
          value={this.state.WorldSeed} //Default value
          onChange={value => this.setState({ WorldSeed: value })} //Stores user input
          //onChangeComplete={value => console.log(value)}
          onCHangeComplet={value => console.log(value)}
        />
   
        <p> Set Map Size </p>
        <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.Size}
          
          onChange={value => this.setState({ Size: value })}
          onChangeComplete={value => console.log(value)} />

     <p> Smoothness of Coast </p>
         <InputRange
          maxValue={7}
          minValue={0}
          value={this.state.ConastSmoothness}
          onChange={value => this.setState({ ConastSmoothness: value })}
          onChangeComplete={value => console.log(value)} />

    <p> Set inland Number </p>
          <InputRange
          maxValue={3}
          minValue={1}
          value={this.state.Inland}
          onChange={value => this.setState({ Inland: value })}
          onChangeComplete={value => console.log(value)} />


     <p> Set Beach Height </p>
         <InputRange
          maxValue={10}
          minValue={0}
          value={this.state.BeachHeight}
          onChange={value => this.setState({ BeachHeight: value })}
          onChangeComplete={value => console.log(value)} />
     
    <p> Set Coast Uniformity</p>
          <InputRange
          maxValue={3}
          minValue={0}
          value={this.state.CoastUniformity}
          onChange={value => this.setState({ CoastUniformity: value })}
          onChangeComplete={value => console.log(value)} />

    <p> Set Number of Rivers </p>
         <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.NumRivers}
          onChange={value => this.setState({ NumRivers: value })}
          onChangeComplete={value => console.log(value)} />

    <p> Set Number of Mountain Ranges </p>
         <InputRange
          maxValue={10}
          minValue={0}
          value={this.state.NumMountainRanges}
          onChange={value => this.setState({ NumMountainRanges: value })}
          onChangeComplete={value => console.log(value)} />

   <p> Set Mountain Width Range </p>
         <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.WidthMountainRange}
          onChange={value => this.setState({ WidthMountainRange: value })}
          onChangeComplete={value => console.log(value)} />


    <p> Set Squiggliness </p>
        <InputRange
          maxValue={90}
          minValue={0}
          value={this.state.Squiggliness}
          onChange={value => this.setState({ Squiggliness: value })}
          onChangeComplete={value => console.log(value)} />

    <p> Set Mountain Smoothness </p>
        <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.MountainSmoothness}
          onChange={value => this.setState({MountainSmoothness: value })}
          onChangeComplete={value => console.log(value)} />
        <a className="bnt-finish" onClick={this.newset.bind(this)}>Finish</a>
        </Scrollbars>
      </form>

    );
  }
}
const rootElement = document.getElementById("root")
ReactDOM.render(<Setting />, rootElement)
// ReactDOM.render(
 //  <Setting />,document.getElementById('challenge-node')
 //  document.getElementById('app')
// );

export default Setting;