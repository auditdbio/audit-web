import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined.js';
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { addTestsLabel, isAuth, reportBuilder } from '../../lib/helper.js';
import {
  AUDITOR,
  CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR,
  CUSTOMER,
  RESOLVED,
} from '../../redux/actions/types.js';
import ResolveAuditConfirmation from './ResolveAuditConfirmation.jsx';
import {
  discloseAllIssues,
  setReadAll,
} from '../../redux/actions/issueAction.js';
import { DRAFT, FIXED, NOT_FIXED } from './constants.js';
import {
  clearMessage,
  downloadReport,
  getPublicReport,
  savePublicReport,
} from '../../redux/actions/auditAction.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import {
  changeRolePublicAuditor,
  clearUserSuccess,
} from '../../redux/actions/userAction.js';
import theme from '../../styles/themes.js';
import { BASE_URL } from '../../services/urls.js';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import DraftsIcon from '@mui/icons-material/Drafts';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DiscloseIcon from '../icons/DiscloseIcon.jsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf.js';

const Control = ({
  issues,
  search,
  setSearch,
  setPage,
  setSearchParams,
  isPublic,
  setIsOpenReset,
  handleSubmit,
  saved,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditId } = useParams();
  const [resolveConfirmation, setResolveConfirmation] = useState(false);
  const [allIssuesClosed, setAllIssuesClosed] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const { user } = useSelector(s => s.user);
  const audit = useSelector(s =>
    s.audits.audits?.find(audit => audit.id === auditId),
  );
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const { auditor } = useSelector(s => s.auditor);
  const { customer } = useSelector(s => s.customer);
  const issuesArray = useSelector(s => s.issues.issues);
  const report = JSON.parse(localStorage.getItem('report'));
  const [openMessage, setOpenMessage] = useState(false);
  const auditMessage = useSelector(s => s.audits.successMessage);
  const xss = useMediaQuery(theme.breakpoints.down(666));

  const handleSearch = e => {
    setSearch(e.target.value);
    setPage(1);
    setSearchParams({ search: e.target.value, page: 1 });
  };

  const handleNewIssue = () => {
    if (isPublic) {
      navigate(`/public-issues/new-issue/${auditId}`);
    } else if (saved) {
      navigate(`/private-issues/new-issue/${auditId}`);
    } else {
      navigate(`/issues/new-issue/${auditId}`);
    }
    window.scrollTo(0, 0);
  };

  const handleReadAllEvents = () => {
    dispatch(setReadAll(auditId));
    setMenuAnchorEl(null);
  };

  const handleDiscloseAll = () => {
    dispatch(discloseAllIssues(auditId));
    setMenuAnchorEl(null);
  };

  const handleSavePublicAudit = async () => {
    if (report?.auditor_name && report?.project_name && report?.description) {
      if (isAuth()) {
        if (user.current_role === CUSTOMER) {
          const data = {
            ...report,
            isPublic: true,
            issues: [...issuesArray],
          };
          await dispatch(changeRolePublicAuditor(AUDITOR, user.id, data, true));
        } else {
          const data = {
            auditor_id: auditor.user_id,
            auditor_first_name: auditor.first_name,
            auditor_last_name: auditor.last_name,
            auditor_contacts: auditor.contacts,
            avatar: auditor.avatar,
            ...report,
            isPublic: true,
            issues: [...issuesArray],
            status: 'Started',
          };
          if (auditor?.user_id) {
            await dispatch(savePublicReport(data));
          } else {
            dispatch({
              type: CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR,
              payload: user,
            });
            const role = user.current_role?.[0];
            const link_id =
              (role === AUDITOR ? auditor?.link_id : customer?.link_id) ||
              user.id;
            navigate(`/${role}/${link_id}`);
          }
        }
      } else {
        navigate('/sign-in');
      }
    } else {
      setOpenMessage(true);
    }
  };

  const handleGenerateReport = () => {
    if (isPublic) {
      if (report?.auditor_name && report?.project_name && report?.description) {
        if (isAuth()) {
          if (user.current_role === AUDITOR) {
            const linkId = auditor.link_id || auditor.user_id;
            report.profile_link = linkId
              ? `${BASE_URL}a/${linkId}`
              : `${BASE_URL}disclaimer/`;
          } else if (user.current_role === CUSTOMER) {
            const linkId = customer.link_id || customer.user_id;
            report.profile_link = linkId
              ? `${BASE_URL}c/${linkId}`
              : `${BASE_URL}disclaimer/`;
          }
        }
        const newData = reportBuilder(report, issuesArray);
        dispatch(getPublicReport(newData, { generate: true }));
      } else {
        handleSubmit();
        setOpenMessage(true);
      }

      setMenuAnchorEl(null);
    } else {
      dispatch(downloadReport(audit, { generate: true }));
      setMenuAnchorEl(null);
    }
  };

  const handleDownloadReport = () => {
    if (audit?.report_name) {
      dispatch(downloadReport(audit));
    } else {
      dispatch(downloadReport(audit, { generate: true }));
    }
  };

  const checkDraftIssues = () => {
    return !issues?.some(issue => issue.status === DRAFT);
  };

  useEffect(() => {
    const allClosed = issues?.every(
      issue =>
        issue.status === FIXED || issue.status === NOT_FIXED || !issue.include,
    );
    setAllIssuesClosed(allClosed);
  }, [issues]);

  const handleCloseSnack = () => {
    setOpenMessage(false);
    if (auditMessage) {
      dispatch(clearMessage());
    }
  };

  return (
    <>
      <ResolveAuditConfirmation
        isOpen={resolveConfirmation}
        setIsOpen={setResolveConfirmation}
        audit={audit}
      />
      {matchMd && !saved && !isPublic && user?.current_role !== CUSTOMER && (
        <Box sx={{ width: '100%' }}>
          <Typography variant={'h3'} sx={{ mb: '10px' }}>
            Issue actions
          </Typography>
          <Divider sx={{ width: '100%' }} />
        </Box>
      )}
      {isPublic ? (
        <Box sx={publicBtnWrapper}>
          <CustomSnackbar
            autoHideDuration={5000}
            open={openMessage || auditMessage}
            severity={(auditMessage && 'success') || (openMessage && 'error')}
            text={
              auditMessage
                ? auditMessage
                : openMessage && 'Please fill in all mandatory fields'
            }
            onClose={handleCloseSnack}
          />
          {!saved && (
            <Button
              variant="contained"
              color="secondary"
              sx={[buttonSx, { marginRight: '0!important' }, publicBtnSx]}
              onClick={handleGenerateReport}
            >
              Generate report
            </Button>
          )}
          {!saved && (
            <Button
              sx={[buttonSx, { marginRight: '0!important' }, publicBtnSx]}
              onClick={() => {
                handleSavePublicAudit();
              }}
              variant={'contained'}
            >
              Save to AuditDB
            </Button>
          )}
          {!saved && (
            <Button
              variant={'contained'}
              type={'button'}
              color={'secondary'}
              onClick={() => setIsOpenReset(true)}
              sx={[buttonSx, { marginRight: '0!important' }, publicBtnSx]}
            >
              Reset form
            </Button>
          )}
        </Box>
      ) : (
        <>
          {xss && saved && (
            <Box sx={publicBtnWrapper}>
              <Button
                variant="contained"
                color="secondary"
                sx={[buttonSx, (isPublic || saved) && xss ? publicBtnSx : {}]}
                onClick={handleGenerateReport}
              >
                Generate report
              </Button>
            </Box>
          )}
        </>
      )}
      <Box
        sx={[
          user?.current_role === CUSTOMER
            ? customerViewSx
            : isPublic || saved
            ? wrapperPublic
            : wrapper,
        ]}
      >
        <Box sx={[isPublic || saved ? publicSearchBlock : searchBlock]}>
          {saved && !xss && (
            <Button
              variant="contained"
              color="secondary"
              sx={[buttonSx, (isPublic || saved) && xss ? publicBtnSx : {}]}
              onClick={handleGenerateReport}
            >
              Generate report
            </Button>
          )}

          <TextField
            variant="outlined"
            size="small"
            sx={textFieldSx}
            value={search}
            onChange={handleSearch}
            inputProps={{ ...addTestsLabel('search-input') }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {user?.current_role !== CUSTOMER ? (
          <Box
            sx={[
              buttonBoxSx,
              isPublic || saved ? { width: 'unset!important' } : {},
            ]}
          >
            {audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (
              <>
                <Box sx={issueActionWrapperSx}>
                  <Tooltip arrow placement="top" title={'New issue'}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={[
                        buttonSx,
                        (isPublic || saved) && xss ? publicBtnSx : {},
                        isPublic || saved ? singleButtonSx : {},
                      ]}
                      disabled={
                        audit?.status?.toLowerCase() === RESOLVED.toLowerCase()
                      }
                      onClick={handleNewIssue}
                      {...addTestsLabel('new-issue-button')}
                    >
                      {/*New issue*/}
                      <NoteAddIcon />
                    </Button>
                  </Tooltip>
                  {user.current_role === AUDITOR && !saved && !isPublic && (
                    <Tooltip arrow placement="top" title={'Disclose all'}>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={[
                          buttonSx,
                          (isPublic || saved) && xss ? publicBtnSx : {},
                        ]}
                        disabled={checkDraftIssues()}
                        onClick={handleDiscloseAll}
                      >
                        {/*Disclose all*/}
                        {/*<UnfoldMoreIcon />*/}
                        <DiscloseIcon />
                      </Button>
                    </Tooltip>
                  )}
                  {!isPublic && !saved && (
                    <Tooltip arrow placement="top" title={'Mark all as read'}>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={[
                          buttonSx,
                          (isPublic || saved) && xss ? publicBtnSx : {},
                        ]}
                        onClick={handleReadAllEvents}
                      >
                        {/*Mark all as read*/}
                        <DraftsIcon />
                      </Button>
                    </Tooltip>
                  )}
                </Box>
              </>
            ) : (
              <Tooltip arrow placement="top" title={'Download report'}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={[buttonSx, { width: '100%' }, generateButtonSx]}
                  onClick={handleDownloadReport}
                  {...addTestsLabel('auditor-report-button')}
                >
                  <PictureAsPdfIcon />
                </Button>
              </Tooltip>
            )}
          </Box>
        ) : !isPublic ? (
          <Box className={'customer-button-wrapper'}>
            <Tooltip arrow placement="top" title={'Download report'}>
              <Button
                variant="contained"
                color="primary"
                disabled={!audit?.report}
                onClick={() => dispatch(downloadReport(audit))}
                sx={buttonSx}
                {...addTestsLabel('customer-report-button')}
              >
                <PictureAsPdfIcon />
              </Button>
            </Tooltip>
            <Tooltip arrow placement="top" title={'Mark all as read'}>
              <Button
                variant="contained"
                color="secondary"
                sx={[buttonSx, (isPublic || saved) && xss ? publicBtnSx : {}]}
                onClick={handleReadAllEvents}
              >
                <DraftsIcon />
              </Button>
            </Tooltip>
          </Box>
        ) : (
          <Tooltip arrow placement="top" title={'New issue'}>
            <Button
              variant="contained"
              color="secondary"
              sx={[buttonSx]}
              disabled={audit?.status?.toLowerCase() === RESOLVED.toLowerCase()}
              onClick={handleNewIssue}
              {...addTestsLabel('new-issue-button')}
            >
              <NoteAddIcon />
            </Button>
          </Tooltip>
        )}
      </Box>
      <ResolveAuditConfirmation
        isOpen={resolveConfirmation}
        setIsOpen={setResolveConfirmation}
        audit={audit}
      />
    </>
  );
};

export default Control;

const generateButtonSx = theme => ({
  width: '270px',
  [theme.breakpoints.down('md')]: {
    width: '240px',
  },
  [theme.breakpoints.down(630)]: {
    width: '100%',
  },
});

const customerViewSx = theme => ({
  width: '100%',
  display: 'flex',
  gap: '15px',
  '& .MuiInputBase-root': {
    paddingY: 0,
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiButtonBase-root': {
      width: '190px',
    },
  },
  [theme.breakpoints.down(769)]: {
    '& .MuiBox-root': {
      marginTop: 'unset',
    },
    '& .MuiButtonBase-root': {
      width: '160px',
    },
    '& .customer-button-wrapper': {
      display: 'flex',
    },
  },
  [theme.breakpoints.down(700)]: {
    flexDirection: 'column',
    gap: '15px',
    '& .customer-button-wrapper': {
      gap: '15px',
      flexDirection: 'column',
    },
    '& .MuiButtonBase-root': {
      width: '100%',
      margin: 0,
    },
  },
});

