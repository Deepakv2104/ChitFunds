import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Layout from '../components/Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/LoginPage.css'; // Import your custom CSS for styling the signup form
import img from '../assets/financeLogin.jpg';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase, db } from '.././Authentication/firebase';
import { collection, doc,setDoc } from 'firebase/firestore';

const AuthPage = () => {
  const auth = getAuth(firebase);
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [userData, setUserData] = useState({ name: '', email: '', password: '' });

  const toggleAuthPage = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, password } = e.target.elements;
  
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const {user} = userCredentials;

      const userDocRef = doc(db, "users", user.uid);  
      await setDoc(userDocRef,{
        userId: user.uid,
        name: name,
        email:email
      })    
      console.log('User signed up successfully!');
      // You can redirect the user to another page or do other actions upon successful sign-up
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle error here, display error message to the user, etc.
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;

    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      console.log('User logged in successfully!');
      navigate('/dashboard/dashboardHome')
      // You can redirect the user to another page or do other actions upon successful login
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error here, display error message to the user, etc.
    }
  };

  return (
    <Layout>
      <div className='signup-page'>
        <div className='image-container'>
          <img src={img} alt="Login" />
        </div>
        <div className="signup-container">
          {isSignUp ? (
            <Form className="signup-form" onSubmit={handleSignUp}>
              <h2>Sign Up</h2>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" placeholder="Enter your name" />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter your email" />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Password" />
              </Form.Group>

              <Button variant="primary" type="submit">
                Sign Up
              </Button>
              <p>
                <span>Already have an account? </span>
                <span onClick={toggleAuthPage} className="signup">Sign In</span>
              </p>
            </Form>
          ) : (
            <Form className="signup-form" onSubmit={handleLogin}>
              <h2>Login In</h2>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter your email" />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Password" />
              </Form.Group>

              <Button variant="primary" type="submit">
                Login In
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
