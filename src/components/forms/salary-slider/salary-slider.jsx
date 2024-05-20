import React from 'react';
import { Box, InputAdornment, Slider } from '@mui/material';
import { FastField, useField } from 'formik';
import { TextField } from 'formik-mui';
import { useSelector } from 'react-redux';
import { CUSTOMER } from '../../../redux/actions/types.js';

const SalarySlider = ({ min = 0, max = 100, name }) => {
  const role = useSelector(s => s.user.user.current_role);
  const [taxField, , taxFieldHelper] = useField(name);

  const handleChange = e => {
    let { value } = e.target;
    if (value > 100) {
      value = 100;
    } else if (value < 0) {
      value = 0;
    }
    taxFieldHelper.setValue(Math.trunc(value).toString());
  };

  return (
    <Box sx={sliderWrapper} className="salary-slider">
      <Slider
        value={+taxField.value}
        multiple
        name={taxField.name}
        valueLabelDisplay="off"
        sx={sliderSx}
        min={min}
        max={max}
        color={role === CUSTOMER ? 'primary' : 'secondary'}
        onChange={handleChange}
      />
      <FastField
        component={TextField}
        name={taxField.name}
        type="number"
        sx={infoWrapper}
        size="small"
        onChange={handleChange}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
      />
    </Box>
  );
};

export default SalarySlider;

export const sliderWrapper = {
  display: 'flex',
  alignItems: 'center',
  gap: '34px',
};

const sliderSx = {
  height: '9px',
  '& .MuiSlider-track, .MuiSlider-rail': {
    backgroundColor: '#B9B9B9',
    border: 'none',
  },
};

const infoWrapper = {
  width: '100px',
  '& .MuiOutlinedInput-input': {
    fontSize: '16px',
    textAlign: 'center',
    '&[type=number]': { '-moz-appearance': 'textfield' },
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
    },
  },
};
