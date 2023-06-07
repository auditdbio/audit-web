import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import { TextField, Select } from 'formik-mui';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkIcon from '@mui/icons-material/Link';
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
  Link,
} from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import { AUDITOR } from '../../redux/actions/types.js';
import Markdown from '../custom/Markdown-editor.jsx';
import IssueSeverity from './IssueSeverity.jsx';
import theme from '../../styles/themes.js';
import {
  addAuditIssue,
  clearMessage,
  updateAuditIssue,
} from '../../redux/actions/auditAction.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import { createIssueEvent } from '../../lib/createIssueEvent.js';
import StatusControl from './StatusControl.jsx';
import TagsField from '../forms/tags-field/tags-field.jsx';
import { ProjectLinksList } from '../custom/ProjectLinksList';

const IssueDetailsForm = ({ issue = null, editMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditId, issueId } = useParams();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));

  const user = useSelector(s => s.user.user);
  const { successMessage, error } = useSelector(s => s.audits);

  const [isEditName, setIsEditName] = useState(!editMode);
  const [isEditDescription, setIsEditDescription] = useState(!editMode);
  const [addLinkField, setAddLinkField] = useState(!!issue?.link);
  const [issuePrevValues, setIssuePrevValues] = useState(null);
  const [severityListOpen, setSeverityListOpen] = useState(false);
  const [mdRef, setMdRef] = useState(null);
  const nameInputRef = useRef();
  const categoryInputRef = useRef();

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
    name: issue?.name || '',
    status: issue?.status || 'Draft',
    severity: issue?.severity || 'Medium',
    category: issue?.category || 'Default',
    description: issue?.description || '',
    include: issue?.include ?? true,
    link: issue?.link || '',
    feedback: issue?.feedback || '',
  };

  const handleSubmitForm = (values, { setFieldValue }) => {
    if (editMode) {
      const prev = issuePrevValues || initialValues;
      const updatedValues = Object.keys(prev).reduce((acc, key) => {
        return prev[key] === values[key] ? acc : { ...acc, [key]: values[key] };
      }, {});

      const updatedValuesWithEvent = createIssueEvent(updatedValues);
      setIsEditName(false);
      setFieldValue('status', '');
      setIssuePrevValues({ ...values, status: '' });
      dispatch(updateAuditIssue(auditId, issueId, updatedValuesWithEvent));
    } else {
      dispatch(addAuditIssue(auditId, values));
      navigate(`/audit-request-offer/${auditId}`);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={issueValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmitForm}
    >
      {({ handleSubmit, values, setFieldValue, dirty }) => {
        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <CustomSnackbar
              autoHideDuration={5000}
              open={!!error || !!successMessage}
              severity={error ? 'error' : 'success'}
              text={error || successMessage}
              onClose={() => dispatch(clearMessage())}
            />

            <Field
              component={TextField}
              name="name"
              label="Title"
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
                  {user.current_role === AUDITOR && !addLinkField && (
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
                  <Box sx={{ mt: '10px' }}>
                    {user.current_role === AUDITOR ? (
                      <>
                        <TagsField
                          size="small"
                          name="link"
                          label="Links"
                          sx={{ '& > div': { borderRadius: 0 } }}
                        />
                        {/*<ProjectLinksList name="link" />*/}
                      </>
                    ) : (
                      <Box sx={linkForCustomerSx}>
                        <LinkIcon fontSize="small" sx={{ mr: '15px' }} />
                        <Link href={issue.link} target="_blank">
                          {issue.link}
                        </Link>
                      </Box>
                      // <Field
                      //   component={TextField}
                      //   name="link"
                      //   fullWidth={true}
                      //   disabled={false}
                      //   sx={linkInputSx}
                      //   inputProps={{ ...addTestsLabel('issue-link-input') }}
                      //   InputProps={
                      //     user.current_role === AUDITOR && issue?.link
                      //       ? {
                      //           endAdornment: (
                      //             <InputAdornment position="end">
                      //               <IconButton
                      //                 edge="end"
                      //                 type="button"
                      //                 aria-label="Delete link"
                      //                 onClick={() => {
                      //                   setFieldValue('link', '');
                      //                   setAddLinkField(false);
                      //                   if (editMode) {
                      //                     handleSubmit();
                      //                   }
                      //                 }}
                      //                 {...addTestsLabel('delete-link-button')}
                      //               >
                      //                 <ClearIcon
                      //                   color="secondary"
                      //                   fontSize="small"
                      //                 />
                      //               </IconButton>
                      //             </InputAdornment>
                      //           ),
                      //         }
                      //       : null
                      //   }
                      // />
                    )}
                  </Box>
                )}
              </Box>

              <Box sx={issueStatusBlock}>
                <Box sx={{ mb: '20px' }}>
                  <Box
                    sx={{
                      textAlign:
                        user.current_role === AUDITOR ? 'left' : 'center',
                    }}
                  >
                    <Typography sx={statusBlockTitle}>▼ Status</Typography>
                    <Typography
                      sx={statusValueSx(issue?.status || values.status)}
                    >
                      {issue?.status || values.status}
                    </Typography>
                  </Box>

                  {editMode && (
                    <StatusControl
                      status={issue.status}
                      setFieldValue={setFieldValue}
                    />
                  )}
                </Box>

                {user.current_role === AUDITOR ? (
                  <Box sx={severityWrapper}>
                    <Typography
                      sx={[statusBlockTitle, { cursor: 'pointer' }]}
                      onClick={() => setSeverityListOpen(true)}
                    >
                      ▼ Severity
                    </Typography>
                    <Field
                      open={severityListOpen}
                      onClose={() => setSeverityListOpen(false)}
                      onOpen={() => setSeverityListOpen(true)}
                      disabled={false}
                      component={Select}
                      name="severity"
                      sx={selectFieldSx}
                      renderValue={selected => {
                        return (
                          <Box sx={{ textAlign: 'center' }}>
                            <IssueSeverity text={selected} />
                          </Box>
                        );
                      }}
                    >
                      <MenuItem
                        value="Critical"
                        sx={severityMenuItem}
                        classes={{ selected: 'selected-severity' }}
                      >
                        Critical
                      </MenuItem>
                      <MenuItem
                        value="Major"
                        sx={severityMenuItem}
                        classes={{ selected: 'selected-severity' }}
                      >
                        Major
                      </MenuItem>
                      <MenuItem
                        value="Medium"
                        sx={severityMenuItem}
                        classes={{ selected: 'selected-severity' }}
                      >
                        Medium
                      </MenuItem>
                      <MenuItem
                        value="Minor"
                        sx={severityMenuItem}
                        classes={{ selected: 'selected-severity' }}
                      >
                        Minor
                      </MenuItem>
                    </Field>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={statusBlockTitle}>Severity</Typography>
                    <IssueSeverity text={values.severity} />
                  </Box>
                )}

                {user.current_role === AUDITOR ? (
                  <Box>
                    <Typography
                      sx={[statusBlockTitle, { cursor: 'pointer' }]}
                      onClick={() => categoryInputRef.current?.focus()}
                    >
                      ▼ Category
                    </Typography>
                    <Field
                      inputRef={categoryInputRef}
                      component={TextField}
                      name="category"
                      disabled={false}
                      fullWidth={true}
                      sx={categoryInput}
                      inputProps={{
                        sx: { padding: '2px', fontSize: '20px' },
                        ...addTestsLabel('issue-category-input'),
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', mt: '20px' }}>
                    <Typography sx={statusBlockTitle}>Category</Typography>
                    <Typography sx={statusBlockTitle}>
                      {values.category}
                    </Typography>
                  </Box>
                )}

                {editMode && user.current_role === AUDITOR && (
                  <Box sx={{ mt: '20px' }}>
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
                          }}
                          name="include"
                        />
                      }
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {user.current_role === AUDITOR && (
              <Box sx={addIssueBox(issue?.events)}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={!dirty}
                  sx={addIssueButton}
                  onClick={() =>
                    editMode &&
                    mdRef?.current?.setView({
                      menu: false,
                      md: false,
                      html: true,
                    })
                  }
                  {...addTestsLabel('new-issue-button')}
                >
                  {editMode ? 'Save changes' : 'Add issue'}
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
  severity: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  // link: Yup.array().of(Yup.string().url()),
  include: Yup.boolean(),
  feedback: Yup.string(),
});

const nameInputSx = theme => ({
  '& > div': { borderRadius: 0 },
  '& input': {
    backgroundColor: 'white',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '24px',
    padding: '20px',
    '&:disabled': {
      backgroundColor: 'transparent',
      color: '#434242',
      '-webkit-text-fill-color': '#434242',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
      padding: '15px 10px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    mb: '12px',
  },
});

const linkInputSx = {
  backgroundColor: 'white',
  '& > div': { borderRadius: 0 },
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

const linkForCustomerSx = {
  display: 'flex',
  alignItems: 'center',
  border: '2px solid #E5E5E5',
  padding: '8px 10px',
  overflow: 'hidden',
  '& a': {
    fontSize: '16px',
    fontWeight: 500,
    textDecorationColor: '#152BEA',
    color: '#152BEA',
  },
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
  padding: '40px 10px 40px 25px',
  [theme.breakpoints.down('sm')]: {
    width: '30%',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '40px 10px',
    alignItems: 'center',
    width: '80%',
  },
});

const statusBlockTitle = theme => ({
  fontSize: '20px',
  fontWeight: 500,
  mb: '5px',
  [theme.breakpoints.down('xs')]: {
    textAlign: 'center',
  },
});

const severityWrapper = {
  mb: '30px',
  '& div.MuiFormControl-root': {
    width: '100%',
  },
};

const severityMenuItem = theme => ({
  ':hover': {
    background: theme.palette.primary.main,
    color: 'white',
  },
});

const selectFieldSx = {
  '& > div': { padding: '0 !important', display: 'flex' },
  '& > fieldset': { border: 'none' },
  '& > svg': { display: 'none' },
};

const statusValueSx = status => {
  let color = '#434242';
  if (status === 'Draft') color = '#52176D';
  if (status === 'Verification' || status === 'InProgress') color = '#5b97bb';
  if (status === 'Fixed' || status === 'WillNotFix') color = '#09C010';

  return { fontSize: '20px', fontWeight: 500, mb: '10px', color };
};

const categoryInput = theme => ({
  '& fieldset': { borderWidth: 0 },
  '& input': {
    [theme.breakpoints.down('xs')]: { textAlign: 'center' },
  },
});

const addIssueBox = events => ({
  display: 'flex',
  justifyContent: 'flex-end',
  pt: '20px',
  position: 'relative',
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'center',
    pt: 0,
    mb: '20px',
  },
  '&::before': {
    content: '""',
    display: events?.length ? 'block' : 'none',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '36px',
    width: '2px',
    backgroundColor: '#b9b9b9',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
});

const addIssueButton = theme => ({
  padding: '16px 44px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '20px',
  lineHeight: '25px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '14px',
    padding: '10px 30px',
  },
});
