import React, { useEffect, useState } from 'react';
import Layout from '../styles/Layout.jsx';
import { Box } from '@mui/material';
import CustomTabs from '../components/custom/CustomTabs.jsx';
import InfoCard from '../components/custom/info-card.jsx';
import UserInfo from '../components/User-info.jsx';
import Projects from '../components/Projects.jsx';
import Audits from '../components/Audits.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import AuditRequest from '../components/Audit-request.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { clearUserSuccess } from '../redux/actions/userAction.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { isAuth } from '../lib/helper.js';
import PublicProfile from './Public-profile.jsx';

const ProfilePage = () => {
  const { tab } = useParams();
  const [chooseTab, setChooseTab] = useState(tab);
  const currentRole = useSelector(s => s.user.user.current_role);
  const id = useSelector(s => s.user.user.id);
  const message = useSelector(s => s.user.success);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth()) {
      navigate('/');
    }
  }, [isAuth()]);

  useEffect(() => {
    setChooseTab(tab);
  }, [tab, chooseTab]);
  return (
    <Layout sx={{ flexDirection: 'column' }}>
      <CustomSnackbar
        autoHideDuration={3000}
        open={!!message}
        onClose={() => dispatch(clearUserSuccess())}
        severity="success"
        text={message}
      />

      <Box sx={wrapper}>
        <CustomTabs
          selectedTabSx={currentRole === AUDITOR ? auditorTabSx : customerTabSx}
          name={'type'}
          choosenTab={chooseTab}
          tabs={currentRole === AUDITOR ? auditorTabs : customerTabs}
          setTab={setChooseTab}
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
          {chooseTab === 'user-info' && <UserInfo role={currentRole} />}
        </InfoCard>
      </Box>
      {chooseTab === 'user-info' && (
        <PublicProfile currentRole={currentRole} ownerId={id} />
      )}
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
