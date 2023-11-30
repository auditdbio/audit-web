import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Switch,
  Typography,
} from '@mui/material';
import { addSpacesToCamelCase, addTestsLabel } from '../../../lib/helper.js';
import StatusControl from '../StatusControl.jsx';
import { AUDITOR, CUSTOMER, RESOLVED } from '../../../redux/actions/types.js';
import ArrowIcon from '../../icons/ArrowIcon.jsx';
import { Field } from 'formik';
import { Select, TextField } from 'formik-mui';
import IssueSeverity from '../IssueSeverity.jsx';
import SaveIcon from '@mui/icons-material/Save.js';
import theme from '../../../styles/themes.js';
import {
  DRAFT,
  FIXED,
  IN_PROGRESS,
  NOT_FIXED,
  VERIFICATION,
} from '../constants.js';

const StatusSeverityBlock = ({
  issue,
  editMode,
  values,
  setFieldValue,
  handleSubmit,
  errors,
  touched,
  dirty,
  user,
  audit,
  isEditFeedback,
  setIsEditFeedback,
  isPublic,
}) => {
  const [severityListOpen, setSeverityListOpen] = useState(false);
  const [statusListOpen, setStatusListOpen] = useState(false);
  const [categoryPrevVal, setCategoryPrevVal] = useState(issue?.category || '');

  return (
    <Box sx={issueStatusBlock}>
      <Box>
        <Box sx={{ mb: '20px' }}>
          <Box sx={statusBlockAlign}>
            <Typography
              onClick={() => isPublic && setStatusListOpen(true)}
              sx={statusBlockTitle}
            >
              {isPublic && <ArrowIcon />}
              <span>Status</span>
            </Typography>
            {!isPublic ? (
              <Typography sx={statusValueSx(issue?.status || values.status)}>
                {addSpacesToCamelCase(issue?.status || values.status)}
              </Typography>
            ) : (
              <Field
                open={statusListOpen}
                onClose={() => setStatusListOpen(false)}
                onOpen={() => setStatusListOpen(true)}
                onChange={e => {
                  setFieldValue('status', e.target.value);
                  if (editMode) handleSubmit();
                }}
                disabled={false}
                component={Select}
                name="status"
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
                  value={FIXED}
                  sx={severityMenuItem}
                  classes={{ selected: 'selected-severity' }}
                >
                  Fixed
                </MenuItem>
                <MenuItem
                  value={NOT_FIXED}
                  sx={severityMenuItem}
                  classes={{ selected: 'selected-severity' }}
                >
                  NotFixed
                </MenuItem>
              </Field>
            )}
          </Box>

          {editMode &&
            !isPublic &&
            audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() && (
              <StatusControl
                status={issue.status}
                setFieldValue={setFieldValue}
              />
            )}
        </Box>

        {(user.current_role !== CUSTOMER || isPublic) &&
        audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (
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

        {user.current_role === AUDITOR &&
        !isPublic &&
        audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (
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
                            <SaveIcon color="secondary" fontSize="small" />
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
            {!isPublic && (
              <Typography sx={statusBlockTitle}>
                <span>Category</span>
              </Typography>
            )}
            <Typography sx={statusBlockTitle}>{values.category}</Typography>
          </Box>
        )}

        {editMode && user.current_role === AUDITOR && !isPublic && (
          <Box sx={[statusBlockAlign, { mt: '20px' }]}>
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
                  disabled={
                    user.current_role === CUSTOMER ||
                    audit?.status?.toLowerCase() === RESOLVED.toLowerCase()
                  }
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

      {(user.current_role !== CUSTOMER || isPublic) && !editMode && (
        <Box sx={buttonsBox}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!dirty}
            sx={issueButton}
            {...addTestsLabel('new-issue-button')}
          >
            Add issue
          </Button>
        </Box>
      )}

      {!isPublic &&
        user.current_role === CUSTOMER &&
        !isEditFeedback &&
        !issue?.feedback && (
          <Box sx={buttonsBox}>
            <Button
              variant="contained"
              color="primary"
              sx={[issueButton, feedbackButton]}
              onClick={() => setIsEditFeedback(prev => !prev)}
              {...addTestsLabel('feedback-button')}
            >
              Send feedback
            </Button>
          </Box>
        )}
    </Box>
  );
};

export default StatusSeverityBlock;

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
  if (status === DRAFT) color = '#52176D';
  if (status === VERIFICATION || status === IN_PROGRESS) color = '#5b97bb';
  if (status === FIXED || status === NOT_FIXED) color = '#09C010';

  return { fontSize: '20px', fontWeight: 500, mb: '10px', color };
};

const categoryInput = theme => ({
  '& fieldset': { borderWidth: 0 },
  '& input': {
    [theme.breakpoints.down('xs')]: { textAlign: 'center' },
  },
});

const buttonsBox = {
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

const issueButton = theme => ({
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

const feedbackButton = theme => ({
  fontSize: '18px',
  padding: '6px 6px',
  [theme.breakpoints.down('md')]: {
    padding: '4px 6px',
    fontSize: '16px',
  },
});
