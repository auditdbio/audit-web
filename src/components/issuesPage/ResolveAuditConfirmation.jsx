import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import { resolveAudit } from '../../redux/actions/auditAction.js';

const ResolveAuditConfirmation = ({ isOpen, setIsOpen, audit }) => {
  const dispatch = useDispatch();

  const handleDisagree = () => {
    setIsOpen(false);
  };

  const handleAgree = () => {
    setIsOpen(false);
    dispatch(resolveAudit(audit));
  };

  return (
    <Dialog open={isOpen} onClose={handleDisagree}>
      <DialogTitle>Are you sure you want to resolve the audit?</DialogTitle>
      <DialogActions>
        <Button
          onClick={handleDisagree}
          variant="contained"
          color="primary"
          sx={buttonSx}
          {...addTestsLabel('resolve-disagree-button')}
        >
          Disagree
        </Button>
        <Button
          onClick={handleAgree}
          variant="contained"
          color="secondary"
          sx={buttonSx}
          {...addTestsLabel('resolve-agree-button')}
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResolveAuditConfirmation;

const buttonSx = () => ({
  textTransform: 'unset',
  fontWeight: 600,
});
