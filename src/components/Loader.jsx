import React from 'react';
import { CircularProgress } from '@mui/material';

const Loader = ({ role }) => {
  return (
    <CircularProgress color={role === 'auditor' ? 'secondary' : 'primary'} />
  );
};

export default Loader;
