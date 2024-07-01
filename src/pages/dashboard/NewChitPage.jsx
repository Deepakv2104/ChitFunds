import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { Button } from 'react-bootstrap';
import { collection, addDoc, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../Authentication/firebase';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './NewChitPage.css';

const NewChitPage = () => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [open, setOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    aadharCardNo: '',
    chequeNo: ''
  });

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

  const handleStartMonthChange = (event) => {
    const selectedStartMonth = event.target.value;
    setStartMonth(selectedStartMonth);
    setEndMonth(calculateEndMonth(selectedStartMonth));
  };

  const handleCreateGroup = async () => {
    try {
      const batch = writeBatch(db);
  
      // Create the group document
      const groupsRef = collection(db, 'groups');
      const newGroupRef = doc(groupsRef);
      const groupId = newGroupRef.id;
  
      // Get the months array from startMonth to endMonth
      const monthsArray = generateMonths(40);
      const startMonthIndex = monthsArray.indexOf(startMonth);
      const endMonthIndex = monthsArray.indexOf(endMonth);
      const selectedMonths = monthsArray.slice(startMonthIndex, endMonthIndex + 1);
  
      // Prepare months object with months in order
      const monthsData = {};
      selectedMonths.forEach(month => {
        monthsData[month] = {
          winner: null,
          memberContributions: {}
        };
      });
  
      // Store the months array in the group document
      const monthsArrayData = selectedMonths.map(month => ({ name: month }));
      const groupData = {
        groupId,
        groupName,
        selectedValue,
        memberIds: selectedContacts.map(contact => contact.id),
        startMonth,
        endMonth,
        numberOfMembers: selectedContacts.length,
        monthsArray: monthsArrayData // Store the array of months
      };
  
      batch.set(newGroupRef, groupData);
  
      // Create the initial contributions document
      const contributionsRef = doc(collection(db, 'contributions'), groupId);
      batch.set(contributionsRef, {
        months: monthsData // Ensure only the selected months are stored
      });
  
      // Commit the batch
      await batch.commit();
  
      toast.success(`${groupName} group created`);
  
      // Reset form state
      setGroupName('');
      setSelectedValue('');
      setSelectedContacts([]);
      setSearchTerm('');
      setStartMonth('');
      setEndMonth('');
  
      // Redirect to ChitFundDetails page passing groupId, startMonth, and endMonth
      // You can use React Router for this purpose
      // Example: history.push(`/chit-details/${groupId}`);
      // For now, let's alert the data
      alert(`Group ${groupName} created with start month: ${startMonth} and end month: ${endMonth}`);
  
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };
  

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNewContact({
      name: '',
      phone: '',
      alternatePhone: '',
      aadharCardNo: '',
      chequeNo: ''
    });
  };

  const handleNewContactChange = (event) => {
    const { name, value } = event.target;
    setNewContact(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddNewContact = async () => {
    try {
      const docRef = await addDoc(collection(db, 'contacts'), newContact);
      await setDoc(doc(db, 'contacts', docRef.id), { ...newContact, memberId: docRef.id });

      setAvailableContacts([...availableContacts, { ...newContact, id: docRef.id }]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding new contact:', error);
    }
  };

  const filteredContacts = availableContacts.filter(contact =>
    contact && contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="new-chit-page">
      <ToastContainer />
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
          <br />
          <p>Start Month</p>
          <select value={startMonth} onChange={handleStartMonthChange}>
            <option value="">Select Start Month</option>
            {generateMonths(20).map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
          <br />
          <p>End Month</p>
          <input type="text" value={endMonth} readOnly className="end-month-input" />
          <br />
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
          <Button variant="primary" className="add-contact-button" onClick={handleOpenDialog}>
            <AddIcon /> New Contact
          </Button>
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
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={newContact.name}
                onChange={handleNewContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone"
                variant="outlined"
                fullWidth
                value={newContact.phone}
                onChange={handleNewContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="alternatePhone"
                label="Alternate Phone"
                variant="outlined"
                fullWidth
                value={newContact.alternatePhone}
                onChange={handleNewContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="aadharCardNo"
                label="Aadhar Card No"
                variant="outlined"
                fullWidth
                value={newContact.aadharCardNo}
                onChange={handleNewContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="chequeNo"
                label="Cheque No"
                variant="outlined"
                fullWidth
                value={newContact.chequeNo}
                onChange={handleNewContactChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddNewContact}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewChitPage;

// dateUtils.js
const generateMonths = (numMonths) => {
  const months = [];
  const date = new Date();

  for (let i = 0; i < numMonths; i++) {
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    months.push(`${month}${year}`);
    date.setMonth(date.getMonth() + 1);
  }

  return months;
};

const calculateEndMonth = (startMonth) => {
  const months = generateMonths(40);
  const startIndex = months.indexOf(startMonth);
  if (startIndex === -1) return '';

  const endIndex = startIndex + 19;
  return months[endIndex] || '';
};
