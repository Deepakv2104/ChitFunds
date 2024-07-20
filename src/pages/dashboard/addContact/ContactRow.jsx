import React, { useState, useEffect } from 'react';
import { db } from '../../../Authentication/firebase'; // Adjust the path according to your project structure
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { TableRow, TableCell, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Tabs, Tab, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ContactRow = ({ contact, onDelete, index }) => {
  const [open, setOpen] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', contact.memberId));
        const querySnapshot = await getDocs(q);
        const groups = querySnapshot.docs.map(doc => ({ groupId: doc.id, groupName: doc.data().groupName, chitAmount: doc.data().selectedValue }));
        setGroupData(groups);

        for (let group of groups) {
          const contributionsDocRef = doc(db, 'contributions', group.groupId);
          const contributionsDoc = await getDoc(contributionsDocRef);
          if (contributionsDoc.exists()) {
            let totalBalance = 0;
            const months = contributionsDoc.data().months;
            for (let month in months) {
              if (months[month].memberContributions[contact.memberId]) {
                totalBalance += months[month].memberContributions[contact.memberId].totalBalance;
              }
            }
            group.totalBalance = totalBalance;
          } else {
            group.totalBalance = 0;
          }
        }
        setGroupData(groups);
      } catch (error) {
        console.error('Error fetching group data: ', error);
      }
    };

    if (contact.memberId) {
      fetchGroupData();
    }
  }, [contact.memberId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <TableRow onClick={handleClickOpen} sx={{ cursor: 'pointer', height: '40px', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
        <TableCell>{contact.name}</TableCell>
        <TableCell>{contact.phone}</TableCell>
        <TableCell>{contact.alternatePhone}</TableCell>
        <TableCell>{contact.aadharCardNo}</TableCell>
        <TableCell>{contact.chequeNo}</TableCell>
        <TableCell>
          <IconButton onClick={(e) => { e.stopPropagation(); onDelete(contact.key); }} color="secondary">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          <Typography variant="h5">Contact Details</Typography>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle1">
              <strong>Name:</strong> {contact.name}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Phone:</strong> {contact.phone}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Alternate Phone:</strong> {contact.alternatePhone}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Aadhar Card No:</strong> {contact.aadharCardNo}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Cheque No:</strong> {contact.chequeNo}
            </Typography>
          </Box>
          {groupData.length > 0 && (
            <>
              <Tabs
                value={selectedTab}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="scrollable groups tabs"
              >
                {groupData.map((group, index) => (
                  <Tab key={group.groupId} label={group.groupName} />
                ))}
              </Tabs>
              {groupData.map((group, index) => (
                <TabPanel key={group.groupId} value={selectedTab} index={index}>
                  <Typography variant="subtitle1">
                    <strong>Group ID:</strong> {group.groupId}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Group Name:</strong> {group.groupName}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Chit Amount:</strong> {group.chitAmount}Lakh
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Total Balance:</strong> {group.totalBalance}
                  </Typography>
                </TabPanel>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default ContactRow;
