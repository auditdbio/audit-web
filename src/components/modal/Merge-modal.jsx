import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import SimpleField from '../forms/fields/simple-field.jsx';
import { TextField } from 'formik-mui';
import { addTestsLabel } from '../../lib/helper.js';
import { FastField } from 'formik';
//
const MergeModal = () => {
  return (
    <Box sx={modalInnerWrapper}>
      <Typography>Please enter your account email for merging</Typography>
      <FastField
        component={TextField}
        name={'email'}
        label={'Email'}
        fullWidth={true}
        disabled={false}
        inputProps={{ ...addTestsLabel(`${name}-input`) }}
      />
      <Button variant={'contained'} sx={btnStyle}>
        Merge
      </Button>
    </Box>
  );
};
//
export default MergeModal;

const btnStyle = theme => ({
  fontWeight: '600',
  fontSize: '18px',
});

const modalInnerWrapper = theme => ({
  width: 400,
  bgcolor: '#fcfaf6',
  borderRadius: '10px',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  p: 4,
  [theme.breakpoints.down(430)]: {
    width: '330px',
  },
});
