import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../Authentication/firebase';
import { Checkbox } from '@mui/material';
import './ChitfundsDetails.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const ChitFundDetails = ({ groupId }) => {
  const [groupData, setGroupData] = useState(null);
  const [contributionsData, setContributionsData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyData, setMonthlyData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState({});
  const [editableData, setEditableData] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [subTabValue, setSubTabValue] = useState(0);
  const monthlyAmount = 5000;

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) {
        setError("No group ID provided");
        setLoading(false);
        return;
      }

      try {
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
          setError("No such group found");
          setLoading(false);
          return;
        }

        const groupDataFetched = groupSnap.data();
        setGroupData(groupDataFetched);

        // Fetch member details only for group members
        const membersData = {};
        const contactsRef = collection(db, 'contacts');
        const contactsSnap = await getDocs(contactsRef);
        contactsSnap.forEach(doc => {
          if (groupDataFetched.memberIds.includes(doc.id)) {
            membersData[doc.id] = doc.data().name;
          }
        });
        setMembers(membersData);

        // Initialize editable data
        const initialEditableData = {};
        Object.keys(membersData).forEach(memberId => {
          initialEditableData[memberId] = {
            amount: '',
            paymentMode: '', // Initialize paymentMode as empty string
            balance: 0,
            paid: false,
            advancePayment: 0
          };
        });
        setEditableData(initialEditableData);

        const contributionsRef = doc(db, 'contributions', groupId);
        const contributionsSnap = await getDoc(contributionsRef);

        if (contributionsSnap.exists()) {
          setContributionsData(contributionsSnap.data());

          // Sort months from start month to end month
          const months = Object.keys(contributionsSnap.data().months).sort((a, b) => {
            const [aMonth, aYear] = a.split(' ');
            const [bMonth, bYear] = b.split(' ');
            return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
          });

          if (months.length > 0) {
            setSelectedMonth(months[0]);
          }
        } else {
          // If no contributions data, create an empty structure
          setContributionsData({ months: {} });
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
        setError(`Error fetching group data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  useEffect(() => {
    if (contributionsData && selectedMonth) {
      const selectedMonthData = contributionsData.months[selectedMonth] || {};
      setMonthlyData(selectedMonthData);

      // Update editable data with existing values
      const newEditableData = {};
      Object.entries(selectedMonthData.memberContributions || {}).forEach(([memberId, data]) => {
        newEditableData[memberId] = {
          amount: data.amount || '',
          paymentMode: data.paymentMode || '', // Initialize paymentMode from data
          balance: data.balance || 0,
          advancePayment: data.advancePayment || 0,
          paid: data.balance === 0 // Set paid based on balance
        };
      });
      setEditableData(newEditableData);
    }
  }, [contributionsData, selectedMonth]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const sortedMonths = Object.keys(contributionsData?.months || {}).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
    });
    setSelectedMonth(sortedMonths[newValue]);
    setSubTabValue(0); // Reset sub-tab value when main tab changes
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTabValue(newValue);
  };

  const handleInputChange = (memberId, field, value) => {
    setEditableData(prevEditableData => ({
      ...prevEditableData,
      [memberId]: {
        ...prevEditableData[memberId],
        [field]: value
      }
    }));

    // Update balance, advancePayment, and paid based on amount and paymentMode
    if (field === 'amount') {
      const amount = parseFloat(value);
      const ma = parseFloat(monthlyAmount || 0);
      const advancePayment = parseFloat(editableData[memberId]?.advancePayment || 0);
      let balance = ma - amount;
      let newAdvancePayment = advancePayment;
  
      // If the amount exceeds the monthly amount, assign the excess to advancePayment
      if (amount > ma) {
        newAdvancePayment += amount - ma;
        balance = 0; // Balance is zero since the excess is considered an advance
      } else {
        // Reset advance payment if the amount is reduced below the monthly amount
        newAdvancePayment = 0;
      }
  
      setEditableData(prevEditableData => ({
        ...prevEditableData,
        [memberId]: {
          ...prevEditableData[memberId],
          balance: isNaN(balance) ? 0 : balance,
          advancePayment: newAdvancePayment,
          paid: balance === 0 // Set paid based on balance
        }
      }));
    }
  };
  
  const handleSave = async () => {
    try {
      const contributionsRef = doc(db, 'contributions', groupId);
      await updateDoc(contributionsRef, {
        [`months.${selectedMonth}.memberContributions`]: editableData
      });
      
      // Update local state with saved data
      setMonthlyData({
        ...monthlyData,
        memberContributions: editableData
      });
  
      // Fetch updated contributions data from Firebase to reflect changes
      const updatedContributionsSnap = await getDoc(contributionsRef);
      const updatedContributionsData = updatedContributionsSnap.data();
  
      // Update contributionsData state with the updated data
      setContributionsData(updatedContributionsData);
  
      // Optionally update selectedMonth if needed
      // setSelectedMonth(selectedMonth);
  
      alert('Data saved successfully!');
    } catch (error) {
      console.error("Error saving data:", error);
      alert('Failed to save data. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!groupData) {
    return (
      <Container>
        <Typography>No data available</Typography>
      </Container>
    );
  }

  const sortedMonths = Object.keys(contributionsData?.months || {}).sort((a, b) => {
    const [aMonth, aYear] = a.split(' ');
    const [bMonth, bYear] = b.split(' ');
    return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
  });
console.log(sortedMonths)
  return (
    <Container>
      <Typography variant="h4" gutterBottom>{groupData.groupName}</Typography>
      <Typography variant="body1">Value: {groupData.selectedValue} lakhs</Typography>
      <Typography variant="body1">Members: {groupData.numberOfMembers}</Typography>
      <Typography variant="body1">Duration: {groupData.startMonth} - {groupData.endMonth}</Typography>

      <Box my={3} style={{ overflowX: 'auto' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          
          {sortedMonths.map((month, index) => (
            <Tab key={month} label={month} />
          ))}
        </Tabs>
      </Box>

      {selectedMonth && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Advance Payment</TableCell>
                <TableCell>Paid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(members).map((memberId) => (
                <TableRow key={memberId}>
                  <TableCell>{members[memberId]}</TableCell>
                  <TableCell>
                  <TextField
  type="number"
  value={editableData[memberId]?.amount || ''}
  onChange={(e) => handleInputChange(memberId, 'amount', e.target.value)}
/>

                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>Payment Mode</InputLabel>
                      <Select
                        value={editableData[memberId]?.paymentMode || ''}
                        onChange={(e) => handleInputChange(memberId, 'paymentMode', e.target.value)}
                      >
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Online">Online</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{editableData[memberId]?.balance}</TableCell>
                  <TableCell>{editableData[memberId]?.advancePayment}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={editableData[memberId]?.paid}
                      disabled
                      style={{ transform: 'scale(1.5)', marginLeft: '6px', color: 'green' }}
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
    </Container>
  );
};

export default ChitFundDetails;
