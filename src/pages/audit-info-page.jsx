import React, { useEffect } from 'react';
import AuditInfo from './audit-info.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getAudit, getPublicAudit } from '../redux/actions/auditAction.js';
import { useParams } from 'react-router-dom';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotFound from './Not-Found.jsx';
import { getIssues } from '../redux/actions/issueAction.js';
import { CLEAR_AUDIT } from '../redux/actions/types.js';
import { CustomCard } from '../components/custom/Card.jsx';
import Headings from '../router/Headings.jsx';
import { useSearchParams } from 'react-router-dom/dist';

const AuditInfoPage = ({ isPublic }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const notFound = useSelector(s => s.notFound.error);
  const auditConfirm = useSelector(s => s.audits?.audit);
  const { issues, issuesAuditId } = useSelector(s => s.issues);
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get('code');

  useEffect(() => {
    if (isPublic) {
      dispatch(getPublicAudit(id, code));
    } else {
      dispatch(getAudit(id));
    }
    return () => dispatch({ type: CLEAR_AUDIT });
  }, [id]);

  useEffect(() => {
    if (
      issuesAuditId !== auditConfirm?.id &&
      auditConfirm?.status &&
      !isPublic
    ) {
      dispatch(getIssues(auditConfirm?.id));
    }
  }, [auditConfirm?.status, issuesAuditId]);

  if (!auditConfirm && !notFound) {
    return (
      <Layout>
        <Headings title="Audit Info" />

        <CustomCard sx={[wrapperCustom, { justifyContent: 'center' }]}>
          <Loader />
        </CustomCard>
      </Layout>
    );
  }

  if (notFound && !auditConfirm?.id) {
    return <NotFound />;
  }
  if (auditConfirm?.id && !notFound) {
    return (
      <Layout>
        <AuditInfo
          isPublic={isPublic}
          audit={auditConfirm}
          confirmed={true}
          code={code}
          issues={auditConfirm.issues}
        />
      </Layout>
    );
  }
};

export default AuditInfoPage;

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
