import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import IssuesList from '../components/issuesPage/IssuesList.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { addTestsLabel } from '../lib/helper.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';

const AuditIssues = () => {
  const navigate = useNavigate();
  const { auditId } = useParams();
  const audit = useSelector(s =>
    s.audits.audits?.find(audit => audit.id === auditId),
  );

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

        <IssuesList auditId={auditId} />
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
