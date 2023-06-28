import React, { useEffect } from 'react';
import AuditInfo from './audit-info.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAuditRequest } from '../redux/actions/auditAction.js';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotFound from './Not-Found.jsx';
import { CLEAR_AUDIT_REQUEST } from '../redux/actions/types.js';

const AuditInfoReqPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const notFound = useSelector(s => s.notFound.error);
  const auditRequest = useSelector(s => s.audits?.auditRequest);

  useEffect(() => {
    dispatch(getAuditRequest(id));
    return () => dispatch({ type: CLEAR_AUDIT_REQUEST });
  }, [id]);

  if (!auditRequest && !notFound) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (notFound && !auditRequest?.id) {
    return <NotFound />;
  }

  if (auditRequest?.id && !notFound) {
    return <AuditInfo audit={auditRequest} auditRequest={auditRequest} />;
  }
};

export default AuditInfoReqPage;
