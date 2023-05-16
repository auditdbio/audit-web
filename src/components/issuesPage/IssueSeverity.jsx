import React from 'react';
import { Chip } from '@mui/material';

const IssueSeverity = ({ text }) => {
  const defineColor = () => {
    switch (text) {
      case 'Critical':
        return '#FF0000';
      case 'Major':
        return '#FF9900';
      case 'Medium':
        return '#5b97bb';
      case 'Minor':
        return '#09C010';
      default:
        return '#CCC';
    }
  };

  return (
    <Chip
      label={text}
      sx={{
        color: 'white',
        backgroundColor: defineColor(),
      }}
    />
  );
};

export default IssueSeverity;
