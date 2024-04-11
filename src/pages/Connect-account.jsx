import React, { useEffect, useState } from 'react';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import { useSearchParams, useNavigate } from 'react-router-dom/dist';
import {
  changeRole,
  clearUserError,
  connect_account,
  signUpGithub,
} from '../redux/actions/userAction.js';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import RoleModal from '../components/modal/RoleModal.jsx';
import { AUDITOR } from '../redux/actions/types.js';
import { isAuth } from '../lib/helper.js';

const ConnectAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParam] = useSearchParams();
  const { error, user, needToSelectRole } = useSelector(s => s.user);
  const [modalSelectedRole, setModalSelectedRole] = useState(AUDITOR);

  useEffect(() => {
    const state = JSON.parse(decodeURIComponent(searchParam.get('state')));
    const values = {
      code: searchParam.get('code'),
      service: state?.service,
    };
    if (state?.role) {
      values.current_role = state.role;
    }

    if (state?.auth) {
      dispatch(signUpGithub(values));
    } else {
      dispatch(connect_account(user?.id, values));
    }
  }, []);

  useEffect(() => {
    if (isAuth() && !needToSelectRole) {
      navigate('/');
    }
  }, [isAuth()]);

  return (
    <Layout>
      <CustomSnackbar
        autoHideDuration={6000}
        open={!!error}
        severity="error"
        text={error}
        onClose={() => {
          dispatch(clearUserError());
          navigate('/sign-in');
        }}
      />

      {needToSelectRole && (
        <RoleModal
          onConfirm={() => dispatch(changeRole(modalSelectedRole, user?.id))}
          role={modalSelectedRole}
          setRole={setModalSelectedRole}
        />
      )}

      <CustomCard sx={cardWrapper}>
        <Box sx={innerWrapper}>
          <Loader />
          <Typography
            variant="h5"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <GitHubIcon fontSize="large" sx={{ marginRight: '15px' }} />
            Please wait while we are redirecting you to the dashboard
          </Typography>
        </Box>
      </CustomCard>
    </Layout>
  );
};

export default ConnectAccount;

const cardWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px 40px',
  [theme.breakpoints.down('sm')]: {
    paddingY: '78px',
  },
});

const innerWrapper = {
  mt: '-35px',
  display: 'flex',
  flexDirection: 'column',
  gap: '45px',
  alignItems: 'center',
};
