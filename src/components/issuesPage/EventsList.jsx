import React from 'react';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Avatar, Box, Typography } from '@mui/material';

const EventsList = ({ issue }) => {
  return (
    <Box sx={wrapper}>
      {issue.events?.map(event => {
        return (
          <Box key={event.datetime} sx={eventSx}>
            <Box sx={iconSx}>
              <CircleNotificationsIcon fontSize="large" color="default" />
            </Box>
            <Avatar sx={avatarSx} src={event.user?.avatar} alt="user photo" />
            <Typography sx={eventTextSx}>
              <b>{event.user?.name}</b> {event.message}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default EventsList;

const wrapper = theme => ({
  width: '100%',
  padding: '0 20px',
  mb: '40px',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('xs')]: {
    padding: 0,
  },
});

const eventSx = {
  display: 'flex',
  alignItems: 'center',
  mb: '20px',
  ':last-child': {
    mb: 0,
  },
};

const iconSx = {
  mr: '20px',
  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '1px',
    height: '32px',
    backgroundColor: '#b9b9b9',
  },
};

const avatarSx = {
  width: '30px',
  height: '30px',
  mr: '13px',
};

const eventTextSx = {
  color: '#434242',
  fontWeight: 500,
  fontSize: '20px',
  lineHeight: '24px',
};
