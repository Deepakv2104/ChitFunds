import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Layout/Footer.jsx'
import Navbar from '../components/Layout/Navbar.jsx';
import LottieAnimation from '../components/LottieAnimation/LottieAnimation.jsx'; // Assuming you have a component for Lottie animation
import animationData from '../assets/finance.json'
import './Styles/Home.css'
import Layout from "../components/Layout/Layout.jsx";

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/signup');
  }

  return (
    <Layout>
      <div className="homepage">
        <div className="container">
          <div className="left-section">
            <br></br>
            <h2>Weclome to ChitFunds !</h2>
            <br></br>
            <h1>Empowering Financial Growth: Your Partner in Chit Funds</h1>
            <p>XYZ Chit Funds: Your pathway to financial growth and stability. Join us to unlock opportunities and realize your dreams with trusted chit fund solutions.</p>
            <br></br>
            <div className="button-row">
              <Button variant="success" onClick={handleClick}>Sign Up</Button>
              <Button variant="primary" onClick={handleClick}> Login</Button>
            </div>
          </div>
          <div className="right-section">
            <LottieAnimation animationData={animationData} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
