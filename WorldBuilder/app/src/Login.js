import React from 'react';
import './App.scss';
import './scss/_modal.scss';
import './scss/_buttons.scss';
import closeIcon from './icons/close.svg';
import { Modal, Button, Form } from 'react-bootstrap';
import firebase from './Firebase.js';

// these functions change the booleans of showLoginModal and showRegisterModal
function loginClose() {
  this.setState( {showLoginModal: false} );
}

function loginOpen() {
  this.setState( {showLoginModal: true} );
}

function registerClose() {
  this.setState( {showRegisterModal: false} );
}

function registerOpen() {
  this.setState( {showRegisterModal: true} );
}

class Login extends React.Component {
  constructor(){
    super();
    this.state = {
      showLoginModal: false,
      showRegisterModal: false,
      loggedIn: firebase.auth().onAuthStateChanged ? true : false,
      email: '',
      password: '',
      passwordOne: '',
      passwordTwo: ''
    };
    loginOpen = loginOpen.bind(this);
    loginClose = loginClose.bind(this);
    registerOpen = registerOpen.bind(this);
    registerClose = registerClose.bind(this);
  }

  toLogin(event){ // opens login window, closes registration windows
    registerClose();
    loginOpen();
  }

  toRegister(event){ // opens registration window, closes login windows
    loginClose();
    registerOpen();
  }

  createAccount(event) {
    event.preventDefault();
    const { email, passwordOne } = this.state; 

    const password = passwordOne;
    console.log(password);

    // calls on Firebase to create user using email and password
    firebase
      .auth().createUserWithEmailAndPassword(email, password)
      .then(function() {
        console.log(this.state.loggedIn);
        console.log("Successfully created new user");
      }.bind(this))
      .catch(error => {
        console.log("Error creating user:", error);
      });
  }
  
  logIn(event) {
    event.preventDefault();
    const { email, password } = this.state; 

    // calls on Firebase to verify user using email and password
    firebase
      .auth().signInWithEmailAndPassword(email, password)
      .then(function() {
        loginClose();
        console.log("Successfully logged in");
      })
      .catch(error => {
        console.log("Error logging in:", error);
      });
    }

    // signs user out
    signOut(event) {
      firebase
        .auth().signOut()
        .then(function(){
          console.log("Signed out sucessfully");
          console.log(this.state.loggedIn);
        })
        .catch(error => {
          console.log("Error signing out:", error);
        });
    }

  render() {
    const { email, passwordOne, passwordTwo } = this.state; 

    // does not allow user to register without email and matching passwords
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '';

    const loggedIn = this.state.loggedIn;
    let loginOrWelcome;
    let signOut;

    if(loggedIn){ // welcomes user and gives them to option to sign out if logged in
      loginOrWelcome = <div className="welcome-text">Welcome, user!</div>;
      signOut = <div className="sign-out" span style={{cursor:"pointer"}} onClick={(event) => this.signOut(event)}>Sign out</div>;
    } else { //shows login/register and hides sign out button if not logged in
      loginOrWelcome = <div className="login-button" span style={{cursor:"pointer"}} onClick={loginOpen}><div className="login-buttonText">Register/Log In</div></div>;
      signOut = '';
    }
    console.log(loggedIn);
    console.log(this.state.email);
    console.log(this.state.passwordOne);
    console.log(this.state.passwordTwo);

    return (
      <>
        {loginOrWelcome}  
        {signOut}

        <Modal show={this.state.showLoginModal} onHide={loginClose}>
            <Modal.Header>
                <Modal.Title>Log in to WorldBuilder</Modal.Title>
                <img src={closeIcon} span style={{cursor:"pointer"}} onClick={loginClose} align="right" />
            </Modal.Header>
          
            <Modal.Body>
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" onChange={(event) => this.setState({email: event.target.value})}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(event) => this.setState({password: event.target.value})}/>
                  </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" span style={{cursor:"pointer"}} onClick={(event) => this.logIn(event)}>Log In</Button>
                <div className="register-text">New to WorldBuilder? <div className="register-link" span style={{cursor:"pointer"}} onClick={loginClose} onClick={(event) => this.toRegister(event)}>Sign up now</div></div>
            </Modal.Footer>
        </Modal>

        <Modal show={this.state.showRegisterModal} onHide={registerClose}>
          <Modal.Header>
              <Modal.Title>Create a WorldBuilder Account</Modal.Title>
              <img src={closeIcon} span style={{cursor:"pointer"}} onClick={registerClose} align="right" />
          </Modal.Header>
          
        
          <Modal.Body>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Email" onChange={(event) => this.setState({email: event.target.value})}/>
                </Form.Group>

                <Form.Group controlId="formBasicPasswordOne">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={(event) => this.setState({passwordOne: event.target.value})}/>
                </Form.Group>

                <Form.Group controlId="formBasicPasswordTwo">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm Password" onChange={(event) => this.setState({passwordTwo: event.target.value})}/>
                </Form.Group>
              </Form>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="primary" type="submit" span style={{cursor:"pointer"}} disabled={isInvalid} onClick={(event) => this.createAccount(event)}>Create Account</Button>
              <div className="register-text">Already have an account? <div className="register-link" span style={{cursor:"pointer"}} onClick={(event) => this.toLogin(event)}>Log in</div></div>
          </Modal.Footer>
          </Modal>
          
      </>
    );
  }
}

export default Login;