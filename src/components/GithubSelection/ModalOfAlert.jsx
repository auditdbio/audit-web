import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded.js';

const ModalOfAlert = ({ onSave, onDisagree, onClose }) => {
  return (
    <Box>
      <Typography variant="body1" sx={{ textAlign: 'center' }}>
        You have unsaved files.
        <br /> Apply changes?
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          mt: '20px',
        }}
      >
        <Button variant="contained" onClick={onSave}>
          agree
        </Button>
        <Button variant="contained" onClick={onDisagree} color="secondary">
          disagree
        </Button>
        <Button onClick={onClose} sx={closeSx}>
          <CloseRoundedIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default ModalOfAlert;

const closeSx = {
  position: 'absolute',
  top: 5,
  right: 5,
  minWidth: '40px',
};
