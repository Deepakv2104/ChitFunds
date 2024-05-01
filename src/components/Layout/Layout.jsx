import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import DashboardFooter from "./DashboardFooter.jsx"; // Import the DashboardFooter component

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
      <Navbar />
      {children}
      {/* Render the appropriate footer component based on screen width */}
      {isMobile ? <DashboardFooter /> : <Footer />}
    </div>
  );
};

export default Layout;
