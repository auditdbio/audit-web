import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined.js';
import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { addTestsLabel } from '../../lib/helper.js';
import { AUDITOR, CUSTOMER, RESOLVED } from '../../redux/actions/types.js';
import ResolveAuditConfirmation from './ResolveAuditConfirmation.jsx';
import { discloseAllIssues } from '../../redux/actions/issueAction.js';
import { DRAFT, FIXED, NOT_FIXED } from './constants.js';
import {
  downloadReport,
  getPublicReport,
} from '../../redux/actions/auditAction.js';

const Control = ({ issues, search, setSearch, setPage, setSearchParams }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditId } = useParams();
  const [resolveConfirmation, setResolveConfirmation] = useState(false);
  const [allIssuesClosed, setAllIssuesClosed] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const user = useSelector(s => s.user.user);
  const audit = useSelector(s =>
    s.audits.audits?.find(audit => audit.id === auditId),
  );
  const issuesArray = useSelector(s => s.issues.issues);
  const report = JSON.parse(localStorage.getItem('report'));

  const isPublic = localStorage.getItem('isPublic');
  const handleSearch = e => {
    setSearch(e.target.value);
    setPage(1);
    setSearchParams({ search: e.target.value, page: 1 });
  };

  const handleNewIssue = () => {
    navigate(`/issues/new-issue/${auditId}`);
    window.scrollTo(0, 0);
  };

  const handleOpenMenu = e => {
    setMenuAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleDiscloseAll = () => {
    dispatch(discloseAllIssues(auditId));
    setMenuAnchorEl(null);
  };

  const handleGenerateReport = () => {
    if (isPublic) {
      const newData = {
        auditor_name: report.auditor_name,
        auditor_email: report.email,
        profile_link: 'https://auditDb.io',
        project_name: report.project_name,
        report_data: [
          {
            type: 'plain_text',
            title: 'Summary',
            include_in_toc: true,
            subsections: [
              {
                type: 'project_description',
                title: 'Project description',
                text: report.description,
                include_in_toc: true,
              },
              {
                type: 'scope',
                title: 'Scope',
                text: '',
                include_in_toc: true,
                links: report.scope,
              },
            ],
          },
          {
            type: 'statistics',
            title: 'Issue statistics',
            include_in_toc: true,
            statistics: {
              total: issuesArray.length,
              fixed: {
                critical: issuesArray.filter(
                  issue =>
                    issue.severity === 'Critical' && issue.status === 'Fixed',
                ).length,
                major: issuesArray.filter(
                  issue =>
                    issue.severity === 'Major' && issue.status === 'Fixed',
                ).length,
                medium: issuesArray.filter(
                  issue =>
                    issue.severity === 'Medium' && issue.status === 'Fixed',
                ).length,
                minor: issuesArray.filter(
                  issue =>
                    issue.severity === 'Minor' && issue.status === 'Fixed',
                ).length,
              },
              not_fixed: {
                critical: issuesArray.filter(
                  issue =>
                    issue.severity === 'Critical' && issue.status !== 'Fixed',
                ).length,
                major: issuesArray.filter(
                  issue =>
                    issue.severity === 'Major' && issue.status !== 'Fixed',
                ).length,
                medium: issuesArray.filter(
                  issue =>
                    issue.severity === 'Medium' && issue.status !== 'Fixed',
                ).length,
                minor: issuesArray.filter(
                  issue =>
                    issue.severity === 'Minor' && issue.status !== 'Fixed',
                ).length,
              },
            },
          },
          {
            type: 'plain_text',
            title: 'Issues',
            text: '',
            include_in_toc: true,
            subsections: issuesArray.map(issue => {
              return {
                type: 'issue_data',
                title: issue.name,
                text: issue.description,
                include_in_toc: true,
                issue_data: {
                  links: issue.links,
                  severity: issue.severity,
                  status: issue.status,
                },
              };
            }),
          },
          // {
          //   type: 'plain_text',
          //   title: '',
          //   text: '',
          //   include_in_toc: true,
          // },
        ],
      };
      dispatch(getPublicReport(newData, { generate: true }));

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

  return (
    <>
      <ResolveAuditConfirmation
        isOpen={resolveConfirmation}
        setIsOpen={setResolveConfirmation}
        audit={audit}
      />

      <Box sx={wrapper}>
        <Box sx={searchBlock}>
          <IconButton
            aria-label="Menu"
            color="secondary"
            onClick={handleOpenMenu}
            sx={menuButton}
          >
            <MenuIcon fontSize="large" sx={{ color: 'white' }} />
          </IconButton>
          <Menu
            open={!!menuAnchorEl}
            anchorEl={menuAnchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: { width: '250px', borderRadius: '10px !important' },
            }}
          >
            {user.current_role === AUDITOR && (
              <MenuItem
                disabled={checkDraftIssues()}
                onClick={handleDiscloseAll}
              >
                Disclose all
              </MenuItem>
            )}
            {!isPublic && (
              <MenuItem disabled onClick={handleCloseMenu}>
                Mark all as read
              </MenuItem>
            )}
            {user.current_role !== CUSTOMER && (
              <MenuItem onClick={handleGenerateReport}>
                Generate report
              </MenuItem>
            )}
          </Menu>

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
          <Box sx={buttonBoxSx}>
            {audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={buttonSx}
                  disabled={
                    audit?.status?.toLowerCase() === RESOLVED.toLowerCase()
                  }
                  onClick={handleNewIssue}
                  {...addTestsLabel('new-issue-button')}
                >
                  New issue
                </Button>
                {!isPublic && (
                  <Tooltip
                    arrow
                    placement="top"
                    title={
                      allIssuesClosed
                        ? ''
                        : "To resolve an audit, it is necessary that the status of all issues be 'Fixed' or 'Not fixed'. Or do not include some issues in the audit."
                    }
                  >
                    <span>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setResolveConfirmation(true)}
                        disabled={!allIssuesClosed}
                        sx={buttonSx}
                        {...addTestsLabel('resolve-button')}
                      >
                        Resolve audit
                      </Button>
                    </span>
                  </Tooltip>
                )}
              </>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                sx={[buttonSx, { width: '100%' }]}
                onClick={handleDownloadReport}
                {...addTestsLabel('auditor-report-button')}
              >
                Download report
              </Button>
            )}
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled={!audit?.report}
            onClick={() => dispatch(downloadReport(audit))}
            sx={buttonSx}
            {...addTestsLabel('customer-report-button')}
          >
            Download report
          </Button>
        )}
      </Box>
    </>
  );
};

