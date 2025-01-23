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
import { addTestsLabel } from '../../../lib/helper.js';
import { AUDITOR, CUSTOMER, RESOLVED } from '../../../redux/actions/types.js';
import { clearMessage } from '../../../redux/actions/auditAction.js';
import {
  addAuditIssue,
  updateAuditIssue,
} from '../../../redux/actions/issueAction.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import DescriptionBlock from './DescriptionBlock.jsx';
import StatusSeverityBlock from './StatusSeverityBlock.jsx';
import { DRAFT } from '../constants.js';
import theme from '../../../styles/themes.js';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const IssueDetailsForm = ({ issue = null, editMode = false, hideControl }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditId, issueId } = useParams();
  const user = useSelector(s => s.user.user);
  const { successMessage, error } = useSelector(s => s.issues);
  const audit = useSelector(s =>
    s.audits.audits?.find(audit => audit.id === auditId),
  );
  const matchXxs = useMediaQuery(theme.breakpoints.down('xxs'));

  const [isEditName, setIsEditName] = useState(!editMode);
  const [isEditCategory, setIsEditCategory] = useState(!editMode);
  const [issuePrevValues, setIssuePrevValues] = useState(null);
  const [isEditFeedback, setIsEditFeedback] = useState(false);

  const nameInputRef = useRef();
  const categoryInputRef = useRef();

  const handleNameEdit = handleSubmit => {
    if (isEditName) {
      handleSubmit();
    }
    setIsEditName(prev => !prev);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const handleCategoryEdit = handleSubmit => {
    if (isEditCategory) {
      handleSubmit();
    }
    setIsEditCategory(prev => !prev);
    setTimeout(() => categoryInputRef.current?.focus(), 100);
  };

  const initialValues = {
    name: issue?.name || '',
    status: issue?.status || DRAFT,
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

      setIsEditName(false);
      setFieldValue('status', '');

      setIssuePrevValues({ ...values, status: '' });
      dispatch(updateAuditIssue(auditId, issueId, updatedValues));
    } else {
      dispatch(addAuditIssue(auditId, values));
      navigate(`/audit/${auditId}`);
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
              <Box sx={nameInputWrapper}>
                <Field
                  component={TextField}
                  name="name"
                  label="Title"
                  fullWidth={true}
                  disabled={
                    !isEditName ||
                    audit?.status?.toLowerCase() === RESOLVED.toLowerCase()
                  }
                  sx={nameInputSx(theme, values.name)}
                  inputRef={nameInputRef}
                  inputProps={{ ...addTestsLabel('issue-name-input') }}
                  InputProps={
                    user?.current_role?.toLowerCase() !==
                      CUSTOMER?.toLowerCase() &&
                    audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() &&
                    editMode &&
                    !hideControl
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
                {!matchXxs &&
                  !editMode &&
                  (!dirty ? (
                    <Tooltip arrow placement="top" title={'New issue'}>
                      <Button
                        variant="contained"
                        type="button"
                        color="primary"
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
                editMode={editMode}
                handleSubmit={handleSubmit}
                errors={errors}
                touched={touched}
                setFieldTouched={setFieldTouched}
                values={values}
                user={user}
                issue={issue}
                audit={audit}
                isEditFeedback={isEditFeedback}
                setIsEditFeedback={setIsEditFeedback}
                hideControl={hideControl}
              />

              <Field
                component={TextField}
                name="category"
                label="Category"
                fullWidth={true}
                disabled={
                  !isEditCategory ||
                  audit?.status?.toLowerCase() === RESOLVED.toLowerCase()
                }
                sx={categoryInputSx(theme, !!values.category)}
                inputRef={categoryInputRef}
                inputProps={{ ...addTestsLabel('issue-category-input') }}
                InputProps={
                  user?.current_role?.toLowerCase() !==
                    CUSTOMER?.toLowerCase() &&
                  audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() &&
                  editMode &&
                  !hideControl
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="start"
                              type="button"
                              aria-label="Edit category"
                              onClick={() => handleCategoryEdit(handleSubmit)}
                              sx={{ display: 'flex', alignItems: 'flex-end' }}
                              {...addTestsLabel('edit-category-button')}
                            >
                              <EditIcon color="secondary" fontSize="small" />
                              <Box component="span" sx={editButtonText}>
                                {isEditCategory ? 'Save' : 'Edit'}
                              </Box>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : null
                }
              />

              <StatusSeverityBlock
                user={user}
                dirty={dirty}
                values={values}
                setFieldValue={setFieldValue}
                touched={touched}
                errors={errors}
                issue={issue}
                hideControl={hideControl}
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

export default IssueDetailsForm;

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
  minWidth: 'unset',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '16px!important',
  lineHeight: '25px',
  width: '51px',
});

const nameInputWrapper = theme => ({
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    gap: '8px',
  },
});

const nameInputSx = (theme, isEmpty) => ({
  '& input': {
    fontSize: '22px',
    paddingY: '8px',
  },
  '& label': {
    top: !isEmpty ? '-6px' : '0px',
  },
});

const categoryInputSx = (theme, isEmpty) => ({
  mb: '5px',
  px: '1px',
  '& input': {
    fontSize: '16px',
    paddingY: '8px',
    [theme.breakpoints.down(650)]: {
      fontSize: '14px!important',
    },
  },
  '& > div': { borderRadius: 0 },
  '& > div > fieldset': { borderColor: '#e0e0e0 !important' },
  '& label': {
    fontSize: '16px',
    top: !isEmpty ? '-8px' : '0px',
    [theme.breakpoints.down(650)]: {
      fontSize: '14px!important',
    },
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
