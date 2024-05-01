import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Authentication/authContext';
import { db } from '../../Authentication/firebase'; // Assuming you have imported your firestore instance as db
import { doc, getDoc } from 'firebase/firestore';
import { FaStar } from 'react-icons/fa'; // Import the yellow star icon from react-icons/fa
import './styles/dashboardHome.css'; // Import your CSS file for styling

const DashboardHome = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid); // Assuming 'users' is your collection name
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
    <div className=" dashboardHome w-full sm:flex p-2 items-end ">
      <div className="sm:flex-grow flex justify-between">
        <div className="">
          <div className="flex items-center">
            <div className="text-container"> {/* Updated container */}
              <div className="user-name"> {/* Updated text class */}
                Hello {userData ? userData.name : 'Guest'}
              </div>
              <div className="flex items-center ml-2">
                <FaStar className="yellow-star" /> {/* Yellow star icon */}
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}

export default DashboardHome;
