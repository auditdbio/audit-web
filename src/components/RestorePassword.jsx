import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import SimpleField from './forms/fields/simple-field.jsx';
import * as Yup from 'yup';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useParams } from 'react-router-dom';
import { sendRestoreMessage } from '../redux/actions/userAction.js';

const RestorePassword = ({ onClose }) => {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={ValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={values => {
        dispatch(sendRestoreMessage(values));
        onClose();
      }}
    >
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ position: 'relative' }}>
              <Button
                onClick={() => onClose()}
                sx={{
                  position: 'absolute',
                  minWidth: '44px',
                  right: '-30px',
                  top: '-30px',
                }}
              >
                <CloseRoundedIcon />
              </Button>
              <Typography
                sx={{ fontSize: '14px!important', marginBottom: '15px' }}
              >
                Please enter your registered email address to receive
                instructions on how to reset your password
              </Typography>
              <Box sx={fieldWrapper}>
                <SimpleField name={'email'} label={'E-mail'} />
              </Box>
              <Button
                sx={{
                  marginTop: '28px',
                  marginX: 'auto',
                  display: 'block',
                  textTransform: 'unset',
                  width: '100%',
                }}
                type={'submit'}
                variant={'contained'}
              >
                Submit
              </Button>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RestorePassword;

const ValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('required'),
});

const fieldWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '10px',
  '& .field-wrapper': {
    gap: '15px',
    '& input': {
      height: '1rem',
    },
  },
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
