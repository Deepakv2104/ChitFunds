import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import './NewChitPage.css';
import { Button } from 'react-bootstrap';

const ContactRow = ({ contact }) => (
  <tr>
    <td>{contact.name}</td>
    <td>{contact.phone}</td>
    <td>{contact.alternatePhone}</td>
    <td>{contact.email}</td>
  </tr>
);

const ContactTable = ({ contacts, filterText }) => {
  const rows = contacts
    .filter(contact => contact.name.toLowerCase().includes(filterText.toLowerCase()))
    .map(contact => <ContactRow key={contact.key} contact={contact} />);
  
  return (
    <table className='table table-hover'>
      <thead>
        <tr>
          <th><i className="fa fa-fw fa-user"></i>Name</th>
          <th><i className="fa fa-fw fa-phone"></i>Phone</th>
          <th><i className="fa fa-fw fa-phone"></i>Alternate Phone</th>
          <th><i className="fa fa-fw fa-envelope"></i>Email</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

const SearchBar = ({ filterText, onFilterTextInput }) => (
  <form>
    <input
      className="form-control"
      type="text"
      placeholder="Search..."
      value={filterText}
      onChange={e => onFilterTextInput(e.target.value)}
    />
  </form>
);

const NewContactRow = ({ addContact }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const { name, phone, alternatePhone, email } = event.target.elements;
    const contact = {
      name: name.value,
      phone: phone.value,
      alternatePhone: alternatePhone.value,
      email: email.value,
      key: new Date().getTime()
    };
    addContact(contact);
  };

  return (
    <form className="form-inline" onSubmit={handleSubmit}>
      <div className="form-group row">
        <div className="col-md-2">
          <input type="text" name="name" className="form-control" placeholder="Name" />
        </div>
        <div className="col-md-2">
          <input type="text" name="phone" className="form-control" placeholder="Phone" />
        </div>
        <div className="col-md-2">
          <input type="text" name="alternatePhone" className="form-control" placeholder="Alternate Phone" />
        </div>
        <div className="col-md-2">
          <input type="email" name="email" className="form-control" placeholder="Email" />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary"><i className="fa fa-fw fa-plus"></i>Add</button>
        </div>
      </div>
    </form>
  );
};

const FilterableContactTable = () => {
  const [filterText, setFilterText] = useState('');
  const [contacts, setContacts] = useState([
    { key: 1, name: 'Tom Jackson', phone: '555-444-333', alternatePhone: '555-555-555', email: 'tom@gmail.com' },
    { key: 2, name: 'Mike James', phone: '555-777-888', alternatePhone: '555-888-999', email: 'mikejames@gmail.com' },
    { key: 3, name: 'Janet Larson', phone: '555-222-111', alternatePhone: '555-111-222', email: 'janetlarson@gmail.com' },
    { key: 4, name: 'Clark Thompson', phone: '555-444-333', alternatePhone: '555-333-444', email: 'clark123@gmail.com' },
    { key: 5, name: 'Emma Page', phone: '555-444-333', alternatePhone: '555-444-666', email: 'emma1page@gmail.com' },
  ]);

  const addContact = (contact) => {
    setContacts([...contacts, contact]);
  };

  return (
    <div>
      <br></br>
      <br></br>
      <br></br>
      <h1><center>Client  - 1 Lakh</center></h1>
      <SearchBar filterText={filterText} onFilterTextInput={setFilterText} />
      <NewContactRow addContact={addContact} />
      <ContactTable contacts={contacts} filterText={filterText} />
    </div>
  );
};

export default FilterableContactTable;