import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../Authentication/firebase'; // Adjust the path as necessary
import './ChitfundsDetails.css';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton } from '@mui/material';

const ChitFundDetails = ({ chitfundId }) => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [members, setMembers] = useState([]);
  const [loadingMonths, setLoadingMonths] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchContributions = async (groupId) => {
      try {
        const contributionsCollectionRef = collection(db, 'contributions');
        const querySnapshot = await getDocs(query(collection(contributionsCollectionRef, groupId).orderBy('month')));
    
        const contributions = querySnapshot.docs.map(doc => doc.data());
    
        // Now contributions should be in the order of months
        console.log('Contributions:', contributions);
        
        // Further processing of contributions...
      } catch (error) {
        console.error('Error fetching contributions:', error);
      }
    };
    
    const fetchMonths = async () => {
      try {
        const contributionsQuery = query(collection(db, 'contributions'), where('chitFundId', '==', chitfundId));
        const contributionsSnapshot = await getDocs(contributionsQuery);
        const monthsData = [...new Set(contributionsSnapshot.docs.map(doc => doc.data().month))]; // Ensure uniqueness
        setMonths(monthsData);
        console.log(months)
      } catch (error) {
        console.error('Error fetching months:', error);
        setError('Failed to load months.');
      } finally {
        setLoadingMonths(false);
      }
    };

    fetchMonths();
    fetchContributions();
  }, [chitfundId]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (selectedMonth) {
        setLoadingMembers(true);
        try {
          const contributionsQuery = query(collection(db, 'contributions'), where('chitFundId', '==', chitfundId), where('month', '==', selectedMonth));
          const contributionsSnapshot = await getDocs(contributionsQuery);
          if (contributionsSnapshot.empty) {
            // Handle case when no contributions found for selected month
            setMembers([]);
            return;
          }
          const contributionsData = contributionsSnapshot.docs[0].data().contributions;
          setMembers(contributionsData);
        } catch (error) {
          console.error('Error fetching members:', error);
          setError('Failed to load members.');
        } finally {
          setLoadingMembers(false);
        }
      }
    };

    fetchMembers();
  }, [selectedMonth, chitfundId]);

  const handleAmountChange = (index, event) => {
    const updatedMembers = [...members];
    updatedMembers[index].amount = parseFloat(event.target.value);
    setMembers(updatedMembers);
  };

  const handlePaymentModeChange = (index, event) => {
    const updatedMembers = [...members];
    updatedMembers[index].paymentMode = event.target.value;
    setMembers(updatedMembers);
  };

  const handleBalanceChange = (index, event) => {
    const updatedMembers = [...members];
    updatedMembers[index].balance = parseFloat(event.target.value);
    setMembers(updatedMembers);
  };

  const handleSaveChanges = async () => {
    try {
      const contributionsQuery = query(collection(db, 'contributions'), where('chitFundId', '==', chitfundId), where('month', '==', selectedMonth));
      const contributionsSnapshot = await getDocs(contributionsQuery);
      const contributionsDoc = contributionsSnapshot.docs[0];
      await updateDoc(doc(db, 'contributions', contributionsDoc.id), { contributions: members });
      console.log('Changes saved successfully!');
      setEditMode(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save changes.');
    }
  };

  return (
<div className="chitfund-details">
  <h2>Chitfund ID: {chitfundId}</h2>
  {loadingMonths ? (
    <p>Loading months...</p>
  ) : (
    <>
      <div className="subnav">
        {months.sort((a, b) => {
          const [aMonth, aYear] = a.split(' ');
          const [bMonth, bYear] = b.split(' ');
          const monthsMap = {
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
          };
          if (aYear === bYear) {
            return monthsMap[aMonth] - monthsMap[bMonth];
          }
          return parseInt(aYear) - parseInt(bYear);
        }).map((month, index) => (
          <button key={index} onClick={() => setSelectedMonth(month)} className={month === selectedMonth ? 'active' : ''}>
            {month}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </>
  )}
  {selectedMonth && (
    <div className="members-table">
      <div className="month-title">
        <h3>Month: {selectedMonth}</h3>
        <div className="edit-toggle">
          <IconButton onClick={() => setEditMode(!editMode)}>
            {editMode ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </div>
      </div>
      {loadingMembers ? (
        <p>Loading members...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Amount</th>
              <th>Payment Mode</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
                <td>{member.memberId}</td>
                <td>
                  {editMode ? (
                    <input type="number" value={member.amount} onChange={(event) => handleAmountChange(index, event)} />
                  ) : (
                    member.amount
                  )}
                </td>
                <td>
                  {editMode ? (
                    <input type="text" value={member.paymentMode} onChange={(event) => handlePaymentModeChange(index, event)} />
                  ) : (
                    member.paymentMode
                  )}
                </td>
                <td>
                  {editMode ? (
                    <input type="number" value={member.balance} onChange={(event) => handleBalanceChange(index, event)} />
                  ) : (
                    member.balance
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editMode && <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>}
    </div>
  )}
</div>




  );
};

export default ChitFundDetails;
