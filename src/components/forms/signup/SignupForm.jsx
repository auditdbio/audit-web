import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom/dist';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  useMediaQuery,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import theme, { radiusOfComponents } from '../../../styles/themes.js';
import PasswordField from '../fields/password-field.jsx';
import SimpleField from '../fields/simple-field.jsx';
import { clearUserError, signUp } from '../../../redux/actions/userAction.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel, isAuth } from '../../../lib/helper.js';
import RoleModal from '../../modal/RoleModal.jsx';
import { AUDITOR, CUSTOMER } from '../../../redux/actions/types.js';
import { BASE_URL, GITHUB_CLIENT_ID } from '../../../services/urls.js';

const SignupForm = () => {
  const dispatch = useDispatch();
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));

  const [searchParams] = useSearchParams();
  const error = useSelector(s => s.user.error);

  const [open, setOpen] = useState(() => searchParams.get('select_role'));
  const [currentRole, setCurrentRole] = useState('auditor');
  const [isAuditor, setIsAuditor] = useState(AUDITOR);

  const initialValues = {
    current_role: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleAuthGithub = () => {
    const state = encodeURIComponent(
      JSON.stringify({
        service: 'GitHub',
        auth: true,
        role: isAuditor,
      }),
    );
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${BASE_URL}oauth/callback&scope=read:user,user:email&state=${state}`,
      '_self',
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignupSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={values => {
        const newValue = { ...values, current_role: currentRole };
        dispatch(signUp(newValue));
      }}
    >
      {({ handleSubmit, errors }) => (
        <Form onSubmit={handleSubmit}>
          <Box sx={formStyle}>
            <Typography sx={titleStyle}>Choose who you want to be</Typography>
            <CustomSnackbar
              autoHideDuration={10000}
              open={!!error || !!Object.keys(errors).length}
              onClose={() => dispatch(clearUserError())}
              severity="error"
              text={error || Object.values(errors)[0]}
            />
            <Tabs
              value={currentRole}
              onChange={(e, newValue) => {
                setCurrentRole(newValue);
              }}
              name="role"
              sx={tabsSx}
              indicatorColor="none"
            >
              <Tab
                value={AUDITOR}
                sx={[
                  currentRole === AUDITOR
                    ? auditorTabSx
                    : { backgroundColor: '#D9D9D9' },
                  tabSx,
                ]}
                label="Auditor"
                {...addTestsLabel('auditor-button')}
              />
              <Tab
                value={CUSTOMER}
                sx={[
                  currentRole === CUSTOMER
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '25px',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Button
                type="submit"
                sx={submitButton}
                color="secondary"
                variant="contained"
                disabled={isAuth()}
                {...addTestsLabel('sign-up-button')}
              >
                Sign up
              </Button>
              <Button
                sx={[submitButton, { paddingX: '0' }]}
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                <GitHubIcon sx={{ marginRight: '15px' }} />
                Sign up with Github
              </Button>
            </Box>
            {open && (
              <RoleModal
                onClose={() => setOpen(false)}
                onConfirm={handleAuthGithub}
                role={isAuditor}
                setRole={setIsAuditor}
              />
            )}
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password is too short')
    .required('Password is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  name: Yup.string()
    .required('Username is required')
    .matches(
      /^[A-Za-z0-9_-]+$/,
      'Username may only contain alphanumeric characters, hyphens or underscore',
    ),
  current_role: Yup.string(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const titleStyle = theme => ({
  fontWeight: 500,
  fontSize: '16px !important',
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
  padding: '11px 0',
  color: '#FCFAF6',
  fontWeight: 600,
  borderRadius: radiusOfComponents,
  maxWidth: '262px',
  fontSize: '16px',
  paddingY: '11px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    width: '225px',
    padding: '8px 0',
    fontSize: '14px',
  },
});

const formStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  alignItems: 'center',
  width: '100%',
  gap: '50px',
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
  width: '340px',
  marginTop: '-20px',
  [theme.breakpoints.down('md')]: {
    width: '320px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '250px',
    marginTop: '-10px',
  },
});

const tabSx = theme => ({
  height: '40px',
  minHeight: '40px',
  width: '50%',
  color: '#222222',
  fontSize: '16px',
  textTransform: 'capitalize',
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
