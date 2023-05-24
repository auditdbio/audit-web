import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  useMediaQuery,
} from '@mui/material';
import theme, { radiusOfComponents } from '../../../styles/themes.js';
import PasswordField from '../fields/password-field.jsx';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import SimpleField from '../fields/simple-field.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserError, signUp } from '../../../redux/actions/userAction.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../../../lib/helper.js';

const SignupForm = () => {
  const [isAuditor, setIsAuditor] = useState('auditor');
  const dispatch = useDispatch();
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const error = useSelector(s => s.user.error);
  const initialValues = {
    current_role: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={values => {
        const newValue = { ...values, current_role: isAuditor };
        dispatch(signUp(newValue));
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Box sx={formStyle}>
            <Typography sx={titleStyle}>Choose who you want to be</Typography>
            <CustomSnackbar
              autoHideDuration={10000}
              open={!!error}
              onClose={() => dispatch(clearUserError())}
              severity="error"
              text={error}
            />
            <Tabs
              value={isAuditor}
              onChange={(e, newValue) => {
                setIsAuditor(newValue);
              }}
              name="role"
              sx={tabsSx}
              indicatorColor="none"
            >
              <Tab
                value="auditor"
                sx={[
                  isAuditor === 'auditor'
                    ? auditorTabSx
                    : { backgroundColor: '#D9D9D9' },
                  tabSx,
                ]}
                label="Auditor"
                {...addTestsLabel('auditor-button')}
              />
              <Tab
                value="customer"
                sx={[
                  isAuditor === 'customer'
                    ? customerTabSx
                    : { backgroundColor: '#D9D9D9' },
                  tabSx,
                ]}
                label="Customer"
                {...addTestsLabel('customer-button')}
              />
            </Tabs>
            <Box sx={fieldsWrapper}>
              <Box sx={fieldWrapper}>
                <SimpleField
                  size={!matchMd ? 'medium' : 'small'}
                  name="name"
                  label="User name"
                  emptyPH
                />
                <SimpleField
                  size={!matchMd ? 'medium' : 'small'}
                  name="email"
                  label="E-mail"
                  emptyPH
                />
              </Box>
              <Box sx={fieldWrapper}>
                <PasswordField
                  size={!matchMd ? 'medium' : 'small'}
                  name="password"
                  label="Password"
                />
                <PasswordField
                  size={!matchMd ? 'medium' : 'small'}
                  name="confirmPassword"
                  label="Confirm password"
                />
              </Box>
            </Box>
            <Button
              type="submit"
              sx={submitButton}
              variant="contained"
              {...addTestsLabel('sign-up-button')}
            >
              Sing up
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;

const SignupSchema = Yup.object().shape({
  password: Yup.string().min(2, 'Too Short!').required('Required'),
  email: Yup.string().email('Invalid email').required('required'),
  name: Yup.string().required('Required'),
  current_role: Yup.string(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const titleStyle = theme => ({
  fontWeight: 500,
  fontSize: '20px',
  lineHeight: '24px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: '16px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
});

const submitButton = theme => ({
  backgroundColor: theme.palette.secondary.main,
  padding: '15px 140px',
  color: '#FCFAF6',
  fontSize: '25px',
  fontWeight: 600,
  borderRadius: radiusOfComponents,
  maxWidth: '402px',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    fontSize: '20px',
    lineHeight: '23px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
    width: '230px',
    padding: '12px 60px',
  },
});

const formStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  alignItems: 'center',
  width: '100%',
  gap: '80px',
  [theme.breakpoints.down('md')]: {
    gap: '60px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '32px',
  },
});

const fieldsWrapper = theme => ({
  display: 'flex',
  width: '100%',
  gap: '70px',
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    gap: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
});

const fieldWrapper = theme => ({
  display: 'flex',
  gap: '28px',
  flexDirection: 'column',
  width: '50%',
  '& .password-wrapper, .field-wrapper': {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    '& p': {
      width: '130px',
    },
  },
  [theme.breakpoints.down('md')]: {
    '& .password-wrapper,.field-wrapper': {
      '& label': {
        fontSize: '18px',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    gap: '16px',
    '& .password-wrapper, .field-wrapper': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '16px',
      '& p': {
        width: 'unset',
      },
      '& label': {
        fontSize: '15px',
      },
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& p': {
      fontSize: '12px',
    },
  },
});

const tabsSx = theme => ({
  marginBottom: 0,
  width: '420px',
  marginTop: '-50px',
  [theme.breakpoints.down('md')]: {
    width: '320px',
    marginTop: '-20px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '250px',
    marginTop: '-10px',
  },
});

const tabSx = theme => ({
  width: '50%',
  color: '#222222',
  fontSize: '16px',
  textTransform: 'capitalize',
  [theme.breakpoints.down('md')]: {
    minHeight: '41px',
    height: '41px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
});

const auditorTabSx = theme => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#FCFAF6!important',
});

const customerTabSx = theme => ({
  color: '#FCFAF6!important',
  backgroundColor: theme.palette.primary.main,
});
