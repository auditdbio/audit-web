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
import Headings from '../router/Headings.jsx';

const CreateIssuePage = ({ isPublic, saved }) => {
  const navigate = useNavigate();
  const { auditId } = useParams();
  const audit = useSelector(s =>
    s.audits.audits.find(audit => audit.id === auditId),
  );

  return (
    <Layout>
      <Headings title={`New Issue | ${audit?.project_name}`} noIndex={true} />

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
  padding: '45px 30px 60px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 'unset',
  [theme.breakpoints.down('md')]: {
    padding: '50px 20px 60px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '50px 10px 30px',
  },
  [theme.breakpoints.down(780)]: {
    borderRadius: 'unset',
  },
});

const backButtonSx = {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'flex-start',
  left: '0',
  top: '5px',
};
