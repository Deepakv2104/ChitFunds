import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { Button } from 'react-bootstrap';
import { collection, doc, getDocs, addDoc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../Authentication/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import ContactDialog from './contactDialog';
import ContactList from './contactList';
import { generateMonths, calculateEndMonth, monthStringToNumber } from './dateUtils';
import './NewChitPage.css';

const NewChitPage = () => {
  const { chitAmount } = useParams();
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedValue, setSelectedValue] = useState(chitAmount || 1);
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
    if (!selectedContacts.some(c => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact]);
    } else {
      toast.warn('Contact is already selected.');
    }
  };

  const handleRemoveContact = (id) => {
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

      // Create the group data
      const groupData = {
        groupId,
        groupName,
        selectedValue,
        memberIds: selectedContacts.map(contact => contact.id),
        startMonth,
        endMonth,
        numberOfMembers: selectedContacts.length,
        monthsArray: selectedMonths // Store the array of months as strings
      };

      batch.set(newGroupRef, groupData);

      // Create the initial contributions document
      const contributionsRef = doc(collection(db, 'contributions'), groupId);
      const monthsData = selectedMonths.reduce((acc, month) => {
        acc[month] = { memberContributions: {} };
        return acc;
      }, {});

      // Ensure monthsData is ordered
      const orderedMonthsData = Object.keys(monthsData).sort((a, b) => {
        const dateA = new Date(parseInt(a.slice(3)), monthStringToNumber(a.slice(0, 3)));
        const dateB = new Date(parseInt(b.slice(3)), monthStringToNumber(b.slice(0, 3)));
        return dateA - dateB;
      }).reduce((obj, key) => {
        obj[key] = monthsData[key];
        return obj;
      }, {});

      batch.set(contributionsRef, {
        months: orderedMonthsData // Ensure only the selected months are stored in order
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

  return (
    <div className="new-chit-page">
      <ToastContainer />
      <h2>Create a New Group</h2>
      <div className="flex-container">
        <div className="left-container">
          <div className="form-group">
            <label>Group name</label>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={handleGroupNameChange}
              className="group-name-input"
            />
          </div>
          <div className="form-group">
            <label>Group Value</label>
            <select value={selectedValue} onChange={handleDropdownChange}>
              <option value="">Select Value</option>
              <option value="1">1 lakh</option>
              <option value="2">2 lakhs</option>
              <option value="5">5 lakhs</option>
              <option value="10">10 lakhs</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Month</label>
            <select value={startMonth} onChange={handleStartMonthChange}>
              <option value="">Select Start Month</option>
              {generateMonths(20).map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>End Month</label>
            <input type="text" value={endMonth} readOnly className="end-month-input" />
          </div>
          <ContactList
            selectedContacts={selectedContacts}
            handleRemoveContact={handleRemoveContact}
          />
          <Button variant="success" className="create-button" onClick={handleCreateGroup}>
            Create
          </Button>
        </div>
        <div className="right-container">
          <div className="form-group">
            <label>Search contact</label>
            <input
              type="text"
              placeholder="Search Contacts"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <Button variant="primary" className="add-contact-button" onClick={handleOpenDialog}>
            <AddIcon /> New Contact
          </Button>
          <ContactList
            availableContacts={filteredContacts}
            handleAddContact={handleAddContact}
            isAvailableList={true}
          />
        </div>
      </div>
      <ContactDialog
        open={open}
        handleCloseDialog={handleCloseDialog}
        handleNewContactChange={handleNewContactChange}
        handleAddNewContact={handleAddNewContact}
        newContact={newContact}
      />
    </div>
  );
};

export default NewChitPage;
