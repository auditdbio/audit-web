import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuditFeedback } from '../redux/actions/auditAction.js';
import { getIssues } from '../redux/actions/issueAction.js';
import { AUDITOR, RESOLVED } from '../redux/actions/types.js';
import PublicAudit from '../components/PublicAudit/PublicAudit.jsx';

const PublicAuditInfoPage = ({ isPublic, publicView, setPublicView }) => {
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
    <PublicAudit
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

export default PublicAuditInfoPage;
