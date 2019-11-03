import React from 'react';
import './App.scss';
import { Modal, Button } from 'react-bootstrap';

function close() {
  this.setState( {showModal: false} );
}

function open() {
  this.setState( {showModal: true} );
}

class Login extends React.Component {
  constructor(){
    super();
    this.state = { showModal: false }
    open = open.bind(this);
    close = close.bind(this);
  }

  render() {
    return (
      <>
        <div className="login-button" span style={{cursor:"pointer"}} onClick={open}><div className="login-buttonText">Register/Log In</div></div>

        <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>Log in to WorldBuilder</Modal.Title>
            </Modal.Header>
          
            <Modal.Body>
                <h4>Text in a modal</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={close}>Close</Button>
            </Modal.Footer>
        </Modal>
      </>
    );
  }
}
/*
class Login extends React.Component {
    constructor(props){
        super(props);
        const isUserAuthorized = false;

        this.state = {isUserAuthorized};
        this.openLogin = this.openLogin.bind(this);
        this.closeLogin = this.closeLogin.bind(this);
    }
  
    componentDidMount(){
        document.addEventListener("click", this.closeLogin);
    }
  
    componentWillUnmount(){
        document.removeEventListener("click", this.closeLogin);
    }

    openLogin() {
        const style = { width: 750, height: 800 };
        this.setState({ style });
        document.body.style.backgroundColor = "#000000";
        document.addEventListener("click", this.closeLogin);
    }

    closeLogin() {
        document.removeEventListener("click", this.closeLogin);
        const style = { width: 750, height: 800 };
        this.setState({ style });
        document.body.style.backgroundColor = "#C9CAD9";
    }

    render() {
        const {isUserAuthorized} = this.state;

        return(
            <div className="login-button" span style={{cursor:"pointer"}} onClick={this.openLogin}><div className="login-buttonText">Register/Log In</div></div> 
        );
    }
}
*/
export default Login;