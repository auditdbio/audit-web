import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  InputAdornment,
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
  // errors,
  // touched,
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
  // const [categoryPrevVal, setCategoryPrevVal] = useState(issue?.category || '');
  const matchXs = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const matchXxs = useMediaQuery(theme => theme.breakpoints.down('xxs'));

  return (
    <Box sx={issueStatusBlock}>
      <Box
        sx={[
          issueWrapperSx(theme, isPublic),
          !editMode ? { gap: '30px!important' } : {},
        ]}
      >
        {(user.current_role !== CUSTOMER || isPublic) &&
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
          sx={[
            issueInnerWrapperSx(
              theme,
              user.current_role.toLowerCase() === CUSTOMER.toLowerCase(),
              editMode,
            ),
          ]}
        >
          <Box sx={statusBlockAlign}>
            <Typography
              onClick={() => isPublic && setStatusListOpen(true)}
              sx={[
                statusBlockTitle,
                { cursor: isPublic ? 'pointer' : 'default' },
              ]}
            >
              {isPublic && <ArrowIcon />}
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
            audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() && (
              <StatusControl
                status={issue.status}
                setFieldValue={setFieldValue}
              />
            )}
        </Box>

        {(user.current_role !== CUSTOMER || isPublic) &&
        audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (
          <Box sx={[severityWrapper, blockSx]}>
            <Typography
              sx={[statusBlockTitle, { cursor: 'pointer' }]}
              onClick={() => {
                if (!hideControl) {
                  setSeverityListOpen(true);
                }
              }}
            >
              <ArrowIcon />
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

        {/*{(user.current_role === AUDITOR || isPublic) &&*/}
        {/*!hideControl &&*/}
        {/*audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (*/}
        {/*  <Box*/}
        {/*    sx={[*/}
        {/*      blockSx(theme, !!issue),*/}
        {/*      !!issue*/}
        {/*        ? {}*/}
        {/*        : {*/}
        {/*            [theme.breakpoints.down(800)]: {*/}
        {/*              width: '40%',*/}
        {/*            },*/}
        {/*          },*/}
        {/*    ]}*/}
        {/*  >*/}
        {/*    <Typography sx={[statusBlockTitle]}>*/}
        {/*      <span>Category</span>*/}
        {/*    </Typography>*/}
        {/*    <Field*/}
        {/*      component={TextField}*/}
        {/*      name="category"*/}
        {/*      placeholder="Enter a category"*/}
        {/*      disabled={false}*/}
        {/*      fullWidth={true}*/}
        {/*      sx={categoryInput}*/}
        {/*      onBlur={e => {*/}
        {/*        if (isPublic) {*/}
        {/*          setCategoryPrevVal(values.category);*/}
        {/*          if (editMode) {*/}
        {/*            handleSubmit();*/}
        {/*          }*/}
        {/*        }*/}
        {/*      }}*/}
        {/*      inputProps={{*/}
        {/*        sx: [*/}
        {/*          { padding: '4px 2px', fontSize: '18px' },*/}
        {/*          touched.category && errors.category*/}
        {/*            ? { border: '1px solid red', borderRadius: '6px' }*/}
        {/*            : {},*/}
        {/*        ],*/}
        {/*        ...addTestsLabel('issue-category-input'),*/}
        {/*      }}*/}
        {/*      InputProps={*/}
        {/*        user.current_role === AUDITOR &&*/}
        {/*        !isPublic &&*/}
        {/*        editMode &&*/}
        {/*        categoryPrevVal !== values.category*/}
        {/*          ? {*/}
        {/*              endAdornment: (*/}
        {/*                <InputAdornment position="end">*/}
        {/*                  <IconButton*/}
        {/*                    edge="end"*/}
        {/*                    type="button"*/}
        {/*                    aria-label="Save"*/}
        {/*                    onClick={() => {*/}
        {/*                      setCategoryPrevVal(values.category);*/}
        {/*                      handleSubmit();*/}
        {/*                    }}*/}
        {/*                    sx={{*/}
        {/*                      display: 'flex',*/}
        {/*                      alignItems: 'flex-end',*/}
        {/*                    }}*/}
        {/*                    {...addTestsLabel('save-category-button')}*/}
        {/*                  >*/}
        {/*                    <SaveIcon color="secondary" fontSize="small" />*/}
        {/*                  </IconButton>*/}
        {/*                </InputAdornment>*/}
        {/*              ),*/}
        {/*            }*/}
        {/*          : null*/}
        {/*      }*/}
        {/*    />*/}
        {/*  </Box>*/}
        {/*) : (*/}
        {/*  values.category && (*/}
        {/*    <Box sx={[statusBlockAlign, blockSx(theme, !!issue)]}>*/}
        {/*      {!isPublic && (*/}
        {/*        <Typography sx={statusBlockTitle}>*/}
        {/*          <span>Category</span>*/}
        {/*        </Typography>*/}
        {/*      )}*/}
        {/*      <Typography sx={statusBlockTitle}>{values.category}</Typography>*/}
        {/*    </Box>*/}
        {/*  )*/}
        {/*)}*/}

        {editMode &&
          user.current_role === AUDITOR &&
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

      {!isPublic &&
        !hideControl &&
        user.current_role === CUSTOMER &&
        !isEditFeedback &&
        !issue?.feedback && (
          <Box sx={buttonsBox}>
            <Tooltip arrow placement={'top'} title={'Send feedback'}>
              <Button
                variant="contained"
                color="primary"
                sx={[issueButton]}
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
  right: 0,
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

const issueWrapperSx = (theme, isPublic) => ({
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
    justifyContent: isPublic ? 'space-around' : 'center',
    flexDirection: isPublic ? 'row' : 'column',
    columnGap: '0px!important',
    rowGap: '15px!important',
  },
});

const issueInnerWrapperSx = (theme, isCustomer, editMode) => ({
  gap: '15px',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.down(500)]: {
    width: editMode ? '100%' : '48%',
  },
  [theme.breakpoints.down(430)]: {
    flexDirection: 'column',
  },
});

const issueStatusBlock = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '20px 0',
  alignItems: 'flex-start',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    padding: '10px 0px',
    alignItems: 'center',
    margin: '0',
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
    // width: '48%!important',
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

// const categoryInput = theme => ({
//   '& fieldset': { borderWidth: 0 },
//   '& input': {
//     [theme.breakpoints.down('xs')]: { textAlign: 'center' },
//   },
// });
