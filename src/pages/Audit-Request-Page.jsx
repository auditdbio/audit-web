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
import { CustomCard } from '../components/custom/Card.jsx';

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
        <CustomCard sx={wrapper} className={'audit-request-wrapper'}>
          <Loader />
        </CustomCard>
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

const wrapper = theme => ({
  overflowY: 'auto',
  height: '100%',
  padding: '48px 74px 80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  '& h3': {
    fontSize: '37px',
    fontWeight: 500,
  },
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
