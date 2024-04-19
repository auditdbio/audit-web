import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';
import { useSelector } from 'react-redux';
import { Card, Avatar, Box, Typography, Tooltip } from '@mui/material';
import theme from '../../../styles/themes';
import { CustomButton } from '../../custom/Button';
import Currency from '../../icons/Currency';
import Star from '../../icons/Star';
import AuditorModal from '../../AuditorModal.jsx';
import { ASSET_URL } from '../../../services/urls.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../../../lib/helper.js';

const AuditorCard = ({ auditor }) => {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const userProjects = useSelector(s => s.project.myProjects);

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

  return (
    <Card sx={cardStyle}>
      <AuditorModal
        open={openModal}
        handleClose={handleCloseModal}
        auditor={auditor}
        handleError={handleError}
        setError={setErrorMessage}
        budge={auditor.kind === 'badge'}
      />
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

      <Avatar
        src={auditor.avatar && `${ASSET_URL}/${auditor.avatar}`}
        alt={`${auditor?.first_name} photo`}
        sx={avatarStyle}
      />
      <Box sx={{ display: 'grid' }}>
        <Tooltip
          title={`${auditor.first_name} ${auditor.last_name}`}
          arrow
          placement="top"
        >
          <Typography sx={mainTextStyle} noWrap={true}>
            {auditor.first_name} {auditor.last_name}
          </Typography>
        </Tooltip>
        <Typography sx={badgeFontStyle}>
          {auditor.tags
            .map(item => item.charAt(0).toUpperCase() + item.slice(1))
            .join(', ')}
        </Typography>
      </Box>
      <Box
        sx={{
          ...columnStyle,
          gap: '1rem',
          width: '100%',
        }}
      >
        <Box sx={badgesStyle}>
          {(auditor.price_range.from > 0 || auditor.price_range.to > 0) && (
            <Box sx={infoStyle}>
              <Currency />
              <Typography sx={priceSx}>
                {auditor.price_range.from} - {auditor.price_range.to}
              </Typography>
            </Box>
          )}
          <Box sx={infoStyle}>
            <Star />
            <Typography sx={priceSx}>150</Typography>
          </Box>
        </Box>
        <CustomButton
          sx={buttonStyle}
          variant={auditor.kind === 'badge' ? 'outlined' : 'contained'}
          onClick={handleView}
          {...addTestsLabel('auditor_more-info-button')}
        >
          More info
        </CustomButton>
      </Box>
    </Card>
  );
};

const buttonStyle = {
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
};

const cardStyle = theme => ({
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2rem',
  [theme.breakpoints.down('sm')]: {
    padding: '14px',
    gap: '1rem',
  },
});

const priceSx = theme => ({
  fontSize: '14px !important',
  [theme.breakpoints.down('md')]: {
    fontSize: '12px !important',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px !important',
  },
});

const avatarStyle = {
  width: '130px',
  height: '130px',
  marginX: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '90px',
    height: '90px',
  },
};

const columnStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const badgesStyle = theme => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  gap: '2rem',
  [theme.breakpoints.down('sm')]: {
    gap: '10px',
  },
});

const infoStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
};

const badgeFontStyle = theme => ({
  fontSize: '19px!important',
  textAlign: 'center',
  display: '-webkit-box',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  height: '86px',
  overflow: 'hidden',
  [theme.breakpoints.down('lg')]: {
    fontSize: '14px!important',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px!important',
  },
  [theme.breakpoints.down('sm')]: {
    height: '45px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '10px!important',
    height: '45px',
  },
});

const mainTextStyle = theme => ({
  fontWeight: 500,
  fontSize: '26px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
});
export default AuditorCard;
