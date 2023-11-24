import React, { useState } from 'react';
import SimpleField from '../forms/fields/simple-field.jsx';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import theme from '../../styles/themes.js';
import { FastField, useField } from 'formik';
import { TextField } from 'formik-mui';
import { addTestsLabel } from '../../lib/helper.js';

const FieldEditor = ({ name, label, handleBlur }) => {
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
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
      <Box sx={[wrapper]} className={'field-wrapper'}>
        <FastField
          component={TextField}
          name={name}
          label={label}
          // fullWidth={true}
          disabled={false}
          sx={fieldSx}
          // size={matchMd ? 'small' : 'medium'}
          inputProps={{ ...addTestsLabel(`${name}-input`) }}
          onBlur={handleBlur}
        />
      </Box>
    </Box>
  );
};

export default FieldEditor;

const wrapper = theme => ({
  // display: 'flex',
  // gap: '28px',
  // flexDirection: 'column',
  '& p.Mui-error': {
    display: 'none',
  },
});

const formLabelSx = theme => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '24px',
  color: '#434242',
  [theme.breakpoints.down('lg')]: {
    fontSize: '14px',
  },
});

const fieldSx = theme => ({
  // '& input': {
  //   paddingLeft: '35px',
  // },
  '& input': {
    fontSize: '22px',
  },
  // [theme.breakpoints.up('sm')]: {
  //   '& input': {
  //     fontSize: '18px',
  //   },
  //   '& textarea': {
  //     fontSize: '18px',
  //   },
  //   '& .MuiFormLabel-root,.MuiInputLabel-root': {
  //     fontSize: '18px',
  //   },
  // },
});
