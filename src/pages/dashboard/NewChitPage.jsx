import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const monthStringToNumber = (month) => {
  const monthMap = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11
  };
  return monthMap[month];
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedContacts, setClickedContacts] = useState([]);
  const contactsPerPage = 7;

  const navigate = useNavigate();

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
    if (!selectedContacts.includes(contact)) {
      setSelectedContacts([...selectedContacts, contact]);
      setClickedContacts([...clickedContacts, contact.id]);
    }
  };

  const handleRemoveContact = (id) => {
    setSelectedContacts(selectedContacts.filter(c => c.id !== id));
    setClickedContacts(clickedContacts.filter(contactId => contactId !== id));
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

      const groupsRef = collection(db, 'groups');
      const newGroupRef = doc(groupsRef);
      const groupId = newGroupRef.id;

      const monthsArray = generateMonths(20);
      const startMonthIndex = monthsArray.indexOf(startMonth);
      const endMonthIndex = monthsArray.indexOf(endMonth);
      const selectedMonths = monthsArray.slice(startMonthIndex, endMonthIndex + 1);

      const groupData = {
        groupId,
        groupName,
        selectedValue,
        memberIds: selectedContacts.map(contact => contact.id),
        startMonth,
        endMonth,
        numberOfMembers: selectedContacts.length,
        monthsArray: selectedMonths
      };

      batch.set(newGroupRef, groupData);

      const contributionsRef = doc(collection(db, 'contributions'), groupId);
      const monthsData = selectedMonths.reduce((acc, month) => {
        acc[month] = { memberContributions: {} };
        return acc;
      }, {});
      const orderedMonthsData = Object.keys(monthsData).sort((a, b) => {
        const dateA = new Date(parseInt(a.slice(3)), monthStringToNumber(a.slice(0, 3)));
        const dateB = new Date(parseInt(b.slice(3)), monthStringToNumber(b.slice(0, 3)));
        return dateA - dateB;
      }).reduce((obj, key) => {
        obj[key] = monthsData[key];
        return obj;
      }, {});

      batch.set(contributionsRef, {
        months: orderedMonthsData
      });

      await batch.commit();

      toast.success(`${groupName} group created`, {
        onClose: () => {
          navigate(`/dashboard/dashboardHome/existingChits/${groupId}`);
        }
      });

      setGroupName('');
      setSelectedValue('');
      setSelectedContacts([]);
      setSearchTerm('');
      setStartMonth('');
      setEndMonth('');

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

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          <p>Group Value</p>
          <select value={selectedValue} onChange={handleDropdownChange}>
            <option value="">Select Value</option>
            <option value="1">1 lakh</option>
            <option value="2">2 lakhs</option>
            <option value="5">5 lakhs</option>
            <option value="10">10 lakhs</option>
          </select>
          <p>Start Month</p>
          <select value={startMonth} onChange={handleStartMonthChange}>
            <option value="">Select Start Month</option>
            {generateMonths(20).map((month, index) => (
              <option key={index} value={month}>{month}</option>
            ))}
          </select>
          <p>End Month</p>
          <input type="text" value={endMonth} readOnly className="end-month-input" />
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
          <button className="create-button" onClick={handleCreateGroup}>Create</button>
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
          <button className="add-contact-button" onClick={handleOpenDialog}>
            <AddIcon /> New Contact
          </button>
          <div className="available-contacts">
            {currentContacts.map(contact => (
              <div
                key={contact.id}
                className={`contact-card ${clickedContacts.includes(contact.id) ? 'clicked' : ''}`}
                onClick={() => handleAddContact(contact)}
              >
                <Avatar alt={contact.name} src={contact.image} />
                <div className="contact-info">
                  <span className="contact-name">{contact.name}</span>
                  <span className="contact-phone">{contact.phone}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination-container">
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {Math.ceil(filteredContacts.length / contactsPerPage)}
            </span>
            <button
              className="pagination-button"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredContacts.length / contactsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                fullWidth
                value={newContact.name}
                onChange={handleNewContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={newContact.phone}
                onChange={handleNewContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="alternatePhone"
                label="Alternate Phone"
                fullWidth
                value={newContact.alternatePhone}
                onChange={handleNewContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="aadharCardNo"
                label="Aadhar Card No"
                fullWidth
                value={newContact.aadharCardNo}
                onChange={handleNewContactChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="chequeNo"
                label="Cheque No"
                fullWidth
                value={newContact.chequeNo}
                onChange={handleNewContactChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddNewContact}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const generateMonths = (numberOfMonths) => {
  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < numberOfMonths; i++) {
    const monthYear = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase() + ' ' + currentDate.getFullYear();
    months.push(monthYear);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return months;
};

const calculateEndMonth = (startMonth) => {
  const [startMonthName, startYear] = startMonth.split(' ');
  const endMonthDate = new Date(startYear, monthStringToNumber(startMonthName) + 19);
  return endMonthDate.toLocaleString('default', { month: 'short' }).toUpperCase() + ' ' + endMonthDate.getFullYear();
};

export default NewChitPage;
