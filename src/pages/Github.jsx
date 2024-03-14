import React, { useEffect } from 'react';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import { useSearchParams } from 'react-router-dom/dist';
import { signUpGithub } from '../redux/actions/userAction.js';
import { useDispatch } from 'react-redux';
import Loader from '../components/Loader.jsx';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';

const Github = () => {
  const [searchParam] = useSearchParams();
  const dispatch = useDispatch();
  useEffect(() => {
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
  }, [searchParam.get('code')]);
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

export default Github;

const cardWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px 40px',
  [theme.breakpoints.down('sm')]: {
    paddingY: '78px',
  },
});
