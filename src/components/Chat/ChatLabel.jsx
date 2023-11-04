import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import theme from '../../styles/themes.js';
import ChatIcon from '../icons/ChatIcon.jsx';

const ChatLabel = () => {
  return (
    <Box sx={wrapper}>
      <Link to="/chat">
        <Box sx={iconWrapper}>
          <ChatIcon />
        </Box>
        {/*<CustomBadge*/}
        {/*  badgeContent={25}*/}
        {/*  color='secondary'*/}
        {/*>*/}
        {/*  <Box sx={iconWrapper}>*/}
        {/*    <ChatIcon />*/}
        {/*  </Box>*/}
        {/*</CustomBadge>*/}
      </Link>

      <Box sx={notice(0)}>0</Box>
    </Box>
  );
};

export default ChatLabel;

const wrapper = theme => ({
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    transform: 'scale(0.7)',
  },
  [theme.breakpoints.down('xs')]: {
    transform: 'scale(0.44)',
    mr: '-20px',
  },
  // '& .MuiBadge-badge': {
  //   [theme.breakpoints.down('sm')]: {
  //     position: 'relative',
  //     top: '-16px',
  //     transform: 'scale(1.4)',
  //   },
  //   [theme.breakpoints.down('xs')]: {
  //     transform: 'scale(2.2)',
  //   },
  // },
});

const iconWrapper = theme => ({
  width: '80px',
  height: '80px',
  background: '#e5e5e5',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0px 4px 6px 0px rgba(190, 190, 190, 1)',
  transition: '0.3s',
  ':hover': { background: '#d1d1d1' },
  [theme.breakpoints.down('xs')]: {
    boxShadow: 'none',
  },
});

const notice = count => ({
  position: 'absolute',
  top: 0,
  right: '-8px',
  width: '25px',
  height: '25px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#FF0000',
  borderRadius: '50%',
  fontSize: count < 100 ? '18px' : '12px',
  fontWeight: 600,
  color: 'white',
  pointerEvents: 'none',
  [theme.breakpoints.down('xs')]: {
    transform: 'scale(1.55)',
    border: '2px solid white',
    fontSize: count < 100 ? '16px' : '11px',
  },
});
