import React from 'react';
import { Box, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import theme from '../../styles/themes.js';

const AuditorSearchListBox = ({ auditor, handleSelectOption }) => {
  return (
    <Box sx={mainContainer} onClick={handleSelectOption}>
      <Box>
        <Typography sx={nameStyle(theme)}>
          {auditor.first_name} {auditor.last_name}
        </Typography>
      </Box>

      <Box sx={statusContainer}>
        <CircleIcon sx={circleStyle} />

        <Typography sx={statusStyle(theme)}>Free to audit</Typography>
      </Box>
    </Box>
  );
};

export default AuditorSearchListBox;

const mainContainer = {
  display: 'flex',
  alignItems: 'start',
  height: '60px',
  justifyContent: 'space-between',
  padding: '12px 12px 0px 30px',
  fontWeight: '600',
  borderBottom: '1px solid #434242',
  [theme.breakpoints.down('sm')]: {
    height: '35px',
    padding: '10px',
    gap: '10px',
    width: '100%',
  },
};

const statusContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  [theme.breakpoints.down('sm')]: {
    gap: '10px',
  },
};

const nameStyle = theme => ({
  fontWeight: '500px',
  width: {
    zero: '100%',
    sm: '150px',
    md: '150px',
    lg: '180px',
  },

  fontSize: {
    zero: '9px',
    sm: '14px',
    md: '14px',
    lg: '14px',
  },
});

const statusStyle = theme => ({
  fontWeight: '500',
  color: '#434242',

  display: {
    zero: 'none',
    sm: 'flex',
    md: 'flex',
    lg: 'flex',
  },
  fontSize: {
    zero: '8px',
    sm: '8px',
    md: '10px',
    lg: '10px',
  },
});

const circleStyle = theme => ({
  fontSize: '10px',
  color: '#09C010',

  display: {
    zero: 'none',
    sm: 'flex',
    md: 'flex',
    lg: 'flex',
  },
});
