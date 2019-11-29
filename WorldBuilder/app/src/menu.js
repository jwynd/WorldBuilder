import React from 'react';
import './App.scss';
import './Setting.js';
import menu from './icons/menu.svg';
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
  getRamNumber=()=>{
    var result=''
    for(let i=0;i<16;i++){
      result+=Math.floor(Math.random()*16).toString(16)
    }
    return result.toLowerCase()
  }


  render() {

    return (
      <>
        <img src={menu} className="App-menu" alt="menu" height="50" onClick={open}/>
        <input type="text" hidden id="worldseed" />
        <Modal show={this.state.showModalMenu} onHide={close} id="menu-left" animation={true}>
            <Modal.Body>
              <ListGroup>
                <ListGroup.Item><a onClick={this.newmap.bind(this)}>New Map</a></ListGroup.Item>
                <ListGroup.Item><a>Load</a></ListGroup.Item>
                <ListGroup.Item><a>Save</a></ListGroup.Item>
                <ListGroup.Item><a>onClick={newset.bind(this)}>Setting</a></ListGroup.Item>
             
              </ListGroup>
            </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default Menu;