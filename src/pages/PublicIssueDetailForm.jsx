import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, InputAdornment, Tooltip } from '@mui/material';
import {
  addAuditIssue,
  addPublicIssue,
  updateAuditIssue,
  updatePublicIssue,
} from '../redux/actions/issueAction.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { clearMessage } from '../redux/actions/auditAction.js';
import { CUSTOMER, RESOLVED } from '../redux/actions/types.js';
import { addTestsLabel } from '../lib/helper.js';
import DescriptionBlock from '../components/issuesPage/IssueDetailsForm/DescriptionBlock.jsx';
import StatusSeverityBlock from '../components/issuesPage/IssueDetailsForm/StatusSeverityBlock.jsx';
import { DRAFT, NOT_FIXED } from '../components/issuesPage/constants.js';
import { createIssueEvent } from '../lib/createIssueEvent.js';

const PublicIssueDetailsForm = ({ issue = null, editMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditId, issueId } = useParams();
  const publicIssies = JSON.parse(localStorage.getItem('publicIssies') || '[]');

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
    status: issue?.status || NOT_FIXED,
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
        issue?.status || DRAFT,
        issue?.feedback,
      );
      setIsEditName(false);

      setIssuePrevValues({ ...values, status: '' });
      const newValues = {
        ...prev,
        ...updatedValuesWithEvent,
        id: +issueId,
        auditId: +auditId,
      };
      delete newValues.events;
      const newArray = publicIssies.map(el => {
        return el.id === +issueId ? newValues : el;
      });
      dispatch(updatePublicIssue(newValues));
      localStorage.setItem('publicIssies', JSON.stringify(newArray));
    } else {
      const newValue = { ...values, auditId: Date.now(), id: Date.now() };
      localStorage.setItem(
        'publicIssies',
        JSON.stringify([...publicIssies, newValue]),
      );
      dispatch(addPublicIssue(newValue));
      if (issues.length) {
        navigate(-1);
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
              <Box>
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
                    user.current_role !== CUSTOMER &&
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

const infoWrapperSx = theme => ({
  display: 'flex',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
