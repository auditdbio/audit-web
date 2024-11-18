import React from 'react';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import { ASSET_URL } from '../../services/urls.js';
import { Link } from 'react-router-dom';

const AuditUserCard = ({ avatar, role, name, email, telegram, id }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={roleTitleSx} align={'center'}>
        {role}
      </Typography>
      <Box sx={useContentSx}>
        <Box sx={userWrapper}>
          <Avatar
            src={avatar ? `${ASSET_URL}/${avatar}` : ''}
            alt="auditor photo"
          />
        </Box>
        <Box sx={userInfoWrapper}>
          <Box sx={infoWrapper}>
            <span>Name:</span>
            <Box sx={{ display: 'grid' }}>
              <Link
                to={`/a/${id}`}
                style={{
                  display: 'grid',
                  textAlign: 'center',
                  color: '#434242',
                }}
              >
                <Tooltip title={name} arrow placement="top">
                  <Typography noWrap={true} sx={userNameWrapper}>
                    {name}
                  </Typography>
                </Tooltip>
              </Link>
            </Box>
          </Box>
          <Box sx={infoWrapper}>
            <span>E-mail:</span>
            <Box sx={{ display: 'grid' }}>
              {!!email ? (
                <Tooltip title={email} arrow placement="top">
                  <Typography noWrap={true}>{email}</Typography>
                </Tooltip>
              ) : (
                <Typography noWrap={true}>Not specified</Typography>
              )}
            </Box>
          </Box>
          <Box sx={infoWrapper}>
            <span>Telegram:</span>
            <Box sx={{ display: 'grid' }}>
              {telegram ? (
                <Tooltip title={telegram} arrow placement="top">
                  <Typography noWrap={true}>{telegram}</Typography>
                </Tooltip>
              ) : (
                <Typography noWrap={true}>Not specified</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuditUserCard;

const useContentSx = theme => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '20px',
  paddingTop: '10px',
});

const userNameWrapper = theme => ({
  maxWidth: '190px',
  textAlign: 'start',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'unset',
  },
});

const userWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  '& .MuiAvatar-root': {
    width: '120px',
    height: '120px',
  },
  '& p': {
    color: '#434242',
    fontSize: '15px',
    fontWeight: 500,
    '&:nth-of-type(1)': {
      margin: '0 0 5px',
    },
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiAvatar-root': {
      width: '90px',
      height: '90px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '20px',
    '& p': {
      color: '#434242',
      fontSize: '15px',
      fontWeight: 500,
      '&:nth-of-type(1)': {
        margin: '0 0 18px',
      },
    },
  },
});

const roleTitleSx = theme => ({
  fontSize: '20px',
  margin: 'unset!important',
});

const userInfoWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  // marginTop: '20px',
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  color: '#434242',
  '& p': {
    fontSize: 'inherit',
    maxWidth: '200px',
  },
  '& span': {
    width: '85px',
    marginRight: '30px',
    color: '#B2B3B3',
  },
  fontSize: '15px',
  [theme.breakpoints.down('md')]: {
    '& span': {
      width: '90px',
      marginRight: '20px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& p': {
      maxWidth: '300px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
  [theme.breakpoints.down(600)]: {
    '& span': {
      width: '50px',
    },
  },
});
