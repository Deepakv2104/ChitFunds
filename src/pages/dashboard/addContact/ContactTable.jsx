import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ContactRow from './ContactRow';

const ContactTable = ({ contacts, filterText, onDelete, page, rowsPerPage }) => {
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(filterText.toLowerCase()) ||
    contact.phone.includes(filterText) ||
    contact.alternatePhone.includes(filterText) ||
    contact.aadharCardNo.includes(filterText) ||
    contact.chequeNo.includes(filterText)
  );
  const displayedContacts = filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const rows = displayedContacts.map((contact, index) => <ContactRow key={contact.key} contact={contact} onDelete={onDelete} index={index} />);

  return (
    <TableContainer component={Paper} className="table-container">
      <Table>
        <TableHead className="table-head">
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Alternate Phone</TableCell>
            <TableCell>Aadhar Card No</TableCell>
            <TableCell>Cheque No</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="table-body">{rows}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContactTable;
