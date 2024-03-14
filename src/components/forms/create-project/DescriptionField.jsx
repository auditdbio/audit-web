import React from 'react';
import { Box, Typography } from '@mui/material';
import { Field } from 'formik';
import { TextField } from 'formik-mui';
import { addTestsLabel } from '../../../lib/helper.js';

const DescriptionField = ({ name, label }) => {
  return (
    <Box sx={wrapper} className="field-wrapper">
      <Typography variant="body2" sx={formLabelSx}>
        {label}
      </Typography>
      <Field
        component={TextField}
        maxRows="5"
        minRows="4"
        multiline
        name={name}
        placeholder=""
        fullWidth={true}
        disabled={false}
        sx={fieldSx}
        inputProps={{
          ...addTestsLabel(`${name}-input`),
        }}
      />
    </Box>
  );
};

export default DescriptionField;

const wrapper = {
  display: 'flex',
  gap: '10px',
  flexDirection: 'column',
  '& p.Mui-error': {
    display: 'none',
  },
  height: '100%',
  '& .MuiInputBase-root': {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
  },
};

const formLabelSx = theme => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '24px',
  color: '#434242',
  [theme.breakpoints.down('lg')]: {
    fontSize: '14px',
  },
});

const fieldSx = {
  '& div': {
    paddingLeft: '15px',
    paddingRight: '5px',
  },
  '& textarea': {
    paddingRight: '10px',
  },
  height: '100%',
};
