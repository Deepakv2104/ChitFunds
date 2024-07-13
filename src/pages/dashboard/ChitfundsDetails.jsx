import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../Authentication/firebase';
import { Check, Close } from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import './ChitfundsDetails.css';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Container, Box, TextField, Button, Tabs, Tab, FormControl, InputLabel, Select, MenuItem,
  Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle
} from '@mui/material';
const ChitFundDetails = () => {
  const { groupId } = useParams();
  const [data, setData] = useState({
    groupData: null,
    contributionsData: null,
    members: {},
    previousWinners: [],
  });
  const [selectedWinner, setSelectedWinner] = useState({ memberId: null, value: false });
  const [selectedMonth, setSelectedMonth] = useState('');
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const monthlyAmount = 5000; // Consider moving this to a config file or fetching from Firestore

  const sortedMonths = useMemo(() => {
    if (!data.groupData?.monthsArray) return [];
    return [...data.groupData.monthsArray].sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
    });
  }, [data.groupData]);

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) {
        setError("No group ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch group data
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
          setError("No such group found");
          setLoading(false);
          return;
        }

        const groupData = groupSnap.data();

        // Fetch members data
        const membersData = {};
        const contactsRef = collection(db, 'contacts');
        const contactsSnap = await getDocs(contactsRef);
        contactsSnap.forEach(doc => {
          if (groupData.memberIds.includes(doc.id)) {
            const data = doc.data();
            membersData[doc.id] = {
              name: data.name,
              phone: data.phone,
              alternatePhone: data.alternatePhone
            };
          }
        });

        // Fetch contributions data
        const contributionsRef = doc(db, 'contributions', groupId);
        const contributionsSnap = await getDoc(contributionsRef);
        const contributionsData = contributionsSnap.exists() ? contributionsSnap.data() : { months: {} };

        // Calculate previous winners
        const previousWinners = Object.values(contributionsData.months).reduce((acc, month) => {
          Object.entries(month.memberContributions || {}).forEach(([memberId, data]) => {
            if (data.winner) acc.add(memberId);
          });
          return acc;
        }, new Set());

        // Update all state at once
        setData({
          groupData,
          contributionsData,
          members: membersData,
          previousWinners: Array.from(previousWinners),
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Error fetching data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  useEffect(() => {
    if (sortedMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(sortedMonths[0]);
    }
  }, [sortedMonths, selectedMonth]);

  useEffect(() => {
    if (data.contributionsData && selectedMonth) {
      const selectedMonthData = data.contributionsData.months[selectedMonth] || {};
      const newEditableData = {};
      Object.entries(selectedMonthData.memberContributions || {}).forEach(([memberId, memberData]) => {
        newEditableData[memberId] = {
          amount: memberData.amount || '',
          paymentMode: memberData.paymentMode || '',
          balance: memberData.balance || 0,
          advancePayment: memberData.advancePayment || 0,
          paid: memberData.balance === 0,
          winner: memberData.winner || false
        };
      });
      setEditableData(newEditableData);
    }
  }, [data.contributionsData, selectedMonth]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedMonth(sortedMonths[newValue]);
  };

  const handleInputChange = (memberId, field, value) => {
    setEditableData(prevData => ({
      ...prevData,
      [memberId]: {
        ...prevData[memberId],
        [field]: value,
        ...(field === 'amount' && calculateBalanceAndPayment(value, prevData[memberId]))
      }
    }));
  };

  const calculateBalanceAndPayment = (amount, prevData) => {
    const parsedAmount = parseFloat(amount);
    const balance = monthlyAmount - parsedAmount;
    let adjustedBalance = Math.max(balance, 0);  // Ensure balance is never negative
    const advancePayment = parsedAmount > monthlyAmount ? parsedAmount - monthlyAmount : 0;
    return {
      balance: adjustedBalance,
      advancePayment,
      paid: balance <= 0
    };
  };

  const handleWinnerChange = (memberId, value) => {
    if (data.previousWinners.includes(memberId)) {
      alert("This member has already won and is not eligible to win again.");
      return;
    }
  
    // Save memberId and value to state
    setSelectedWinner({ memberId, value });
  
    // Open the confirmation dialog
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedWinner({ memberId: null, value: false }); // Reset selected winner
  };
  

  const handleConfirmWinner = () => {
    const { memberId, value } = selectedWinner;
  
    // Proceed with setting the winner
    setEditableData(prevData => {
      const newData = { ...prevData };
      Object.keys(newData).forEach(id => {
        newData[id] = { ...newData[id], winner: id === memberId ? value : false };
      });
      return newData;
    });
  
    // Close the dialog after confirmation
    setDialogOpen(false);
  };
  

  
  const handleSave = async () => {
    try {
      const contributionsRef = doc(db, 'contributions', groupId);
      const updatedMonths = { 
        ...data.contributionsData.months,
        [selectedMonth]: {
          ...data.contributionsData.months[selectedMonth],
          memberContributions: editableData,
        }
      };

      await updateDoc(contributionsRef, { months: updatedMonths });

      setData(prevData => ({
        ...prevData,
        contributionsData: {
          ...prevData.contributionsData,
          months: updatedMonths
        },
        previousWinners: [
          ...prevData.previousWinners,
          ...Object.entries(editableData)
            .filter(([, data]) => data.winner)
            .map(([memberId]) => memberId)
        ]
      }));

      alert('Data saved successfully!');
    } catch (error) {
      console.error("Error saving data:", error);
      alert('Failed to save data. Please try again.');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data.groupData) return <Typography>No data available</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{data.groupData.groupName}</Typography>
      <Typography variant="body1">Value: {data.groupData.selectedValue} lakhs</Typography>
      <Typography variant="body1">Members: {data.groupData.numberOfMembers}</Typography>
      <Typography variant="body1">Duration: {data.groupData.startMonth} - {data.groupData.endMonth}</Typography>

      <Box my={3} style={{ overflowX: 'auto' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant='scrollable'>
          {sortedMonths.map((month, index) => (
            <Tab key={index} label={month} />
          ))}
        </Tabs>
      </Box>

      {selectedMonth && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Alternate Phone</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Picked</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(data.members).map(([memberId, memberData]) => (
                <TableRow key={memberId}>
                  <TableCell>{memberData.name}</TableCell>
                  <TableCell>{memberData.phone}</TableCell>
                  <TableCell>{memberData.alternatePhone}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={editableData[memberId]?.amount || ''}
                      onChange={(e) => handleInputChange(memberId, 'amount', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={editableData[memberId]?.paymentMode || ''}
                      onChange={(e) => handleInputChange(memberId, 'paymentMode', e.target.value)}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {editableData[memberId]?.balance > 0 
                      ? editableData[memberId].balance 
                      : (editableData[memberId]?.advancePayment > 0 
                        ? `+${editableData[memberId].advancePayment}` 
                        : '0')}
                  </TableCell>
                  <TableCell>
                  <Checkbox
                      checked={editableData[memberId]?.paid || false}
                      disabled
                      style={{ color: 'green' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={editableData[memberId]?.winner || false}
                      onChange={(e) => handleWinnerChange(memberId, e.target.checked)}
                      disabled={data.previousWinners.includes(memberId)}
                      style={{ color: data.previousWinners.includes(memberId) ? 'grey' : 'blue' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Winner</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to set this member as a winner?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmWinner} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
     
  
  );
};

export default ChitFundDetails;
