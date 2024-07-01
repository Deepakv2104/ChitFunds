import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../Authentication/firebase';
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
  Tab
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

        if (groupSnap.exists()) {
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
            initialEditableData[memberId] = { amount: '', paymentMode: '' };
          });
          setEditableData(initialEditableData);

        } else {
          setError("No such group found");
          setLoading(false);
          return;
        }

        const contributionsRef = doc(db, 'contributions', groupId);
        const contributionsSnap = await getDoc(contributionsRef);

        if (contributionsSnap.exists()) {
          setContributionsData(contributionsSnap.data());
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
      setMonthlyData(contributionsData.months[selectedMonth] || {});
      // Update editable data with existing values
      const newEditableData = {};
      Object.entries(contributionsData.months[selectedMonth]?.memberContributions || {}).forEach(([memberId, data]) => {
        newEditableData[memberId] = { amount: data.amount || '', paymentMode: data.paymentMode || '' };
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
    setEditableData(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], [field]: value }
    }));
  };

  const handleSave = async () => {
    try {
      const contributionsRef = doc(db, 'contributions', groupId);
      await updateDoc(contributionsRef, {
        [`months.${selectedMonth}.memberContributions`]: editableData
      });
      setMonthlyData({ ...monthlyData, memberContributions: editableData });
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

        <Tabs
          value={subTabValue}
          onChange={handleSubTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {sortedMonths[tabValue] && Object.keys(contributionsData.months[sortedMonths[tabValue]].memberContributions || {}).map((memberId, index) => (
            <Tab key={memberId} label={members[memberId]} />
          ))}
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(members).map(([memberId, memberName]) => (
              <TableRow key={memberId}>
                <TableCell>{memberName}</TableCell>
                <TableCell>
                  <TextField
                    value={editableData[memberId]?.amount || ''}
                    onChange={(e) => handleInputChange(memberId, 'amount', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={editableData[memberId]?.paymentMode || ''}
                    onChange={(e) => handleInputChange(memberId, 'paymentMode', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>

      {monthlyData && monthlyData.winner && (
        <Box mt={3}>
          <Typography variant="h6">Winner for {selectedMonth}</Typography>
          <Typography>Member Name: {members[monthlyData.winner.memberId] || 'Unknown'}</Typography>
          <Typography>Amount: {monthlyData.winner.amount}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default ChitFundDetails;
