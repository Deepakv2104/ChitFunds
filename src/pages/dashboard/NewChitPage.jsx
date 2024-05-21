import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { Button } from 'react-bootstrap';
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../Authentication/firebase'; // Adjust the path as necessary
import './NewChitPage.css'
const NewChitPage = () => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');

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

  const handleCreateGroup = async () => {
    try {
      const newGroupRef = doc(collection(db, 'groups')); // Create a reference to a new document
      const groupId = newGroupRef.id; // Get the generated ID for the new document

      // Push selected group name, selected value, and selected contacts to Firebase database
      await setDoc(newGroupRef, { 
        groupId: groupId,
        groupName, 
        selectedValue, 
        selectedContacts 
      });

      // Reset form fields
      setGroupName('');
      setSelectedValue('');
      setSelectedContacts([]);
      setSearchTerm('');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const filteredContacts = availableContacts.filter(contact =>
    contact && contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
