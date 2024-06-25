import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const TypeChat = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
      }}
    >
      <Button variant={'contained'} sx={{ textTransform: 'initial' }}>
        Personal chat
      </Button>
      <Button
        variant={'contained'}
        color={'secondary'}
        sx={{ textTransform: 'initial' }}
      >
        Organization chat
      </Button>
    </Box>
  );
};

export default TypeChat;
