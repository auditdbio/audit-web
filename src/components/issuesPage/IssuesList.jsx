import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Typography } from '@mui/material';
import theme from '../../styles/themes.js';
import { addTestsLabel } from '../../lib/helper.js';
import Control from './Control.jsx';
import IssueSeverity from './IssueSeverity.jsx';
import CustomPagination from '../custom/CustomPagination.jsx';

const IssuesList = ({ auditId }) => {
  const { issues } = useSelector(s => s.issues);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const getSearchResultsLength = () => {
    return issues?.filter(issue => issue.name?.includes(search)).length;
  };

  const getNumberOfPages = () => Math.ceil(getSearchResultsLength() / 10);

  return (
    <>
      <Control setSearch={setSearch} setPage={setPage} />

      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
        <Box sx={columnsTitleBlock}>
          <Typography sx={[columnText, columnTitle]}>Status &#9660;</Typography>
          <Typography sx={[columnText, columnTitle]}>
            Severity &#9660;
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: '100%' }}>
        {issues
          ?.filter(issue => issue.name?.includes(search))
          .reverse()
          .slice((page - 1) * 10, page * 10)
          .map(issue => (
            <Link
              key={issue.id}
              sx={issueRow}
              component={RouterLink}
              onClick={() => window.scrollTo({ top: 0 })}
              to={`/issues/audit-issue/${auditId}/${issue.id}`}
              {...addTestsLabel('issue-details-link')}
            >
              <Typography sx={[columnText, issueTitleSx]}>
                {issue.name}
              </Typography>
              <Typography sx={[columnText, statusSx(issue.status)]}>
                {issue.status}
              </Typography>
              <Box sx={severityWrapper}>
                <IssueSeverity text={issue.severity} />
              </Box>
            </Link>
          ))}
      </Box>

      {getSearchResultsLength() === 0 && <Box sx={noResults}>Empty</Box>}

      <CustomPagination
        show={getSearchResultsLength() > 10}
        count={getNumberOfPages()}
        onChange={(e, page) => setPage(page)}
        page={page}
        showFirstLast={false}
      />
    </>
  );
};

export default IssuesList;

const projectTitle = {
  fontWeight: 600,
  fontSize: '26px',
  lineHeight: '32px',
  width: '70%',
};

const columnsTitleBlock = theme => ({
  display: 'flex',
  width: '30%',
  [theme.breakpoints.down('xs')]: {
    display: 'none',
  },
});

const columnTitle = {
  width: '50%',
  textAlign: 'center',
  whiteSpace: 'nowrap',
};

const columnText = theme => ({
  color: '#434242',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '25px',
  padding: '0 25px',
  [theme.breakpoints.down('lg')]: {
    fontSize: '18px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '0 15px',
  },
});

const issueRow = theme => ({
  display: 'flex',
  width: '100%',
  padding: '30px 0',
  textDecoration: 'none',
  cursor: 'pointer',
  border: '2px solid #E5E5E5',
  borderBottom: 'none',
  '&:last-child': { borderBottom: '2px solid #E5E5E5' },
  ':hover': { backgroundColor: '#F1F1F1' },
  [theme.breakpoints.down('xs')]: {
    justifyContent: 'space-between',
    padding: '15px 10px 15px 0',
  },
});

const issueTitleSx = {
  display: '-webkit-box',
  maxHeight: '50px',
  overflow: 'hidden',
  wordBreak: 'break-word',
  width: '70%',
  alignSelf: 'center',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
};

const statusSx = status => {
  let color = '#434242';
  if (status === 'Draft') color = '#52176D';
  if (status === 'Verification' || status === 'InProgress') color = '#5b97bb';
  if (status === 'Fixed' || status === 'WillNotFix') color = '#09C010';

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 !important',
    width: '15%',
    letterSpacing: '-1px',
    color,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  };
};

const severityWrapper = {
  width: '15%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const noResults = {
  paddingTop: '70px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};