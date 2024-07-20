import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Button
} from '@mui/material';

const ContactDialog = ({ open, handleCloseDialog, handleNewContactChange, handleAddNewContact, newContact }) => (
  <Dialog open={open} onClose={handleCloseDialog}>
    <DialogTitle>Add New Contact</DialogTitle>
    <DialogContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            value={newContact.name}
            onChange={handleNewContactChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="phone"
            label="Phone"
            variant="outlined"
            fullWidth
            value={newContact.phone}
            onChange={handleNewContactChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="alternatePhone"
            label="Alternate Phone"
            variant="outlined"
            fullWidth
            value={newContact.alternatePhone}
            onChange={handleNewContactChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="aadharCardNo"
            label="Aadhar Card No"
            variant="outlined"
            fullWidth
            value={newContact.aadharCardNo}
            onChange={handleNewContactChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="chequeNo"
            label="Cheque No"
            variant="outlined"
            fullWidth
            value={newContact.chequeNo}
            onChange={handleNewContactChange}
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button variant="secondary" onClick={handleCloseDialog}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleAddNewContact}>
        Add
      </Button>
    </DialogActions>
  </Dialog>
);

export default ContactDialog;
