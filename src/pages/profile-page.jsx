import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../styles/Layout.jsx';
import { Box } from '@mui/material';
import CustomTabs from '../components/custom/CustomTabs.jsx';
import InfoCard from '../components/custom/info-card.jsx';
import UserInfo from '../components/User-info.jsx';
import Projects from '../components/Projects.jsx';
import Audits from '../components/Audits.jsx';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import AuditRequest from '../components/Audit-request.jsx';
import { clearUserSuccess } from '../redux/actions/userAction.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { isAuth } from '../lib/helper.js';
import PublicProfile from './Public-profile.jsx';
import NotFound from './Not-Found.jsx';
import Organization from '../components/Organization.jsx';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { tab, role, linkId } = useParams();

  const [chooseTab, setChooseTab] = useState(tab || 'user-info');
  const currentRole = useSelector(s => s.user.user.current_role);
  const { user, success } = useSelector(s => s.user);
  const { auditor } = useSelector(s => s.auditor);
  const { customer } = useSelector(s => s.customer);

  useEffect(() => {
    if (tab) setChooseTab(tab);
  }, [tab]);

  if (linkId && role) {
    if (/^c|a$/i.test(role)) {
      const userLinkId =
        user?.current_role === AUDITOR ? auditor?.link_id : customer?.link_id;
      if (
        !isAuth() ||
        (user?.id &&
          linkId.toLowerCase() !== userLinkId?.toLowerCase() &&
          linkId.toLowerCase() !== user?.id)
      ) {
        return <PublicProfile />;
      } else if (
        (user?.current_role === AUDITOR && !/^a$/i.test(role)) ||
        (user?.current_role === CUSTOMER && !/^c$/i.test(role))
      ) {
        return <PublicProfile notFoundRedirect={false} />;
      }
    } else {
      return <NotFound />;
    }
  }

  if (tab && !isAuth()) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <Layout>
      <CustomSnackbar
        autoHideDuration={3000}
        open={!!success}
        onClose={() => dispatch(clearUserSuccess())}
        severity="success"
        text={success}
      />

      <Box sx={wrapper}>
        <CustomTabs
          selectedTabSx={currentRole === AUDITOR ? auditorTabSx : customerTabSx}
          name="type"
          choosenTab={chooseTab}
          tabs={currentRole === AUDITOR ? auditorTabs : customerTabs}
          setTab={setChooseTab}
          user={user}
          auditor={auditor}
          customer={customer}
        />
        <InfoCard role={currentRole}>
          {chooseTab === 'audits' && currentRole === CUSTOMER && <Audits />}
          {chooseTab === 'audits' && currentRole === AUDITOR && (
            <Projects role={currentRole} />
          )}
          {chooseTab === 'projects' && currentRole === CUSTOMER && (
            <Projects role={currentRole} />
          )}
          {chooseTab === 'audit-requests' && currentRole === AUDITOR && (
            <AuditRequest />
          )}
          {chooseTab === 'user-info' && (
            <UserInfo role={currentRole} linkId={linkId} />
          )}
          {chooseTab === 'organizations' && (
            <Organization role={currentRole} linkId={linkId} />
          )}
        </InfoCard>
      </Box>
    </Layout>
  );
};

export default ProfilePage;

const auditorTabs = [
  {
    value: 'audits',
    label: 'Audits',
  },
  {
    value: 'audit-requests',
    label: 'Audit requests',
  },
  {
    value: 'user-info',
    label: 'User info',
  },
];

const customerTabs = [
  {
    value: 'audits',
    label: 'Audits',
  },
  {
    value: 'projects',
    label: 'Projects',
  },
  {
    value: 'user-info',
    label: 'User info',
  },
  {
    value: 'organizations',
    label: 'My organizations',
  },
];

const wrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1300px',
  minHeight: '560px',
  width: '100%',
});

const customerTabSx = theme => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FCFAF6!important',
});

const auditorTabSx = theme => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#FCFAF6!important',
});
