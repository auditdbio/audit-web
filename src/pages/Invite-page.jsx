import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { CustomCard } from '../components/custom/Card.jsx';
import { Box, Button, ClickAwayListener, Typography } from '@mui/material';
import Layout from '../styles/Layout.jsx';
import { radiusOfComponents } from '../styles/themes.js';
import { signUp } from '../redux/actions/userAction.js';
import SimpleField from '../components/forms/fields/simple-field.jsx';
import PasswordField from '../components/forms/fields/password-field.jsx';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import SubmitModal from '../components/modal/Submit-modal.jsx';
import MergeModal from '../components/modal/Merge-modal.jsx';
import { mergeCurrentAccount } from '../redux/actions/auditorAction.js';

const InvitePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auditor.auditor);
  const { id, secret } = useParams();
  const [isOpenSubmit, setIsOpenSubmit] = useState(false);
  const [isOpenMerge, setIsOpenMerge] = useState(false);
  const initialValues = {
    current_role: 'auditor',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleMerge = () => {
    isAuth()
      ? dispatch(mergeCurrentAccount(user, secret))
      : setIsOpenMerge(true);
  };

  return (
    <Layout>
      <CustomCard sx={cardWrapper}>
        <Formik
          initialValues={initialValues}
          validationSchema={SignupSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={values => {
            const newValues = { ...values, secret };
            dispatch(signUp(newValues));
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Box sx={formStyle}>
                <Box sx={fieldsWrapper}>
                  <Box sx={fieldWrapper}>
                    <SimpleField
                      size="small"
                      name="name"
                      label="User name"
                      emptyPH
                    />
                    <SimpleField
                      size="small"
                      name="email"
                      label="E-mail"
                      emptyPH
                    />
                  </Box>
                  <Box sx={fieldWrapper}>
                    <PasswordField
                      size="small"
                      name="password"
                      label="Password"
                    />
                    <PasswordField
                      size="small"
                      name="confirmPassword"
                      label="Confirm password"
                    />
                  </Box>
                </Box>
                <Box sx={buttonWrapper}>
                  <Button
                    type="button"
                    sx={[submitButton, { bgColor: `#FF9900!important` }]}
                    variant="contained"
                    onClick={() => setIsOpenSubmit(true)}
                    {...addTestsLabel('sign-up-button')}
                  >
                    Sing up
                  </Button>
                  <Typography>or</Typography>
                  <Button
                    type="button"
                    sx={submitButton}
                    variant="contained"
                    onClick={handleMerge}
                    {...addTestsLabel('sign-up-button')}
                  >
                    Merge in your account
                  </Button>
                </Box>
              </Box>
              {isOpenSubmit && (
                <Box sx={modalWrapper}>
                  <ClickAwayListener onClickAway={() => setIsOpenSubmit(false)}>
                    <Box>
                      <SubmitModal
                        handleSubmit={handleSubmit}
                        close={() => setIsOpenSubmit(false)}
                      />
                    </Box>
                  </ClickAwayListener>
                </Box>
              )}
            </Form>
          )}
        </Formik>
        {isOpenMerge && (
          <Box sx={modalWrapper}>
            <ClickAwayListener onClickAway={() => setIsOpenMerge(false)}>
              <Box>
                <MergeModal secret={secret} />
              </Box>
            </ClickAwayListener>
          </Box>
        )}
      </CustomCard>
    </Layout>
  );
};

export default InvitePage;

const SignupSchema = Yup.object().shape({
  password: Yup.string().min(2, 'Too Short!').required('Required'),
  email: Yup.string().email('Invalid email').required('required'),
  name: Yup.string().required('Required'),
  current_role: Yup.string(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const modalWrapper = theme => ({
  position: 'fixed',
  overflow: 'hidden',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  right: 0,
  bottom: 0,
  bgcolor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: '999',
});

const cardWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '50px 100px',
  '& form': {
    width: '100%',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '30px 50px',
  },
});

const buttonWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px',
  [theme.breakpoints.down('sm')]: {
    gap: '5px',
  },
});

const submitButton = theme => ({
  backgroundColor: theme.palette.secondary.main,
  padding: '15px',
  color: '#FCFAF6',
  fontSize: '14px',
  width: '100%',
  fontWeight: 600,
  lineHeight: 1.2,
  borderRadius: radiusOfComponents,
  maxWidth: '402px',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px!important',
    width: '240px',
    padding: '12px',
  },
});

const formStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  alignItems: 'center',
  width: '100%',
  gap: '50px',
  [theme.breakpoints.down('md')]: {
    gap: '40px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '32px',
  },
});

const fieldsWrapper = theme => ({
  display: 'flex',
  width: '100%',
  gap: '28px',
  flexDirection: 'column',
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
  width: '100%',
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
