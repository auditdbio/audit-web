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
        <Loader />
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
