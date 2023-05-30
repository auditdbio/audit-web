import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Typography, useMediaQuery } from '@mui/material';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import Loader from '../components/Loader.jsx';
import { Box } from '@mui/system';
import { ASSET_URL } from '../services/urls.js';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import MobileTagsList from '../components/MobileTagsList/index.jsx';
import TagsList from '../components/tagsList.jsx';
import theme from '../styles/themes.js';
import Layout from '../styles/Layout.jsx';
import { getCurrentAuditor } from '../redux/actions/auditorAction.js';
import { getCurrentCustomer } from '../redux/actions/customerAction.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import {
  changeRolePublicCustomer,
  changeRolePublicCustomerNoRedirect,
} from '../redux/actions/userAction.js';

const PublicProfile = () => {
  const { role, id } = useParams();
  const navigate = useNavigate();
  const customer = useSelector(s => s.customer.currentAuditor);
  const auditor = useSelector(s => s.auditor.currentAuditor);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const userProjects = useSelector(s => s.project.myProjects);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const customerReducer = useSelector(state => state.customer.customer);
  const myProjects = useSelector(state => state.project.myProjects);
  const user = useSelector(state => state.user.user);

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
      navigate(`/my-projects/${auditor.user_id}`);
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

  useEffect(() => {
    if (role.toLowerCase() === AUDITOR) {
      dispatch(getCurrentAuditor(id));
    } else {
      dispatch(getCurrentCustomer(id));
    }
  }, [id, role]);

  const data = useMemo(() => {
    if (role.toLowerCase() === AUDITOR) {
      return auditor;
    } else {
      return customer;
    }
  }, [role, customer, auditor]);

  if (!data) {
    return <Loader role={role} />;
  } else {
    return (
      <Layout>
        <Box
          sx={wrapper(
            theme,
            role.toLowerCase() === AUDITOR
              ? theme.palette.secondary.main
              : theme.palette.primary.main,
          )}
        >
          <Box sx={contentWrapper}>
            <CustomSnackbar
              autoHideDuration={3000}
              open={!!message || !!errorMessage}
              onClose={() => {
                setErrorMessage(null);
                setMessage(null);
              }}
              severity={!errorMessage ? 'success' : 'error'}
              text={message || errorMessage}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                src={data.avatar && `${ASSET_URL}/${data.avatar}`}
                sx={avatarStyle}
                alt="User photo"
              />
            </Box>
            <Box sx={infoStyle}>
              <Box sx={infoInnerStyle}>
                <Box sx={infoWrapper}>
                  <span>First Name</span>
                  <Typography noWrap={true}>{data.first_name}</Typography>
                </Box>
                <Box sx={infoWrapper}>
                  <span>Last name</span>
                  <Typography noWrap={true}>{data.last_name}</Typography>
                </Box>
                <Box sx={infoWrapper}>
                  <span>Telegram</span>
                  <Typography noWrap={true}>
                    {data.contacts?.public_contacts
                      ? data.contacts?.telegram
                      : 'Hidden'}
                  </Typography>
                </Box>
                {role === AUDITOR && (
                  <Box sx={infoWrapper}>
                    <span>Price range:</span>
                    {data?.price_range?.from && data?.price_range?.to && (
                      <Typography>
                        ${data?.price_range?.from} - {data?.price_range?.to} per
                        line
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
              <Box sx={infoInnerStyle}>
                {role !== AUDITOR && (
                  <Box sx={infoWrapper}>
                    <span>Company</span>
                    <Typography noWrap={true}>{data.company}</Typography>
                  </Box>
                )}
                <Box sx={infoWrapper}>
                  <span>E-mail</span>
                  <Typography noWrap={true}>
                    {data.contacts?.public_contacts
                      ? data.contacts?.email
                      : 'Hidden'}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
              >
                <Box sx={infoWrapper}>
                  <Typography
                    sx={{
                      wordBreak: 'break-word',
                      maxWidth: 'unset!important',
                    }}
                  >
                    <span className={'about-title'}>About</span>
                    {data.about}
                  </Typography>
                </Box>
                {!matchXs && <TagsList data={data.tags} fullView={true} />}
              </Box>
            </Box>
          </Box>
          {matchXs && <MobileTagsList data={data.tags} />}
          {role.toLowerCase() === AUDITOR && (
            <Button
              variant={'contained'}
              sx={[submitAuditor, buttonSx]}
              onClick={handleInvite}
              {...addTestsLabel('invite-button')}
            >
              Invite to project
            </Button>
          )}
        </Box>
      </Layout>
    );
  }
};

export default PublicProfile;

const wrapper = (theme, color) => ({
  width: '100%',
  minHeight: '520px',
  display: 'flex',
  flexDirection: 'column',
  padding: '100px 100px 60px',
  gap: '50px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  border: `2px solid ${color}`,
  justifyContent: 'space-between',
  [theme.breakpoints.down('lg')]: {
    padding: '60px 40px 40px',
  },
  [theme.breakpoints.down('md')]: {
    gap: '50px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '20px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    alignItems: 'center',
    gap: '25px',
    '& .mobile-tag-wrapper': {
      maxWidth: '380px',
    },
  },
});

const infoInnerStyle = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const infoStyle = theme => ({
  display: 'flex',
  margin: '0 0 50px',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '40px',
  '& .tagsWrapper': {
    width: '100%',
  },
  [theme.breakpoints.down('md')]: {
    gap: '10px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '16px',
    margin: 0,
    '& .tagsWrapper': {
      width: '520px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    gap: '16px',
    margin: 0,
    alignItems: 'flex-start',
    '& .tagsWrapper': {
      width: '520px',
    },
  },
});

const avatarStyle = theme => ({
  width: '205px',
  height: '205px',
  [theme.breakpoints.down('xs')]: {
    width: '150px',
    height: '150px',
  },
});

const contentWrapper = theme => ({
  display: 'flex',
  gap: '70px',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    gap: '50px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
  },
});

const buttonSx = theme => ({
  margin: '0 auto',
  display: 'block',
  color: theme.palette.background.default,
  textTransform: 'capitalize',
  fontWeight: 600,
  fontSize: '18px',
  padding: '9px 50px',
  borderRadius: '10px',
  [theme.breakpoints.down('xs')]: {
    padding: '9px 20px',
    fontSize: '12px',
  },
});

const submitAuditor = theme => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: '#450e5d',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  fontWeight: 500,
  color: '#434242',
  '& .about-title': {
    marginRight: '128px',
  },
  '& p': {
    fontSize: 'inherit',
    maxWidth: '250px',
  },
  '& span': {
    width: '125px',
    marginRight: '50px',
    color: '#B2B3B3',
  },
  fontSize: '15px',
  [theme.breakpoints.down('md')]: {
    '& span': {
      width: '90px',
      marginRight: '20px',
    },
    '& p': {
      maxWidth: '190px',
    },
    '& .about-title': {
      marginRight: '64px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& p': {
      maxWidth: '240px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
    '& .about-title': {
      marginRight: '73px',
    },
  },
  [theme.breakpoints.down(450)]: {
    '& span': {
      width: '70px',
      marginRight: '20px',
    },
    '& p': {
      maxWidth: '180px',
    },
    '& .about-title': {
      marginRight: '52px',
    },
  },
});
