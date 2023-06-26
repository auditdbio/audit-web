import React, { useMemo } from 'react';
import Layout from '../styles/Layout.jsx';
import AuditRequestInfo from '../components/audit-request-info.jsx';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CustomCard } from '../components/custom/Card.jsx';
import Loader from '../components/Loader.jsx';
import NotFound from './Not-Found.jsx';

const AuditRequestPage = () => {
  const { id } = useParams();
  const audits = useSelector(s => s.audits?.auditRequests);

  const auditInfo = useMemo(() => {
    const data = audits.find(project => project.id === id);
    if (data) {
      return data;
    } else {
      return null;
    }
  }, [audits, id]);

  if (!auditInfo && auditInfo !== null) {
    return (
      <Layout>
        <CustomCard sx={wrapper}>
          <Loader />
        </CustomCard>
      </Layout>
    );
  }

  if (auditInfo) {
    return (
      <Layout>
        <AuditRequestInfo project={auditInfo} />
      </Layout>
    );
  }

  if (auditInfo === null && auditInfo !== undefined) {
    return <NotFound />;
  }
};

export default AuditRequestPage;
