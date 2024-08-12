import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Button,
  Link,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import Loader from '../components/Loader.jsx';
import { Box } from '@mui/system';
import { ASSET_URL } from '../services/urls.js';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import MobileTagsList from '../components/MobileTagsList/index.jsx';
import TagsList from '../components/tagsList.jsx';
import theme from '../styles/themes.js';
import Layout from '../styles/Layout.jsx';
import {
  clearCurrentAuditor,
  getAuditorByLinkId,
  getAuditorRating,
  getCurrentAuditor,
} from '../redux/actions/auditorAction.js';
import {
  getCurrentCustomer,
  getCustomerByLinkId,
} from '../redux/actions/customerAction.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import {
  changeRolePublicCustomer,
  changeRolePublicCustomerNoRedirect,
  getPublicProfile,
} from '../redux/actions/userAction.js';
import { setCurrentChat } from '../redux/actions/chatActions.js';
import ChatIcon from '../components/icons/ChatIcon.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import LinkedinIcon from '../components/icons/LinkedinIcon.jsx';
import XTwitterLogo from '../components/icons/XTwitter-logo.jsx';
import GitHubIcon from '@mui/icons-material/GitHub';
import Headings from '../router/Headings.jsx';
import Star from '../components/icons/Star.jsx';
import RatingDetails from '../components/RatingDetails.jsx';
import UserFeedbacks from '../components/UserFeedbacks.jsx';
import WalletConnectIcon from '../components/icons/WalletConnectIcon.jsx';

