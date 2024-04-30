import React, { useEffect } from "react";
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
  return (
    <Layout>
 <div className="homepage">
      {/* <Navbar /> */}
      <div className="container">
      <div className="left-section">
  <h2>Weclome to ChitFunds !</h2>
  <h1>Empowering Financial Growth: Your Partner in Chit Funds</h1>
  <p>XYZ Chit Funds: Your pathway to financial growth and stability. Join us to unlock opportunities and realize your dreams with trusted chit fund solutions.</p>
  <div className="button-row">
    <Button variant="success">Sign In</Button>
    <Button variant="primary">Login</Button>
  </div>
</div>

        <div className="right-section">
          <LottieAnimation animationData={animationData} />
        </div>
      </div>
      {/* <Footer/> */}
    </div>
    </Layout>
   
  );
}

export default HomePage;
