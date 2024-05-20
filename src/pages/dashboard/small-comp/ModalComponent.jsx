// ModalComponent.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

const ModalComponent = ({ isOpen, onRequestClose, onNewClick, onExistingClick }) => {
  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <DialogTitle>Select Option</DialogTitle>
      <DialogActions>
        <Button onClick={onNewClick} variant="contained" color="primary">
          New
        </Button>
        <Button onClick={onExistingClick} variant="contained" color="secondary">
          Existing
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalComponent;
