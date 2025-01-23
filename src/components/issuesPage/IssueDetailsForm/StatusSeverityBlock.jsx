import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { addSpacesToCamelCase, addTestsLabel } from '../../../lib/helper.js';
import StatusControl from '../StatusControl.jsx';
import { AUDITOR, CUSTOMER, RESOLVED } from '../../../redux/actions/types.js';
import ArrowIcon from '../../icons/ArrowIcon.jsx';
import { Field } from 'formik';
import { Select } from 'formik-mui';
import IssueSeverity from '../IssueSeverity.jsx';
import theme from '../../../styles/themes.js';
import {
  DRAFT,
  FIXED,
  IN_PROGRESS,
  NOT_FIXED,
  VERIFICATION,
  WILL_NOT_FIX,
} from '../constants.js';
import NoteAddIcon from '@mui/icons-material/NoteAdd.js';
import FeedbackIcon from '@mui/icons-material/Feedback';

const StatusSeverityBlock = ({
  issue,
  editMode,
  values,
  setFieldValue,
  handleSubmit,
  hideControl,
  dirty,
  user,
  audit,
  isEditFeedback,
  setIsEditFeedback,
  isPublic,
}) => {
  const [severityListOpen, setSeverityListOpen] = useState(false);
  const [statusListOpen, setStatusListOpen] = useState(false);
  const matchXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const matchXxs = useMediaQuery(theme => theme.breakpoints.down('xxs'));

  return (
    <Box sx={issueStatusBlock}>
      <Box
        sx={issueWrapperSx(
          theme,
          isPublic,
          audit?.status?.toLowerCase() === RESOLVED?.toLowerCase(),
          hideControl,
          (issue?.status || values?.status) === 'Draft',
          user?.current_role?.toLowerCase() === CUSTOMER?.toLowerCase(),
          !isEditFeedback && !issue?.feedback,
        )}
      >
        {(user?.current_role?.toLowerCase() !== CUSTOMER?.toLowerCase() ||
          isPublic) &&
          !editMode &&
          matchXxs && (
            <Box sx={[buttonsBox, blockSx]}>
              {!dirty ? (
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
              )}
            </Box>
          )}

        <Box
          sx={issueInnerWrapperSx(
            theme,
            (issue?.status || values?.status) === 'Draft',
            audit?.status?.toLowerCase() === RESOLVED?.toLowerCase(),
            user?.current_role?.toLowerCase() === CUSTOMER?.toLowerCase(),
          )}
        >
          <Box sx={statusBlockAlign}>
            <Typography
              onClick={() => isPublic && setStatusListOpen(true)}
              sx={[
                statusBlockTitle,
                { cursor: isPublic ? 'pointer' : 'default' },
              ]}
            >
              {isPublic && <ArrowIcon size={matchXs ? 'small' : 'medium'} />}
              <span>Status:</span>
            </Typography>
            {!isPublic ? (
              <Typography
                sx={statusValueSx(theme, issue?.status || values.status)}
              >
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
                      <IssueSeverity
                        text={
                          selected === WILL_NOT_FIX ? 'Will not fix' : selected
                        }
                      />
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
                  value={WILL_NOT_FIX}
                  sx={severityMenuItem}
                  classes={{ selected: 'selected-severity' }}
                >
                  Will not fix
                </MenuItem>
              </Field>
            )}
          </Box>

          {editMode &&
            !isPublic &&
            !hideControl &&
            audit?.status?.toLowerCase() !== RESOLVED?.toLowerCase() && (
              <StatusControl
                status={issue.status}
                setFieldValue={setFieldValue}
              />
            )}
        </Box>

        {(user?.current_role?.toLowerCase() !== CUSTOMER?.toLowerCase() ||
          isPublic) &&
        audit?.status?.toLowerCase() !== RESOLVED?.toLowerCase() ? (
          <Box sx={[severityWrapper, blockSx]}>
            <Typography
              sx={[statusBlockTitle, { cursor: 'pointer' }]}
              onClick={() => {
                if (!hideControl) {
                  setSeverityListOpen(true);
                }
              }}
            >
              <ArrowIcon size={matchXs ? 'small' : 'medium'} />
              <span>Severity</span>
            </Typography>
            <Field
              open={severityListOpen}
              onClose={() => setSeverityListOpen(false)}
              onOpen={() => {
                if (!hideControl) {
                  setSeverityListOpen(true);
                }
              }}
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
          <Box
            sx={[
              statusBlockAlign,
              { pointerEvents: 'none' },
              blockSx(theme, !!issue),
            ]}
          >
            <Typography sx={statusBlockTitle}>
              <span>Severity</span>
            </Typography>
            <IssueSeverity text={values.severity} />
          </Box>
        )}

        {editMode &&
          user?.current_role?.toLowerCase() === AUDITOR?.toLowerCase() &&
          !isPublic &&
          !hideControl && (
            <Box sx={includeSx}>
              <FormControlLabel
                label={
                  <Typography sx={includeSxTitle}>
                    Include in the report
                  </Typography>
                }
                control={
                  <Switch
                    size={matchXs ? 'small' : 'medium'}
                    checked={values.include}
                    color="secondary"
                    disabled={
                      user?.current_role?.toLowerCase() ===
                        CUSTOMER?.toLowerCase() ||
                      audit?.status?.toLowerCase() === RESOLVED?.toLowerCase()
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

      {!isPublic &&
        !hideControl &&
        editMode &&
        audit?.status?.toLowerCase() !== RESOLVED?.toLowerCase() &&
        (user?.current_role?.toLowerCase() === CUSTOMER?.toLowerCase() ||
          user?.current_role?.toLowerCase() === AUDITOR?.toLowerCase()) &&
        !isEditFeedback &&
        !issue?.feedback && (
          <Box sx={buttonsBox}>
            <Tooltip
              arrow
              placement="top"
              title={
                user?.current_role?.toLowerCase() === AUDITOR?.toLowerCase()
                  ? 'Customer feedback will be included in the report. Do not edit this field without a reasonable cause.'
                  : 'Customer feedback will be included in the report'
              }
            >
              <Button
                variant="contained"
                color="primary"
                sx={[issueButton, feedbackButton]}
                onClick={() => setIsEditFeedback(prev => !prev)}
                {...addTestsLabel('feedback-button')}
              >
                <FeedbackIcon />
              </Button>
            </Tooltip>
          </Box>
        )}
    </Box>
  );
};

export default StatusSeverityBlock;

const includeSx = theme => ({
  position: 'absolute',
  top: 4,
  right: '30px',
  [theme.breakpoints.down('md')]: {
    right: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    right: '10px',
  },
  [theme.breakpoints.down('xs')]: {
    top: 10,
  },
});

const includeSxTitle = theme => ({
  fontSize: '16px!important',
  fontWeight: 500,
  [theme.breakpoints.down('xs')]: {
    fontSize: '14px!important',
  },
});

const issueWrapperSx = (
  theme,
  isPublic,
  isResolved,
  hideControl,
  isDraft,
  isCustomer,
  isShowFeedbackBtn,
) => ({
  display: 'flex',
  flexGrow: 1,
  gap: '35px',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    gap: '25px!important',
    width: '100%',
  },
  [theme.breakpoints.down('xs')]: {
    flexWrap: 'wrap',
  },
  [theme.breakpoints.down(640)]: {
    justifyContent:
      isPublic || isResolved || hideControl || isDraft
        ? 'space-around'
        : 'center',
    flexDirection:
      isPublic || isResolved || hideControl || isDraft ? 'row' : 'column',
    columnGap: '0px!important',
    rowGap: '15px!important',
    ml: isCustomer && isShowFeedbackBtn ? '50px' : 0,
  },
  [theme.breakpoints.down(450)]: {
    flexDirection: (!hideControl && isDraft) || isCustomer ? 'column' : 'row',
  },
  [theme.breakpoints.down('xxs')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.down(370)]: {
    ml: 0,
    mb: isCustomer && isShowFeedbackBtn ? '15px' : 0,
  },
});

const issueInnerWrapperSx = (theme, isDraft, isResolved, isCustomer) => ({
  gap: '15px',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.down(540)]: {
    flexDirection: !isResolved && isCustomer ? 'column' : 'row',
  },
  [theme.breakpoints.down(435)]: {
    width: '100%',
    flexDirection: isDraft ? 'row' : 'column',
  },
});

const issueStatusBlock = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '20px 0',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    padding: '10px 0px',
    margin: '0',
  },
  [theme.breakpoints.down(370)]: {
    flexDirection: 'column',
  },
});

