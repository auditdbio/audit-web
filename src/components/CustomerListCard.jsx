import React, { useState } from 'react';
import { Avatar, Box, Button, Tooltip, Typography } from '@mui/material';
import TagsList from './tagsList.jsx';
import CircleIcon from '@mui/icons-material/Circle';
import theme from '../styles/themes.js';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import { useNavigate } from 'react-router-dom';
import { ASSET_URL } from '../services/urls.js';
import { useDispatch, useSelector } from 'react-redux';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import AuditorSearchModal from './AuditorSearchModal.jsx';

const CustomerListCard = ({ customer, projectIdToInvite, budge }) => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const [openModal, setOpenModal] = useState(false);
  const customerReducer = useSelector(state => state.customer.customer);
  const [message, setMessage] = useState('');
  const [isForm, setIsForm] = useState(false);
  const myProjects = useSelector(state => state.project.myProjects);
  const dispatch = useDispatch();
  const userProjects = useSelector(s => s.project.myProjects);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const handleView = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleError = () => {
    setErrorMessage(null);
    setMessage('Switched to customer role');
    const delayedFunc = setTimeout(() => {
      if (userProjects.length) {
        navigate(`/my-projects/${auditor.user_id}`);
      } else {
        setMessage(null);
        setErrorMessage('No active projects');
      }
    }, 1000);
    return () => clearTimeout(delayedFunc);
  };

  const handleInvite = () => {
    setShowAddUser(!showAddUser);
  };

  return (
    <Box sx={wrapper}>
      <CustomSnackbar
        autoHideDuration={3000}
        open={!!message || !!errorMessage}
        onClose={() => {
          setErrorMessage(null);
          setMessage(null);
        }}
        severity={isForm || message ? 'success' : 'error'}
        text={message || errorMessage}
      />
      <AuditorSearchModal
        open={showAddUser}
        editMode={true}
        invite={true}
        handleClose={() => {
          setShowAddUser(false);
        }}
        customer={customer}
        modeType={'invite'}
        setError={() => console.log('error')}
      />
      <Box sx={cardLeftSide}>
        <Box sx={avatarDescription}>
          <Box>
            <Avatar
              src={customer.avatar && `${ASSET_URL}/${customer.avatar}`}
              sx={avatarStyle}
              alt={`${customer.first_name} photo`}
            />
          </Box>
          <Box sx={descriptionStyle(theme)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Box
                sx={{ display: 'grid', cursor: 'pointer' }}
                onClick={handleView}
              >
                <Tooltip
                  title={`${customer.first_name} ${customer.last_name}`}
                  arrow
                  placement="top"
                >
                  <Typography sx={nameStyle} noWrap={true}>
                    {customer.first_name} {customer.last_name}
                  </Typography>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={tagsWrapper}>
          <TagsList data={customer.tags} />
        </Box>
      </Box>

      <Box sx={cardRightSide}>
        {/*<Button*/}
        {/*  color="secondary"*/}
        {/*  size="small"*/}
        {/*  sx={viewButtonStyle}*/}
        {/*  variant={budge ? 'outlined' : 'contained'}*/}
        {/*  onClick={handleView}*/}
        {/*  {...addTestsLabel('view-more-button')}*/}
        {/*>*/}
        {/*  View more*/}
        {/*</Button>*/}
        <Button
          color="primary"
          size="small"
          sx={inviteButtonStyle(theme)}
          variant={budge ? 'outlined' : 'contained'}
          onClick={handleInvite}
          {...addTestsLabel('invite-button')}
        >
          Invite
        </Button>
        {budge && <Typography sx={budgeTitle}>not registered</Typography>}
      </Box>
    </Box>
  );
};

export default CustomerListCard;

const budgeTitle = theme => ({
  color: '#B2B3B3',
  fontSize: '12px!important',
  marginTop: '-10px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px!important',
    marginTop: '-5px',
  },
});

const wrapper = theme => ({
  padding: '12px 20px 12px 45px',
  display: 'flex',
  gap: '10px',
  height: '100%',
  justifyContent: 'space-between',
  [theme.breakpoints.down('lg')]: {
    padding: '20px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '15px',
  },
});

const cardLeftSide = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '12px',
  [theme.breakpoints.down('xs')]: {
    gap: '15px',
  },
};

const cardRightSide = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px',
  [theme.breakpoints.down('xs')]: {
    gap: '12px',
  },
};

const avatarDescription = theme => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '30px',
  [theme.breakpoints.down('lg')]: {
    gap: '20px',
  },
  [theme.breakpoints.down('xs')]: {
    gap: '10px',
  },
});

const descriptionStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  [theme.breakpoints.down('xs')]: {
    gap: '8px',
  },
});

const avatarStyle = theme => ({
  width: '65px',
  height: '65px',
  [theme.breakpoints.down('xs')]: {
    width: '38px',
    height: '38px',
  },
});

const nameStyle = {
  fontWeight: '600',
  fontSize: {
    zero: '11px',
    sm: '14px',
    md: '16px',
    lg: '18px',
  },
  color: '#152BEA',
};

const inviteButtonStyle = theme => ({
  width: '130px',
  textTransform: 'unset',
  boxShadow: '0',
  fontWeight: 600,
  [theme.breakpoints.down('md')]: {
    width: '130px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '86px',
    fontSize: '8px',
  },
});

const tagsWrapper = theme => ({
  [theme.breakpoints.down('xs')]: {
    maxWidth: '130px',
  },
});
