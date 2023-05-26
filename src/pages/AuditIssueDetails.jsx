import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../styles/Layout.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { Box, Button } from '@mui/material';
import { addTestsLabel } from '../lib/helper.js';
import { CustomCard } from '../components/custom/Card';
import IssueDetailsForm from '../components/issuesPage/IssueDetailsForm.jsx';
import EventsList from '../components/issuesPage/EventsList.jsx';
import AddComment from '../components/issuesPage/AddComment.jsx';
import Loader from '../components/Loader.jsx';
import { setCurrentAuditPartner } from '../redux/actions/auditAction.js';

const AuditIssueDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auditId, issueId } = useParams();
  const { currentAuditPartner } = useSelector(s => s.audits);
  const audit = useSelector(s =>
    s.audits.audits?.find(audit => audit.id === auditId),
  );
  const issue = useMemo(() => {
    return audit?.issues?.find(issue => issue.id === +issueId);
  }, [audit]);

  useEffect(() => {
    dispatch(setCurrentAuditPartner(audit));
  }, [audit?.id]);

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
        <IssueDetailsForm issue={issue} editMode={true} />
        {!!issue.events?.length && (
          <EventsList issue={issue} auditPartner={currentAuditPartner} />
        )}
        <AddComment auditId={auditId} issueId={issueId} />
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
  [theme.breakpoints.down('md')]: {
    padding: '38px 44px 60px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '38px 20px 30px',
  },
});

const backButtonSx = {
  position: 'absolute',
  left: '0',
  top: '5px',
};