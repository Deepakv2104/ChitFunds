import React from 'react';
import { MdHome, MdPeople, MdSettings } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authentication/authContext'; // Import useAuth hook
import './DashboardFooter.css';

const DashboardFooter = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get the currentUser from useAuth

  return (
    <footer className="dashboard-footer">
      <button className="tab-button" onClick={() => navigate(currentUser ? 'dashboardHome' : '/')}>
        <MdHome className="icon" size={24} />
        <span className="text">Home</span>
      </button>
      <button className="tab-button" onClick={() => navigate(currentUser ? 'dashboardHome/AddContact' : '/signup')}>
        <MdPeople className="icon" size={24} />
        <span className="text">Contact</span>
      </button>
      <button className="tab-button" onClick={() => navigate(currentUser ? 'dashboardHome/settings' : '/signup')}>
        <MdSettings className="icon" size={24} />
        <span className="text">Profile</span>
      </button>
    </footer>
  );
}

export default DashboardFooter;
