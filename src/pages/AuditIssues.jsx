import React, { useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, Typography, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { addTestsLabel } from '../lib/helper.js';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card';
import IssueSeverity from '../components/issuesPage/IssueSeverity.jsx';
import Control from '../components/issuesPage/Control.jsx';
import CustomPagination from '../components/custom/CustomPagination.jsx';
import theme from '../styles/themes.js';
import Loader from '../components/Loader.jsx';

const AuditIssues = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const audit = useSelector(s =>
    s.audits.audits?.find(audit => audit.id === auditId),
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const getSearchResultsLength = () => {
    return audit?.issues?.filter(issue => issue.name?.includes(search)).length;
  };

  const getNumberOfPages = () => Math.ceil(getSearchResultsLength() / 10);

  if (!audit) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Loader />
      </Box>
    );
  }

  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          onClick={() => navigate(-1)}
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon color="secondary" />
        </Button>

        <Control setSearch={setSearch} setPage={setPage} />

        <Box sx={{ display: 'flex', width: '100%' }}>
          <Typography variant="h3" sx={projectTitle}>
            {audit?.project_name}
          </Typography>
          <Box sx={columnsTitleBlock}>
            <Typography sx={[columnText, columnTitle]}>
              Status &#9660;
            </Typography>
            <Typography sx={[columnText, columnTitle]}>
              Severity &#9660;
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%' }}>
          {audit?.issues
            ?.filter(issue => issue.name?.includes(search))
            .reverse()
            .slice((page - 1) * 10, page * 10)
            .map(issue => (
              <Link
                key={issue.id}
                sx={issueRow}
                component={RouterLink}
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
      </CustomCard>
    </Layout>
  );
};

export default AuditIssues;

const wrapper = theme => ({
  padding: '48px 45px 80px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    padding: '38px 44px 60px',
    '& h3': {
      fontSize: '30px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '38px 20px 30px',
  },
});

const backButtonSx = {
  position: 'absolute',
  left: '0',
  top: '5px',
};

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