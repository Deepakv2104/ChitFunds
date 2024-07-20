import React, { useEffect, useState } from "react";
import { useAuth } from '../../Authentication/authContext';
import { FaStar } from 'react-icons/fa';
import { db, auth } from '../../Authentication/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc } from 'firebase/firestore';
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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

  const handleTitleClick = () => {
    if (currentUser) {
      navigate("/dashboard/dashboardHome");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      toast.success('Logged out successfully!', { autoClose: 700 });
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div>
      <nav>
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
            <NavLink to="/dashboard/dashboardHome/NewChitpage/1">New Chit</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/dashboardHome/existingChits">Existing Chit</NavLink>
          </li>
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
