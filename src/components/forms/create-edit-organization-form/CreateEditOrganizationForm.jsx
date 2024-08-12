import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Checkbox,
  Typography,
  useMediaQuery,
} from '@mui/material';
import SimpleField from '../fields/simple-field.jsx';
import theme from '../../../styles/themes.js';
import Loader from '../../Loader.jsx';
import { AUDITOR, CUSTOMER } from '../../../redux/actions/types.js';
import AvatarForm from '../Avatar-form/index.jsx';
import { SliderRange } from '../salary-slider/slider-range.jsx';
import { addTestsLabel } from '../../../lib/helper.js';
import { useNavigate } from 'react-router-dom/dist';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { history } from '../../../services/history.js';
import {
  createOrganization,
  updateOrganization,
} from '../../../redux/actions/organizationAction.js';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const GoBack = ({ role, newLinkId }) => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    if (newLinkId) {
      navigate(`/${role[0]}/${newLinkId}`);
    } else {
      navigate(-1);
    }
  };
  return (
    <Button sx={backBtnSx} onClick={handleGoBack}>
      <ArrowBackIcon color={role !== AUDITOR ? 'primary' : 'secondary'} />
    </Button>
  );
};

const CreateEditOrganizationForm = ({
  role,
  needLoad,
  organization,
  newLinkId,
}) => {
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.user);
  const { customer } = useSelector(s => s.customer);
  const { auditor } = useSelector(s => s.auditor);
  const navigate = useNavigate();
  const [isDirty, setIsDirty] = useState(false);

  if (!organization.id && needLoad) {
    return <Loader />;
  } else {
    return (
      <Formik
        initialValues={{
          id: organization.id || '',
          avatar: organization.avatar || '',
          contacts: {
            telegram: organization?.contacts?.telegram || '',
            email: organization?.contacts?.email || '',
            public_contacts: organization.contacts?.public_contacts || false,
          },
          name: organization.name || '',
          // about: organization?.about || '',
          company: organization?.company || '',
          organization_type:
            organization.organization_type ||
            user.current_role.slice(0, 1).toUpperCase() +
              user.current_role.slice(1),
        }}
        validationSchema={EditOrganizationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={values => {
          setIsDirty(false);
          if (!values.id) {
            dispatch(
              createOrganization(values, `/${user.current_role[0]}/${user.id}`),
            );
          } else {
            dispatch(
              updateOrganization(values, `/${user.current_role[0]}/${user.id}`),
            );
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue, dirty }) => {
          useEffect(() => {
            setIsDirty(dirty);
          }, [dirty]);
          useEffect(() => {
            const unblock = history.block(({ location }) => {
              if (!isDirty) {
                unblock();
                return navigate(location);
              }

              const confirmed = window.confirm(
                'Do you want to save changes before leaving the page?',
              );

              if (confirmed) {
                handleSubmit(values);
                unblock();
                return navigate(location);
              } else {
                unblock();
                return navigate(location);
              }
            });

            if (!isDirty) {
              unblock();
            }

            return () => {
              unblock();
            };
          }, [history, isDirty]);
          return (
            <Form onSubmit={handleSubmit}>
              <Box sx={wrapper}>
                <GoBack role={role} newLinkId={newLinkId} />
                <Box sx={avatarWrapper}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <AvatarForm name="avatar" role={role} />
                  </Box>
                  {matchSm && (
                    <Box sx={[fieldWrapper, { width: '100%' }]}>
                      <SimpleField
                        name="name"
                        label="Name"
                        size={matchXs ? 'small' : 'medium'}
                        emptyPH
                      />
                    </Box>
                  )}
                </Box>
                <Box sx={fieldsWrapper}>
                  <Box sx={fieldWrapper}>
                    {!matchSm && (
                      <>
                        <SimpleField name="name" label="Name" emptyPH />
                        {/*<SimpleField name={'last_name'} label={'Last name'}/>*/}
                      </>
                    )}
                    <SimpleField
                      name="contacts.telegram"
                      label="Telegram"
                      size={matchXs ? 'small' : 'medium'}
                      emptyPH
                    />
                    <Box>
                      <SimpleField
                        name="contacts.email"
                        label="E-mail"
                        size={matchXs ? 'small' : 'medium'}
                        emptyPH
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          mt: '5px',
                        }}
                      >
                        <Checkbox
                          color="success"
                          id="hide-contacts"
                          checked={values.contacts?.public_contacts}
                          onChange={e => {
                            setFieldValue(
                              'contacts.public_contacts',
                              e.target.checked,
                            );
                          }}
                          inputProps={{
                            ...addTestsLabel('make-contacts-visible'),
                          }}
                        />
                        <label
                          htmlFor="hide-contacts"
                          style={{
                            width: '174px',
                            display: 'flex',
                            color:
                              role === AUDITOR
                                ? theme.palette.secondary.main
                                : theme.palette.primary.main,
                          }}
                        >
                          Make contacts visible
                        </label>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={fieldWrapper}>
                    {/*<SimpleField*/}
                    {/*  name="about"*/}
                    {/*  label="About"*/}
                    {/*  size={matchXs ? 'small' : 'medium'}*/}
                    {/*  emptyPH*/}
                    {/*  multiline*/}
                    {/*  rows={3}*/}
                    {/*/>*/}
                    <FormControl
                      onChange={e =>
                        setFieldValue('organization_type', e.target.value)
                      }
                      disabled={!!organization?.id}
                    >
                      <FormLabel
                        color={
                          user.current_role === CUSTOMER
                            ? 'primary'
                            : 'secondary'
                        }
                      >
                        Organization type
                      </FormLabel>
                      <RadioGroup
                        defaultValue={values.organization_type}
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value={'Customer'}
                          control={
                            <Radio
                              color={
                                user.current_role === CUSTOMER
                                  ? 'primary'
                                  : 'secondary'
                              }
                            />
                          }
                          label="Customer"
                        />
                        <FormControlLabel
                          value={'Auditor'}
                          control={
                            <Radio
                              color={
                                user.current_role === CUSTOMER
                                  ? 'primary'
                                  : 'secondary'
                              }
                            />
                          }
                          label="Auditor"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color={role === AUDITOR ? 'secondary' : 'primary'}
                sx={buttonSx}
                {...addTestsLabel('save-button')}
              >
                Save changes
              </Button>
            </Form>
          );
        }}
      </Formik>
    );
  }
};

