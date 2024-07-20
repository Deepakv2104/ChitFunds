import React, { useState, useEffect } from 'react';
import { db } from '../../../Authentication/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Container, Typography, Box, Button, TablePagination, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContactTable from './ContactTable';
import SearchBar from './SearchBar';
import NewContactRow from './NewContactRow';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/dashboardHome.css';

const AddContact = () => {
  const [contacts, setContacts] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contacts'));
        const contactsData = querySnapshot.docs.map(doc => ({ ...doc.data(), memberId: doc.id, key: doc.id }));
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts: ', error);
      }
    };

    fetchContacts();
  }, []); // Empty dependency array to only run on mount

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const addContact = async (contact) => {
    try {
      const docRef = await addDoc(collection(db, 'contacts'), contact);
      await updateDoc(docRef, { memberId: docRef.id });
      setContacts(prevContacts => [...prevContacts, { ...contact, memberId: docRef.id, key: docRef.id }]);
      setDialogOpen(false); // Close dialog after adding
    } catch (error) {
      console.error('Error adding contact: ', error);
      toast.error('Error adding contact. Please try again.');
    }
  };

  const deleteContact = async (key) => {
    try {
      await deleteDoc(doc(db, 'contacts', key));
      setContacts(prevContacts => prevContacts.filter(contact => contact.key !== key));
      toast.success('Contact deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact: ', error);
      toast.error('Error deleting contact. Please try again.');
    }
  };

  return (
    <Container className="dashboardHome addContact" maxWidth={false} disableGutters>
      <p className="title">Add Contacts</p>
      <SearchBar filterText={filterText} onFilterTextInput={setFilterText} />
      <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ mb: 2, backgroundColor: '#1976d2' }}
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon sx={{ fontSize: 18 }} /> Add Contact
        </Button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
          <DialogTitle>Add Contact</DialogTitle>
          <DialogContent>
            <NewContactRow addContact={addContact} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <NewContactRow addContact={addContact} />
      </Box>
      <Box className="pagination-container">
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
        <ContactTable contacts={contacts} filterText={filterText} onDelete={deleteContact} page={page} rowsPerPage={rowsPerPage} />
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Box>
    </Container>
  );
};

export default AddContact;
