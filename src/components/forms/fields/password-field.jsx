import { Box, InputAdornment, Typography } from '@mui/material';
import { Field, useField } from 'formik';
import { TextField } from 'formik-mui';
import React, { useState } from 'react';
import EyeIcon from '../../icons/eye-icon.jsx';
import RemovedEyeIcon from '../../icons/removed-eye-icon.jsx';

const PasswordField = ({ name, label }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={wrapper} className={'password-wrapper'}>
      <Typography sx={formLabelSx} variant={'body2'}>
        {label}
      </Typography>
      <Field
        component={TextField}
        placeholder={'● ● ● ● ● ● ●'}
        fullWidth={true}
        sx={fieldSx}
        name={name}
        disabled={false}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment
              sx={{ cursor: 'pointer' }}
              position="end"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <RemovedEyeIcon /> : <EyeIcon />}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default PasswordField;

const wrapper = theme => ({
  display: 'flex',
  gap: '28px',
  flexDirection: 'column',
  '& p.Mui-error': {
    display: 'none',
  },
});

const fieldSx = theme => ({
  '& input': {
    paddingLeft: '35px',
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
