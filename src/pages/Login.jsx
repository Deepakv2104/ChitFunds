import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Layout from '../components/Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/LoginPage.css'; // Import your custom CSS for styling the signup form
import img from '../assets/financeLogin.jpg';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebase, db, auth } from '.././Authentication/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Login = () => {
    const navigate = useNavigate();
    const toggleAuthPage = () => {
        navigate('/signup')
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;

        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
            navigate('/dashboard/dashboardHome');
            toast.success('Logged in successfully!', { autoClose: 700 }); // Display success toast
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Invalid email or password. Please try again.', { autoClose: 700 }); // Display error toast
        }
    };

    return (

        <Layout>
            <div className='signup-page'>
                <div className='image-container'>
                    <img src={img} alt="Login" />
                </div>
                <div className="signup-container">
                <Form className="signup-form" onSubmit={handleLogin}>
                    <h2>Log In</h2>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter your email" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Log In
                    </Button>
                    <p>
                        <span>Don't have an account? </span>
                        <span onClick={toggleAuthPage} className="signup">Sign Up</span>
                    </p>
                </Form>
                </div>
            </div>
       
    </Layout >
    
  )
}

export default Login