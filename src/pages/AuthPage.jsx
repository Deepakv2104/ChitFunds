import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Layout from '../components/Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/LoginPage.css'; // Import your custom CSS for styling the signup form
import img from '../assets/financeLogin.jpg';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleAuthPage = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Layout>
      <div className='signup-page'>
        <div className='image-container'>
          <img src={img} alt="Login" />
        </div>
        <div className="signup-container">
          {isSignUp ? (
            <Form className="signup-form">
              <h2>Sign Up</h2>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>

              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" />
              </Form.Group>

              <Button variant="primary" type="submit">
                Sign Up
              </Button>
              <p>
  <span>Already have an account? </span>
  <span onClick={toggleAuthPage} className="signup">Sign In</span>
</p>            </Form>
          ) : (
            <Form className="signup-form">
              <h2>Sign In</h2>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>

              <Button variant="primary" type="submit">
                Sign In
              </Button>
              <p>
  <span>Don't have an account? </span>
  <span onClick={toggleAuthPage} className="signup">Sign Up</span>
</p>
            </Form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
