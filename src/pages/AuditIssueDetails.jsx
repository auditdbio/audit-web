import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../styles/Layout.jsx';
import { Box, Button, Typography } from '@mui/material';
import { CustomCard } from '../components/custom/Card';

import { issues } from './AuditIssues.jsx';
import { addTestsLabel } from '../lib/helper.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';

const AuditIssueDetails = () => {
  const navigate = useNavigate();
  const { auditId, issueId } = useParams();

  const issue = issues.find(it => it.id === +issueId); //delete after api finish

  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          onClick={() => navigate(-1)}
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon color={'secondary'} />
        </Button>
        <Typography variant="h3" sx={issueTitle}>
          {issue?.title}
        </Typography>
      </CustomCard>
    </Layout>
  );
};

export default AuditIssueDetails;

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

const issueTitle = {
  width: '100%',
  border: '2px solid #E5E5E5',
  padding: '30px 20px',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '25px',
};
