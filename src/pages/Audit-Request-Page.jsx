import React, { useEffect } from 'react';
import Layout from '../styles/Layout.jsx';
import AuditRequestInfo from '../components/audit-request-info.jsx';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuditRequest } from '../redux/actions/auditAction.js';
import { Box } from '@mui/material';
import Loader from '../components/Loader.jsx';
import NotFound from './Not-Found.jsx';
import { CLEAR_AUDIT_REQUEST } from '../redux/actions/types.js';

const AuditRequestPage = () => {
  const { id } = useParams();
  const role = useSelector(s => s.user?.user?.current_role);
  const auditInfo = useSelector(s => s.audits?.auditRequest);
  const dispatch = useDispatch();
  const notFound = useSelector(s => s.notFound.error);

  useEffect(() => {
    dispatch(getAuditRequest(id));
    return () => {
      dispatch({ type: CLEAR_AUDIT_REQUEST });
    };
  }, [id]);

  if (!auditInfo && !notFound) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (notFound && !auditInfo?.id) {
    return <NotFound role={role} />;
  }

  if (auditInfo?.id && !notFound) {
    return (
      <Layout>
        <AuditRequestInfo project={auditInfo} />
      </Layout>
    );
  }
};

export default AuditRequestPage;
