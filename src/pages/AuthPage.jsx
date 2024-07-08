import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Layout from '../components/Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/LoginPage.css'; // Import your custom CSS for styling the signup form
import img from '../assets/financeLogin.jpg';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebase, db, auth } from '.././Authentication/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '', password: '' });

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, password } = e.target.elements;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        userId: user.uid,
        name: name.value,
        email: email.value
      });

      navigate('/dashboard/dashboardHome');
      toast.success('Signed up successfully!', { autoClose: 700 });
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Error signing up. Please try again.', { autoClose: 700 });
    }
  };

  return (
    <Layout>
      <div className='signup-page'>
        <div className='image-container'>
          <img src={img} alt="Login" />
        </div>
        <div className="signup-container">
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
              <span onClick={() => navigate('/login')} className="signup">Sign In</span>
            </p>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
