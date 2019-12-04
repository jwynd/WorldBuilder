import React from 'react';
import './App.scss';
import menu from './icons/menu.svg';
import ControlledPopup from './Popup.js'
import './scss/_modal.scss';
import './scss/_buttons.scss';
import { Modal, ListGroup } from 'react-bootstrap';
import { tsTypeQuery } from '@babel/types';

function close() {
  this.setState( {showModalMenu: false} );
}

function open() {
  this.setState( {showModalMenu: true} );
}

class Menu extends React.Component {
  constructor(){
    super();
    this.state = { showModalMenu: false }
    open = open.bind(this);
    close = close.bind(this);
    this.ControlledPopupElement = React.createRef();
  }
  newmap=()=>{
    document.querySelector("div[role=dialog]").style.display='none'
    document.getElementById('worldseed').value=this.getRamNumber()
    this.setState( {showModalMenu: false} );
    let loading = document.getElementById('i-loading')
    loading.setAttribute('class', 'i-loading')
    loading.style.display = 'block'
    setTimeout(() => {
      this.props.setParentState()
    }, 1000)
  }
  

  setSelfState = () => {
    document.getElementById('worldseed1').value=this.getRamNumber()
    let loading = document.getElementById('i-loading')
    loading.setAttribute('class', 'i-loading')
    loading.style.display = 'block'
    setTimeout(() => {
      this.props.setParentState1()
    }, 1000)
  }
  getRamNumber=()=>{
    var result=''
    for(let i=0;i<16;i++){
      result+=Math.floor(Math.random()*16).toString(16)
    }
    return result.toLowerCase()
  }

  handleSettingClick=()=>{
    this.setState( {showModalMenu: false} );
    this.ControlledPopupElement.current.openModal()
  }

  render() {

    return (
      <>
        <img src={menu} className="App-menu" alt="menu" height="50" onClick={open}/>
        <input type="text" hidden id="worldseed" />
        <input type="text" hidden id="worldseed1" />
        <Modal show={this.state.showModalMenu} onHide={close} id="menu-left" animation={true}>
            <Modal.Body>
              <ListGroup>
                <ListGroup.Item><a onClick={this.newmap}>New Map</a></ListGroup.Item>
                <ListGroup.Item><a>Load</a></ListGroup.Item>
                <ListGroup.Item><a>Save</a></ListGroup.Item>
                {/* <ListGroup.Item><a onClick={ControlledPopup.pop.bind(this)}>Setting</a></ListGroup.Item> */}
                <ListGroup.Item><a onClick={this.handleSettingClick}>Setting</a></ListGroup.Item>
              </ListGroup>
            </Modal.Body>
        </Modal>
        <ControlledPopup setParentState={this.setSelfState} ref={this.ControlledPopupElement} />
        
        
      </>
    );
  }
}
export default Menu;