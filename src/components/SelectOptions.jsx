import React from 'react';
import { Link } from 'react-router-dom';
import './SelectOptions.css'; // Import CSS file for styles

const SelectOptions = () => {
    return (
        <div className="options-container">
            <h2>Select your options</h2>
            <ul className="options-list">
                <li className="option-item"><Link to="/1lakh" className="option-link">1 lakh Chit</Link></li>
                <li className="option-item"><Link to="/2lakh" className="option-link">2 lakh Chit</Link></li>
                <li className="option-item"><Link to="/5lakh" className="option-link">5 lakh Chit</Link></li>
                <li className="option-item"><Link to="/10lakh" className="option-link">10 lakh Chit</Link></li>
            </ul>
        </div>
    );
};

export default SelectOptions;
