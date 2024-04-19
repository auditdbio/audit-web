import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit.js';
import {
  changePassword,
  clearUserError,
  clearUserSuccess,
} from '../../../redux/actions/userAction.js';
import { useDispatch, useSelector } from 'react-redux';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../../../lib/helper.js';
import PasswordField from '../fields/password-field.jsx';
import { AUDITOR } from '../../../redux/actions/types.js';
import theme from '../../../styles/themes.js';

const ChangePasswordFormik = () => {
  const dispatch = useDispatch();
  const { user, success, error } = useSelector(s => s.user);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (success) {
      setEditMode(false);
    }
  }, [success]);

  return (
    <Box sx={{ textAlign: 'center', mt: '5px' }}>
      <CustomSnackbar
        autoHideDuration={10000}
        open={!!error || !!success}
        onClose={() => {
          dispatch(clearUserSuccess());
          dispatch(clearUserError());
        }}
        severity={error ? 'error' : 'success'}
        text={error || success}
      />

      <Dialog open={editMode} onClose={() => setEditMode(false)} sx={modalSx}>
        <DialogTitle sx={{ padding: '16px 70px' }}>
          Set a new password
        </DialogTitle>
        <Formik
          initialValues={{
            current_password: '',
            password: '',
            confirm_password: '',
          }}
          validationSchema={validationSchema(user?.is_passwordless)}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={values => {
            dispatch(changePassword(values, user.id));
          }}
        >
          {({ handleSubmit, dirty, errors }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Box sx={wrapper}>
                  <Box sx={fieldsWrapper}>
                    {!user?.is_passwordless && (
                      <PasswordField
                        name="current_password"
                        label="Current password"
                      />
                    )}
                    <PasswordField name="password" label="New password" />
                    <PasswordField
                      name="confirm_password"
                      label="Confirm password"
                    />
                    {(errors.confirm_password || errors.password) && (
                      <Typography
                        sx={{
                          color: `${theme.palette.error.main}!important`,
                          fontSize: '14px',
                        }}
                      >
                        {errors.confirm_password || errors.password}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Button
                      sx={passwordButtonSx}
                      type="button"
                      onClick={() => setEditMode(false)}
                      {...addTestsLabel('cancel-password-button')}
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={passwordButtonSx}
                      type="submit"
                      disabled={!dirty}
                      {...addTestsLabel('change-password-button')}
                    >
                      <EditIcon />
                      {user?.is_passwordless
                        ? 'Set password'
                        : 'Change password'}
                    </Button>
                  </Box>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Dialog>

      <Button
        color={user?.current_role === AUDITOR ? 'secondary' : 'primary'}
        onClick={() => setEditMode(true)}
      >
        {user?.is_passwordless ? 'Set password' : 'Change password'}
      </Button>
    </Box>
  );
};

export default ChangePasswordFormik;

const validationSchema = isPassworless =>
  Yup.object().shape({
    current_password: isPassworless
      ? Yup.string()
      : Yup.string().required('Required'),
    password: Yup.string().min(6, 'Password too Short!').required('Required'),
    confirm_password: Yup.string()
      .required()
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

const wrapper = theme => ({
  width: '450px',
  margin: '0 auto',
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});

const modalSx = theme => ({
  '& .MuiPaper-root': {
    padding: '20px 30px',
    [theme.breakpoints.down('xs')]: {
      padding: '20px 15px',
    },
    '& h2': {
      textAlign: 'center',
      color: '#434242',
      [theme.breakpoints.down('xs')]: {
        padding: '10px',
        fontSize: '15px',
      },
    },
  },
});

const fieldsWrapper = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  mb: '10px',
};

const passwordButtonSx = {
  display: 'flex',
  alignItems: 'center',
  textTransform: 'unset',
  fontSize: '10px',
  gap: '5px',
  '& svg': {
    width: '14px',
  },
};
