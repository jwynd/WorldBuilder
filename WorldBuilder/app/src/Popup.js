"use strict";
import React from 'react';
import Setting from './Setting.js';
import Popup from 'reactjs-popup';
import ReactDOM from 'react-dom';

class ControlledPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal() {
    this.setState({ open: true });
  }
  closeModal() {
    this.setState({ open: false });
  }
  // pop=()=>{
  //    this.setState( {open: true} );
  // }
  setSelfState = () => {
    this.setState({
      open: false
    })
    this.props.setParentState()
  }
  render() {
    return (
      <div classname = 'popup'> 

        <Popup
          open={this.state.open}
          closeOnDocumentClick
          onClose={this.closeModal}
        >
          <div className="modal">
        
            <a className="close" onClick={this.closeModal}>
              &times;
            </a>
  
          </div>
          <Setting setParentState={this.setSelfState}/>
        </Popup>
      </div>
    );
  }
}
const rootElement = document.getElementById("root")
ReactDOM.render(<ControlledPopup />, rootElement);

// render(<ControlledPopup />);
export default ControlledPopup;