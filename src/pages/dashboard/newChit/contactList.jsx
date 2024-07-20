import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './ContactList.css';

const ContactList = ({ selectedContacts, handleRemoveContact, availableContacts, handleAddContact, isAvailableList = false }) => {
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [temporarySelectedContacts, setTemporarySelectedContacts] = useState([]);

  const handleContactClick = (contact) => {
    setSelectedContactId(contact.id);
  };

  const handleAddContactWrapper = (contact) => {
    handleAddContact(contact);
    setTemporarySelectedContacts([...temporarySelectedContacts, contact.id]);
    setSelectedContactId(null);
  };

  const handleRemoveContactWrapper = (contact) => {
    handleRemoveContact(contact.id);
    setTemporarySelectedContacts(temporarySelectedContacts.filter(id => id !== contact.id));
    setSelectedContactId(null);
  };

  const handleTemporaryRemove = (contact) => {
    setTemporarySelectedContacts(temporarySelectedContacts.filter(id => id !== contact.id));
    handleRemoveContact(contact.id);
    setSelectedContactId(null);
  };

  if (isAvailableList) {
    return (
      <div className="available-contacts">
        {availableContacts.map(contact => (
          <div
            key={contact.id}
            className={`contact-row ${temporarySelectedContacts.includes(contact.id) ? 'selected' : ''}`}
            onClick={() => handleContactClick(contact)}
          >
            <Avatar alt={contact.name} src={contact.image} />
            <div className="contact-info">
              <span className="contact-name">{contact.name}</span>
              <span className="contact-phone">{contact.phone}</span>
            </div>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                if (temporarySelectedContacts.includes(contact.id)) {
                  handleTemporaryRemove(contact);
                } else {
                  handleAddContactWrapper(contact);
                }
              }}
              color="primary"
            >
              {temporarySelectedContacts.includes(contact.id) ? <DeleteIcon /> : <AddIcon />}
            </IconButton>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="selected-contacts">
      {selectedContacts.map(contact => (
        <div key={contact.id} className="chip">
          <Avatar alt={contact.name} src={contact.image} />
          <div className="contact-info">
            <span className="chip-name">{contact.name}</span>
            <span className="contact-phone">{contact.phone}</span>
          </div>
          <IconButton
            onClick={() => handleRemoveContactWrapper(contact)}
            color="secondary"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
