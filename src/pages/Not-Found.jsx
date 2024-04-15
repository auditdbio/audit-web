import React from 'react';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card.jsx';
import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { addTestsLabel } from '../lib/helper.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom/dist';
import { AUDITOR } from '../redux/actions/types.js';
import NotFound404 from '../components/images/404.png';
import Headings from '../router/Headings.jsx';

const NotFound = ({ role }) => {
  const navigate = useNavigate();
  return (
    <Layout>
      <Headings title="Page Not Found" />

      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          color={role === AUDITOR ? 'secondary' : 'primary'}
          onClick={() => navigate(-1)}
          aria-label="Go back"
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon />
        </Button>
        <Box>
          <img src={NotFound404} alt="" />
        </Box>
      </CustomCard>
    </Layout>
  );
};

export default NotFound;

const backButtonSx = theme => ({
  position: 'absolute',
  left: '10px',
  top: '10px',
  [theme.breakpoints.down('md')]: {
    minWidth: 'unset',
  },
  [theme.breakpoints.down('sm')]: {
    top: 0,
    left: 0,
  },
});

const wrapper = theme => ({
  padding: '25px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '80px',
  position: 'relative',
  '& img': {
    width: '100%',
    objectFit: 'contain',
  },
});
