import React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

const SubmitModal = ({ close }) => {
  return (
    <Box sx={modalInnerWrapper}>
      <Typography sx={titleStyle}>
        Are you sure you want to create a new account?
      </Typography>
      <Typography sx={titleStyle}>
        You can merge your email with an existing account.
      </Typography>
      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <Button sx={btnStyle} type={'submit'} variant={'contained'}>
          Submit
        </Button>
        <Button
          sx={btnStyle}
          variant={'contained'}
          color={'secondary'}
          onClick={() => close()}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default SubmitModal;

const btnStyle = theme => ({
  fontWeight: '600',
  fontSize: '18px',
});

const modalInnerWrapper = theme => ({
  width: 400,
  bgcolor: '#fcfaf6',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  [theme.breakpoints.down(430)]: {
    width: '330px',
  },
});

const titleStyle = theme => ({
  fontSize: '20px',
  lineHeight: '24px',
  color: '#000000',
  textAlign: 'center',
  marginBottom: '20px',
});
