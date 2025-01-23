import React, { useEffect } from 'react';
import AuditInfo from './audit-info.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getAudit, getAuditFeedback } from '../redux/actions/auditAction.js';
import { getPublicAudit } from '../redux/actions/auditAction.js';
import { useParams } from 'react-router-dom';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotFound from './Not-Found.jsx';
import { getIssues } from '../redux/actions/issueAction.js';
import { AUDITOR, CLEAR_AUDIT, RESOLVED } from '../redux/actions/types.js';
import { CustomCard } from '../components/custom/Card.jsx';
import Headings from '../router/Headings.jsx';
import { useSearchParams } from 'react-router-dom/dist';

const AuditInfoPage = ({ isPublic, publicView, setPublicView }) => {
  const dispatch = useDispatch();
  const auditConfirm = useSelector(s => s.audits?.audit);
  const { issuesAuditId } = useSelector(s => s.issues);
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code');

  useEffect(() => {
    if (
      auditConfirm &&
      !auditConfirm.no_customer &&
      auditConfirm.status.toLowerCase() === RESOLVED.toLowerCase() &&
      !isPublic
    ) {
      dispatch(
        getAuditFeedback(AUDITOR, auditConfirm.auditor_id, auditConfirm.id),
      );
    }
  }, [auditConfirm?.id]);

  useEffect(() => {
    if (
      issuesAuditId !== auditConfirm?.id &&
      auditConfirm?.status &&
      !isPublic
    ) {
      dispatch(getIssues(auditConfirm?.id));
    }
  }, [auditConfirm?.status, issuesAuditId]);

  return (
    <AuditInfo
      isPublic={isPublic}
      audit={auditConfirm}
      confirmed={true}
      code={code}
      issues={auditConfirm.issues}
      publicView={publicView}
      setPublicView={setPublicView}
    />
  );
};

export default AuditInfoPage;
