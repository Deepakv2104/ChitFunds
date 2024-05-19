import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Authentication/authContext';
import { db } from '../../Authentication/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/dashboardHome.css';
import oneLakh from '../../assets/oneLakh.svg';
import twoLakh from '../../assets/twoLakh.svg';
import fiveLakh from '../../assets/fiveLakh.svg';
import tenLakh from '../../assets/tenLakh.svg';

const DashboardHome = () => {
  const { currentUser } = useAuth();
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

  const handleImageClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboardHome w-full sm:flex p-2 items-end">
      <h2 >Chit Amounts</h2>
<hr style={{ width: '100%', border: '1px solid black' }}/>
      <div className="sm:flex-grow flex justify-between">
        <div>
  
          <div className="image-grid">
            <img
              src={oneLakh}
              alt="Image 1"
              className="grid-item"
              onClick={() => handleImageClick('1lakh')}
            />
            <img
              src={twoLakh}
              alt="Image 2"
              className="grid-item"
              onClick={() => handleImageClick('2lakh')}
            />
            <img
              src={fiveLakh}
              alt="Image 3"
              className="grid-item"
              onClick={() => handleImageClick('5lakh')}
            />
            <img
              src={tenLakh}
              alt="Image 4"
              className="grid-item"
              onClick={() => handleImageClick('10lakh')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
