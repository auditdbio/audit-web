import React from 'react';
import { CUSTOMER } from '../redux/actions/types.js';
import theme from '../styles/themes.js';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { ASSET_URL } from '../services/urls.js';
import PeopleIcon from '@mui/icons-material/People.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom/dist';

const OrganizationCard = ({ org }) => {
  const role = useSelector(s => s.user.user.current_role);
  const navigate = useNavigate();

  return (
    <Box sx={wrapper(theme, role)}>
      <Avatar
        src={org.avatar ? `${ASSET_URL}/id/${org.avatar}` : ''}
        sx={avatarSx}
      />
      <Box sx={{ width: '100%' }}>
        <Typography align={'center'} sx={{ fontWeight: 500 }}>
          {org.name}
        </Typography>
        <Box sx={infoWrapper}>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <PeopleIcon sx={iconSx} /> {org.members.length}
          </Typography>
          <Typography>{org.organization_type}</Typography>
        </Box>
      </Box>
      <Button
        onClick={() => navigate(`/o/${org.link_id}`)}
        sx={buttonSx}
        variant={'contained'}
        color={role === CUSTOMER ? 'primary' : 'secondary'}
      >
        View more
      </Button>
    </Box>
  );
};

export default OrganizationCard;

const wrapper = (theme, role) => ({
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  gap: '15px',
  borderRadius: '1.5rem',
  border: `1px solid ${
    role === CUSTOMER
      ? theme.palette.primary.main
      : theme.palette.secondary.main
  }!important`,
  [theme.breakpoints.down('sm')]: {
    padding: '15px 10px',
  },
});

const avatarSx = theme => ({
  height: '200px',
  width: '200px',
  [theme.breakpoints.down('md')]: {
    width: '150px',
    height: '150px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100px',
    height: '100px',
  },
});

const infoWrapper = theme => ({
  mt: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    '& p': {
      fontSize: '16px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& p': {
      fontSize: '14px',
    },
  },
});

const buttonSx = theme => ({
  width: '100%',
  borderRadius: '8px',
  textTransform: 'unset',
  [theme.breakpoints.down('md')]: {
    fontSize: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
});

const iconSx = theme => ({
  [theme.breakpoints.down('md')]: {
    width: '18px',
    height: '18px',
  },
});
