import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import {
  addAuditIssue,
  addPublicIssue,
  updateAuditIssue,
  updatePublicIssue,
} from '../redux/actions/issueAction.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { clearMessage } from '../redux/actions/auditAction.js';
import { RESOLVED } from '../redux/actions/types.js';
import { addTestsLabel } from '../lib/helper.js';
import DescriptionBlock from '../components/issuesPage/IssueDetailsForm/DescriptionBlock.jsx';
import StatusSeverityBlock from '../components/issuesPage/IssueDetailsForm/StatusSeverityBlock.jsx';
import { NOT_FIXED, WILL_NOT_FIX } from '../components/issuesPage/constants.js';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const PublicIssueDetailsForm = ({ issue = null, editMode = false, saved }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditId, issueId } = useParams();
  const publicIssues = JSON.parse(localStorage.getItem('publicIssues') || '[]');
  const matchXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const user = useSelector(s => s.user.user);
  const { successMessage, error } = useSelector(s => s.issues);
  const audit = useSelector(s =>
    s.audits.audits?.find(audit => audit.id === auditId),
  );
  const issues = useSelector(s => s.issues.issues);

  const [isEditName, setIsEditName] = useState(!editMode);
  const [issuePrevValues, setIssuePrevValues] = useState(null);
  const [isEditFeedback, setIsEditFeedback] = useState(false);
  const nameInputRef = useRef();

  const handleNameEdit = handleSubmit => {
    if (isEditName) {
      handleSubmit();
    }
    setIsEditName(prev => !prev);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const initialValues = {
    name: issue?.name || '',
    status: issue?.status || WILL_NOT_FIX,
    severity: issue?.severity || 'Medium',
    category: issue?.category || '',
    description: issue?.description || '',
    include: issue?.include ?? true,
    links: issue?.links || [],
    feedback: issue?.feedback || '',
    id: issue?.id,
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

      setIsEditName(false);
      setIssuePrevValues({ ...values, status: '' });
      const newValues = {
        ...prev,
        ...updatedValues,
        id: +issueId,
        auditId: +auditId,
      };
      delete newValues.events;
      const newArray = publicIssues.map(el => {
        return el.id === +issueId ? newValues : el;
      });
      if (saved) {
        dispatch(updateAuditIssue(auditId, issueId, updatedValues));
      } else {
        dispatch(updatePublicIssue(newValues));
        localStorage.setItem('publicIssues', JSON.stringify(newArray));
      }
    } else {
      if (saved) {
        dispatch(addAuditIssue(auditId, values));
        if (editMode) {
          navigate(-1);
        }
      } else {
        const newValue = { ...values, auditId: Date.now(), id: Date.now() };
        localStorage.setItem(
          'publicIssues',
          JSON.stringify([...publicIssues, newValue]),
        );
        dispatch(addPublicIssue(newValue));
        if (issues.length) {
          navigate(-1);
        }
      }
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
              <Box sx={{ display: 'flex', gap: '15px' }}>
                <Field
                  component={TextField}
                  name="name"
                  label="Issue title"
                  fullWidth={true}
                  disabled={
                    !isEditName ||
                    audit?.status?.toLowerCase() === RESOLVED.toLowerCase()
                  }
                  sx={nameInputSx}
                  inputRef={nameInputRef}
                  inputProps={{ ...addTestsLabel('issue-name-input') }}
                  InputProps={
                    audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() &&
                    editMode
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
                {!matchXs &&
                  (!dirty ? (
                    <Tooltip arrow placement="top" title={'New issue'}>
                      <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        // disabled={!dirty}
                        sx={[
                          issueButton,
                          {
                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.12)',
                            },
                          },
                        ]}
                        {...addTestsLabel('new-issue-button')}
                      >
                        <NoteAddIcon />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip arrow placement="top" title={'New issue'}>
                      <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        disabled={!dirty}
                        sx={issueButton}
                        {...addTestsLabel('new-issue-button')}
                      >
                        <NoteAddIcon />
                      </Button>
                    </Tooltip>
                  ))}
              </Box>
            </Tooltip>

            <Box sx={infoWrapperSx}>
              <DescriptionBlock
                isPublic={true}
                editMode={editMode}
                handleSubmit={handleSubmit}
                errors={errors}
                touched={touched}
                setFieldTouched={setFieldTouched}
                values={values}
                user={user}
                audit={audit}
                isEditFeedback={isEditFeedback}
                setIsEditFeedback={setIsEditFeedback}
              />

              <StatusSeverityBlock
                isPublic={true}
                user={user}
                dirty={dirty}
                values={values}
                setFieldValue={setFieldValue}
                touched={touched}
                errors={errors}
                issue={issue}
                editMode={editMode}
                handleSubmit={handleSubmit}
                audit={audit}
                isEditFeedback={isEditFeedback}
                setIsEditFeedback={setIsEditFeedback}
              />
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PublicIssueDetailsForm;

const issueValidationSchema = Yup.object().shape({
  name: Yup.string().required('Title is required'),
  description: Yup.string().required('Description required'),
  severity: Yup.string().required('Required'),
  category: Yup.string(),
  links: Yup.array().of(Yup.string()),
  include: Yup.boolean(),
  feedback: Yup.string(),
});

const issueButton = theme => ({
  padding: '11px 10px',
  width: '50px',
  minWidth: 'unset',
  height: '47px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '16px!important',
  lineHeight: '25px',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px!important',
    padding: '12px 6px',
    letterSpacing: '-0.5px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '10px 30px',
  },
});

const nameInputSx = theme => ({
  '& input': {
    fontSize: '22px',
    paddingY: '8px',
  },
  '& label': {
    top: '-6px',
  },
});

const editButtonText = theme => ({
  ml: '6px',
  color: theme.palette.secondary.main,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '17px',
});

const infoWrapperSx = theme => ({
  display: 'flex',
  flexDirection: 'column-reverse',
});
