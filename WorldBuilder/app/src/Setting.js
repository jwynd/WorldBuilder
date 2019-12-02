import React from 'react';
import ReactDOM from 'react-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import InputRange from 'react-input-range';
import './App.scss';
import 'react-rangeslider/lib/index.css'; 
import 'react-input-range/lib/css/index.css'

class Setting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        Size: 5,
        ConastSmoothness: 2,
        Inland: 3,
        BeachHeight: 5,
        CoastUniformity: 3,
        NumRivers: 0,
        NumMountainRanges: 30,
        WidthMountainRange: 10,
        Squiggliness: 1,
        MountainSmoothness: 5,
    };
  }
    newset=()=>{
      // need change to long
        let width =  document.getElementById("mWidth")
        let height =  document.getElementById("mHeight")
        let temp = this.Size()/100* Math.ceil((width * height))
        document.getElementById("size").value = temp
        let islandArea = Math.pow(2, temp)
        let islandCircumference = 2 * Math.PI * Math.sqrt(islandArea / Math.PI);
        document.getElementById("conastSmoothness").value = this.ConastSmoothness()/100*temp  
        document.getElementById("inland").value = this.Inland() 
        document.getElementById("beachHeight").value = this.BeachHeight()
        document.getElementById("coastUniformity").value = this.CoastUniformity()
        document.getElementById("numRivers").value = this.NumRivers()/100*.05(2 * Math.pi * Math.sqrt(islandArea/ Math.pi))
        document.getElementById("numMountainRanges").value = this.NumMountainRanges()/100* 0.05 * islandArea
        document.getElementById("widthMountainRange").value = this.WidthMountainRange()/100* islandCircumference / 3
        document.getElementById("squiggliness").value = this.Squiggliness()
        document.getElementById("mountainSmoothness").value = this.MountainSmoothness()
        let loading = document.getElementById('i-loading')
        loading.setAttribute('class', 'i-loading')
        loading.style.display = 'block'
        setTimeout(() => {
         this.props.setParentState()
        }, 1000)
    } 
    

  render() {
    return (
     
      <form className="form">
        <Scrollbars
                style={{width: 500, height: 400 }}>
            
        <p> Set Map Size </p>
        <InputRange
          maxValue={100}
          minValue={0}
          value={this.state.Size}
          
          onChange={value => this.setState({ Size: value })}
          onChangeComplete={value => console.log(value)} />

     <p> Smoothness of Coast </p>
         <InputRange
          maxValue={100}
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
          maxValue={30}
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
          maxValue={100}
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
        <button>Finish</button>
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