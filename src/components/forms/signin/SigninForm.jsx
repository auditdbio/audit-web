import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Modal, useMediaQuery } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';
import theme, { radiusOfComponents } from '../../../styles/themes.js';
import PasswordField from '../fields/password-field.jsx';
import SimpleField from '../fields/simple-field.jsx';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import RestorePassword from '../../RestorePassword.jsx';
import { addTestsLabel, isAuth } from '../../../lib/helper.js';
import {
  clearUserError,
  clearUserSuccess,
  signIn,
} from '../../../redux/actions/userAction.js';
import { BASE_URL, GITHUB_CLIENT_ID } from '../../../services/urls.js';

const SigninForm = () => {
  const dispatch = useDispatch();
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const { error, success } = useSelector(s => s.user);
  const [open, setOpen] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAuthGithub = () => {
    const state = encodeURIComponent(
      JSON.stringify({
        service: 'GitHub',
        auth: true,
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
      validationSchema={SigninSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={values => {
        dispatch(signIn(values));
      }}
    >
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Box sx={formWrapper}>
              <CustomSnackbar
                autoHideDuration={7000}
                open={!!error || !!success}
                onClose={() => {
                  dispatch(clearUserError());
                  dispatch(clearUserSuccess());
                }}
                severity={success ? 'success' : 'error'}
                text={error || success}
              />
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={modalWrapper}>
                  <RestorePassword onClose={handleClose} />
                </Box>
              </Modal>
              <Box sx={fieldWrapper}>
                <SimpleField
                  size={!matchMd ? 'medium' : 'small'}
                  name="email"
                  label="E-mail"
                  emptyPH
                />
                <PasswordField
                  size={!matchMd ? 'medium' : 'small'}
                  name="password"
                  label="Password"
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={submitButton}
                  {...addTestsLabel('sign-in-button')}
                  disabled={isAuth()}
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  type="button"
                  sx={[submitButton, { mt: '25px' }]}
                  variant="contained"
                  onClick={handleAuthGithub}
                >
                  <GitHubIcon sx={{ marginRight: '15px' }} />
                  Sign in with Github
                </Button>
                <Button
                  type="button"
                  variant="text"
                  sx={{ textTransform: 'unset', mt: '25px', fontSize: '12px' }}
                  onClick={() => setOpen(true)}
                  disabled={isAuth()}
                  {...addTestsLabel('forgot-password-button')}
                >
                  Forgot password
                </Button>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SigninForm;

const SigninSchema = Yup.object().shape({
  password: Yup.string().min(2, 'Too Short!').required('required'),
  email: Yup.string().email('Invalid email').required('required'),
});

const modalWrapper = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
  [theme.breakpoints.down('xs')]: {
    width: '330px',
  },
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
  padding: '11px 0',
  color: '#FCFAF6',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.2,
  borderRadius: radiusOfComponents,
  maxWidth: '402px',
  margin: '0 auto',
  paddingY: '11px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    width: '225px',
    padding: '8px 0',
    fontSize: '14px',
  },
});

const fieldWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    '& .password-wrapper,.field-wrapper': {
      '& label': {
        fontSize: '18px',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    '& .password-wrapper, .field-wrapper': {
      gap: '16px',
      '& label': {
        fontSize: '15px',
      },
    },
  },
});
