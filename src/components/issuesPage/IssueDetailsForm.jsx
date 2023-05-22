import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { TextField, Select } from 'formik-mui';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  useMediaQuery,
} from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import { AUDITOR } from '../../redux/actions/types.js';
import Markdown from '../custom/Markdown-editor.jsx';
import IssueSeverity from './IssueSeverity.jsx';
import theme from '../../styles/themes.js';

const IssueDetailsForm = ({ issue = null, editMode = false }) => {
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const user = useSelector(s => s.user.user);
  const [isEditName, setIsEditName] = useState(!editMode);
  const [isEditDescription, setIsEditDescription] = useState(!editMode);
  const [addLinkField, setAddLinkField] = useState(false);
  const [mdRef, setMdRef] = useState(null);
  const nameInputRef = useRef();

  const handleNameEdit = handleSubmit => {
    if (isEditName) {
      handleSubmit();
    }
    setIsEditName(prev => !prev);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const handleDescriptionEdit = handleSubmit => {
    if (isEditDescription) {
      mdRef?.current?.setView({ menu: false, md: false, html: true });
      handleSubmit();
    } else {
      mdRef.current?.setView({ menu: true, md: true, html: !matchXs });
      setTimeout(() => mdRef?.current?.nodeMdText?.current?.focus(), 100);
    }
    setIsEditDescription(!isEditDescription);
  };

  const getMarkdownInitialView = () => {
    if (editMode) {
      return { menu: false, md: false, html: true };
    } else {
      if (matchXs) {
        return { menu: true, md: true, html: false };
      }
      return { menu: true, md: true, html: true };
    }
  };

  const initialValues = {
    id: issue?.id || '',
    name: issue?.name || '',
    status: issue?.status || 'Draft',
    severity: issue?.severity || '',
    category: issue?.category || '',
    description: issue?.description || '',
    include: issue?.include ?? true,
    event: issue?.event || [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={issueValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={values => {
        if (editMode) {
          setIsEditName(false);
        }
        console.log(values);
        console.log('submitted! waiting for API to be ready');
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => {
        return (
          <Form
            onSubmit={handleSubmit}
            style={{ width: '100%', marginBottom: '25px' }}
          >
            <Field
              component={TextField}
              name="name"
              label="Title"
              autoFocus
              fullWidth={true}
              disabled={!isEditName}
              sx={nameInputSx}
              inputRef={nameInputRef}
              inputProps={{ ...addTestsLabel('issue-name-input') }}
              InputProps={
                user.current_role === AUDITOR && editMode
                  ? {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="start"
                            type="button"
                            aria-label="Edit name"
                            onClick={() => handleNameEdit(handleSubmit)}
                            sx={{ display: 'flex', alignItems: 'flex-end' }}
                            {...addTestsLabel('edit-name-button')}
                          >
                            <EditIcon color="secondary" fontSize="small" />
                            <Box component="span" sx={editButtonText}>
                              {isEditName ? 'Save' : 'Edit'}
                            </Box>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  : null
              }
            />

            <Box sx={infoWrapperSx}>
              <Box sx={descriptionBlock}>
                <Box sx={{ position: 'relative' }}>
                  <Markdown
                    name="description"
                    setMdRef={setMdRef}
                    mdProps={{
                      view: getMarkdownInitialView(),
                      placeholder: 'Description',
                      style: markdownSx,
                    }}
                  />
                  {user.current_role === AUDITOR && editMode && (
                    <IconButton
                      type="button"
                      aria-label="Edit description"
                      onClick={() => handleDescriptionEdit(handleSubmit)}
                      sx={editDescriptionButton}
                      {...addTestsLabel('edit-description-button')}
                    >
                      <EditIcon color="secondary" fontSize="small" />
                      <Box component="span" sx={editButtonText}>
                        {isEditDescription ? 'Save' : 'Edit'}
                      </Box>
                    </IconButton>
                  )}
                  {user.current_role === AUDITOR && (
                    <IconButton
                      type="button"
                      aria-label="add link"
                      onClick={() => setAddLinkField(true)}
                      sx={addLinkButton}
                      {...addTestsLabel('add-link-button')}
                    >
                      <AddLinkIcon color="secondary" />
                      <Box component="span" sx={editButtonText}>
                        Add link
                      </Box>
                    </IconButton>
                  )}
                </Box>
                {addLinkField && (
                  <Box>
                    <Field
                      component={TextField}
                      name="link"
                      fullWidth={true}
                      sx={linkInputSx}
                      defaultValue="https://"
                      inputProps={{ ...addTestsLabel('issue-link-input') }}
                      InputProps={
                        user.current_role === AUDITOR
                          ? {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    edge="end"
                                    type="button"
                                    aria-label="Delete link"
                                    onClick={() => {}}
                                    {...addTestsLabel('delete-link-button')}
                                  >
                                    <ClearIcon
                                      color="secondary"
                                      fontSize="small"
                                    />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }
                          : null
                      }
                    />
                  </Box>
                )}
              </Box>

              <Box sx={issueStatusBlock}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={statusBlockTitle}>Status</Typography>
                  <Typography sx={statusValueSx(values.status)}>
                    {values.status}
                  </Typography>
                </Box>

                {editMode && (
                  <Box sx={{ textAlign: 'center', mb: '30px' }}>
                    <Button
                      variant="contained"
                      type="submit"
                      color="secondary"
                      onClick={() => {}}
                      {...addTestsLabel('change-status-button')}
                    >
                      !! AFTER API !!
                    </Button>
                  </Box>
                )}

                {user.current_role === AUDITOR ? (
                  <Field
                    label="Severity"
                    disabled={false}
                    component={Select}
                    name="severity"
                    onChange={() => editMode && handleSubmit()}
                    renderValue={selected => {
                      return (
                        <Box sx={{ textAlign: 'center' }}>
                          <IssueSeverity text={selected} />
                        </Box>
                      );
                    }}
                  >
                    <MenuItem value="Critical">Critical</MenuItem>
                    <MenuItem value="Major">Major</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Minor">Minor</MenuItem>
                  </Field>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={statusBlockTitle}>Severity</Typography>
                    <IssueSeverity text={values.severity} />
                  </Box>
                )}

                {user.current_role === AUDITOR ? (
                  <Field
                    component={TextField}
                    name="category"
                    label="Category"
                    disabled={false}
                    fullWidth={true}
                    sx={{ mt: '20px' }}
                    onBlur={() => editMode && handleSubmit()}
                    inputProps={{ ...addTestsLabel('issue-category-input') }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', mt: '20px' }}>
                    <Typography sx={statusBlockTitle}>Category</Typography>
                    <Typography sx={statusBlockTitle}>
                      {values.category}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ textAlign: 'center', mt: '20px' }}>
                  <FormControlLabel
                    label={
                      <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>
                        Include
                      </Typography>
                    }
                    control={
                      <Switch
                        checked={values.include}
                        color="secondary"
                        disabled={user.current_role !== AUDITOR}
                        onChange={e => {
                          setFieldValue('include', e.target.checked);
                          handleSubmit();
                        }}
                        name="include"
                      />
                    }
                  />
                </Box>
              </Box>
            </Box>

            {user.current_role === AUDITOR && !editMode && (
              <Box sx={addIssueBox}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  sx={addIssueButton}
                  {...addTestsLabel('new-issue-button')}
                >
                  Add issue
                </Button>
              </Box>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default IssueDetailsForm;

const issueValidationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
  severity: Yup.string().required('Required'),
  category: Yup.string(),
  include: Yup.boolean(),
  event: Yup.array(),
});

const nameInputSx = theme => ({
  '& input': {
    backgroundColor: 'white',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '24px',
    padding: '30px 20px',
    '&:disabled': {
      backgroundColor: 'transparent',
      color: '#434242',
      '-webkit-text-fill-color': '#434242',
    },
  },
  [theme.breakpoints.down('xs')]: {
    mb: '12px',
  },
});

const linkInputSx = {
  backgroundColor: 'white',
  '& input': {
    fontSize: '16px',
    padding: '8px 10px',
  },
};

const editButtonText = theme => ({
  ml: '6px',
  color: theme.palette.secondary.main,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '17px',
});

const editDescriptionButton = {
  position: 'absolute',
  bottom: '10px',
  right: '15px',
  display: 'flex',
  alignItems: 'flex-end',
};

const addLinkButton = {
  position: 'absolute',
  bottom: '10px',
  left: '15px',
  display: 'flex',
  alignItems: 'center',
};

const markdownSx = {
  height: '500px',
  backgroundColor: 'transparent',
  fontWeight: 500,
  fontSize: '20px !important',
  lineHeight: '24px',
};

const infoWrapperSx = theme => ({
  display: 'flex',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const descriptionBlock = theme => ({
  width: '80%',
  // position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: '70%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
  },
});

const issueStatusBlock = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '20%',
  padding: '40px 10px 40px 20px',
  [theme.breakpoints.down('sm')]: {
    width: '30%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '80%',
  },
});

const statusBlockTitle = {
  fontSize: '20px',
  fontWeight: 500,
  mb: '5px',
};

const statusValueSx = status => {
  let color = '#434242';
  if (status === 'Draft') color = '#52176D';
  if (status === 'Verification' || status === 'In progress') color = '#5b97bb';
  if (status === 'Fixed' || status === 'Will not fix') color = '#09C010';

  return { fontSize: '20px', fontWeight: 500, mb: '10px', color };
};

const addIssueBox = theme => ({
  display: 'flex',
  justifyContent: 'flex-end',
  mt: '20px',
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'center',
    mt: 0,
  },
});

const addIssueButton = {
  padding: '16px 44px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '20px',
  lineHeight: '25px',
};
