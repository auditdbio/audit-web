import React, { useEffect } from 'react';
import { isAuth } from '../lib/helper.js';
import { PrivateRoute } from '../router/PrivateRoute.jsx';
import PublicAuditInfoPage from './PublicAuditInfo.jsx';
import { getAudit, getPublicAudit } from '../redux/actions/auditAction.js';
import { AUDITOR, CLEAR_AUDIT, CUSTOMER } from '../redux/actions/types.js';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AuditOffer from './audit-offer.jsx';
import AuditInfoPage from './audit-info-page.jsx';

const Audit = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { code } = useParams();
  const userCurrentRole = useSelector(s => s.user.user.current_role);

  if (code && id) {
    return <PublicAuditInfoPage isPublic={true} />;
  } else if (userCurrentRole.toLowerCase() === AUDITOR.toLowerCase()) {
    return (
      <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
        <AuditOffer />
      </PrivateRoute>
    );
  } else if (userCurrentRole.toLowerCase() === CUSTOMER.toLowerCase()) {
    return (
      <PrivateRoute auth={{ isAuthenticated: isAuth() }}>
        <AuditInfoPage />
      </PrivateRoute>
    );
  }
};

export default Audit;
