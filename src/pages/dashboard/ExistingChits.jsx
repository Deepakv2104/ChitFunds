import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles/ExistingChitPage.css';
import { firebase, db } from '../../Authentication/firebase';
import { collection, getDocs } from 'firebase/firestore';

const ExistingChits = () => {
  const [groups, setGroups] = useState([]);
  const [selectedValue, setSelectedValue] = useState('1'); // Set default selectedValue to '1'
  const navigate = useNavigate(); // Initialize useNavigate

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

  const handleOptionClick = (value) => {
    setSelectedValue(value);
  };

  const handleRowClick = (groupId) => {
    // Navigate to another page and pass the groupId as a parameter
    navigate(`${groupId}`);
  };

  const filteredGroups = groups.filter(group => group.selectedValue === selectedValue);

  return (
    <div className='existing-chit-page'>
      <div className='existing-sidebar'>
        <div className="subnav">
          <div className={`option ${selectedValue === '1' ? 'active' : ''}`} onClick={() => handleOptionClick('1')}>
            1L
          </div>
          <div className={`option ${selectedValue === '2' ? 'active' : ''}`} onClick={() => handleOptionClick('2')}>
            2L
          </div>
          <div className={`option ${selectedValue === '5' ? 'active' : ''}`} onClick={() => handleOptionClick('5')}>
            5L
          </div>
          <div className={`option ${selectedValue === '10' ? 'active' : ''}`} onClick={() => handleOptionClick('10')}>
            10L
          </div>
        </div>
      </div>
      <div className='main-content-existing-page'>
        <table>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Number of members</th>
              <th>Chits Picked</th>
              {/* <th>Date of Creation</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map(group => (
              <tr key={group.id} onClick={() => handleRowClick(group.id)}> {/* Call handleRowClick on row click */}
                <td>{group.groupName}</td>
                <td>{group.NumberOfMembers || 0}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExistingChits;
