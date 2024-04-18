import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../styles/Layout.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { Box, Button } from '@mui/material';
import { addTestsLabel } from '../lib/helper.js';
import { CustomCard } from '../components/custom/Card';
import IssueDetailsForm from '../components/issuesPage/IssueDetailsForm/IssueDetailsForm.jsx';
import EventsList from '../components/issuesPage/EventsList.jsx';
import AddComment from '../components/issuesPage/AddComment.jsx';
import Loader from '../components/Loader.jsx';
import { setCurrentAuditPartner } from '../redux/actions/auditAction.js';
import { getIssues } from '../redux/actions/issueAction.js';
import PublicIssueDetailsForm from './PublicIssueDetailForm.jsx';
import Headings from '../router/Headings.jsx';

const AuditIssueDetails = ({ isPublic, saved }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auditId, issueId } = useParams();
  const { currentAuditPartner } = useSelector(s => s.audits);
  const { issues, issuesAuditId } = useSelector(s => s.issues);
  const audit = useSelector(s =>
    s.audits.audits?.find(audit => audit.id === auditId),
  );

  const issue = useMemo(() => {
    if (!isPublic || saved) {
      return issues?.find(issue => issue.id === +issueId);
    } else {
      const publicIssues = JSON.parse(
        localStorage.getItem('publicIssues') || '[]',
      );
      return publicIssues.find(issue => issue.id === +issueId);
    }
  }, [issues]);

  useEffect(() => {
    dispatch(setCurrentAuditPartner(audit));
  }, [audit?.id]);

  useEffect(() => {
    if (issuesAuditId !== auditId && (!isPublic || saved)) {
      dispatch(getIssues(auditId));
    }
  }, []);

  if (!issue) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Headings title="Issues" noIndex={true} />
        <Loader />
      </Box>
    );
  }

  return (
    <Layout
      sx={layoutSx}
      containerSx={{
        maxWidth: 'unset!important',
        padding: '0 35px!important',
      }}
    >
      <Headings
        title={`${issue?.name} | ${audit?.project_name || 'Issues'}`}
        noIndex={true}
      />

      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          onClick={() => navigate(-1)}
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon color="secondary" />
        </Button>
        {isPublic || saved ? (
          <PublicIssueDetailsForm issue={issue} saved={saved} editMode={true} />
        ) : (
          <IssueDetailsForm issue={issue} editMode={true} />
        )}
        {!!issue.events?.length && !saved && !isPublic && (
          <EventsList
            issue={issue}
            auditPartner={currentAuditPartner}
            auditId={auditId}
          />
        )}
        {!isPublic && !saved && (
          <AddComment auditId={auditId} issueId={issueId} />
        )}
      </CustomCard>
    </Layout>
  );
};

export default AuditIssueDetails;

const layoutSx = theme => ({
  padding: '40px!important',
  [theme.breakpoints.down('sm')]: {
    padding: '10px!important',
  },
});

const wrapper = theme => ({
  padding: '50px 30px 80px',
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
});

const backButtonSx = {
  position: 'absolute',
  justifyContent: 'flex-start',
  left: '0',
  top: '5px',
};
