import React from 'react';
import './App.scss';
import './scss/_modal.scss';
import './scss/_buttons.scss';
import closeIcon from './icons/close.svg';
import { Modal, Button, Form } from 'react-bootstrap';

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

        <Modal show={this.state.showModal} onHide={close}>
            <Modal.Header>
                <Modal.Title>Log in to WorldBuilder</Modal.Title>
                <img src={closeIcon} span style={{cursor:"pointer"}} onClick={close} align="right" />
            </Modal.Header>
          
            <Modal.Body>
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit">Submit</Button>
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