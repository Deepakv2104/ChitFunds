import React, { useState, useEffect } from 'react';
import './styles/ExistingChitPage.css';
import { firebase, db } from '../../Authentication/firebase';
import { collection, getDocs } from 'firebase/firestore';

const ExistingChits = () => {
  const [groups, setGroups] = useState([]);
  const [selectedValue, setSelectedValue] = useState('1'); // Set default selectedValue to '1'

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'groups'));
        const groupData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(groupData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleButtonClick = (value) => {
    setSelectedValue(value);
  };

  const filteredGroups = groups.filter(group => group.selectedValue === selectedValue);

  return (
    <div className='existing-chit-page'>
      <div className='existing-sidebar'>
        <button className='option' onClick={() => handleButtonClick('1')}>1 lakh</button>
        <button className='option' onClick={() => handleButtonClick('2')}>2 lakh</button>
        <button className='option' onClick={() => handleButtonClick('5')}>5 lakh</button>
        <button className='option' onClick={() => handleButtonClick('10')}>10 lakh</button>
      </div>
      <div className='main-content-existing-page'>
        <table>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Number of members</th>
              {/* <th>Date of Creation</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map(group => (
              <tr key={group.id}>
                <td>{group.groupName}</td>
                {/* <td>{group.dateOfCreation}</td> */}
                <td>{group.NumberOfMembers || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExistingChits;
