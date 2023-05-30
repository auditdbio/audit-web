import React from 'react';
import Layout from '../styles/Layout.jsx';
import AuditRequestInfo from '../components/audit-request-info.jsx';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuditRequestPage = () => {
  const { id } = useParams();
  const auditInfo = useSelector(s =>
    s.audits?.auditRequests?.find(project => project.id === id),
  );
  return (
    <Layout>
      <AuditRequestInfo project={auditInfo} />
    </Layout>
  );
};

export default AuditRequestPage;
