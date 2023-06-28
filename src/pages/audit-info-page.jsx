import React, { useEffect } from 'react';
import AuditInfo from './audit-info.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getAudit } from '../redux/actions/auditAction.js';
import { useParams } from 'react-router-dom';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotFound from './Not-Found.jsx';
import { getIssues } from '../redux/actions/issueAction.js';
import { CLEAR_AUDIT } from '../redux/actions/types.js';
import { CustomCard } from '../components/custom/Card.jsx';

const AuditInfoPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const notFound = useSelector(s => s.notFound.error);
  const auditConfirm = useSelector(s => s.audits?.audit);
  const { issues, issuesAuditId } = useSelector(s => s.issues);

  useEffect(() => {
    dispatch(getAudit(id));
    return () => dispatch({ type: CLEAR_AUDIT });
  }, [id]);

  useEffect(() => {
    if (issuesAuditId !== auditConfirm?.id && auditConfirm?.status) {
      dispatch(getIssues(auditConfirm?.id));
    }
  }, [auditConfirm?.status, issuesAuditId]);

  if (!auditConfirm && !notFound) {
    return (
      <Layout>
        <CustomCard sx={[wrapper, { justifyContent: 'center' }]}>
          <Loader />
        </CustomCard>
      </Layout>
    );
  }

  if (notFound && !auditConfirm?.id) {
    return <NotFound />;
  }
  if (auditConfirm?.id && !notFound) {
    return <AuditInfo audit={auditConfirm} issues={issues} />;
  }
};

export default AuditInfoPage;

const wrapper = theme => ({
  padding: '48px 74px 80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '80px',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    padding: '38px 44px 60px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '40px',
    padding: '38px 20px 30px',
  },
});
