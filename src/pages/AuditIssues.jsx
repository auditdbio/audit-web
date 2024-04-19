import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import IssuesList from '../components/issuesPage/IssuesList.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { addTestsLabel } from '../lib/helper.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { getIssues } from '../redux/actions/issueAction.js';
import { CUSTOMER } from '../redux/actions/types.js';
import Headings from '../router/Headings.jsx';

const AuditIssues = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auditId } = useParams();

  const { issuesAuditId } = useSelector(s => s.issues);
  const { user } = useSelector(s => s.user);
  const audit = useSelector(s =>
    s.audits.audits?.find(audit => audit.id === auditId),
  );

  useEffect(() => {
    if (issuesAuditId !== auditId) {
      dispatch(getIssues(auditId));
    }
  }, []);

  const handleGoBack = () => {
    if (user.current_role === CUSTOMER) {
      navigate(`/audit-info/${auditId}/customer`);
    } else {
      navigate(`/audit-info/${auditId}/auditor`);
    }
  };

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
        <Headings title="Issues" noIndex={true} />
        <Loader />
      </Box>
    );
  }

  return (
    <Layout>
      <Headings title="Issues" noIndex={true} />

      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          onClick={handleGoBack}
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
