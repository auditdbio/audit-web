import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit.js';
import {
  changePassword,
  clearUserError,
  clearUserSuccess,
} from '../../../redux/actions/userAction.js';
import { useDispatch, useSelector } from 'react-redux';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../../../lib/helper.js';
import PasswordField from '../fields/password-field.jsx';
import { AUDITOR } from '../../../redux/actions/types.js';

const ChangePasswordFormik = () => {
  const dispatch = useDispatch();
  const { user, success, error } = useSelector(s => s.user);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (success) {
      setEditMode(false);
    }
  }, [success]);

  return (
    <Box sx={{ textAlign: 'center', mt: '30px' }}>
      <CustomSnackbar
        autoHideDuration={10000}
        open={!!error || !!success}
        onClose={() => {
          dispatch(clearUserSuccess());
          dispatch(clearUserError());
        }}
        severity={error ? 'error' : 'success'}
        text={error || success}
      />

      {editMode ? (
        <Formik
          initialValues={{
            current_password: '',
            password: '',
            confirm_password: '',
          }}
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={values => {
            dispatch(changePassword(values, user.id));
          }}
        >
          {({ handleSubmit, dirty }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Box sx={wrapper}>
                  <Box sx={fieldsWrapper}>
                    <PasswordField
                      name="current_password"
                      label="Current password"
                    />
                    <PasswordField name="password" label="New password" />
                    <PasswordField
                      name="confirm_password"
                      label="Confirm password"
                    />
                  </Box>
                  <Button
                    sx={passwordButtonSx}
                    type="submit"
                    disabled={!dirty}
                    {...addTestsLabel('change-password-button')}
                  >
                    <EditIcon />
                    Change password
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <Button
          color={user?.current_role === AUDITOR ? 'secondary' : 'primary'}
          onClick={() => setEditMode(true)}
        >
          Change password
        </Button>
      )}
    </Box>
  );
};

export default ChangePasswordFormik;

const validationSchema = Yup.object().shape({
  current_password: Yup.string().required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const wrapper = theme => ({
  width: '450px',
  margin: '0 auto',
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});

const fieldsWrapper = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const passwordButtonSx = {
  display: 'flex',
  alignItems: 'center',
  marginRight: 0,
  marginLeft: 'auto',
  textTransform: 'unset',
  fontSize: '10px',
  gap: '5px',
  '& svg': {
    width: '14px',
  },
};
