import React from 'react';
import { CircularProgress } from '@mui/material';
import { AUDITOR } from '../redux/actions/types.js';

const Loader = ({ role }) => {
  return (
    <CircularProgress color={role === AUDITOR ? 'secondary' : 'primary'} />
  );
};

export default Loader;
