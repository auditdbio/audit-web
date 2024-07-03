import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const TypeChat = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        overflow: 'visible',
        p: 4,
      }}
    >
      <Button variant={'contained'} sx={{ textTransform: 'initial' }}>
        Personal chat
      </Button>
      <Button
        variant={'contained'}
        color={'secondary'}
        onClick={() => setIsOpen(!isOpen)}
        sx={{ textTransform: 'initial', position: 'relative' }}
      >
        Organization chat
        {isOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: '40px',
              zIndex: 1,
              left: 0,
              right: 0,
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              backgroundColor: '#fff',
            }}
          >
            <Button>Organization 1</Button>
            <Button>Organization 2</Button>
            <Button>Organization 3</Button>
          </Box>
        )}
      </Button>
    </Box>
  );
};

export default TypeChat;