const statusBlockAlign = theme => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  '& > p': {
    mr: '10px',
    [theme.breakpoints.down('xs')]: {
      mr: '6px',
    },
  },
});

const statusBlockTitle = theme => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: '10px',
  fontSize: '16px!important',
  fontWeight: 500,
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.down(650)]: {
    fontSize: '14px!important',
  },
});

const severityWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  '& div.MuiFormControl-root': {
    width: '100%',
  },
  '& > p': {
    mr: '15px',
    [theme.breakpoints.down('xs')]: {
      mr: '10px',
    },
  },
});

const blockSx = theme => ({
  [theme.breakpoints.down(500)]: {
    boxSizing: 'unset',
    padding: 'unset',
    alignItems: 'center!important',
  },
});

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
  '& #mui-component-select-severity': {
    justifyContent: 'center',
  },
  '& #mui-component-select-status': {
    justifyContent: 'center',
  },
});

const statusValueSx = (theme, status) => {
  let color = '#434242';
  if (status === DRAFT) color = '#52176D';
  if (status === VERIFICATION || status === IN_PROGRESS) color = '#5b97bb';
  if (status === FIXED || status === NOT_FIXED || status === WILL_NOT_FIX)
    color = '#09C010';

  return {
    fontSize: '16px!important',
    fontWeight: 500,
    color,
    mr: '0!important',
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px!important',
    },
  };
};

const buttonsBox = theme => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '10px',
  position: 'relative',
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'center',
    pt: 0,
  },
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
});

const feedbackButton = theme => ({
  ml: '10px',
  [theme.breakpoints.down(370)]: {
    ml: 0,
  },
});
