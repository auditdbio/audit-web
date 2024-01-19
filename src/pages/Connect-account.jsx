import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import { useSearchParams } from 'react-router-dom/dist';
import { connect_account, signUpGithub } from '../redux/actions/userAction.js';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';

const ConnectAccount = () => {
  const [searchParam] = useSearchParams();
  const dispatch = useDispatch();
  const user_id = useSelector(state => state.user.user.id);

  useEffect(() => {
    if (
      searchParam
        .get('state')
        .slice(searchParam.get('state').lastIndexOf('_') + 1) === 'auth'
    ) {
      const value = {
        code: searchParam.get('code'),
        current_role: searchParam
          .get('state')
          .slice(0, searchParam.get('state').indexOf('_')),
        service: searchParam
          .get('state')
          .slice(
            searchParam.get('state').indexOf('_') + 1,
            searchParam.get('state').lastIndexOf('_'),
          ),
      };
      dispatch(signUpGithub(value));
    } else {
      const data = {
        code: searchParam.get('code'),
        current_role: searchParam
          .get('state')
          .slice(0, searchParam.get('state').indexOf('_')),
        service: searchParam
          .get('state')
          .slice(searchParam.get('state').indexOf('_') + 1),
      };
      dispatch(connect_account(user_id, data));
    }
  }, []);

  return (
    <Layout>
      <CustomCard sx={cardWrapper}>
        <Box
          sx={{
            mt: '-35px',
            display: 'flex',
            flexDirection: 'column',
            gap: '45px',
            alignItems: 'center',
          }}
        >
          <Loader />
          <Typography
            variant={'h5'}
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
