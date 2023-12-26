import React, { useEffect, useState } from 'react';
import Layout from '../styles/Layout.jsx';
import { Box } from '@mui/material';
import CustomTabs from '../components/custom/CustomTabs.jsx';
import InfoCard from '../components/custom/info-card.jsx';
import UserInfo from '../components/User-info.jsx';
import Projects from '../components/Projects.jsx';
import Audits from '../components/Audits.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomer } from '../redux/actions/customerAction.js';
import { getAuditor } from '../redux/actions/auditorAction.js';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import AuditRequest from '../components/Audit-request.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { clearUserSuccess } from '../redux/actions/userAction.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { isAuth } from '../lib/helper.js';

const ProfilePage = () => {
  const { tab } = useParams();
  const [chooseTab, setChooseTab] = useState(tab);
  const currentRole = useSelector(s => s.user.user.current_role);
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

  const handleChange = value => {
    navigate(`/profile/${value}`);
  };

  return (
    <Layout>
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
          tabStyle={tabStyle}
          tabsStyle={tabsStyle}
          onChange={handleChange}
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

const tabStyle = theme => ({
  borderRadius: '14.8672px 14.8672px 0px 0px',
  width: '100%',
});

const tabsStyle = theme => ({
  marginBottom: '-1px',
  '& .MuiTabs-flexContainer': {
    gap: '3px',
  },
  [theme.breakpoints.down('xs')]: {
    minHeight: '35px',
    height: '35px',
    '& .MuiTabs-flexContainer': {
      gap: 0,
      // display: 'block'
    },
  },
});

const customerTabSx = theme => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FCFAF6!important',
});

const auditorTabSx = theme => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#FCFAF6!important',
});
