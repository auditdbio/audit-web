import React, { useState } from 'react';
import { Avatar, Box, Button, Tooltip, Typography } from '@mui/material';
import TagsList from './tagsList.jsx';
import CircleIcon from '@mui/icons-material/Circle';
import theme from '../styles/themes.js';
import AuditorModal from './AuditorModal.jsx';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import { useNavigate } from 'react-router-dom';
import { ASSET_URL } from '../services/urls.js';
import { useDispatch, useSelector } from 'react-redux';
import { CUSTOMER } from '../redux/actions/types.js';
import {
  changeRolePublicCustomer,
  changeRolePublicCustomerNoRedirect,
} from '../redux/actions/userAction.js';
import CustomSnackbar from './custom/CustomSnackbar.jsx';

const AuditorListCard = ({ auditor, projectIdToInvite }) => {
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
    if (user.current_role === CUSTOMER && isAuth() && myProjects.length) {
      if (projectIdToInvite) {
        return navigate(
          `/my-projects/${auditor.user_id}?projectIdToInvite=${projectIdToInvite}`,
        );
      } else {
        return navigate(`/my-projects/${auditor.user_id}`);
      }
    } else if (
      user.current_role !== CUSTOMER &&
      isAuth() &&
      !customerReducer?.first_name
    ) {
      dispatch(changeRolePublicCustomer(CUSTOMER, user.id, customerReducer));
      handleError();
    } else if (
      user.current_role !== CUSTOMER &&
      isAuth() &&
      customerReducer?.first_name
    ) {
      dispatch(
        changeRolePublicCustomerNoRedirect(CUSTOMER, user.id, customerReducer),
      );
      handleError();
    } else if (
      user.current_role === CUSTOMER &&
      isAuth() &&
      !myProjects.length
    ) {
      setErrorMessage('No active projects');
    } else {
      navigate('/sign-in');
    }
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

      <AuditorModal
        open={openModal}
        handleClose={handleCloseModal}
        auditor={auditor}
        isForm={isForm}
        handleError={handleError}
      />
      <Box sx={cardLeftSide}>
        <Box sx={avatarDescription}>
          <Box>
            <Avatar
              src={auditor.avatar && `${ASSET_URL}/${auditor.avatar}`}
              sx={avatarStyle}
              alt={`${auditor.first_name} photo`}
            />
          </Box>
          <Box sx={descriptionStyle(theme)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Box sx={{ display: 'grid' }}>
                <Tooltip
                  title={`${auditor.first_name} ${auditor.last_name}`}
                  arrow
                  placement={'top'}
                >
                  <Typography sx={nameStyle} noWrap={true}>
                    {auditor.first_name} {auditor.last_name}
                  </Typography>
                </Tooltip>
              </Box>
              {/*<Typography sx={projectStyle}>{auditor.company}</Typography>*/}
            </Box>
            <Box sx={statusGroup(theme)}>
              <CircleIcon sx={statusCircle} />
              <Typography sx={statusTextStyle}>Ready to audit</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={tagsWrapper}>
          <TagsList data={auditor.tags} />
        </Box>
      </Box>
      <Box sx={cardRightSide}>
        <Typography sx={priceStyle}>
          ${auditor.price_range.from} - {auditor.price_range.to}
        </Typography>
        <Button
          color={'secondary'}
          size={'small'}
          sx={viewButtonStyle}
          variant={'contained'}
          onClick={handleView}
          {...addTestsLabel('view-more-button')}
        >
          View more
        </Button>
        <Button
          color={'primary'}
          size={'small'}
          sx={inviteButtonStyle(theme)}
          variant={'contained'}
          onClick={handleInvite}
          {...addTestsLabel('invite-button')}
        >
          Invite to project
        </Button>
      </Box>
    </Box>
  );
};

export default AuditorListCard;

const wrapper = theme => ({
  padding: '32px 38px 32px 38px',
  border: '0.5px solid #B2B3B3',
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
  gap: '20px',
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
    md: '20px',
    lg: '20px',
  },
  color: '#152BEA',
};

const projectStyle = {
  fontWeight: 500,
  fontSize: {
    zero: '9px',
    sm: '11px',
    md: '13px',
    lg: '14px',
  },
  color: '#434242',
};

const statusGroup = theme => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  [theme.breakpoints.down('xs')]: {
    gap: '5px',
  },
});

const statusCircle = theme => ({
  fontSize: '14px',
  color: '#09C010',
  [theme.breakpoints.down('xs')]: {
    fontSize: '9px',
  },
});
const statusTextStyle = {
  fontWeight: 400,
  fontSize: {
    zero: '9px',
    sm: '11px',
    md: '13px',
    lg: '14px',
  },
  color: '#434242',
};

const priceStyle = {
  fontSize: '20px',
  color: '#434242',
  [theme.breakpoints.down('xs')]: {
    fontSize: '9px',
  },
};

const viewButtonStyle = theme => ({
  width: '130px',
  fontWeight: 600,
  textTransform: 'unset',
  boxShadow: '0',
  [theme.breakpoints.down('md')]: {
    width: '130px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '85px',
    fontSize: '8px',
  },
});

const inviteButtonStyle = theme => ({
  width: '130px',
  textTransform: 'unset',
  boxShadow: '0',
  fontWeight: 600,
  [theme.breakpoints.down('md')]: {
    width: '130px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '85px',
    fontSize: '8px',
  },
});

const tagsWrapper = theme => ({
  [theme.breakpoints.down('xs')]: {
    maxWidth: '130px',
  },
});

const fakeTagsArray = ['Python', 'Java', 'Audit', 'Big Four'];
