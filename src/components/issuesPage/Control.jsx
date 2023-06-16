import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined.js';
import { Box, Button, InputAdornment, TextField } from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import { AUDITOR } from '../../redux/actions/types.js';
import { handleOpenReport } from '../../lib/openReport.js';

const Control = ({ search, setSearch, setPage, setSearchParams }) => {
  const navigate = useNavigate();
  const { auditId } = useParams();
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

  return (
    <>
      <Box sx={wrapper}>
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
        {user?.current_role === AUDITOR ? (
          <Box sx={{ flexShrink: 0, alignSelf: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              sx={buttonSx}
              onClick={handleNewIssue}
              {...addTestsLabel('new-issue-button')}
            >
              New issue
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {}}
              sx={buttonSx}
              {...addTestsLabel('resolve-button')}
            >
              Resolve audit
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="secondary"
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

const textFieldSx = theme => ({
  width: '100%',
  mr: '20px',
  [theme.breakpoints.down('xs')]: {
    mr: 0,
    mt: '10px',
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
    padding: '7px 24px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('xs')]: {
    padding: '7px 12px',
    fontSize: '16px',
    fontWeight: 400,
  },
});
