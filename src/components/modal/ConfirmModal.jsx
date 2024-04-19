import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';

const ConfirmModal = ({
  isOpen,
  handleAgree,
  handleDisagree,
  text = 'Are you sure?',
}) => {
  return (
    <Dialog open={isOpen} onClose={handleDisagree}>
      <DialogTitle sx={{ padding: '16px 70px' }}>{text}</DialogTitle>
      <DialogActions sx={{ justifyContent: 'space-around' }}>
        <Button
          onClick={handleDisagree}
          variant="contained"
          color="primary"
          {...addTestsLabel('close-disagree-button')}
        >
          Disagree
        </Button>
        <Button
          onClick={handleAgree}
          variant="contained"
          color="secondary"
          autoFocus
          {...addTestsLabel('close-agree-button')}
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
