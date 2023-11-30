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
  const [field, meta, fieldHelper] = useField(name);
  const handleChange = e => {
    fieldHelper.setValue(e.target.value);
    handleBlur();
  };

  return (
    <Box sx={fieldWrapper}>
      <Box sx={[wrapper]} className={'field-wrapper'}>
        <FastField
          component={TextField}
          name={name}
          label={label}
          // fullWidth={true}
          disabled={false}
          sx={[
            fieldSx,
            !field.value && meta.touched
              ? { '& fieldset': { borderColor: 'red' } }
              : {},
          ]}
          onChange={e => {
            handleChange(e);
          }}
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
  width: '100%',
  '& .MuiFormControl-root': {
    width: '100%',
  },
  // display: 'flex',
  // gap: '28px',
  // flexDirection: 'column',
  '& p.Mui-error': {
    display: 'none',
  },
});

const fieldWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: '390px',
  gap: '15px',
  height: '58px',
  width: '100%',
  [theme.breakpoints.down('xs')]: {
    minWidth: 'unset',
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
