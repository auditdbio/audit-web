import React, { useState } from 'react';
import PasswordField from '../fields/password-field.jsx';
import {
  Box,
  Button,
  InputAdornment,
  Typography,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit.js';
import RemovedEyeIcon from '../../icons/removed-eye-icon.jsx';
import EyeIcon from '../../icons/eye-icon.jsx';
import {
  changePassword,
  clearUserError,
  clearUserSuccess,
} from '../../../redux/actions/userAction.js';
import { useDispatch, useSelector } from 'react-redux';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';

const ChangePasswordFormik = () => {
  const dispatch = useDispatch();
  const userId = useSelector(s => s.user.user.id);
  const message = useSelector(s => s.user.success);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordState, setPasswordState] = useState('');
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleChangePassword = () => {
    setPasswordState('');
    dispatch(changePassword(passwordState, userId));
  };
  return (
    <Box>
      <CustomSnackbar
        autoHideDuration={10000}
        open={!!message}
        onClose={() => dispatch(clearUserSuccess())}
        severity="success"
        text={message}
      />

      <Box sx={wrapper} className={'password-wrapper'}>
        <Typography sx={formLabelSx} variant={'body2'}>
          {'Password'}
        </Typography>
        <TextField
          placeholder={'● ● ● ● ● ● ●'}
          fullWidth={true}
          sx={fieldSx}
          disabled={false}
          onChange={e => setPasswordState(e.target.value)}
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
      <Button
        sx={passwordButtonSx}
        onClick={handleChangePassword}
        disabled={passwordState.length < 6}
      >
        <EditIcon />
        Change password
      </Button>
    </Box>
  );
};

export default ChangePasswordFormik;

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

const passwordButtonSx = theme => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: 0,
  marginLeft: 'auto',
  textTransform: 'unset',
  fontSize: '10px',
  gap: '5px',
  '& svg': {
    width: '14px',
  },
});
