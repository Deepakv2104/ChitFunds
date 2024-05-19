import React, { useEffect,useState } from "react";
import { useAuth } from '../../Authentication/authContext';
import { FaStar } from 'react-icons/fa';
import { db } from '../../Authentication/firebase';
import { doc, getDoc } from 'firebase/firestore';
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { FaBell, FaUser } from 'react-icons/fa'; // Import the icons
 const Navbar = () => {
  const { currentUser } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
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

  return (
 
    <div>
         <nav>
      <Link to="/" className="title">
        CHITFUNDS
      </Link>
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
      </ul>
     
    </nav>
    <nav  className="text-nav">
    <div className="flex items-center">
    <div className="text-container flex items-center justify-between">
    <div className="flex items-center">
      <div className="user-name">
        Hello {userData ? userData.name : 'Guest'}
      </div>
      <FaStar className="yellow-star ml-2" />
    </div>
    <div className="flex items-center">
      <FaBell className="notification-icon mr-4" /> {/* Notification icon */}
      <FaUser className="profile-avatar rounded-full" /> {/* Profile avatar icon */}
    </div>
  </div>
    </div>
   
    </nav>
    </div>
  );
};

export default Navbar;