import React from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import SimpleField from '../forms/fields/simple-field.jsx';
import { TextField } from 'formik-mui';
import { addTestsLabel, isAuth } from '../../lib/helper.js';
import { FastField, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  mergeAccount,
  mergeCurrentAccount,
} from '../../redux/actions/auditorAction.js';
import { signUp } from '../../redux/actions/userAction.js';
import * as Yup from 'yup';
import PasswordField from '../forms/fields/password-field.jsx';
import theme from '../../styles/themes.js';

const MergeModal = ({ secret }) => {
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={MergeSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={values => {
        dispatch(mergeAccount(values, secret));
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Box sx={modalInnerWrapper}>
            <Typography>Please enter your account email for merging</Typography>
            <SimpleField
              size={!matchMd ? 'medium' : 'small'}
              name="email"
              label="Email"
              emptyPH
            />
            <PasswordField
              size={!matchMd ? 'medium' : 'small'}
              name="password"
              label="Password"
            />
            <Button variant={'contained'} type={'submit'} sx={btnStyle}>
              Merge
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default MergeModal;

const MergeSchema = Yup.object().shape({
  password: Yup.string().min(2, 'Too Short!').required('Required'),
  email: Yup.string().email('Invalid email').required('required'),
});

const btnStyle = theme => ({
  fontWeight: '600',
  fontSize: '18px',
});

const modalInnerWrapper = theme => ({
  width: 400,
  bgcolor: '#fcfaf6',
  borderRadius: '10px',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  p: 4,
  [theme.breakpoints.down(430)]: {
    width: '330px',
  },
});
