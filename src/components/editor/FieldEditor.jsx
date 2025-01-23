import React from 'react';
import { Box } from '@mui/material';
import { FastField, useField } from 'formik';
import { TextField } from 'formik-mui';
import { addTestsLabel } from '../../lib/helper.js';

const FieldEditor = ({ name, label, handleBlur, disabled }) => {
  const [field, meta, fieldHelper] = useField(name);
  const handleChange = e => {
    fieldHelper.setValue(e.target.value);
  };

  return (
    <Box sx={fieldWrapper}>
      <Box sx={[wrapper]} className={'field-wrapper'}>
        <FastField
          component={TextField}
          name={name}
          label={label}
          disabled={!!disabled}
          sx={[
            fieldSx,
            !field.value && meta.touched
              ? { '& fieldset': { borderColor: 'red' } }
              : {},
          ]}
          size={'small'}
          onChange={e => {
            handleChange(e);
          }}
          inputProps={{ ...addTestsLabel(`${name}-input`) }}
          onBlur={() => {
            handleBlur();
          }}
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
  '& p.Mui-error': {
    display: 'none',
  },
});

const fieldWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: '390px',
  gap: '15px',
  width: '100%',
  [theme.breakpoints.down('xs')]: {
    minWidth: 'unset',
  },
});

const fieldSx = theme => ({
  '& input': {
    fontSize: '22px',
    paddingY: '8px',
  },
});
