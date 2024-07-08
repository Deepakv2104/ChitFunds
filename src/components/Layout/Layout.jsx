import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import DashboardFooter from "./DashboardFooter.jsx";
import "./Layout.css"; // Import the CSS file

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check and add event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout">
      <div className="navbar">
        {/* <Navbar /> */}
      </div>
      <div className={`content ${isMobile ? 'mobile' : ''}`}>
        {children}
      </div>
      <div className="footer">
        {isMobile ? <DashboardFooter /> : <Footer />}
      </div>
    </div>
  );
};

export default Layout;
