import React, { useState } from 'react';
import { Box, Button, Modal, useMediaQuery } from '@mui/material';
import theme, { radiusOfComponents } from '../../../styles/themes.js';
import PasswordField from '../fields/password-field.jsx';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import SimpleField from '../fields/simple-field.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearUserError,
  clearUserSuccess,
  signIn,
} from '../../../redux/actions/userAction.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import RestorePassword from '../../RestorePassword.jsx';
import { addTestsLabel, isAuth } from '../../../lib/helper.js';

const SigninForm = () => {
  const dispatch = useDispatch();
  const error = useSelector(s => s.user.error);
  const [open, setOpen] = useState(false);
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const successMessage = useSelector(s => s.user.success);
  const initialValues = {
    email: '',
    password: '',
  };
  const handleClose = () => {
    setOpen(false);
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
                open={!!error || !!successMessage}
                onClose={() => {
                  dispatch(clearUserError());
                  dispatch(clearUserSuccess());
                }}
                severity={successMessage ? 'success' : 'error'}
                text={error || successMessage}
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
                  sx={submitButton}
                  {...addTestsLabel('sign-in-button')}
                  disabled={isAuth()}
                >
                  Sign in
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
  backgroundColor: theme.palette.secondary.main,
  padding: '11px 140px',
  color: '#FCFAF6',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.2,
  borderRadius: radiusOfComponents,
  maxWidth: '402px',
  margin: '0 auto',
  paddingY: '11px',
  [theme.breakpoints.down('sm')]: {
    width: '225px',
    padding: '13px 80px',
    fontSize: '12px',
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
