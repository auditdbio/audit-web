import React, { useState } from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  useMediaQuery,
  ClickAwayListener,
  Typography,
} from '@mui/material';
import theme, { radiusOfComponents } from '../styles/themes.js';
import { signUp } from '../redux/actions/userAction.js';
import { Form, Formik } from 'formik';
import SimpleField from '../components/forms/fields/simple-field.jsx';
import PasswordField from '../components/forms/fields/password-field.jsx';
import { addTestsLabel } from '../lib/helper.js';
import * as Yup from 'yup';
import SubmitModal from '../components/modal/Submit-modal.jsx';
import MergeModal from '../components/modal/Merge-modal.jsx';
import { useParams } from 'react-router-dom';
//
const InvitePage = () => {
  const dispatch = useDispatch();
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const error = useSelector(s => s.user.error);
  const { id, secret } = useParams();
  const [isOpenSubmit, setIsOpenSubmit] = useState(false);
  const [isOpenMerge, setIsOpenMerge] = useState(false);
  const initialValues = {
    current_role: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
            dispatch(signUp(values));
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Box sx={formStyle}>
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
                    alignItems: 'center',
                    gap: '15px',
                  }}
                >
                  <Button
                    type="button"
                    sx={[submitButton, { bgColor: `#FF9900!important` }]}
                    variant={'contained'}
                    onClick={() => setIsOpenSubmit(true)}
                    {...addTestsLabel('sign-up-button')}
                  >
                    Sing up
                  </Button>
                  <Typography>or</Typography>
                  <Button
                    type="button"
                    sx={submitButton}
                    variant={'contained'}
                    onClick={() => setIsOpenMerge(true)}
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
              {isOpenMerge && (
                <Box sx={modalWrapper}>
                  <ClickAwayListener onClickAway={() => setIsOpenMerge(false)}>
                    <Box>
                      <MergeModal />
                    </Box>
                  </ClickAwayListener>
                </Box>
              )}
            </Form>
          )}
        </Formik>
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
  position: 'absolute',
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

const submitButton = theme => ({
  backgroundColor: theme.palette.secondary.main,
  padding: '15px',
  color: '#FCFAF6',
  fontSize: '25px',
  width: '100%',
  fontWeight: 600,
  borderRadius: radiusOfComponents,
  maxWidth: '402px',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    fontSize: '20px',
    lineHeight: '23px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px!important',
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
