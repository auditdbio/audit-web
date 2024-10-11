import React, { useMemo, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Typography,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';
import theme from '../styles/themes.js';
import { useNavigate, Link, useSearchParams } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader.jsx';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import TagsList from './tagsList';
import { ASSET_URL } from '../services/urls.js';
import MobileTagsList from './MobileTagsList/index.jsx';
import { addTestsLabel } from '../lib/helper.js';
import ShareProfileButton from './custom/ShareProfileButton.jsx';
import IdentitySetting from './IdentitySetting/IdentitySetting.jsx';
import LinkedinIcon from './icons/LinkedinIcon.jsx';
import XTwitterLogo from './icons/XTwitter-logo.jsx';
import WalletConnectIcon from './icons/WalletConnectIcon.jsx';
import { clearUserMessages } from '../redux/actions/userAction.js';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import Headings from '../router/Headings.jsx';
import OrganizationList from './OrganizationList/OrganizationList.jsx';
import Star from './icons/Star.jsx';
import { getAuditorRating } from '../redux/actions/auditorAction.js';
import RatingDetails from './RatingDetails.jsx';
import UserFeedbacks from './UserFeedbacks.jsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';

const UserInfo = ({ role, linkId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchXxs = useMediaQuery(theme.breakpoints.down(850));
  const organizations = useSelector(s => s.organization.organizations);
  const invites = useSelector(s => s.organization.invites);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isDetailsOpen, setIsDetailsOpen] = useState(
    searchParams.get('rating') || false,
  );

  const {
    customer,
    error: customerError,
    success: customerSuccess,
  } = useSelector(s => s.customer);
  const {
    auditor,
    auditorRating,
    error: auditorError,
    success: auditorSuccess,
  } = useSelector(s => s.auditor);
  const { user, error } = useSelector(s => s.user);

  const handleEdit = () => {
    navigate('/edit-profile');
  };

  const openRating = () => {
    setIsDetailsOpen(prev => !prev);
    if (isDetailsOpen) {
      setSearchParams({});
    }
  };

  const data = useMemo(() => {
    if (role === AUDITOR) {
      return auditor;
    } else {
      return customer;
    }
  }, [role, customer, auditor]);

  useEffect(() => {
    if (linkId && data?.link_id && data?.link_id !== linkId) {
      navigate(`/${role[0]}/${data.link_id}`);
    }
  }, [linkId, data]);

  useEffect(() => {
    if (data?.user_id && role.toLowerCase() === AUDITOR) {
      dispatch(getAuditorRating(data.user_id, true));
    }
  }, [data]);

  if (!data) {
    return <Loader role={role} />;
  } else {
    return (
      <Box sx={wrapper}>
        <Headings
          title={user?.name || 'Profile'}
          image={data.avatar}
          description={`${data.first_name} ${data.last_name} | ${data.about}`}
        />

        <CustomSnackbar
          autoHideDuration={5000}
          open={
            !!error ||
            !!customerError ||
            !!auditorError ||
            !!customerSuccess ||
            !!auditorSuccess
          }
          text={
            error ||
            customerError ||
            auditorError ||
            customerSuccess ||
            auditorSuccess
          }
          severity={
            error || customerError || auditorError ? 'error' : 'success'
          }
          onClose={() => dispatch(clearUserMessages())}
        />

        <Box sx={contentWrapper}>
          {isDetailsOpen && (
            <Button
              variant="text"
              color={role.toLowerCase() === AUDITOR ? 'secondary' : 'primary'}
              sx={goBackSx}
              onClick={() => setIsDetailsOpen(false)}
            >
              <ArrowBackIcon />
            </Button>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
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
            {!!organizations.length && (
              <Box
                sx={{
                  flexDirection: 'column',
                  gap: '10px',
                  display: 'flex',
                  maxWidth: '200px',
                  width: '100%',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  '& span': {
                    color: '#B2B3B3',
                  },
                }}
              >
                {!!invites.length && (
                  <>
                    <span>Invites</span>
                    <OrganizationList organizations={invites} />
                  </>
                )}
                <Link to={'/my-organizations'}>
                  <span>Organization</span>
                </Link>
                <OrganizationList organizations={organizations} />
              </Box>
            )}
          </Box>

          {isDetailsOpen ? (
            <Box sx={ratingWrapper}>
              <RatingDetails
                rating={auditorRating}
                role={role}
                username={`${data.first_name} ${data.last_name}`}
              />
            </Box>
          ) : (
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
                    {data.contacts?.telegram}
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
                  <Typography noWrap={true}>{data.contacts?.email}</Typography>
                </Box>
              </Box>
              <Box sx={[infoWrapper, aboutWrapper]}>
                <span>About</span>
                <Typography
                  sx={{
                    maxWidth: 'unset!important',
                    width: '100%',
                    wordBreak: 'break-word',
                  }}
                >
                  {data.about}
                </Typography>
              </Box>
              {!matchXs && <TagsList data={data.tags} fullView={true} />}
            </Box>
          )}
        </Box>
        {matchXs && !isDetailsOpen && <MobileTagsList data={data.tags} />}

        {isDetailsOpen && (
          <UserFeedbacks feedbacks={auditorRating?.user_feedbacks} />
        )}

        <Box sx={accountsSection}>
          {user.linked_accounts?.map(account => {
            if (account.name.toLowerCase() === 'linkedin') {
              return (
                <Box
                  key={account.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <Tooltip title={account.url} placement="top">
                    {/*<Link href={account.url} target={'_blank'}>*/}
                    <LinkedinIcon />
                    {/*</Link>*/}
                  </Tooltip>
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
                        sx={{ width: '50px', height: '50px', padding: '4px' }}
                      />
                    </Link>
                  </Tooltip>
                </Box>
              );
            } else if (account.name === 'WalletConnect') {
              return (
                <Box
                  key={account.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <Tooltip title={account.name} placement="top">
                    <Box sx={{ color: 'initial' }}>
                      <WalletConnectIcon
                        sx={{ width: '45px', height: '45px', padding: '4px' }}
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
                      <XTwitterLogo width={'38px'} height={'38px'} />
                    </Link>
                  </Tooltip>
                </Box>
              );
            }
          })}
        </Box>

        <Box sx={buttonsSection}>
          {((role === AUDITOR && auditor.user_id) ||
            (role === CUSTOMER && customer.user_id)) && (
            <ShareProfileButton
              role={role}
              userId={
                role === AUDITOR
                  ? auditor.link_id || auditor.user_id
                  : customer.link_id || customer.user_id
              }
            />
          )}
          <Box
            sx={[
              { display: 'flex', gap: '15px' },
              matchXxs ? { flexDirection: 'column' } : {},
            ]}
          >
            <Button
              sx={[buttonSx, role === 'auditor' ? submitAuditor : {}]}
              variant={'contained'}
              onClick={handleEdit}
              {...addTestsLabel('user_edit-button')}
            >
              Edit
            </Button>
            <IdentitySetting />
            <Button
              onClick={() => navigate('/create-organization')}
              sx={buttonSx}
              variant={'contained'}
            >
              Create organization
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
};

export default UserInfo;

const aboutWrapper = theme => ({
  width: '100%',
  '& span': {
    marginRight: '50px',
    maxWidth: '125px',
    width: '100%',
  },
  [theme.breakpoints.down('md')]: {
    '& span': {
      maxWidth: '90px',
      marginRight: '20px',
    },
  },
  [theme.breakpoints.down(450)]: {
    '& span': {
      maxWidth: '70px',
    },
  },
});

const wrapper = theme => ({
  position: 'relative',
  width: '100%',
  minHeight: '520px',
  display: 'flex',
  flexDirection: 'column',
  padding: '60px 40px 40px',
  gap: '30px',
  justifyContent: 'space-between',
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

const ratingWrapper = theme => ({
  flexGrow: 1,
  [theme.breakpoints.down('sm')]: {
    width: '80%',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
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
  rowGap: '15px',
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
  // padding: '9px 50px',
  width: '234px',
  borderRadius: '10px',
  [theme.breakpoints.down('xs')]: {
    padding: '9px 10px',
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
  alignItems: 'center',
  fontWeight: 500,
  color: '#434242',
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
  },
  [theme.breakpoints.down('sm')]: {
    '& p': {
      maxWidth: '240px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
  [theme.breakpoints.down(450)]: {
    '& span': {
      width: '70px',
      marginRight: '20px',
    },
    '& p': {
      maxWidth: '180px',
    },
  },
});

const accountLink = {
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  color: 'black',
  textDecoration: 'none',
};

const ratingButton = {
  color: 'black',
  mt: '20px',
  display: 'flex',
  alignItems: 'center',
};

const buttonsSection = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
};

const accountsSection = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'center',
};

const goBackSx = {
  position: 'absolute',
  top: '10px',
  left: '10px',
};
