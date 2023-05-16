import React, { useState } from 'react';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import {
  clearUserError,
  clearUserSuccess,
  restorePassword,
  signIn,
} from '../redux/actions/userAction.js';
import { Form, Formik } from 'formik';
import { Box, Button, Typography } from '@mui/material';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import PasswordField from '../components/forms/fields/password-field.jsx';
import * as Yup from 'yup';
import { radiusOfComponents } from '../styles/themes.js';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addTestsLabel } from '../lib/helper.js';

const RestorePasswordPage = () => {
  const dispatch = useDispatch();
  const error = useSelector(s => s.user.error);
  const successMessage = useSelector(s => s.user.success);
  const params = useParams();

  const initialValues = {
    code: params.token || '',
    confirmPassword: '',
    password: '',
  };

  return (
    <Layout>
      <CustomCard sx={cardWrapper}>
        <Formik
          initialValues={initialValues}
          validationSchema={RestorePasswordSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={values => {
            dispatch(restorePassword(values));
          }}
        >
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Box sx={formWrapper}>
                  <CustomSnackbar
                    autoHideDuration={7000}
                    open={!!error || !!successMessage}
                    onClose={() => {
                      dispatch(clearUserError());
                      dispatch(clearUserSuccess());
                    }}
                    severity={successMessage ? 'success' : 'error'}
                    text={error || successMessage}
                  />
                  <Typography variant={'h5'} sx={{ fontWeight: 600 }}>
                    Set a new password
                  </Typography>
                  <Box sx={fieldWrapper}>
                    <PasswordField name={'password'} label={'New password'} />
                    <PasswordField
                      name={'confirmPassword'}
                      label={'Confirm password'}
                    />
                  </Box>
                  <Button
                    type={'submit'}
                    variant={'contained'}
                    sx={submitButton}
                    {...addTestsLabel('change-password-button')}
                  >
                    Change password
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomCard>
    </Layout>
  );
};

export default RestorePasswordPage;

const cardWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px 40px',
  [theme.breakpoints.down('sm')]: {
    paddingY: '78px',
  },
});

const RestorePasswordSchema = Yup.object().shape({
  password: Yup.string().min(2, 'Too Short!').required('required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const formWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  gap: '75px',
  [theme.breakpoints.down('xs')]: {
    gap: '60px',
  },
});

const submitButton = theme => ({
  backgroundColor: theme.palette.secondary.main,
  padding: '11px 25px',
  color: '#FCFAF6',
  fontWeight: 600,
  borderRadius: radiusOfComponents,
  margin: '0 auto',
  fontSize: '16px',
  paddingY: '11px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
    padding: '10px 18px',
  },
  [theme.breakpoints.down('sm')]: {},
});

const fieldWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    '& .MuiInputBase-root': {
      height: '44px',
      '& input': {
        paddingY: '7px',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    '& .password-wrapper, .field-wrapper': {
      gap: '16px',
    },
  },
});
