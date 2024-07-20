import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './ContactList.css';

const ContactList = ({ selectedContacts, handleRemoveContact, availableContacts, handleAddContact, isAvailableList = false }) => {
  if (isAvailableList) {
    return (
      <div className="available-contacts">
        {availableContacts.map(contact => (
          <div key={contact.id} className="contact-row">
            <Avatar alt={contact.name} src={contact.image} />
            <div className="contact-info">
              <span className="contact-name">{contact.name}</span>
              <span className="contact-phone">{contact.phone}</span>
            </div>
            <IconButton onClick={() => handleAddContact(contact)} color="primary">
              <AddIcon />
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
          <IconButton onClick={() => handleRemoveContact(contact.id)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
