import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Container,
    IconButton,
    Button,
    Checkbox,
    Grid,
    Typography,
    Divider,
    Box
  } from '@mui/material';
  import { useNavigate, useParams } from 'react-router-dom';
  import './styles/GroupDetails.css' 
  import DeleteIcon from '@mui/icons-material/Delete';
  import AddIcon from '@mui/icons-material/Add';
  import { firebase, db } from '../../Authentication/firebase';
import { collection, getDocs, getDoc , doc} from 'firebase/firestore';

const ContactRow = ({ contact, onDelete }) => {
    const [picked, setPicked] = useState(false);
  
    const handleCheckboxChange = () => {
      setPicked(!picked);
    };
  
    return (
      <TableRow style={{ backgroundColor: picked ? '#c8e6c9' : 'inherit' }}>
        <TableCell>{contact.name}</TableCell>
        <TableCell>{contact.phone}</TableCell>
        <TableCell>{contact.alternatePhone}</TableCell>
        <TableCell>{contact.aadharCardNo}</TableCell>
        <TableCell>{contact.chequeNo}</TableCell>
        <TableCell>
          <Checkbox checked={picked} onChange={handleCheckboxChange} />
        </TableCell>
        <TableCell>
          <IconButton onClick={() => onDelete(contact.key)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };
  
  const ContactTable = ({ contacts, filterText, onDelete }) => {
    const rows = contacts
      .filter(contact => contact.name && contact.name.toLowerCase().includes(filterText.toLowerCase()))
      .map(contact => <ContactRow key={contact.key} contact={contact} onDelete={onDelete} />);
    
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
              <TableCell sx={{ color: 'white' }}>Picked</TableCell>
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
const GroupDetails = () => {
    const { groupId } = useParams(); // Get groupId from URL path
    const [filterText, setFilterText] = useState('');
    const [contacts, setContacts] = useState([]);
    const [groupData, setGroupData] = useState(null);
    useEffect(() => {
        const fetchGroupData = async () => {
          try {
            const groupDoc = await getDoc(doc(db, 'groups', groupId)); // Fetch group data using groupId
            if (groupDoc.exists()) {
              const groupData = groupDoc.data();
              setGroupData(groupData);
              const selectedContacts = groupData.selectedContacts || [];
              setContacts(selectedContacts);
            } else {
              console.error('Group not found.');
            }
          } catch (error) {
            console.error('Error fetching group data: ', error);
          }
        };
    
        fetchGroupData();
      }, [groupId]);
    
      const deleteContact = async (key) => {
        try {
          // Delete contact from the selectedContacts array in the group document
          const updatedSelectedContacts = contacts.filter(contact => contact.key !== key);
          await db.collection('groups').doc(groupId).update({ selectedContacts: updatedSelectedContacts });
          setContacts(updatedSelectedContacts);
        } catch (error) {
          console.error('Error deleting contact: ', error);
        }
      };
    
    
  return (
  <Container className="group-details" maxWidth={false} disableGutters>
  {groupData ? (
    <div className="group-info">
      <h2>Group Name: {groupData.groupName}</h2>
      <p>Current Month: {groupData.currentMonth || 'NA'}</p>
      <p>End Month: {groupData.endMonth || 'NA'}</p>
      <p>Number of Members: {groupData.numberOfMembers || 'NA'}</p>
      <p>Number of Chits Picked: {groupData.numberOfChitsPicked || 'NA'}</p>
    </div>
  ) : (
    <div className="group-info">
      <h2>Group Details</h2>
      <p>Group Name: NA</p>
      <p>Current Month: NA</p>
      <p>End Month: NA</p>
      <p>Number of Members: NA</p>
      <p>Number of Chits Picked: NA</p>
    </div>
  )}
  <SearchBar filterText={filterText} onFilterTextInput={setFilterText} />
  <ContactTable contacts={contacts} filterText={filterText} onDelete={deleteContact} />
</Container>

  )
}

export default GroupDetails