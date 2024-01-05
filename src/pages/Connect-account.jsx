import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import { useSearchParams } from 'react-router-dom/dist';
import { signUpGithub } from '../redux/actions/userAction.js';
import { useDispatch } from 'react-redux';
import Loader from '../components/Loader.jsx';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';

const ConnectAccount = () => {
  const [searchParam] = useSearchParams();
  const { servicename, role } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (servicename === 'linkedin') {
      // TODO: connect linkedin
    } else if (servicename === 'github') {
      dispatch(signUpGithub(searchParam.get('code'), role));
    } else if (servicename === 'facebook') {
      // TODO: connect facebook
    } else if (servicename === 'medium') {
      // TODO: connect medium
    } else if (servicename === 'twitter') {
      // TODO: connect twitter
    } else if (servicename === 'gitcoin') {
      // TODO: connect gitcoin
    }
  }, [searchParam.get('code'), role]);
  //
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