export default Control;

const wrapper = theme => ({
  display: 'flex',
  width: '100%',
  mb: '10px',
  [theme.breakpoints.down('xs')]: {
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

const textFieldSx = theme => ({
  width: '100%',
  mr: '20px',
  [theme.breakpoints.down('xs')]: {
    mr: 0,
  },
});

const menuButton = theme => ({
  width: '55px',
  height: '55px',
  borderRadius: '8px',
  background: theme.palette.secondary.main,
  padding: 0,
  mr: '20px',
  '&:hover': {
    filter: 'brightness(0.8)',
    background: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('lg')]: {
    width: '49px',
    height: '49px',
  },
  [theme.breakpoints.down('md')]: {
    width: '46px',
    height: '46px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '39px',
    height: '39px',
  },
});

const buttonBoxSx = theme => ({
  [theme.breakpoints.down('xs')]: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const buttonSx = theme => ({
  padding: '15px 24px',
  flexShrink: 0,
  fontWeight: '600!important',
  fontSize: '20px',
  lineHeight: '25px',
  textTransform: 'none',
  borderRadius: '10px',
  mr: '20px',
  '&:last-child': { mr: 0 },
  [theme.breakpoints.down('lg')]: {
    padding: '12px 24px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '10px 24px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('sm')]: {
    padding: '7px 24px',
    fontSize: '16px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '7px 10px',
    fontWeight: 400,
  },
});
