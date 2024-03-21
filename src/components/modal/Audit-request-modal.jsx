import React from 'react';
import { Modal } from '@mui/material';
import AuditRequestInfo from '../audit-request-info.jsx';

const AuditRequestModal = ({ close, open }) => {
  return (
    <Modal
      open={open}
      onClose={close()}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <AuditRequestInfo />
    </Modal>
  );
};

export default AuditRequestModal;
