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
import { AUDITOR, RESOLVED } from '../../redux/actions/types.js';
import { handleOpenReport } from '../../lib/openReport.js';
import ResolveAuditConfirmation from './ResolveAuditConfirmation.jsx';
import { discloseAllIssues } from '../../redux/actions/issueAction.js';
import { DRAFT, FIXED, NOT_FIXED } from './constants.js';

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
              <>
                <MenuItem
                  disabled={checkDraftIssues()}
                  onClick={handleDiscloseAll}
                >
                  Disclose all
                </MenuItem>
                <MenuItem onClick={handleCloseMenu}>Generate report</MenuItem>
              </>
            )}
            <MenuItem onClick={handleCloseMenu}>Mark all as read</MenuItem>
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

        {user?.current_role === AUDITOR ? (
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
              </>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                sx={[buttonSx, { width: '100%' }]}
                onClick={() => {}}
                {...addTestsLabel('download-report-button')}
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
            onClick={() => handleOpenReport(audit)}
            sx={buttonSx}
            {...addTestsLabel('report-button')}
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
  fontWeight: 600,
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
