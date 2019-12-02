 import React from 'react';
import './App.scss';
import './scss/_modal.scss';
import './scss/_buttons.scss';
import './js/main';
import { Modal, Button, Form } from 'react-bootstrap';
import { tsConstructorType } from '@babel/types';
/*
function close() {
    this.setState( {showModal: false} );
  }
  
  function open() {
    this.setState( {showModal: true} );
  }
  */
class Setting extends React.Component {
constructor(props){
    super(props);
    this.state = {
        Size: '',
        ConastSmoothness:'',
        Inland:'',
        BeachHeight:'',
        CoastUniformity:'',
        NumRivers:'',
        NumMountainRanges:'',
        WidthMountainRange:'',
        Squiggliness:'',
        MountainSmoothness:'',

    };
}
handleClick(){
    console.log("State ==>", this.state);
}

setSize = (e) => {
    this.setState({
       Size: e.target.value
       document.getElementById("size").value = this.Size()
    })
  }
  
setConast = (e) => {
    this.setState({
        ConastSmoothness: e.target.value
        document.getElementById("conastSmoothness").value = this.Size()     

    })
}
setIsd = (e) => {
    this.setState({
        Inland: e.target.value
    })
}
setBeaHgh = (e) => {
    this.setState({
        BeachHeight: e.target.value
    })
}
setCoastUni = (e) => {
    this.setState({
        CoastUniformity: e.target.value
    })
}
setRiv = (e) => {
    this.setState({
        NumRivers: e.target.value
    })
}
setMount = (e) => {
    this.setState({
        NumMountainRanges: e.target.value
    })
}
setWidMount = (e) => {
    this.setState({
        WidthMountainRange: e.target.value
    })
}
setSqyu = (e) => {
    this.setState({
        Squiggliness: e.target.value
    })
}
setMountSm = (e) => {
    this.setState({
        MountainSmoothness: e.target.value
    })
}
  render(){
  return(
  <div>
     <label> Set Map Size </label>
     <input type="number" name="Size" onChange={e => this.setSize(e)}/>
     <label> Smoothness of Coast </label>
     <input type="number" name="ConastSmoothness" onChange={e => this.setConast(e)}/>
     <label> Set inland Number </label>
     <input type="number" name="Inland" onChange={e => this.setIsd(e)}/>
     <label> Set Beach Height </label>
     <input type="number" name="BeachHeight" onChange={e => this.setBeaHgh(e)}/>
     <label> Set Coast Uniformity</label>
     <input type="number" name="CoastUniformity" onChange={e => this.setCoastUni(e)}/>
     <label> Set Number of Rivers </label>
     <input type="number" name="NumRivers" onChange={e => this.setRiv(e)}/>
     <label> Set Number of Mountain Ranges </label>
     <input type="number" name="NumMountainRanges" onChange={e => this.setMount(e)}/>
     <label> Set Mountain Width Range </label>
     <input type="number" name="WidthMountainRange" onChange={e => this.setWidMount(e)}/>
     <label> Set Squiggliness </label>
     <input type="number" name="Squiggliness" onChange={e => this.setSqyu(e)}/>
     <label> Set Mountain Smoothness </label>
     <input type="number" name="MountainSmoothness" onChange={e => this.setMountSm(e)}/>
     <button type="submit" onClick={this.handleClick}/>   
  </div>
  )
  }
}




/* class Set extends React.Component {
    constructor(){
      super();
      this.state= false;
      open = open.bind(this);
      close = close.bind(this);
    }
newset=()=>{
          document.querySelector("div[role=dialog]").style.display='none'
          document.getElementById("Size").value = this.sizeOpt()
          document.getElementById("coastSmoothness").value = this.coastSmOpt()

          //reloading for the new map afer setting 
          let loading = document.getElementById('i-loading')
          loading.setAttribute('class', 'i-loading')
          loading.style.display = 'block'
          setTimeout(() => {
            this.props.setParentState()
          }, 1000)
        }
//get variable from the main function
sizeOpt=()=>{
   //reciver vairbale number from the user 
   //return a%* max size; 
   return 4;//temp value
}
coastSmOpt=()=>{
    //range 0-8
    //return 
    return 8;
}
render(){
  const [show, setShow] = Set(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

return (
    <>
      <Button title="setting" onClick={handleShow}>
        Setting</Button>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Setting for the map</Modal.Title>
        </Modal.Header>
        <Modal.Body>Change size</Modal.Body>
        <Modal.Body>Change coastSmoothness </Modal.Body>
        <Modal.Body>Island Number </Modal.Body>
        <Modal.Body>Beach Hight </Modal.Body>
        <Modal.Body>CoastUniformity </Modal.Body>
        <Modal.Body>River number </Modal.Body>
        <Modal.Body>Mountain Range </Modal.Body>
        <Modal.Body>Mountain Width</Modal.Body>
        <Modal.Body>MountainSmoothness </Modal.Body>
  
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
}
*/
  export default Setting;
