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
import { addTestsLabel, encodeBase64url, isAuth } from '../../../lib/helper.js';
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
    const state = encodeBase64url(
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
                  sx={forgotBtnSx}
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

const forgotBtnSx = theme => ({
  textTransform: 'unset',
  mt: '25px',
  fontSize: '14px',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
  },
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
  fontWeight: 600,
  borderRadius: radiusOfComponents,
  maxWidth: '262px',
  fontSize: '20px',
  paddingY: '9px',
  width: '100%',
  textTransform: 'unset',
  [theme.breakpoints.down('xl')]: {
    fontSize: '18px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '225px',
    padding: '8px 0',
    fontSize: '14px',
  },
});

const fieldWrapper = theme => ({
  display: 'flex',
  gap: '28px',
  flexDirection: 'column',
  '& .password-wrapper, .field-wrapper': {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    '& p': {
      width: '130px',
    },
  },
  '& .field-wrapper label': {
    fontSize: '20px',
  },
  '& .field-wrapper input': {
    paddingY: '12px',
    fontSize: '20px',
  },
  '& .password-wrapper input': {
    paddingY: '12px',
    fontSize: '20px',
  },
  '& .password-wrapper label': {
    fontSize: '20px',
  },
  [theme.breakpoints.down('xl')]: {
    '& .field-wrapper label': {
      fontSize: '18px',
    },
    '& .password-wrapper label': {
      fontSize: '18px',
    },
  },
  [theme.breakpoints.down('md')]: {
    '& .field-wrapper input': {
      paddingY: '10px',
      fontSize: '18px',
    },
    '& .password-wrapper input': {
      paddingY: '10px',
      fontSize: '18px',
    },
    '& .password-wrapper,.field-wrapper': {
      '& label': {
        fontSize: '18px',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .field-wrapper input': {
      paddingY: '10px',
      fontSize: '14px',
    },
    '& .password-wrapper input': {
      paddingY: '10px',
      fontSize: '14px',
    },
    '& .field-wrapper label': {
      fontSize: '14px',
    },
    '& .password-wrapper label': {
      fontSize: '14px',
    },
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
