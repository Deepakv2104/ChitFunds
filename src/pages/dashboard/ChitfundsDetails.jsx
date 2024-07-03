import React, { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../Authentication/firebase';
import { Checkbox } from '@mui/material';
import './ChitfundsDetails.css';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Container, Box, TextField, Button, Tabs, Tab, FormControl, InputLabel, Select, MenuItem
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
  const [currentWinner, setCurrentWinner] = useState('');
  const monthlyAmount = 5000;

  useEffect(() => {
    const fetchData = async () => {
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

        const membersData = {};
        const contactsRef = collection(db, 'contacts');
        const contactsSnap = await getDocs(contactsRef);
        console.log(contactsSnap);
        contactsSnap.forEach(doc => {
          if (groupDataFetched.memberIds.includes(doc.id)) {
            const data = doc.data();
            membersData[doc.id] = {
              name: data.name,
              phone: data.phone,
              alternatePhone: data.alternatePhone
            };
          }
        });
        setMembers(membersData);

        const contributionsRef = doc(db, 'contributions', groupId);
        const contributionsSnap = await getDoc(contributionsRef);

        if (contributionsSnap.exists()) {
          const contributions = contributionsSnap.data();
          setContributionsData(contributions);

          const months = Object.keys(contributions.months).sort((a, b) => {
            const [aMonth, aYear] = a.split(' ');
            const [bMonth, bYear] = b.split(' ');
            return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
          });

          if (months.length > 0) {
            setSelectedMonth(months[0]);
          }
        } else {
          setContributionsData({ months: {} });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  useEffect(() => {
    if (contributionsData && selectedMonth) {
      const selectedMonthData = contributionsData.months[selectedMonth] || {};
      setMonthlyData(selectedMonthData);

      const newEditableData = {};
      Object.entries(selectedMonthData.memberContributions || {}).forEach(([memberId, data]) => {
        newEditableData[memberId] = {
          amount: data.amount || '',
          paymentMode: data.paymentMode || '',
          balance: data.balance || 0,
          advancePayment: data.advancePayment || 0,
          paid: data.balance === 0,
          winner: data.winner || ''
        };

        if (data.winner) {
          setCurrentWinner(memberId);
        }
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
  };

  const handleInputChange = (memberId, field, value) => {
    setEditableData(prevEditableData => {
      const newEditableData = {
        ...prevEditableData,
        [memberId]: {
          ...prevEditableData[memberId],
          [field]: value
        }
      };

      if (field === 'amount') {
        const amount = parseFloat(value);
        const ma = parseFloat(monthlyAmount || 0);
        const advancePayment = parseFloat(prevEditableData[memberId]?.advancePayment || 0);
        let balance = ma - amount;
        let newAdvancePayment = advancePayment;

        if (amount > ma) {
          newAdvancePayment += amount - ma;
          balance = 0;
        } else {
          newAdvancePayment = 0;
        }

        newEditableData[memberId].balance = isNaN(balance) ? 0 : balance;
        newEditableData[memberId].advancePayment = newAdvancePayment;
        newEditableData[memberId].paid = balance === 0;
      }

      return newEditableData;
    });
  };

  const handleWinnerChange = (memberId, value) => {
    setEditableData(prevEditableData => {
      const newEditableData = {
        ...prevEditableData,
        [memberId]: {
          ...prevEditableData[memberId],
          winner: value
        }
      };

      if (value) {
        Object.keys(newEditableData).forEach(id => {
          if (id !== memberId) {
            newEditableData[id].winner = false;
          }
        });
        setCurrentWinner(memberId);
      } else {
        setCurrentWinner('');
      }

      return newEditableData;
    });
  };

  const handleSave = async () => {
    try {
      const contributionsRef = doc(db, 'contributions', groupId);
      await updateDoc(contributionsRef, {
        [`months.${selectedMonth}.memberContributions`]: editableData,
        [`months.${selectedMonth}.winner`]: currentWinner
      });

      setMonthlyData({
        ...monthlyData,
        memberContributions: editableData,
        winner: currentWinner
      });

      const updatedContributionsSnap = await getDoc(contributionsRef);
      const updatedContributionsData = updatedContributionsSnap.data();

      setContributionsData(updatedContributionsData);

      const sortedMonths = Object.keys(updatedContributionsData.months).sort((a, b) => {
        const [aMonth, aYear] = a.split(' ');
        const [bMonth, bYear] = b.split(' ');
        return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
      });

      const nextMonthIndex = sortedMonths.indexOf(selectedMonth) + 1;

      if (nextMonthIndex < sortedMonths.length) {
        const nextMonth = sortedMonths[nextMonthIndex];
        const nextMonthData = updatedContributionsData.months[nextMonth] || {};

        const newNextMonthData = { ...nextMonthData };

        if (currentWinner) {
          newNextMonthData.memberContributions = newNextMonthData.memberContributions || {};
          newNextMonthData.memberContributions[currentWinner] = {
            ...newNextMonthData.memberContributions[currentWinner],
            winner: true
          };
        }

        await updateDoc(contributionsRef, {
          [`months.${nextMonth}.memberContributions`]: newNextMonthData.memberContributions,
          [`months.${nextMonth}.winner`]: currentWinner
        });

        setContributionsData({
          ...updatedContributionsData,
          months: {
            ...updatedContributionsData.months,
            [nextMonth]: newNextMonthData
          }
        });
      }

      alert('Data saved successfully!');
    } catch (error) {
      console.error("Error saving data:", error);
      alert('Failed to save data. Please try again.');
    }
  };

  const sortedMonths = useMemo(() => {
    return Object.keys(contributionsData?.months || {}).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      return new Date(`${aMonth} 1, ${aYear}`) - new Date(`${bMonth} 1, ${bYear}`);
    });
  }, [contributionsData]);

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

  return (
    <div style={{ padding: '10px', margin: '10px' }}>
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
                  <TableCell>Phone</TableCell>
                  <TableCell>Alternate Phone</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Mode</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Advance Payment</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Picked</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(members).map((memberId) => (
                  <TableRow key={memberId}>
                    <TableCell>{members[memberId].name}</TableCell>
                    <TableCell>{members[memberId].phone}</TableCell>
                    <TableCell>{members[memberId].alternatePhone}</TableCell>

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
                        checked={editableData[memberId]?.paid || false}
                        disabled
                        style={{ transform: 'scale(1.5)', marginLeft: '6px', color: 'green' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={editableData[memberId]?.winner || false}
                        onChange={(e) => handleWinnerChange(memberId, e.target.checked)}
                        style={{ transform: 'scale(1.5)', marginLeft: '6px', color: 'blue' }}
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
    </div>
  );
};

export default ChitFundDetails;
