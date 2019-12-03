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

function loggedIn() {
  this.setState( {loggedIn: true} );
}

function notLoggedIn() {
  this.setState( {loggedIn: false} );
}

class Login extends React.Component {
  constructor () {
    super();
    this.state = {
      showLoginModal: false,
      showRegisterModal: false,
      loggedIn: '',
      loginEmail: '',
      loginPassword: '',
      registrationEmail: '',
      passwordOne: '',
      passwordTwo: ''
    };
    loginOpen = loginOpen.bind(this);
    loginClose = loginClose.bind(this);
    registerOpen = registerOpen.bind(this);
    registerClose = registerClose.bind(this);
    loggedIn = loggedIn.bind(this);
    notLoggedIn = notLoggedIn.bind(this);

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        loggedIn();
      } else {
        notLoggedIn();
      }
    });
    
  }

  toLogin(event) { // opens login window, closes registration windows
    registerClose();
    loginOpen();
  }

  toRegister(event) { // opens registration window, closes login windows
    loginClose();
    registerOpen();
  }

  createAccount(event) {
    event.preventDefault();
    const { registrationEmail, passwordOne } = this.state; 

    console.log(passwordOne);

    // calls on Firebase to create user using email and password
    firebase
      .auth().createUserWithEmailAndPassword(registrationEmail, passwordOne)
      .then(function() {
        console.log(this.state.loggedIn);
        console.log("Successfully created new user");
      })
      .catch(error => {
        console.log("Error creating user:", error);
      });
    registerClose();
  }

  logIn(event) {
    event.preventDefault();
    const { loginEmail, loginPassword, loggedIn } = this.state; 

    // calls on Firebase to verify user using email and password
    firebase
      .auth().signInWithEmailAndPassword(loginEmail, loginPassword)
      .then(function() {
        loginClose();
        console.log("Successfully logged in");
        console.log("logged in :" + loggedIn);
        console.log("current user: " + firebase.auth().currentUser);
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
      })
      .catch(error => {
        console.log("Error signing out:", error);
      });
  }

  render() {
    const { loginEmail, registrationEmail, passwordOne, passwordTwo } = this.state; 

    // does not allow user to register without email and matching passwords
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      registrationEmail === '';

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
                    <Form.Control type="email" placeholder="Email" onChange={(event) => this.setState({loginEmail: event.target.value})}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(event) => this.setState({loginPassword: event.target.value})}/>
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
                  <Form.Control type="email" placeholder="Email" onChange={(event) => this.setState({registrationEmail: event.target.value})}/>
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