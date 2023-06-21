import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import { TextField, Select } from 'formik-mui';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddLinkIcon from '@mui/icons-material/AddLink';
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
  Tooltip,
} from '@mui/material';
import { addSpacesToCamelCase, addTestsLabel } from '../../lib/helper.js';
import { AUDITOR } from '../../redux/actions/types.js';
import MarkdownEditor from '../markdown/Markdown-editor.jsx';
import IssueSeverity from './IssueSeverity.jsx';
import theme from '../../styles/themes.js';
import { clearMessage } from '../../redux/actions/auditAction.js';
import {
  addAuditIssue,
  updateAuditIssue,
} from '../../redux/actions/issueAction.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import { createIssueEvent } from '../../lib/createIssueEvent.js';
import StatusControl from './StatusControl.jsx';
import TagsField from '../forms/tags-field/tags-field.jsx';
import { ProjectLinksList } from '../custom/ProjectLinksList';
import ArrowIcon from '../icons/ArrowIcon.jsx';
import CustomLink from '../custom/CustomLink.jsx';

const IssueDetailsForm = ({ issue = null, editMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditId, issueId } = useParams();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));

  const user = useSelector(s => s.user.user);
  const { successMessage, error } = useSelector(s => s.issues);

  const [isEditName, setIsEditName] = useState(!editMode);
  const [isEditDescription, setIsEditDescription] = useState(!editMode);
  const [addLinkField, setAddLinkField] = useState(false);
  const [issuePrevValues, setIssuePrevValues] = useState(null);
  const [severityListOpen, setSeverityListOpen] = useState(false);
  const [categoryPrevVal, setCategoryPrevVal] = useState(issue?.category || '');
  const [mdRef, setMdRef] = useState(null);
  const nameInputRef = useRef();

  const handleNameEdit = handleSubmit => {
    if (isEditName) {
      handleSubmit();
    }
    setIsEditName(prev => !prev);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const handleDescriptionEdit = (handleSubmit, values) => {
    if (!values.description?.trim()) return;

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
    category: issue?.category || '',
    description: issue?.description || '',
    include: issue?.include ?? true,
    links: issue?.links || [],
    feedback: issue?.feedback || '',
  };

  const handleSubmitForm = (values, { setFieldValue }) => {
    if (editMode) {
      const prev = issuePrevValues || initialValues;
      const updatedValues = Object.keys(prev).reduce((acc, key) => {
        if (Array.isArray(values[key])) {
          return String(prev[key]) === String(values[key])
            ? acc
            : { ...acc, [key]: values[key] };
        }
        return prev[key] === values[key] ? acc : { ...acc, [key]: values[key] };
      }, {});

      const updatedValuesWithEvent = createIssueEvent(
        updatedValues,
        prev.links?.length,
        issue?.status || 'Draft',
      );
      setIsEditName(false);
      setFieldValue('status', '');
      setIssuePrevValues({ ...values, status: '' });
      dispatch(updateAuditIssue(auditId, issueId, updatedValuesWithEvent));
    } else {
      dispatch(addAuditIssue(auditId, values));
      navigate(`/audit-info/${auditId}/auditor`);
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
      {({
        handleSubmit,
        values,
        setFieldValue,
        dirty,
        setFieldTouched,
        touched,
        errors,
      }) => {
        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <CustomSnackbar
              autoHideDuration={5000}
              open={!!error || !!successMessage}
              severity={error ? 'error' : 'success'}
              text={error || successMessage}
              onClose={() => dispatch(clearMessage())}
            />

            <Tooltip
              title={isEditName ? '' : values.name}
              arrow
              placement="top"
              disableFocusListener
              disableTouchListener
              enterDelay={500}
              leaveDelay={0}
            >
              <Box>
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
              </Box>
            </Tooltip>

            <Box sx={infoWrapperSx}>
              <Box sx={descriptionBlock}>
                <Box sx={markdownWrapper}>
                  <MarkdownEditor
                    name="description"
                    setMdRef={setMdRef}
                    setFieldTouched={setFieldTouched}
                    mdProps={{
                      view: getMarkdownInitialView(),
                      placeholder:
                        touched.description && errors.description
                          ? 'Description is required'
                          : 'Description',
                      style: markdownSx(matchXs),
                    }}
                  />
                </Box>

                {user.current_role === AUDITOR && (
                  <Box sx={descriptionButtonsSx}>
                    {editMode && (
                      <IconButton
                        type="button"
                        aria-label="Edit description"
                        onClick={() =>
                          handleDescriptionEdit(handleSubmit, values)
                        }
                        sx={editDescriptionButton}
                        {...addTestsLabel('edit-description-button')}
                      >
                        <EditIcon color="secondary" fontSize="small" />
                        <Box component="span" sx={editButtonText}>
                          {isEditDescription ? 'Save' : 'Edit'}
                        </Box>
                      </IconButton>
                    )}
                    {!addLinkField && (
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
                )}

                <Box sx={linksList}>
                  {user.current_role === AUDITOR ? (
                    <ProjectLinksList
                      name="links"
                      handleSubmit={handleSubmit}
                    />
                  ) : (
                    <Box sx={customerLinksList}>
                      {values.links?.map((link, idx) => (
                        <CustomLink link={link} key={idx} sx={linkSx} />
                      ))}
                    </Box>
                  )}
                </Box>

                {touched.description && errors.description && (
                  <Typography
                    sx={{
                      color: `${theme.palette.error.main}!important`,
                      fontSize: '14px',
                    }}
                  >
                    {errors.description}
                  </Typography>
                )}

                {addLinkField && (
                  <Box sx={{ mt: '10px' }}>
                    {user.current_role === AUDITOR && (
                      <TagsField
                        size="small"
                        name="links"
                        label="Links"
                        handleSubmit={handleSubmit}
                        sx={linkFieldSx}
                      />
                    )}
                  </Box>
                )}
              </Box>

              <Box sx={issueStatusBlock}>
                <Box>
                  <Box sx={{ mb: '20px' }}>
                    <Box sx={statusBlockAlign}>
                      <Typography sx={statusBlockTitle}>
                        <span>Status</span>
                      </Typography>
                      <Typography
                        sx={statusValueSx(issue?.status || values.status)}
                      >
                        {addSpacesToCamelCase(issue?.status || values.status)}
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
                        <ArrowIcon />
                        <span>Severity</span>
                      </Typography>
                      <Field
                        open={severityListOpen}
                        onClose={() => setSeverityListOpen(false)}
                        onOpen={() => setSeverityListOpen(true)}
                        onChange={e => {
                          setFieldValue('severity', e.target.value);
                          if (editMode) handleSubmit();
                        }}
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
                    <Box sx={[statusBlockAlign, { pointerEvents: 'none' }]}>
                      <Typography sx={statusBlockTitle}>
                        <span>Severity</span>
                      </Typography>
                      <IssueSeverity text={values.severity} />
                    </Box>
                  )}

                  {user.current_role === AUDITOR ? (
                    <Box>
                      <Typography sx={[statusBlockTitle]}>
                        <span>Category</span>
                      </Typography>
                      <Field
                        component={TextField}
                        name="category"
                        placeholder="Enter a category"
                        disabled={false}
                        fullWidth={true}
                        sx={categoryInput}
                        inputProps={{
                          sx: [
                            { padding: '4px 2px', fontSize: '18px' },
                            touched.category && errors.category
                              ? { border: '1px solid red', borderRadius: '6px' }
                              : {},
                          ],
                          ...addTestsLabel('issue-category-input'),
                        }}
                        InputProps={
                          user.current_role === AUDITOR &&
                          editMode &&
                          categoryPrevVal !== values.category
                            ? {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      edge="end"
                                      type="button"
                                      aria-label="Save"
                                      onClick={() => {
                                        setCategoryPrevVal(values.category);
                                        handleSubmit();
                                      }}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                      }}
                                      {...addTestsLabel('save-category-button')}
                                    >
                                      <SaveIcon
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
                  ) : (
                    <Box sx={[statusBlockAlign, { mt: '20px' }]}>
                      <Typography sx={statusBlockTitle}>
                        <span>Category</span>
                      </Typography>
                      <Typography sx={statusBlockTitle}>
                        {values.category}
                      </Typography>
                    </Box>
                  )}

                  {editMode && user.current_role === AUDITOR && (
                    <Box sx={[statusBlockAlign, { mt: '20px' }]}>
                      <FormControlLabel
                        label={
                          <Typography
                            sx={{ fontSize: '20px', fontWeight: 500 }}
                          >
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
                  )}
                </Box>

                {user.current_role === AUDITOR && !editMode && (
                  <Box sx={addIssueBox}>
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
                      Add issue
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default IssueDetailsForm;

const issueValidationSchema = Yup.object().shape({
  name: Yup.string().required('Title is required'),
  description: Yup.string().required('Description required'),
  severity: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  links: Yup.array().of(Yup.string().url()),
  include: Yup.boolean(),
  feedback: Yup.string(),
});

const nameInputSx = theme => ({
  '& > div': { borderRadius: 0 },
  '& fieldset': { borderColor: '#b9b9b9 !important' },
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

const editButtonText = theme => ({
  ml: '6px',
  color: theme.palette.secondary.main,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '17px',
});

const descriptionButtonsSx = {
  height: '40px',
  padding: '0 10px',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row-reverse',
  borderLeft: '1px solid #b9b9b9',
  borderRight: '1px solid #b9b9b9',
};

const editDescriptionButton = {
  display: 'flex',
  alignItems: 'flex-end',
};

const addLinkButton = {
  display: 'flex',
  alignItems: 'center',
};

const linksList = {
  border: '1px solid #b9b9b9',
  borderTop: 'none',
  padding: '0 15px 15px',
};

const linkFieldSx = {
  '& > div': { borderRadius: 0 },
  '& fieldset': { borderColor: '#b9b9b9' },
};

const customerLinksList = {
  display: 'flex',
  flexDirection: 'column',
  '& p': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
  },
};

const linkSx = theme => ({
  fontSize: '18px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
});

const markdownWrapper = {
  position: 'relative',
  '& .rc-md-editor': {
    borderBottom: 'none',
  },
  '& .rc-md-navigation.visible': {
    borderRight: '1px solid #b9b9b9',
    borderBottom: '1px solid #b9b9b9',
  },
  '& .section': {
    borderRightColor: '#b9b9b9 !important',
  },
  '& .sec-md.visible': {
    borderBottom: '1px solid #b9b9b9',
  },
};

const markdownSx = matchXs => ({
  height: '550px',
  backgroundColor: '#fcfaf6',
  fontWeight: 500,
  fontSize: '20px !important',
  lineHeight: '24px',
  borderLeft: '1px solid #b9b9b9',
  borderTop: matchXs ? '1px solid #b9b9b9' : 'none',
  borderRight: 'none',
});

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
  justifyContent: 'space-between',
  width: '20%',
  padding: '40px 10px 0px 25px',
  [theme.breakpoints.down('sm')]: {
    width: '30%',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '40px 10px',
    alignItems: 'center',
    width: '80%',
  },
});

const statusBlockAlign = theme => ({
  textAlign: 'left',
  [theme.breakpoints.down('xs')]: {
    textAlign: 'center',
  },
});

const statusBlockTitle = theme => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: '10px',
  fontSize: '20px',
  fontWeight: 500,
  mb: '5px',
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'center',
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

const selectFieldSx = theme => ({
  '& > fieldset': { border: 'none' },
  '& > svg': { display: 'none' },
  '& > div': {
    padding: '0 !important',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
    },
  },
});

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

const addIssueBox = {
  display: 'flex',
  justifyContent: 'flex-end',
  pt: '20px',
  position: 'relative',
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'center',
    pt: 0,
    mb: '20px',
  },
};

const addIssueButton = theme => ({
  padding: '16px 10px',
  width: '100%',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '20px',
  lineHeight: '25px',
  [theme.breakpoints.down('md')]: {
    padding: '12px 6px',
    letterSpacing: '-0.5px',
    fontSize: '18px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '14px',
    padding: '10px 30px',
    mt: '20px',
  },
});
