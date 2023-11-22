import React, { useState } from 'react';
import SimpleField from '../forms/fields/simple-field.jsx';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import theme from '../../styles/themes.js';
import { useField } from 'formik';

const FieldEditor = ({ name, label }) => {
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const [editMode, setEditMode] = useState(false);
  const [fieldValue] = useField(name);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        maxWidth: '500px',
        gap: '15px',
        height: '58px',
      }}
    >
      <SimpleField
        size={matchMd ? 'small' : 'medium'}
        name={name}
        label={label}
        emptyPH
        sx={{ width: '100%' }}
      />
    </Box>
  );
};

export default FieldEditor;

const titleSx = theme => ({
  width: '100%',
  fontSize: '24px',
  [theme.breakpoints.down('md')]: {
    fontSize: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    // fontSize: '16px',
  },
});
