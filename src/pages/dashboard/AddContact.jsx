import React, { useState, useEffect } from 'react';
import { db } from '../../Authentication/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Container,
  Button,
  Grid,
  Typography,
  Divider,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';

const ContactRow = ({ contact, onDelete }) => (
  <TableRow>
    <TableCell>{contact.name}</TableCell>
    <TableCell>{contact.phone}</TableCell>
    <TableCell>{contact.alternatePhone}</TableCell>
    <TableCell>{contact.aadharCardNo}</TableCell>
    <TableCell>{contact.chequeNo}</TableCell>
    <TableCell>
      <IconButton onClick={() => onDelete(contact.key)} color="secondary">
        <DeleteIcon />
      </IconButton>
    </TableCell>
  </TableRow>
);

const ContactTable = ({ contacts, filterText, onDelete }) => {
  const filteredContacts = contacts.filter(contact => contact.name && contact.name.toLowerCase().includes(filterText.toLowerCase()));
  const rows = filteredContacts.map(contact => <ContactRow key={contact.key} contact={contact} onDelete={onDelete} />);
  return (
    <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#0f172a' }}>
            <TableCell sx={{ color: 'white' }}>Name</TableCell>
            <TableCell sx={{ color: 'white' }}>Phone</TableCell>
            <TableCell sx={{ color: 'white' }}>Alternate Phone</TableCell>
            <TableCell sx={{ color: 'white' }}>Aadhar Card No</TableCell>
            <TableCell sx={{ color: 'white' }}>Cheque No</TableCell>
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
      '& .MuiInputLabel-root': { color: '#1976d2' },
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#1976d2' },
        '&:hover fieldset': { borderColor: '#1976d2' },
        '&.Mui-focused fieldset': { borderColor: '#1976d2' },
      },
    }}
  />
);

const NewContactRow = ({ addContact }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, phone, alternatePhone, aadharCardNo, chequeNo } = event.target.elements;
    const contact = {
      name: name.value,
      phone: phone.value,
      alternatePhone: alternatePhone.value,
      aadharCardNo: aadharCardNo.value,
      chequeNo: chequeNo.value,
      key: new Date().getTime()
    };
    await addContact(contact);
    event.target.reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2}>
          <TextField name="name" label="Name" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField name="phone" label="Phone" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField name="alternatePhone" label="Alternate Phone" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField name="aadharCardNo" label="Aadhar Card No" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField name="chequeNo" label="Cheque No" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6} md={2} display="flex" justifyContent="center">
          <Button type="submit" color="primary" fullWidth variant="contained" sx={{ backgroundColor: '#1976d2' }}>
            <AddIcon /> Add
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const AddContact = () => {
  const [filterText, setFilterText] = useState('');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contacts'));
        const contactsData = querySnapshot.docs.map(doc => ({ ...doc.data(), memberId: doc.id, key: doc.id })); // Include memberId as document ID
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts: ', error);
      }
    };

    fetchContacts();
  }, []);

  const addContact = async (contact) => {
    try {
      const docRef = await addDoc(collection(db, 'contacts'), contact);
      await updateDoc(docRef, { memberId: docRef.id }); // Update the document to include memberId
      setContacts([...contacts, { ...contact, memberId: docRef.id, key: docRef.id }]); // Include memberId as document ID
    } catch (error) {
      console.error('Error adding contact: ', error);
    }
  };

  const deleteContact = async (key) => {
    try {
      await deleteDoc(doc(db, 'contacts', key));
      setContacts(contacts.filter(contact => contact.key !== key));
    } catch (error) {
      console.error('Error deleting contact: ', error);
    }
  };

  // Pagination
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Container className="addContact" maxWidth={false} disableGutters>
      <Typography variant="h4" component="h1" className="title" gutterBottom>
        Add Contacts
      </Typography>
      <Divider className="divider" />
      <SearchBar filterText={filterText} onFilterTextInput={setFilterText} />
      <NewContactRow addContact={addContact} />
      <Box className="pagination-container">
        <ContactTable contacts={contacts.slice((page - 1) * itemsPerPage, page * itemsPerPage)} filterText={filterText} onDelete={deleteContact} />
        <Pagination count={Math.ceil(contacts.length / itemsPerPage)} page={page} onChange={handleChangePage} color="primary" />
      </Box>
    </Container>
  );
};

export default AddContact;
