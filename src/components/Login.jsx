import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Layout from '../components/Layout/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginScreen.css';
import img from '../assets/financeLogin.jpg';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Authentication/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard/dashboardHome');
      toast.success('Logged in successfully!', { autoClose: 700 });
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Invalid email or password. Please try again.', { autoClose: 700 });
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
            <h2>Login In</h2>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Login In
            </Button>
            <p>
              <span>Don't have an account? </span>
              <span onClick={() => navigate('/signup')} className="signup">Sign Up</span>
            </p>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
