import React, { useEffect, useState } from "react";
import { useAuth } from '../../Authentication/authContext';
import { FaStar } from 'react-icons/fa';
import { db,auth } from '../../Authentication/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc } from 'firebase/firestore';
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { FaBell } from 'react-icons/fa'; // Import the icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar = () => {
  const { currentUser, logout } = useAuth(); // Add logout function from useAuth
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      console.log(currentUser)
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          } else {
            console.log('User data not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleTitleClick = () => {
    // Navigate conditionally based on user authentication
    if (currentUser) {
      navigate("/dashboard/dashboardHome");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    console.log('clicked')
    try {
      await signOut(auth);

      navigate("/");
      toast.success('Logged out successfully!', { autoClose: 700 }); // Display success toast

    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div>
      <nav>
        {/* Add onClick event to handle title click */}
        <div onClick={handleTitleClick} className="title">
          CHITFUNDS
        </div>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="/services">Services</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          {/* Conditionally render logout option when user is logged in */}
          {currentUser && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
