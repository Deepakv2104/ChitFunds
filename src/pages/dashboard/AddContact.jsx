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
  Box,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone is required'),
  alternatePhone: yup
    .string()
    .matches(/^\d{10}$/, 'Alternate phone number must be exactly 10 digits')
    .required('Alternate Phone is required'),
  aadharCardNo: yup.string().required('Aadhar Card No is required'),
  chequeNo: yup.string().required('Cheque No is required'),
});

const ContactRow = ({ contact, onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={handleClickOpen}>
            <Avatar src={contact.profilePicUrl} alt={contact.name} />
          </IconButton>
        </TableCell>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Contact Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Name:</strong> {contact.name} <br />
            <strong>Phone:</strong> {contact.phone} <br />
            <strong>Alternate Phone:</strong> {contact.alternatePhone} <br />
            <strong>Aadhar Card No:</strong> {contact.aadharCardNo} <br />
            <strong>Cheque No:</strong> {contact.chequeNo} <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ContactTable = ({ contacts, filterText, onDelete, page, rowsPerPage }) => {
  const filteredContacts = contacts.filter(contact => contact.name && contact.name.toLowerCase().includes(filterText.toLowerCase()));
  const displayedContacts = filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const rows = displayedContacts.map(contact => <ContactRow key={contact.key} contact={contact} onDelete={onDelete} />);

  return (
    <TableContainer component={Paper} className="table-container">
      <Table>
        <TableHead className="table-head">
          <TableRow>
            <TableCell>Profile</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Alternate Phone</TableCell>
            <TableCell>Aadhar Card No</TableCell>
            <TableCell>Cheque No</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="table-body">{rows}</TableBody>
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
    className="search-bar"
    sx={{
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
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      alternatePhone: '',
      aadharCardNo: '',
      chequeNo: '',
      profilePicUrl: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const contact = {
        ...values,
        key: new Date().getTime()
      };
      await addContact(contact);
      toast.success('Contact added successfully!');
      resetForm();
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="phone"
            label="Phone"
            variant="outlined"
            fullWidth
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="alternatePhone"
            label="Alternate Phone"
            variant="outlined"
            fullWidth
            value={formik.values.alternatePhone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.alternatePhone && Boolean(formik.errors.alternatePhone)}
            helperText={formik.touched.alternatePhone && formik.errors.alternatePhone}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="aadharCardNo"
            label="Aadhar Card No"
            variant="outlined"
            fullWidth
            value={formik.values.aadharCardNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.aadharCardNo && Boolean(formik.errors.aadharCardNo)}
            helperText={formik.touched.aadharCardNo && formik.errors.aadharCardNo}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            name="chequeNo"
            label="Cheque No"
            variant="outlined"
            fullWidth
            value={formik.values.chequeNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.chequeNo && Boolean(formik.errors.chequeNo)}
            helperText={formik.touched.chequeNo && formik.errors.chequeNo}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <Button type="submit" color="primary" fullWidth variant="contained" sx={{ backgroundColor: '#1976d2' }}>
            <AddIcon /> Add
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

const AddContact = () => {
  const [filterText, setFilterText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

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
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const addContact = async (contact) => {
    try {
      const docRef = await addDoc(collection(db, 'contacts'), contact);
      await updateDoc(docRef, { memberId: docRef.id });
      setContacts([...contacts, { ...contact, memberId: docRef.id, key: docRef.id }]);
    } catch (error) {
      console.error('Error adding contact: ', error);
      toast.error('Error adding contact. Please try again.');
    }
  };

  const deleteContact = async (key) => {
    try {
      await deleteDoc(doc(db, 'contacts', key));
      setContacts(contacts.filter(contact => contact.key !== key));
      toast.success('Contact deleted successfully!');
    } catch (error) {
      console.error('Error deleting contact: ', error);
      toast.error('Error deleting contact. Please try again.');
    }
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
