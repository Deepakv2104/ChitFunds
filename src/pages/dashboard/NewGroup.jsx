import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import './NewChitPage.css';
import { Button } from 'react-bootstrap';
const contacts = [
  { id: 1, name: 'John Doe', image: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Jane Smith', image: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Alice Johnson', image: 'https://via.placeholder.com/40' },
  { id: 4, name: 'Bob Brown', image: 'https://via.placeholder.com/40' },
  { id: 5, name: 'Michael Clark', image: 'https://via.placeholder.com/40' },
  { id: 6, name: 'Emily Davis', image: 'https://via.placeholder.com/40' }
];
const Chip = ({ contact, onRemove }) => (
  <div className="chip">
    <Avatar alt={contact.name} src={contact.image} />
    <span className="chip-name">{contact.name}</span>
    <button onClick={() => onRemove(contact.id)}>x</button>
  </div>
);
const NewChitPage = () => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [availableContacts, setAvailableContacts] = useState(contacts);
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
  const handleCreateGroup = () => {
    // Here you can define the logic to create the group using the groupName and selectedContacts.
    // For demonstration, let's just log the groupName and selectedContacts to console.
    console.log("Group Name:", groupName);
    console.log("Selected Contacts:", selectedContacts);
  };
  const filteredContacts = availableContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  <p>Selected Contacts</p>
  <div className="selected-contacts">
    {selectedContacts.map(contact => (
      <Chip key={contact.id} contact={contact} onRemove={handleRemoveContact} />
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