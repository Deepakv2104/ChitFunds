import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ExistingChitPage.css';
import { db } from '../../Authentication/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const ExistingChits = () => {
  const [groups, setGroups] = useState([]);
  const [selectedValue, setSelectedValue] = useState('1'); 
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'groups'));
        const groupData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(groupData);
        console.log(groupData)
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
    navigate(`${groupId}`);
  };

  const handleDeleteClick = (group) => {
    setGroupToDelete(group);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (groupToDelete) {
      try {
        await deleteDoc(doc(db, 'groups', groupToDelete.id));
        setGroups(groups.filter(group => group.id !== groupToDelete.id));
        setShowDeleteDialog(false);
        setGroupToDelete(null);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setGroupToDelete(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGroups = groups
    .filter(group => group.selectedValue === selectedValue)
    .filter(group => group.groupName.toLowerCase().includes(searchTerm.toLowerCase()));

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
          <div className="option back" onClick={() => navigate('/dashboard/dashboardHome')}>Back</div>
        </div>
      </div>
      <div className='main-content-existing-page'>
        <div className='search-container'>
          <input
            type="text"
            placeholder="Search by Group Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className='search-input'
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Number of members</th>
              <th>Chits Picked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map(group => (
              <tr key={group.id}>
                <td onClick={() => handleRowClick(group.id)}>{group.groupName}</td>
                <td onClick={() => handleRowClick(group.id)}>{group.NumberOfMembers || 0}</td>
                <td onClick={() => handleRowClick(group.id)}></td>
                <td>
                  <button onClick={() => handleDeleteClick(group)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteDialog && (
        <div className="delete-dialog">
          <div className="delete-dialog-content">
            <p>Are you sure you want to permanently delete this chit?</p>
            <button onClick={handleConfirmDelete}>Yes</button>
            <button onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExistingChits;
