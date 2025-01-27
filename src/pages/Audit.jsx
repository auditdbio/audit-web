import React, { useEffect, useState } from 'react';
import { isAuth } from '../lib/helper.js';
import PublicAuditInfoPage from './PublicAuditInfo.jsx';
import { getAudit, getPublicAudit } from '../redux/actions/auditAction.js';
import { AUDITOR, CLEAR_AUDIT, CUSTOMER } from '../redux/actions/types.js';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AuditOffer from './audit-offer.jsx';
import AuditInfoPage from './audit-info-page.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import Loader from '../components/Loader.jsx';
import NotFound from './Not-Found.jsx';
import { useSearchParams } from 'react-router-dom/dist';

const Audit = () => {
  const dispatch = useDispatch();
  const { auditId } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const [publicView, setPublicView] = useState(false);
  const user = useSelector(s => s.user.user);
  const { audit } = useSelector(s => s.audits);
  const notFound = useSelector(s => s.notFound.error);

  useEffect(() => {
    if (isAuth()) {
      if (code) {
        dispatch(getPublicAudit(auditId, code));
      } else {
        dispatch(getAudit(auditId));
      }
    } else {
      dispatch(getPublicAudit(auditId, code));
    }
    return () => {
      dispatch({ type: CLEAR_AUDIT });
    };
  }, [auditId]);

  const renderContent = () => {
    const role = user.current_role?.toLowerCase();
    if (!audit?.id && !notFound) {
      return <Loader />;
    }

    if (isAuth()) {
      if (
        role === CUSTOMER.toLowerCase() &&
        audit?.customer_id === user.id &&
        !publicView &&
        !audit.isPublic
      ) {
        return (
          <AuditInfoPage
            setPublicView={setPublicView}
            publicView={publicView}
          />
        );
      }
      if (
        role === AUDITOR.toLowerCase() &&
        audit?.auditor_id === user.id &&
        !publicView
      ) {
        return (
          <AuditOffer setPublicView={setPublicView} publicView={publicView} />
        );
      }
    }

    return (
      <PublicAuditInfoPage
        setPublicView={setPublicView}
        publicView={publicView}
        isPublic={true}
      />
    );
  };

  if (notFound && !audit?.id) {
    return <NotFound role={user?.current_role} />;
  }

  return (
    <Layout>
      <CustomCard sx={wrapper}>{renderContent()}</CustomCard>
    </Layout>
  );
};

export default Audit;

const wrapper = theme => ({
  padding: '25px 30px 60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 'unset',
  gap: '20px',
  '& h3': {
    fontSize: '24px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('md')]: {
    padding: '20px 24px 20px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '30px 20px 20px',
    '& h3': {
      fontSize: '20px',
    },
  },
  [theme.breakpoints.down(780)]: {
    borderRadius: '0!important',
  },
});
