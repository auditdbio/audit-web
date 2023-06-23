import React from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { addTestsLabel } from '../lib/helper.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom/dist';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          onClick={() => navigate(-1)}
          aria-label="Go back"
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon />
        </Button>
        <Box>
          <Typography variant={'h3'}>Page not found</Typography>
          <Typography>
            Oops! The page you are looking for does not exist
          </Typography>
          <Typography variant={'h2'} color={'primary'}>
            404
          </Typography>
        </Box>
      </CustomCard>
    </Layout>
  );
};

export default NotFound;

const backButtonSx = theme => ({
  position: 'absolute',
  left: 0,
  top: '10px',
  [theme.breakpoints.down('md')]: {
    minWidth: 'unset',
    top: 0,
  },
});

const wrapper = theme => ({
  padding: '48px 74px 80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '80px',
  position: 'relative',
  '& div': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    marginTop: '50px',
    '& h3': {
      fontSize: '24px',
      lineHeight: '29px',
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    '& h2': {
      fontSize: '144px',
      lineHeight: '100%',
      fontWeight: 'bold',
    },
  },
  [theme.breakpoints.down('md')]: {
    padding: '38px 44px 60px',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '70vh',
    padding: '38px 20px 30px',
    '& div': {
      marginTop: '20px',
      '& h3': {
        fontSize: '20px',
      },
      '& h2': {
        fontSize: '124px',
      },
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& div': {
      '& p': {
        fontSize: '12px',
        textAlign: 'center',
      },
      marginTop: '20px',
      '& h3': {
        fontSize: '20px',
      },
      '& h2': {
        fontSize: '94px',
      },
    },
  },
});
