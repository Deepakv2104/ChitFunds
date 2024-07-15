import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../Authentication/firebase';
import { Check, Close } from '@mui/icons-material';
import { Checkbox } from '@mui/material';
import './ChitfundsDetails.css';
import {
  Table, Grid, Card, CardContent, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Container, Box, TextField, Button, Tabs, Tab, FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
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
  const [monthlyAmount, setMonthlyAmount] = useState(0)


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
    if (data && data.groupData) {
      console.log("selectedValue:", data.groupData.selectedValue); // Log the selectedValue for debugging
      switch (data.groupData.selectedValue) {
        case "1":
          setMonthlyAmount(5000);
          console.log("case1")
          break;
        case "2":
          setMonthlyAmount(10000);
          console.log("case2")

          break;
        case "5":
          setMonthlyAmount(25000);
          console.log("case5")

          break;
        case "10":
          setMonthlyAmount(50000);
          console.log("case10")

          break;
        default:
          setMonthlyAmount(0);
          console.log("default")
        // Default case if none of the above values match
      }
    }
  }, [data]);




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
          winner: memberData.winner || false,
          totalBalance: memberData.totalBalance || 0  // Add this line
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
        [field]: field === 'totalBalance' ? (parseFloat(value) || 0) : value,
        ...(field === 'amount' && calculateBalanceAndPayment(value, prevData[memberId])),
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
      console.log('Starting save process');
      console.log('Group ID:', groupId);
      console.log('Editable Data:', editableData);

      const contributionsRef = doc(db, 'contributions', groupId);
      const updatedMonths = { ...data.contributionsData.months };

      // Filter out undefined or null values
      const filteredEditableData = Object.entries(editableData).reduce((acc, [memberId, memberData]) => {
        acc[memberId] = Object.entries(memberData).reduce((memberAcc, [key, value]) => {
          if (value !== undefined && value !== null) {
            memberAcc[key] = value;
          }
          return memberAcc;
        }, {});
        return acc;
      }, {});

      // Update current month
      updatedMonths[selectedMonth] = {
        ...updatedMonths[selectedMonth],
        memberContributions: filteredEditableData,
      };

      // Carry over total balance to next month
      const currentMonthIndex = sortedMonths.indexOf(selectedMonth);
      if (currentMonthIndex < sortedMonths.length - 1) {
        const nextMonth = sortedMonths[currentMonthIndex + 1];
        updatedMonths[nextMonth] = updatedMonths[nextMonth] || { memberContributions: {} };

        Object.entries(filteredEditableData).forEach(([memberId, memberData]) => {
          if (memberData.totalBalance !== undefined && memberData.totalBalance !== null) {
            updatedMonths[nextMonth].memberContributions[memberId] = {
              ...updatedMonths[nextMonth].memberContributions[memberId],
              totalBalance: memberData.totalBalance
            };
          }
        });
      }

      console.log('Updated Months:', updatedMonths);
      await updateDoc(contributionsRef, { months: updatedMonths });
      console.log('Data saved successfully');

      setData(prevData => ({
        ...prevData,
        contributionsData: {
          ...prevData.contributionsData,
          months: updatedMonths
        },
        previousWinners: [
          ...prevData.previousWinners,
          ...Object.entries(filteredEditableData)
            .filter(([, data]) => data.winner)
            .map(([memberId]) => memberId)
        ]
      }));

      alert('Data saved successfully!');
    } catch (error) {
      console.error("Error saving data:", error);
      alert(`Failed to save data. Error: ${error.message}`);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data.groupData) return <Typography>No data available</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, sm: 3 } }}>
      <Container maxWidth="xl">
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="h3" gutterBottom fontWeight="bold" color="primary" sx={{ fontSize: { xs: '1.75rem', sm: '3rem' } }}>
            {data.groupData.groupName}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: 'Value', value: `${data.groupData.selectedValue} lakhs` },
              { label: 'Members', value: data.groupData.numberOfMembers },
              { label: 'Duration', value: `${data.groupData.startMonth} - ${data.groupData.endMonth}` }
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    <Typography variant="h6">{item.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 4, overflowX: 'auto' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant='scrollable'
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': { height: 3 },
                '& .MuiTab-root': { fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }
              }}
            >
              {sortedMonths.map((month, index) => (
                <Tab key={index} label={month} />
              ))}
            </Tabs>
          </Box>

          {selectedMonth && (
            <Box sx={{ overflowX: 'auto', width: '100%' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Name</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Phone</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Alt. Phone</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Mode</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Balance</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Paid</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Picked</TableCell>
                    <TableCell sx={{ color: 'common.white', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Total Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(data.members).map(([memberId, memberData]) => (
                    <TableRow key={memberId} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{memberData.name}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{memberData.phone}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{memberData.alternatePhone}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={editableData[memberId]?.amount || ''}
                          onChange={(e) => handleInputChange(memberId, 'amount', e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100px' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={editableData[memberId]?.paymentMode || ''}
                          onChange={(e) => handleInputChange(memberId, 'paymentMode', e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100px' }}
                        >
                          <MenuItem value="Cash">Cash</MenuItem>
                          <MenuItem value="Online">Online</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {editableData[memberId]?.balance > 0
                          ? editableData[memberId].balance
                          : (editableData[memberId]?.advancePayment > 0
                            ? <Typography color="success.main">+{editableData[memberId].advancePayment}</Typography>
                            : '0')}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={editableData[memberId]?.paid || false}
                          disabled
                          sx={{ color: 'success.main', '&.Mui-checked': { color: 'success.main' } }}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={editableData[memberId]?.winner || false}
                          onChange={(e) => handleWinnerChange(memberId, e.target.checked)}
                          disabled={data.previousWinners.includes(memberId)}
                          sx={{
                            color: data.previousWinners.includes(memberId) ? 'text.disabled' : 'primary.main',
                            '&.Mui-checked': { color: 'primary.main' }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={editableData[memberId]?.totalBalance || ''}
                          onChange={(e) => handleInputChange(memberId, 'totalBalance', e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100px' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{
                fontWeight: 'bold',
                px: { xs: 2, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': { boxShadow: 4 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Save Changes
            </Button>
          </Box>

          <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            PaperProps={{
              elevation: 5,
              sx: { borderRadius: 2, width: { xs: '90%', sm: 'auto' } }
            }}
          >
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'common.white', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Confirm Winner
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Are you sure you want to set this member as a winner?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleDialogClose} color="primary" variant="outlined" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Cancel
              </Button>
              <Button onClick={handleConfirmWinner} color="primary" variant="contained" autoFocus sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChitFundDetails;
