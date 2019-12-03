import React from 'react';
import ReactDOM from 'react-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import InputRange from 'react-input-range';
import './App.scss';
import 'react-rangeslider/lib/index.css'; 
import 'react-input-range/lib/css/index.css';
import { mWidth, mHeight, mapName, size, coastSmoothness, islandArea, islandCircumference,
         inland, beachHeight, coastUniformity, numRivers, numMountainRanges, widthMountainRange,
         squiggliness, mountainSmoothness, worldSeed} from './js/main.js';

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapName: mapName,
      islandArea: islandArea,
      islandCircumference: islandCircumference,
      inland: inland,
      beachHeight: beachHeight,
      coastUniformity: coastUniformity,
      squiggliness: squiggliness,
      mountainSmoothness: mountainSmoothness,
      worldSeed: worldSeed,
      width: mWidth,
      height: mHeight,
      sizePercent: size * 100 / Math.ceil(Math.log2(mWidth * mHeight)),
      coastSmoothnessPercent: coastSmoothness * 100 / size,
      numRiverPercentage: numRivers * 100 / .05 * (2 * Math.PI * Math.sqrt(islandArea/Math.PI)),
      numMountainRanges: numMountainRanges,
      widthMountainRangesPercentage: widthMountainRange * 100 / (islandCircumference / 3),
    }
    
  }
  
  newset () {
    document.getElementById('mWidth').value = this.state.width;
    document.getElementById('mHeight').value = this.state.height;
    document.getElementById('mapName').value = this.state.mapName;
    document.getElementById('size').value  = this.state.sizePercent * Math.ceil(Math.log2(this.state.width * this.state.height));
    document.getElementById('coastSmoothness').value  = this.state.coastSmoothnessPercent * this.state.size;
    document.getElementById('islandArea').value  = Math.pow(2, this.state.size);
    document.getElementById('islandCircumference').value  = 2 * Math.PI * Math.sqrt(this.state.islandArea / Math.PI);
    document.getElementById('inland').value = this.state.inland;
    document.getElementById('beachHeight').value  = this.state.beachHeight;
    document.getElementById('coastUniformity').value  = this.state.coastUniformity;
    document.getElementById('numRivers').value  = this.state.numRiverPercentage * .05 * (2 * Math.PI * Math.sqrt(this.state.islandArea/Math.PI));
    document.getElementById('numMountainRanges').value  = this.state.numMountainRanges;
    document.getElementById('widthMountainRange').value = this.state.numMountainRanges * (this.state.islandCircumference / 3);
    widthMountainRange = Math.max(this.state.islandCircumference / 10, this.state.widthMountainRange);
    document.getElementById('squiggliness').value  = this.state.squiggliness;
    document.getElementById('mountainSmoothness').value = this.state.mountainSmoothness;
    document.getElementById('worldSeed').value = this.state.worldSeed;

    this.props.setParentState();
  }
  
    setSeed = (e) => {
      this.setState({
        worldSeed: e.target.value
      })
    }

    setName = (e) => {
      this.setState({
        mapName: e.target.value
      })
    }

  render() {
    return (
     
      <form className="form">
        <input type="text" hidden id="mWidth" value={1280}/>
        <input type="text" hidden id="mHeight" value={720}/>
        <Scrollbars
                style={{width: 450, height: '95vh' }}>

      <p> Set Map Name  </p>
          <input type="text" name="worldSeed" onChange={e => this.setName(e)}/>
    
      <p></p>

      <p> Set Map Seed  </p>
          <input type="numbers" name="worldSeed" onChange={e => this.setSeed(e)}/>
    
      <p></p>

      <p> Set Map Width </p>
        <InputRange
          maxValue={2000}
          minValue={500}
          value={this.state.width} //Default value
          onChange={value => this.setState({ width: value })} //Stores user input
          //onChangeComplete={value => console.log(value)}
        />

      <p> Set Map Height </p>
        <InputRange
          maxValue={1500}
          minValue={100}
          value={this.state.height} //Default value
          onChange={value => this.setState({ height: value })} //Stores user input
          //onChangeComplete={value => console.log(value)}
        />

      <p> Set Map Size </p>
        <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.sizePercent} //Default value
          onChange={value => this.setState({ sizePercent: value })} //Stores user input
          //onChangeComplete={value => console.log(value)}
        />

     <p> Smoothness of Coast </p>
         <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.coastSmoothnessPercent}
          onChange={value => this.setState({ coastSmoothnessPercent: value })}
          //onChangeComplete={value => console.log(value)}
        />

    <p> Set inland Number </p>
          <InputRange
          maxValue={3}
          minValue={1}
          value={this.state.inland}
          onChange={value => this.setState({inland: value})}
          //onChangeComplete={value => console.log(value)}
        />


     <p> Set Beach Height </p>
         <InputRange
          maxValue={10}
          minValue={0}
          value={this.state.beachHeight}
          onChange={value => this.setState({beachHeight: value})}
          //onChangeComplete={value => console.log(value)}
          />
     
    <p> Set Coast Uniformity</p>
          <InputRange
          maxValue={3}
          minValue={0}
          value={this.state.coastUniformity}
          onChange={value => this.setState({coastUniformity: value})}
          //onChangeComplete={value => console.log(value), this.forceUpdate()}
          />

    <p> Set Density of Rivers </p>
         <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.numRiverPercentage}
          onChange={value => this.setState({numRiverPercentage: value})}
          //onChangeComplete={value => console.log(value)}
          />

    <p> Set Density of Mountain Ranges </p>
         <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.numMountainRanges}
          onChange={value => this.setState({numMountainRanges: value})}
          //onChangeComplete={value => console.log(value)}
          />

   <p> Set Mountain Range Width </p>
         <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.widthMountainRangesPercentage}
          onChange={value => this.setState({widthMountainRangesPercentage: value})}
          //onChangeComplete={value => console.log(value)}
          />


    <p> Set Squiggliness </p>
        <InputRange
          maxValue={90}
          minValue={0}
          value={this.state.squiggliness}
          onChange={value => this.setState({squiggliness: value})}
          //onChangeComplete={value => console.log(value)}
          />

    <p> Set Mountain Smoothness </p>
        <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.mountainSmoothness}
          onChange={value => this.setState({mountainSmoothness: value})}
          //onChangeComplete={value => console.log(value)}
          />
        <a className="bnt-finish" onClick={this.newset()}>Finish</a>
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