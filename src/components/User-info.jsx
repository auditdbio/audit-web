import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import theme from '../styles/themes.js';
import { useNavigate } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader.jsx';
import { AUDITOR } from '../redux/actions/types.js';
import TagsList from './tagsList';
import { API_URL, ASSET_URL } from '../services/urls.js';
import MobileTagsList from './MobileTagsList/index.jsx';
import { addTestsLabel } from '../lib/helper.js';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import ClipboardJS from 'clipboard';

const UserInfo = ({ role }) => {
  const navigate = useNavigate();
  const customer = useSelector(s => s.customer.customer);
  const auditor = useSelector(s => s.auditor.auditor);
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const buttonRef = useRef(null);
  const [tooltipText, setTooltipText] = useState(null);

  const handleEdit = () => {
    navigate('/edit-profile');
  };

  const handleShare = () => {
    const text =
      role === AUDITOR
        ? `${API_URL.slice(0, API_URL.length - 3)}user/${
            auditor.user_id
          }/auditor`
        : `${API_URL.slice(0, API_URL.length - 3)}user/${
            customer.user_id
          }/customer`;

    const clipboard = new ClipboardJS(buttonRef.current, {
      text: () => text,
    });

    clipboard.on('success', () => {
      setTooltipText('Copied');
      clipboard.destroy();
      setTimeout(() => {
        setTooltipText(null);
      }, 1500);
    });

    clipboard.on('error', () => {
      console.error('Failed to copy URL to clipboard.');
      clipboard.destroy();
    });

    clipboard.onClick(event);
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
            {!matchXs && <TagsList data={data.tags} fullView={true} />}
          </Box>
        </Box>
        {matchXs && <MobileTagsList data={data.tags} />}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Button
            sx={shareBtn}
            color={role === AUDITOR ? 'secondary' : 'primary'}
            onClick={handleShare}
            ref={buttonRef}
          >
            {!tooltipText ? (
              <>
                <LaunchRoundedIcon size={'small'} sx={{ marginRight: '5px' }} />{' '}
                Share my profile
              </>
            ) : (
              tooltipText
            )}
          </Button>
          <Button
            sx={[buttonSx, role === 'auditor' ? submitAuditor : {}]}
            variant={'contained'}
            onClick={handleEdit}
            {...addTestsLabel('user_edit-button')}
          >
            Edit
          </Button>
        </Box>
      </Box>
    );
  }
};

export default UserInfo;

const shareBtn = theme => ({
  textTransform: 'capitalize',
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
  padding: '9px 50px',
  width: '214px',
  borderRadius: '10px',
  [theme.breakpoints.down('xs')]: {
    width: '88px',
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
    width: '90px',
    marginRight: '30px',
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
