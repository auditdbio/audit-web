import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Подключаем хук useLocation
import { Box, Button, Typography } from '@mui/material';

const GITHUB_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const GitHubAuthComponent = () => {
  const [authWindow, setAuthWindow] = useState(null);

  const handleConnectGithub = () => {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&redirect_uri=${BASE_URL}oauth/callback&scope=read:user,user:email,repo&state=customer_GitHub_auth1`;
    const newAuthWindow = window.open(
      authUrl,
      '_blank',
      'width=500,height=600',
    );
    setAuthWindow(newAuthWindow);
  };

  useEffect(() => {
    if (!authWindow) return;

    const handleAuthWindowClose = () => {
      console.log('Authorization window closed');
      localStorage.setItem('authenticated', 'true');
      authWindow.close();
    };

    authWindow.addEventListener('beforeunload', handleAuthWindowClose);

    return () => {
      authWindow.removeEventListener('beforeunload', handleAuthWindowClose);
    };
  }, [authWindow]);

  return (
    <Box sx={githubTitleSx}>
      <Typography variant={'h5'} align={'center'}>
        Authenticate via GitHub to select from your repositories
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
