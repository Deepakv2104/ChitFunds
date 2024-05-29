    import React, { useState, useEffect } from 'react';
    import { collection, query, where, getDocs } from 'firebase/firestore';
    import { db } from '../../Authentication/firebase'; // Adjust the path as necessary
    import './ChitfundsDetails.css'

    const ChitFundDetails = ({ chitfundId }) => {
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMonths = async () => {
        try {
            const contributionsQuery = query(collection(db, 'contributions'), where('chitFundId', '==', chitfundId));
            const contributionsSnapshot = await getDocs(contributionsQuery);
            const monthsData = contributionsSnapshot.docs.map(doc => doc.data().month);
            setMonths(monthsData);
        } catch (error) {
            console.error('Error fetching months:', error);
        }
        };

        fetchMonths();
    }, [chitfundId]);

    useEffect(() => {
        const fetchMembers = async () => {
        if (selectedMonth) {
            try {
            const contributionsQuery = query(collection(db, 'contributions'), where('chitFundId', '==', chitfundId), where('month', '==', selectedMonth));
            const contributionsSnapshot = await getDocs(contributionsQuery);
            const contributionsData = contributionsSnapshot.docs.map(doc => doc.data().contributions);
            setMembers(contributionsData[0] || []);
            } catch (error) {
            console.error('Error fetching members:', error);
            }
        }
        };

        fetchMembers();
    }, [selectedMonth, chitfundId]);

    return (
        <div className="chitfund-details">
        <h2>Chitfund ID: {chitfundId}</h2>
        <div className="subnav">
            {months.map((month, index) => (
            <button key={index} onClick={() => setSelectedMonth(month)} className={month === selectedMonth ? 'active' : ''}>
                {month}
            </button>
            ))}
        </div>
        {selectedMonth && (
            <div className="members-table">
            <h3>Month: {selectedMonth}</h3>
            <table>
                <thead>
                <tr>
                    <th>Member ID</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                {members.map((member, index) => (
                    <tr key={index}>
                    <td>{member.memberId}</td>
                    <td>{member.amount}</td>
                    <td>{member.paymentMode}</td>
                    <td>{member.balance}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
    };

    export default ChitFundDetails;