const publicBtnWrapper = theme => ({
  display: 'flex',
  width: '100%',
  mb: '10px',
  justifyContent: 'center',
  gap: '15px',
  [theme.breakpoints.down(690)]: {
    flexDirection: 'column-reverse',
  },
});

const wrapper = theme => ({
  display: 'flex',
  width: '100%',
  mb: '10px',
  gap: '25px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column-reverse',
  },
});

const wrapperPublic = theme => ({
  display: 'flex',
  width: '100%',
  mb: '10px',
  gap: '15px',
  [theme.breakpoints.down(555)]: {
    flexDirection: 'column-reverse',
  },
});

const searchBlock = theme => ({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    mt: '20px',
  },
});

const publicSearchBlock = theme => ({
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  [theme.breakpoints.down(555)]: {
    mt: '20px',
    mr: 0,
  },
});

const textFieldSx = theme => ({
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    '& .MuiInputBase-root': {
      paddingY: '3.5px',
    },
  },
});

const menuButton = theme => ({
  width: '42px',
  height: '45px',
  borderRadius: '8px',
  background: theme.palette.secondary.main,
  padding: 0,
  mr: '20px',
  '&:hover': {
    filter: 'brightness(0.8)',
    background: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    width: '39px',
    height: '39px',
  },
});

const buttonBoxSx = theme => ({
  display: 'flex',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
  [theme.breakpoints.down(630)]: {
    flexDirection: 'column',
    gap: '15px',
  },
});

const issueActionWrapperSx = theme => ({
  display: 'flex',
  [theme.breakpoints.down(630)]: {
    justifyContent: 'center',
  },
});

const buttonSx = theme => ({
  padding: '8.5px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  '&:not(:last-child)': {
    mr: '15px',
  },
  width: '50px!important',
  minWidth: '50px',
  borderRadius: '10px',
});

const publicBtnSx = theme => ({
  width: '213px',
  [theme.breakpoints.down('sm')]: {
    width: '185px',
  },
  [theme.breakpoints.down(690)]: {
    width: '100%',
    mr: 0,
  },
});

const singleButtonSx = theme => ({
  [theme.breakpoints.down(690)]: {
    width: '130px!important',
    mr: 0,
  },
  [theme.breakpoints.down(555)]: {
    width: '100%!important',
  },
});
