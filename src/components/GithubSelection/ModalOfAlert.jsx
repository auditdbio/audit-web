import React from 'react';
import { Box, Button, Typography } from '@mui/material';
//
const ModalOfAlert = ({ onSave, onClose }) => {
  return (
    <Box>
      <Typography variant={'body1'}>
        Are you sure you want to close? You have unsaved files.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          mt: '20px',
        }}
      >
        <Button variant={'contained'} onClick={onSave}>
          agree
        </Button>
        <Button variant={'contained'} onClick={onClose} color={'secondary'}>
          disagree
        </Button>
      </Box>
    </Box>
  );
};

export default ModalOfAlert;
