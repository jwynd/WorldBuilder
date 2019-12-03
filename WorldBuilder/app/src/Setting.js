import React from 'react';
import ReactDOM from 'react-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import InputRange from 'react-input-range';
import './App.scss';
import 'react-rangeslider/lib/index.css'; 
import 'react-input-range/lib/css/index.css';
import { mWidth, mHeight, mapName, size, coastSmoothness, islandArea, islandCircumference,
         inland, beachHeight, coastUniformity, numRivers, numMountainRanges, widthMountainRange,
         maxHeightMountainRange, squiggliness, mountainSmoothness, worldSeed, setWidth, setHeight, setName, setSize,
         setCoastSmoothness, setIslandArea, setIslandCircumference, setInland, setBeachHeight,
         setCoastUniformity, setNumRivers, setNumMountainRanges, setWidthMountainRange,
         setSquiggliness, setMountainSmoothness, setMaxHeightMountainRange } from './js/main.js';

function clamp (val, min, max){
  let result = val;
  if(val < min) result = min;
  if(val > max) result = max;
  return Math.round(result);
}

class Setting extends React.Component {
  constructor(props) {
    super(props);
    // const sp = clamp(size / Math.ceil(Math.log2(mWidth * mHeight)), 1, 100);
    // const csp = clamp(coastSmoothness / size, 1, 100);
    const wmrp = clamp(widthMountainRange / (islandCircumference / 3), 1, 100);
    const mhmrp = clamp(maxHeightMountainRange / 255, 1, 100);
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
      sizePercent: size / Math.ceil(Math.log2(mWidth * mHeight)),
      coastSmoothnessPercent: coastSmoothness / size,
      numRiverPercentage: numRivers / .05 * (2 * Math.PI * Math.sqrt(islandArea/Math.PI)),
      numMountainRanges: numMountainRanges,
      widthMountainRangesPercentage: wmrp,
      maxHeightMountainRangePercentage: mhmrp,
    }
    
  }
  newset () {
    setWidth(this.state.width);
    setHeight(this.state.height);
    setName(this.state.mapName);
    setSize(this.state.sizePercent * Math.ceil(Math.log2(mWidth * mHeight)));
    setCoastSmoothness(this.state.coastSmoothnessPercent * size);
    setIslandArea(Math.pow(2, size));
    setIslandCircumference(2 * Math.PI * Math.sqrt(islandArea / Math.PI));
    setInland(this.state.inland);
    setBeachHeight(this.state.beachHeight);
    setCoastUniformity(this.state.coastUniformity);
    setNumRivers(Math.ceil(this.state.numRiverPercentage * .05 * (2 * Math.PI * Math.sqrt(islandArea/Math.PI))));
    setNumMountainRanges(this.state.numMountainRanges);
    const widthMountainRange = Math.ceil(this.state.widthMountainRangesPercentage * (islandCircumference / 3));
    setWidthMountainRange(Math.max(islandCircumference / 10, widthMountainRange));
    const maxHeightMountainRange = Math.ceil(this.state.maxHeightMountainRangePercentage * 255);
    setMaxHeightMountainRange(Math.max(maxHeightMountainRange, 150));
    setSquiggliness(this.state.squiggliness);
    setMountainSmoothness(this.state.mountainSmoothness);
    //worldSeed = this.state.worldSeed;
    
    this.props.setParentState();
  }

    setName = (e) => {
      this.setState({
        mapName: e.target.value
      })
    }

  render() {
    return (
     
      <form className="form">
        <Scrollbars
                style={{width: 450, height: '95vh' }}>

      <p> Set Map Name  </p>
          <input type="text" name="worldSeed" onChange={e => this.setName(e)}/>
    
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

   <p> Set Maximum Mountain Height </p>
         <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.maxHeightMountainRangePercentage}
          onChange={value => this.setState({maxHeightMountainRangePercentage: value})}
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