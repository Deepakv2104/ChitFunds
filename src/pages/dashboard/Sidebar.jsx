import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
      <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>
      <nav>
        <ul>
          <li>
            <a href="#"><FontAwesomeIcon icon={faHome} /> Home</a>
          </li>
          <li>
            <a href="#"><FontAwesomeIcon icon={faEnvelope} /> Contact</a>
          </li>
          <li>
            <a href="#"><FontAwesomeIcon icon={faUser} /> Profile</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
