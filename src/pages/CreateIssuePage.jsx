import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { Button } from '@mui/material';
import { addTestsLabel } from '../lib/helper.js';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card';
import IssueDetailsForm from '../components/issuesPage/IssueDetailsForm/IssueDetailsForm.jsx';
import PublicIssueDetailsForm from './PublicIssueDetailForm.jsx';
import { useSelector } from 'react-redux';

const CreateIssuePage = ({ isPublic, saved }) => {
  const navigate = useNavigate();
  const { auditId } = useParams();
  const audit = useSelector(s =>
    s.audits.audits.find(audit => audit.id === auditId),
  );

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
        {!isPublic && !saved ? (
          <IssueDetailsForm />
        ) : (
          <PublicIssueDetailsForm saved={!!audit?.no_customer || saved} />
        )}
      </CustomCard>
    </Layout>
  );
};

export default CreateIssuePage;

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
