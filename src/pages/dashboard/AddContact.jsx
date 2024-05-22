import React, { useState, useEffect } from 'react';
import './AddContact.css';
import { db } from '../../Authentication/firebase'; // Adjust the path as necessary
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  Card,
  CardContent,
  Divider,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Container,
  IconButton,
  Button,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ContactRow = ({ contact, onDelete }) => (
  <TableRow>
    <TableCell>{contact.name}</TableCell>
    <TableCell>{contact.phone}</TableCell>
    <TableCell>{contact.alternatePhone}</TableCell>
    <TableCell>{contact.email}</TableCell>
    <TableCell>
      <IconButton onClick={() => onDelete(contact.key)} color="secondary">
        <DeleteIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);

const ContactTable = ({ contacts, filterText, onDelete }) => {
  const rows = contacts
    .filter(contact => contact.name && contact.name.toLowerCase().includes(filterText.toLowerCase()))
    .map(contact => <ContactRow key={contact.key} contact={contact} onDelete={onDelete} />);
  return (
    <TableContainer component={Paper}  sx={{marginTop:'10px'}}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#0f172a' }}>
            <TableCell sx={{ color: 'white' }}>Name</TableCell>
            <TableCell sx={{ color: 'white' }}>Phone</TableCell>
            <TableCell sx={{ color: 'white' }}>Alternate Phone</TableCell>
            <TableCell sx={{ color: 'white' }}>Email</TableCell>
            <TableCell sx={{ color: 'white' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
};
const SearchBar = ({ filterText, onFilterTextInput }) => (
  <TextField
    fullWidth
    variant="outlined"
    placeholder="Search..."
    value={filterText}
    onChange={e => onFilterTextInput(e.target.value)}
    sx={{
      mb: 2,
      '& .MuiInputLabel-root': { color: 'dark' }, // Set label color to dark
      '& .MuiOutlinedInput-root': { // Customize outlined input
        '& fieldset': { borderColor: 'dark' }, // Set border color to dark
        '&:hover fieldset': { borderColor: 'dark' }, // Set border color on hover to dark
        '&.Mui-focused fieldset': { borderColor: 'dark' }, // Set border color when focused to dark
      },
    }}
  />
);

const NewContactRow = ({ addContact }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, phone, alternatePhone, email } = event.target.elements;
    const contact = {
      name: name.value,
      phone: phone.value,
      alternatePhone: alternatePhone.value,
      email: email.value,
      key: new Date().getTime()
    };
    await addContact(contact);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField name="name" label="Name" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField name="phone" label="Phone" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField name="alternatePhone" label="Alternate Phone" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField name="email" label="Email" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={12} md={12} display="flex" justifyContent="center">
          <Button type="submit" color="primary" fullWidth style={{ backgroundColor: 'green', color: 'white' }}>
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const AddContact = () => {
  const [filterText, setFilterText] = useState('');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contacts'));
        const contactsData = querySnapshot.docs.map(doc => ({ ...doc.data(), key: doc.id }));
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts: ', error);
      }
    };

    fetchContacts();
  }, []);

  const addContact = async (contact) => {
    try {
      // Add the contact to the Firestore database
      const docRef = await addDoc(collection(db, 'contacts'), contact);
      // Update the local state with the document ID
      setContacts([...contacts, { ...contact, key: docRef.id }]);
    } catch (error) {
      console.error('Error adding contact: ', error);
    }
  };

  const deleteContact = async (key) => {
    try {
      // Delete the contact from the Firestore database
      await deleteDoc(doc(db, 'contacts', key));
      // Update the local state
      setContacts(contacts.filter(contact => contact.key !== key));
    } catch (error) {
      console.error('Error deleting contact: ', error);
    }
  };

  return (
    <div className='addContact'>
         <p className="title">Add contacts</p>
      <hr className="divider" />
      <Container>
        <SearchBar filterText={filterText} onFilterTextInput={setFilterText} />
        <NewContactRow addContact={addContact} />
        <ContactTable contacts={contacts} filterText={filterText} onDelete={deleteContact} />
      </Container>
    </div>
   
  );
};
export default AddContact;