const PublicProfile = ({ notFoundRedirect = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));

  const { role: roleParams, id, linkId } = useParams();

  const { currentCustomer, customer } = useSelector(s => s.customer);
  const { currentAuditor, auditorRating } = useSelector(s => s.auditor);
  const { myProjects } = useSelector(s => s.project);
  const { user, publicUser } = useSelector(s => s.user);
  const { chatList } = useSelector(s => s.chat);

  const [errorMessage, setErrorMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [role, setRole] = useState(() => {
    if (roleParams.toLowerCase() === 'c') return CUSTOMER;
    if (roleParams.toLowerCase() === 'a') return AUDITOR;
    return roleParams;
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDetailsOpen, setIsDetailsOpen] = useState(
    searchParams.get('rating') || false,
  );

  const handleError = () => {
    setErrorMessage(null);
    setMessage('Switched to customer role');
    const delayedFunc = setTimeout(() => {
      if (myProjects.length) {
        navigate(`/my-projects/${currentAuditor.user_id}`);
      } else {
        setMessage(null);
        setErrorMessage('No active projects');
      }
    }, 1000);
    return () => clearTimeout(delayedFunc);
  };

  const handleInvite = () => {
    if (user.current_role === CUSTOMER && isAuth() && myProjects.length) {
      navigate(`/my-projects/${currentAuditor.user_id}`);
    } else if (
      user.current_role !== CUSTOMER &&
      isAuth() &&
      !customer?.first_name
    ) {
      dispatch(changeRolePublicCustomer(CUSTOMER, user.id));
      handleError();
    } else if (
      user.current_role !== CUSTOMER &&
      isAuth() &&
      customer?.first_name
    ) {
      dispatch(changeRolePublicCustomerNoRedirect(CUSTOMER, user.id, customer));
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

  const handleSendMessage = data => {
    const existingChat = chatList.find(chat =>
      chat.members?.find(
        member =>
          member.id === data?.user_id &&
          member.role?.toLowerCase() === role.toLowerCase(),
      ),
    );
    const chatId = existingChat ? existingChat.id : data?.user_id;
    const members = [data?.user_id, user.id];

    dispatch(
      setCurrentChat(chatId, {
        name: data.first_name,
        avatar: data.avatar,
        role,
        isNew: !existingChat,
        members,
      }),
    );
    localStorage.setItem('path', window.location.pathname);
    navigate(`/chat/${chatId}`);
  };

  const openRating = () => {
    setIsDetailsOpen(prev => !prev);
    if (isDetailsOpen) {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (role.toLowerCase() === AUDITOR) {
      if (id) {
        dispatch(getCurrentAuditor(id));
      } else if (linkId) {
        dispatch(getAuditorByLinkId(linkId, notFoundRedirect));
      }
    } else if (role.toLowerCase() === CUSTOMER) {
      if (id) {
        dispatch(getCurrentCustomer(id));
      } else if (linkId) {
        dispatch(getCustomerByLinkId(linkId, notFoundRedirect));
      }
    }
    if (id) {
      dispatch(getPublicProfile(id));
    }
  }, [id, role, linkId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('go-back');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      localStorage.removeItem('go-back');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      dispatch(clearCurrentAuditor());
    };
  }, [navigate]);

  const data = useMemo(() => {
    if (role.toLowerCase() === AUDITOR) {
      return currentAuditor;
    } else {
      return currentCustomer;
    }
  }, [role, currentCustomer, currentAuditor]);

  useEffect(() => {
    if (linkId && data?.link_id && data?.link_id !== linkId) {
      navigate(`/${roleParams}/${data.link_id}`);
    }
  }, [linkId, data]);

  useEffect(() => {
    if (
      data?.user_id &&
      role.toLowerCase() === AUDITOR &&
      user.id !== data?.user_id
    ) {
      dispatch(getAuditorRating(data.user_id, true));
    }
  }, [data, user]);

  if (!data) {
    return (
      <Layout>
        <Headings title="Profile" />

        <Box
          sx={[
            wrapper(
              theme,
              role.toLowerCase() === AUDITOR
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
            ),
            {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <Loader role={role} />
        </Box>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Headings
          title={`${data.first_name} ${data.last_name}`}
          description={data.about}
          image={data.avatar}
        />

        <Box
          sx={wrapper(
            theme,
            role.toLowerCase() === AUDITOR
              ? theme.palette.secondary.main
              : theme.palette.primary.main,
          )}
        >
          {(localStorage.getItem('go-back') || isDetailsOpen) && (
            <Button
              variant="text"
              color={role.toLowerCase() === AUDITOR ? 'secondary' : 'primary'}
              sx={goBackSx}
              onClick={() => {
                isDetailsOpen ? setIsDetailsOpen(false) : navigate(-1);
              }}
            >
              <ArrowBackIcon />
            </Button>
          )}

          {data.kind === 'badge' && (
            <Typography sx={badgeTitle}>Not in base AuditDB</Typography>
          )}
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Avatar
                src={data.avatar && `${ASSET_URL}/${data.avatar}`}
                sx={avatarStyle}
                alt="User photo"
              />
              {role === AUDITOR && auditorRating && (
                <Button sx={ratingButton} type="button" onClick={openRating}>
                  <Star size={25} />
                  <Typography
                    component="span"
                    sx={{ ml: '10px', fontWeight: 500, fontSize: '20px' }}
                  >
                    {auditorRating.user_id === data.user_id
                      ? Math.trunc(auditorRating.summary)
                      : Math.trunc(data.rating || 0)}
                  </Typography>
                </Button>
              )}
            </Box>

            {isDetailsOpen ? (
              <RatingDetails role={role} rating={auditorRating} />
            ) : (
              <>
                <Box sx={{ [theme.breakpoints.down(560)]: { width: '100%' } }}>
                  <Box sx={infoStyle}>
                    <Box sx={infoInnerStyle}>
                      <Box sx={infoWrapper}>
                        <span>{data.last_name ? 'First Name' : 'Name'}</span>
                        <Typography noWrap={true}>{data.first_name}</Typography>
                      </Box>
                      {data.last_name && (
                        <Box sx={infoWrapper}>
                          <span>Last name</span>
                          <Typography noWrap={true}>
                            {data.last_name}
                          </Typography>
                        </Box>
                      )}

                      {role.toLowerCase() === AUDITOR && (
                        <Box sx={infoWrapper}>
                          <span>Price range:</span>
                          {data.price_range?.from && data.price_range?.to ? (
                            <Typography>
                              ${data.price_range.from} - {data.price_range.to}{' '}
                              per line
                            </Typography>
                          ) : (
                            <Typography>not specified</Typography>
                          )}
                        </Box>
                      )}

                      {role.toLowerCase() !== AUDITOR && data.company && (
                        <Box sx={infoWrapper}>
                          <span>Company</span>
                          <Typography noWrap={true}>{data.company}</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={infoInnerStyle}>
                      <Box sx={infoWrapper}>
                        <span>E-mail</span>
                        <Typography noWrap={true}>
                          {data.contacts?.public_contacts
                            ? data.contacts?.email
                            : 'Hidden'}
                        </Typography>
                      </Box>
                      <Box sx={infoWrapper}>
                        <span>Telegram</span>
                        <Typography noWrap={true}>
                          {data.contacts?.public_contacts
                            ? data.contacts?.telegram
                            : 'Hidden'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {!matchSm && (data.about || !!data.tags?.length) && (
                    <Box sx={aboutWrapper}>
                      <Box sx={infoWrapper}>
                        <Typography
                          sx={{
                            wordBreak: 'break-word',
                            maxWidth: 'unset!important',
                          }}
                        >
                          <span className="about-title">About</span>
                          {data.about}
                        </Typography>
                      </Box>
                      <TagsList data={data.tags} fullView={true} />
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>

          {matchSm && !isDetailsOpen && (data.about || !!data.tags?.length) && (
            <Box sx={aboutWrapper}>
              <Box sx={[infoWrapper, { flexDirection: 'column' }]}>
                <span
                  className="about-title"
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    marginBottom: '10px',
                  }}
                >
                  About
                </span>
                <Typography
                  sx={{
                    wordBreak: 'break-word',
                    maxWidth: 'unset!important',
                  }}
                >
                  {data.about}
                </Typography>
              </Box>
              <MobileTagsList data={data.tags} />
            </Box>
          )}

          {isDetailsOpen && (
            <UserFeedbacks feedbacks={auditorRating?.user_feedbacks} />
          )}

          <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {publicUser?.linked_accounts
              ?.filter(account => account.is_public)
              .map(account => {
                if (account.name.toLowerCase() === 'linkedin') {
                  return (
                    <Box
                      key={account.id}
                      sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                    >
                      {account.url ? (
                        <Tooltip title={account.url} placement="top">
                          <Link
                            href={account.url}
                            sx={{ color: 'initial' }}
                            target={'_blank'}
                          >
                            <LinkedinIcon />
                          </Link>
                        </Tooltip>
                      ) : (
                        <LinkedinIcon />
                      )}
                    </Box>
                  );
                } else if (account.name.toLowerCase() === 'github') {
                  return (
                    <Box
                      key={account.id}
                      sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                    >
                      <Tooltip title={account.url} placement="top">
                        <Link
                          href={account.url}
                          sx={{ color: 'initial' }}
                          target={'_blank'}
                        >
                          <GitHubIcon
                            sx={{
                              width: '50px',
                              height: '50px',
                              padding: '4px',
                            }}
                          />
                        </Link>
                      </Tooltip>
                    </Box>
                  );
                } else if (account.name.toLowerCase() === 'walletconnect') {
                  return (
                    <Box
                      key={account.id}
                      sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                    >
                      <Tooltip title={account.name} placement="top">
                        <Box sx={{ color: 'initial' }}>
                          <WalletConnectIcon
                            sx={{
                              width: '45px',
                              height: '45px',
                              padding: '4px',
                            }}
                          />
                        </Box>
                      </Tooltip>
                    </Box>
                  );
                } else {
                  return (
                    <Box
                      key={account.id}
                      sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                    >
                      <Tooltip title={account.url} placement="top">
                        <Link
                          href={account.url}
                          sx={{ color: 'initial' }}
                          target={'_blank'}
                        >
                          <XTwitterLogo width={'50px'} height={'50px'} space />
                        </Link>
                      </Tooltip>
                    </Box>
                  );
                }
              })}
          </Box>
          {/*{matchXs && <MobileTagsList data={data.tags} />}*/}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              alignItems: 'center',
            }}
          >
            {role.toLowerCase() === AUDITOR && (
              <Button
                variant={data.kind === 'badge' ? 'outlined' : 'contained'}
                sx={buttonSx}
                color={'secondary'}
                onClick={handleInvite}
                disabled={data?.user_id === user?.id}
                {...addTestsLabel('invite-button')}
              >
                Invite to project
              </Button>
            )}
            {data.kind !== 'badge' &&
              isAuth() &&
              data?.user_id !== user?.id && (
                <Button
                  variant="text"
                  color={role === AUDITOR ? 'secondary' : 'primary'}
                  sx={buttonSx}
                  disabled={data?.user_id === user?.id}
                  onClick={() => handleSendMessage(data)}
                  {...addTestsLabel('message-button')}
                >
                  <ChatIcon />
                </Button>
              )}
          </Box>
        </Box>
      </Layout>
    );
  }
};

export default PublicProfile;

const wrapper = (theme, color) => ({
  position: 'relative',
  width: '100%',
  minHeight: '520px',
  display: 'flex',
  flexDirection: 'column',
  padding: '60px 40px 40px',
  gap: '50px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  border: `2px solid ${color}`,
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    justifyContent: 'flex-start',
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

const goBackSx = {
  position: 'absolute',
  top: '20px',
  left: '30px',
};

const badgeTitle = {
  textAlign: 'center',
  color: '#B9B9B9',
  fontWeight: 500,
};

const aboutWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  '& .tagsWrapper': {
    width: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});

const infoInnerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const infoStyle = theme => ({
  display: 'flex',
  margin: '0 0 16px',
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

const ratingButton = {
  color: 'black',
  mt: '20px',
  display: 'flex',
  alignItems: 'center',
};

const contentWrapper = theme => ({
  display: 'flex',
  gap: '70px',
  // justifyContent: 'center',
  margin: '0 auto',
  width: '100%',
  maxWidth: '1200px',
  [theme.breakpoints.down('md')]: {
    gap: '50px',
  },
  [theme.breakpoints.down('sm')]: {
    alignItems: 'center',
    maxWidth: 'unset',
    // justifyContent: 'flex-start',
    margin: 0,
    gap: '30px',
    width: '100%',
  },
  [theme.breakpoints.down(560)]: {
    flexDirection: 'column',
    gap: '20px',
  },
});

const buttonSx = theme => ({
  display: 'block',
  textTransform: 'capitalize',
  fontWeight: 600,
  padding: '9px 50px',
  borderRadius: '10px',
  ':last-child': { mb: 0 },
  [theme.breakpoints.down('xs')]: {
    padding: '9px 20px',
    fontSize: '12px',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
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
    '& .about-title': {
      marginRight: 'unset',
    },
    '& p': {
      maxWidth: '240px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
    '& span': {
      width: '80px',
      marginRight: '12px',
    },
    '& p': {
      maxWidth: '180px',
    },
  },
  [theme.breakpoints.down(450)]: {
    '& .about-title': {
      marginRight: '52px',
    },
  },
});
