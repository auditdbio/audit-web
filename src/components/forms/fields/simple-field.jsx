import React from 'react';
import { Box, Typography } from '@mui/material';
import { FastField } from 'formik';
import { TextField } from 'formik-mui';
import { addTestsLabel } from '../../../lib/helper.js';

const SimpleField = ({
  name,
  label,
  size = 'medium',
  emptyPH = false,
  outerLabel = false,
  sx = {},
  ...props
}) => {
  return (
    <Box sx={[wrapper, sx]} className={'field-wrapper'}>
      {outerLabel && (
        <Typography variant={'body2'} sx={formLabelSx}>
          {label}
        </Typography>
      )}
      <FastField
        component={TextField}
        name={name}
        label={label}
        placeholder={!emptyPH ? '● ● ● ● ● ● ●' : ''}
        fullWidth={true}
        disabled={false}
        sx={[fieldSx, sx]}
        size={size}
        inputProps={{ ...addTestsLabel(`${name}-input`) }}
        {...props}
      />
    </Box>
  );
};

export default SimpleField;

const wrapper = theme => ({
  display: 'flex',
  gap: '28px',
  flexDirection: 'column',
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
  '& input': {
    paddingLeft: '35px',
  },
  [theme.breakpoints.up('sm')]: {
    '& input': {
      fontSize: '18px',
    },
    '& textarea': {
      fontSize: '18px',
    },
    '& .MuiFormLabel-root,.MuiInputLabel-root': {
      fontSize: '18px',
    },
  },
});