export default CreateEditOrganizationForm;

const EditOrganizationSchema = Yup.object().shape({
  name: Yup.string().required('required'),
  // contacts: Yup.object().shape({
  //   email: Yup.string().email('Invalid email').required('required'),
  //   telegram: Yup.string(),
  // }),
});

const backBtnSx = theme => ({
  position: 'absolute',
  left: '-70px',
  top: '-30px',
  [theme.breakpoints.down('sm')]: {
    left: '-50px',
  },
  [theme.breakpoints.down('xs')]: {
    left: '-40px',
  },
});

const wrapper = theme => ({
  display: 'flex',
  position: 'relative',
  gap: '52px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '12px',
  },
});

const rateLabel = theme => ({
  fontSize: '15px',
  color: '#B2B3B3',
  fontWeight: 500,
});

const fieldsWrapper = theme => ({
  display: 'flex',
  gap: '52px',
  width: '100%',
  '& p': {
    color: '#B2B3B3',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '14px',
  },
});

const fieldWrapper = theme => ({
  width: '100%',
  gap: '18px',
  display: 'flex',
  flexDirection: 'column',
  '& .tags-array-wrapper': {
    margin: 'auto 0 0 0',
  },
  '& .password-wrapper': {
    gap: '12px',
  },
  '& .field-wrapper': {
    gap: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '14px',
    '& .field-wrapper': {
      gap: '8px',
    },
    '& .password-wrapper': {
      gap: '8px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& p': {
      fontSize: '12px',
    },
    '& input': {
      fontSize: '12px',
    },
  },
});

const buttonSx = {
  display: 'block',
  margin: '70px auto 0',
  textTransform: 'unset',
  padding: '13px 0',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: 1.2,
  width: '200px',
  borderRadius: '10px',
};

const avatarWrapper = theme => ({
  '& button': {
    textTransform: 'unset',
    '& svg': { marginRight: '5px' },
  },
  '& .MuiAvatar-root': {
    width: '205px',
    height: '205px',
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiAvatar-root': {
      width: '158px',
      height: '158px',
    },
    '& button': { fontSize: '12px' },
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiAvatar-root': {
      width: '128px',
      height: '128px',
    },
    display: 'flex',
    gap: '22px',
    '& p': { color: '#B2B3B3' },
  },
  [theme.breakpoints.down('xs')]: {
    '& .MuiAvatar-root': {
      width: '80px',
      height: '80px',
    },
    '& button': {
      paddingX: '4px',
      fontSize: '10px',
      '& svg': { marginRight: 0 },
    },
  },
});
