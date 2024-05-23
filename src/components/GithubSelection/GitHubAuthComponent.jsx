import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { CUSTOMER } from '../../redux/actions/types.js';
import { GITHUB_CLIENT_ID, BASE_URL } from '../../services/urls.js';
import { encodeBase64url } from '../../lib/helper.js';

const GitHubAuthComponent = ({ desc, noPrivate }) => {
  const handleConnectGithub = () => {
    const state = encodeBase64url(
      JSON.stringify({
        service: 'GitHub',
        authExtended: true,
        role: CUSTOMER,
      }),
    );

    const authUrl = noPrivate
      ? `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${BASE_URL}oauth/callback&scope=read:user,user:email&state=${state}`
      : `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${BASE_URL}oauth/callback&scope=read:user,user:email,repo&state=${state}`;

    const newAuthWindow = window.open(
      authUrl,
      '_blank',
      'width=500,height=600',
    );
  };

  return (
    <Box sx={githubTitleSx}>
      <Typography variant={'h5'} align={'center'}>
        {desc
          ? desc
          : 'Authenticate via GitHub to select from your repositories'}
      </Typography>
      <Button
        onClick={handleConnectGithub}
        sx={{ textTransform: 'unset' }}
        variant={'contained'}
      >
        Authenticate with GitHub{' '}
      </Button>
    </Box>
  );
};

export default GitHubAuthComponent;

const githubTitleSx = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '45px',
  gap: '25px',
  '& h5': {
    fontSize: '24px',
    fontWeight: 500,
  },
  '& button': {
    fontSize: '18px',
  },
  [theme.breakpoints.down('md')]: {
    marginTop: '35px',
    gap: '15px',
    '& h5': {
      fontSize: '20px',
    },
    '& button': {
      fontSize: '16px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& h5': {
      fontSize: '16px',
    },
  },
  [theme.breakpoints.down(550)]: {
    '& button': {
      width: '100%',
    },
  },
});
