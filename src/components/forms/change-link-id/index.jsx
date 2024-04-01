import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit.js';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  useMediaQuery,
} from '@mui/material';
import {
  changeLinkId,
  clearUserError,
  clearUserSuccess,
} from '../../../redux/actions/userAction.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { AUDITOR } from '../../../redux/actions/types.js';
import { addTestsLabel } from '../../../lib/helper.js';
import SimpleField from '../fields/simple-field.jsx';
import theme from '../../../styles/themes.js';

const ChangeLinkId = ({ setNewLinkId }) => {
  const dispatch = useDispatch();

  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
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
        autoHideDuration={8000}
        open={!!error || !!success}
        onClose={() => {
          dispatch(clearUserSuccess());
          dispatch(clearUserError());
        }}
        severity={error ? 'error' : 'success'}
        text={error || success}
      />

      <Dialog open={editMode} onClose={() => setEditMode(false)} sx={modalSx}>
        <DialogTitle sx={{ padding: '16px 70px' }}>
          Set a new Link ID
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={dialogTextSx}>
            Link ID is the unique name specified in the link leading to your
            profile. <br /> After changing your Link ID, your old Link ID
            becomes available for anyone else to claim. Old links to your
            profile won't automatically redirect. The Link ID will be changed
            for all user roles.
          </DialogContentText>
        </DialogContent>
        <Formik
          initialValues={{ link_id: '' }}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={validationSchema}
          onSubmit={values => {
            setNewLinkId(values.link_id);
            dispatch(changeLinkId(values, user.id));
          }}
        >
          {({ handleSubmit, dirty }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Box sx={wrapper}>
                  <Box sx={fieldsWrapper}>
                    <SimpleField
                      name="link_id"
                      label="New Link ID"
                      size={matchXs ? 'small' : 'medium'}
                      emptyPH
                    />
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Button
                      sx={buttonSx}
                      type="button"
                      onClick={() => setEditMode(false)}
                      {...addTestsLabel('cancel-link-id-button')}
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={buttonSx}
                      type="submit"
                      disabled={!dirty}
                      {...addTestsLabel('change-link-id-button')}
                    >
                      <EditIcon />
                      Change Link ID
                    </Button>
                  </Box>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Dialog>

      <Button
        color={user?.current_role === AUDITOR ? 'secondary' : 'primary'}
        onClick={() => setEditMode(true)}
      >
        Change Link ID
      </Button>
    </Box>
  );
};

export default ChangeLinkId;

const validationSchema = Yup.object().shape({
  link_id: Yup.string()
    .required('Required')
    .matches(
      /^[A-Za-z0-9_-]+$/,
      'Link ID may only contain alphanumeric characters, hyphens or underscore',
    ),
});

const modalSx = theme => ({
  '& .MuiPaper-root': {
    padding: '20px 30px',
    [theme.breakpoints.down('xs')]: {
      padding: '20px 15px',
    },
    '& h2': {
      textAlign: 'center',
      color: '#434242',
      [theme.breakpoints.down('xs')]: {
        padding: '10px',
        fontSize: '15px',
      },
    },
  },
});

const dialogTextSx = theme => ({
  mb: '20px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '13px',
  },
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
  mb: '10px',
};

const buttonSx = {
  display: 'flex',
  alignItems: 'center',
  textTransform: 'unset',
  fontSize: '10px',
  gap: '5px',
  '& svg': {
    width: '14px',
  },
};
