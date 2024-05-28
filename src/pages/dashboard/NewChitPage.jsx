import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { Button } from 'react-bootstrap';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../Authentication/firebase'; // Adjust the path as necessary
import './NewChitPage.css';

const NewChitPage = () => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [NumberOfMembers, setNumberOfMembers] = useState('');

  // Fetch contacts from Firestore on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsSnapshot = await getDocs(collection(db, 'contacts'));
        const contactsData = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailableContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const handleAddContact = (contact) => {
    setSelectedContacts([...selectedContacts, contact]);
    setAvailableContacts(availableContacts.filter(c => c.id !== contact.id));
  };

  const handleRemoveContact = (id) => {
    const contactToRemove = selectedContacts.find(c => c.id === id);
    setAvailableContacts([...availableContacts, contactToRemove]);
    setSelectedContacts(selectedContacts.filter(c => c.id !== id));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleStartMonthChange = (event) => {
    const selectedStartMonth = event.target.value;
    setStartMonth(selectedStartMonth);
    setEndMonth(calculateEndMonth(selectedStartMonth));
  };

  const handleCreateGroup = async () => {
    try {
      const newGroupRef = doc(collection(db, 'groups')); // Create a reference to a new document
      const groupId = newGroupRef.id; // Get the generated ID for the new document

      // Calculate the number of selected contacts
      const NumberOfMembers = selectedContacts.length;

      // Push selected group name, selected value, selected contacts, startMonth, endMonth, and NumberOfMembers to Firebase database
      await setDoc(newGroupRef, {
        groupId: groupId,
        groupName,
        selectedValue,
        selectedContacts,
        startMonth,
        endMonth,
        NumberOfMembers // Add NumberOfMembers to the data
      });

      // Reset form fields
      setGroupName('');
      setSelectedValue('');
      setSelectedContacts([]);
      setSearchTerm('');
      setStartMonth('');
      setEndMonth('');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const filteredContacts = availableContacts.filter(contact =>
    contact && contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate months starting from the current month
  const months = generateMonths(20); // Adjust the number of months as needed

  return (
    <div className="new-chit-page">
      <h2>Create a New Group</h2>
      <div className="flex-container">
        <div className="left-container">
          <p>Group name</p>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={handleGroupNameChange}
            className="group-name-input"
          />
          <p>Group Value</p>

          <select value={selectedValue} onChange={handleDropdownChange}>
            <option value="">Select Value</option>
            <option value="1">1 lakh</option>
            <option value="2">2 lakhs</option>
            <option value="5">5 lakhs</option>
            <option value="10">10 lakhs</option>
          </select>
          <br />
          <p>Start Month</p>
          <select value={startMonth} onChange={handleStartMonthChange}>
            <option value="">Select Start Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
          <br />
          <p>End Month</p>
          <input type="text" value={endMonth} readOnly className="end-month-input" />
          <br />
          <p>Selected Contacts</p>
          <div className="selected-contacts">
            {selectedContacts.map(contact => (
              <div key={contact.id} className="chip">
                <Avatar alt={contact.name} src={contact.image} />
                <span className="chip-name">{contact.name}</span>
                <button onClick={() => handleRemoveContact(contact.id)}>x</button>
              </div>
            ))}
          </div>
          <Button variant="success" className="create-button" onClick={handleCreateGroup}>
            Create
          </Button>
        </div>

        <div className="right-container">
          <p>Search contact</p>
          <input
            type="text"
            placeholder="Search Contacts"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="available-contacts">
            {filteredContacts.map(contact => (
              <div key={contact.id} className="contact-row" onClick={() => handleAddContact(contact)}>
                <Avatar alt={contact.name} src={contact.image} />
                <span className="contact-name">{contact.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChitPage;

// dateUtils.js
 const generateMonths = (numMonths) => {
  const months = [];
  const date = new Date();

  for (let i = 0; i < numMonths; i++) {
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    months.push(`${month}${year}`);
    date.setMonth(date.getMonth() + 1);
  }

  return months;
};

 const calculateEndMonth = (startMonth) => {
  const months = generateMonths(40); // Generate enough months to ensure the end month is within the range
  const startIndex = months.indexOf(startMonth);
  if (startIndex === -1) return '';

  const endIndex = startIndex + 20;
  return months[endIndex] || '';
};
