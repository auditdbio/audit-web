import React, { useEffect } from 'react';
import AuditInfo from './audit-info.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAuditRequest } from '../redux/actions/auditAction.js';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotFound from './Not-Found.jsx';
import { CLEAR_AUDIT_REQUEST } from '../redux/actions/types.js';
import { CustomCard } from '../components/custom/Card.jsx';

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
        <CustomCard sx={[wrapperCustom, { justifyContent: 'center' }]}>
          <Loader />
        </CustomCard>
      </Layout>
    );
  }

  if (notFound && !auditRequest?.id) {
    return <NotFound />;
  }

  if (auditRequest?.id && !notFound) {
    return (
      <Layout>
        <AuditInfo
          audit={auditRequest}
          auditRequest={auditRequest}
          request={true}
        />
      </Layout>
    );
  }
};

export default AuditInfoReqPage;

const wrapper = theme => ({
  padding: '30px 60px 60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '40px',
  position: 'relative',
  '& h3': {
    fontSize: '24px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('sm')]: {
    gap: '40px',
    padding: '25px 20px 30px',
    '& h3': {
      fontSize: '20px',
    },
  },
});

const wrapperCustom = theme => ({
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
