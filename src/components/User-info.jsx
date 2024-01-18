import React, { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Typography,
  Link,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub.js';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import theme from '../styles/themes.js';
import { useNavigate } from 'react-router-dom/dist';
import { useSelector } from 'react-redux';
import Loader from './Loader.jsx';
import { AUDITOR } from '../redux/actions/types.js';
import TagsList from './tagsList';
import { ASSET_URL } from '../services/urls.js';
import MobileTagsList from './MobileTagsList/index.jsx';
import { addTestsLabel } from '../lib/helper.js';
import ShareProfileButton from './custom/ShareProfileButton.jsx';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link as RouterLink } from 'react-router-dom';
import IdentitySetting from './IdentitySetting/IdentitySetting.jsx';
import LinkedinIcon from './icons/LinkedinIcon.jsx';
import GitcoinIcon from './icons/GitcoinIcon.jsx';
import XTwitterLogo from './icons/XTwitter-logo.jsx';

const UserInfo = ({ role }) => {
  const navigate = useNavigate();
  const customer = useSelector(s => s.customer.customer);
  const auditor = useSelector(s => s.auditor.auditor);
  const { user } = useSelector(s => s.user);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchXxs = useMediaQuery(theme.breakpoints.down(590));

  const handleEdit = () => {
    navigate('/edit-profile');
  };

  const data = useMemo(() => {
    if (role === AUDITOR) {
      return auditor;
    } else {
      return customer;
    }
  }, [role, customer, auditor]);

  if (!data) {
    return <Loader role={role} />;
  } else {
    return (
      <Box sx={wrapper}>
        <Box sx={contentWrapper}>
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
                <Typography noWrap={true}>{data.contacts?.telegram}</Typography>
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
        </Box>
        {matchXs && <MobileTagsList data={data.tags} />}
        <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {user.linked_accounts?.map(account => {
            if (account.name.toLowerCase() === 'linkedin') {
              return (
                <Box
                  key={account.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <LinkedinIcon />
                </Box>
              );
            } else if (account.name.toLowerCase() === 'github') {
              return (
                <Box
                  key={account.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <GitHubIcon
                    sx={{ width: '50px', height: '50px', padding: '4px' }}
                  />
                </Box>
              );
            } else if (account.name.toLowerCase() === 'gitcoin') {
              return (
                <Box
                  key={account.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <GitcoinIcon />
                </Box>
              );
            } else {
              return (
                <Box
                  key={account.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                >
                  <XTwitterLogo width={'38px'} height={'38px'} />
                </Box>
              );
            }
          })}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <ShareProfileButton
            role={role}
            userId={role === AUDITOR ? auditor.user_id : customer.user_id}
          />
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
          </Box>
        </Box>
      </Box>
    );
  }
};
//
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
  width: '100%',
  minHeight: '520px',
  display: 'flex',
  flexDirection: 'column',
  padding: '100px 100px 60px',
  gap: '30px',
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
  width: '214px',
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
