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
    if (audits && audits.length) {
      const data = audits.find(project => project.id === id);
      if (data) {
        return data;
      } else {
        return 'not-found';
      }
    }
    return null;
  }, [audits, id]);

  if (!auditInfo) {
    return (
      <Layout>
        <CustomCard sx={wrapper}>
          <Loader />
        </CustomCard>
      </Layout>
    );
  }

  if (auditInfo && auditInfo !== 'not-found') {
    return (
      <Layout>
        <AuditRequestInfo project={auditInfo} />
      </Layout>
    );
  }

  if (auditInfo === 'not-found') {
    return <NotFound />;
  }
};

export default AuditRequestPage;
