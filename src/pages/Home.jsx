import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import LottieAnimation from '../components/LottieAnimation/LottieAnimation';
import animationData from '../assets/finance.json';
import Layout from '../components/Layout/Layout';
import './Styles/Home.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Replace '/signup' with '/login' to navigate to the login page
  };

  return (
    <Layout>
      <div className="homepage">
        <div className="container">
          <div className="left-section">
            <br />
            <h2>Welcome to ChitFunds!</h2>
            <br />
            <h1>Empowering Financial Growth: Your Partner in Chit Funds</h1>
            <p>XYZ Chit Funds: Your pathway to financial growth and stability. Join us to unlock opportunities and realize your dreams with trusted chit fund solutions.</p>
            <br />
            <div className="button-row">
              <Button variant="success" onClick={() => navigate('/signup')}>Sign Up</Button>
              <Button variant="primary" onClick={handleLogin}>Login</Button>
            </div>
          </div>
          <div className="right-section">
            <LottieAnimation animationData={animationData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
