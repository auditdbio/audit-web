import React from 'react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import Currency from './icons/Currency.jsx';
import Star from './icons/Star.jsx';
import theme, { radiusOfComponents } from '../styles/themes.js';
import { useNavigate } from 'react-router-dom/dist';
import { useDispatch } from 'react-redux';
import { deleteAuditRequest } from '../redux/actions/auditAction.js';
import dayjs from 'dayjs';
import { addTestsLabel } from '../lib/helper.js';

const AuditRequestCard = ({ type, request }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Box sx={cardWrapper}>
      <Box sx={cardInnerWrapper}>
        <Tooltip title={request.project_name} arrow placement={'top'}>
          <Typography variant={'h5'} sx={projectNameSx} textAlign={'center'}>
            {request.project_name}
          </Typography>
        </Tooltip>
        {/*<Typography sx={categorySx}>{(request || audit)?.tags?.map(el => el).join(', ') ?? ''}</Typography>*/}
        <Box sx={dateWrapper}>
          <Typography sx={dateStyle}>
            {dayjs((request || audit)?.time?.from).format('DD.MM.YYYY')}
          </Typography>
          <Typography variant={'caption'}>-</Typography>
          <Typography sx={dateStyle}>
            {dayjs((request || audit)?.time?.to).format('DD.MM.YYYY')}
          </Typography>
        </Box>
        <Box sx={priceWrapper}>
          <Box sx={infoWrapper}>
            <Currency />
            <Typography>{request.price}</Typography>
          </Box>
          <Box sx={infoWrapper}>
            <Star />
            <Typography>150</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={buttonWrapper}>
        <Button
          variant={'contained'}
          sx={[actionButton, type === 'auditor' ? editAuditor : {}]}
          onClick={() => navigate(`/audit-request/${request.id}`)}
          {...addTestsLabel('audit-req_view-button')}
        >
          View
        </Button>
        <Button
          sx={[actionButton, copyBtn]}
          onClick={() => dispatch(deleteAuditRequest(request.id))}
          variant={'contained'}
          {...addTestsLabel('audit-req_decline-button')}
        >
          Decline
        </Button>
      </Box>
    </Box>
  );
};

export default AuditRequestCard;

const cardInnerWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  gap: '15px',
  [theme.breakpoints.down('xs')]: {
    alignItems: 'unset',
    gap: '10px',
  },
});

const buttonWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: '7px',
  mt: '24px',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    width: 'unset',
    justifyContent: 'unset',
    mt: 0,
  },
});

const projectNameSx = theme => ({
  display: '-webkit-box',
  height: '66px',
  overflow: 'hidden',
  wordBreak: 'break-word',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  [theme.breakpoints.down('xs')]: {
    height: '45px',
    textAlign: 'unset',
  },
});

const priceWrapper = theme => ({
  display: 'flex',
  gap: '30px',
  mt: '18px',
  [theme.breakpoints.down('md')]: {
    gap: '18px',
  },
  [theme.breakpoints.down('xs')]: {
    mt: '5px',
    marginLeft: '35px',
  },
  [theme.breakpoints.down(450)]: {
    marginLeft: '28px',
  },
});

const copyBtn = theme => ({
  backgroundColor: theme.palette.secondary.main,
});

const actionButton = theme => ({
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: '25px',
  width: '100px',
  textTransform: 'none',
  borderRadius: '10px',
  gap: '40px',
  padding: '9px 0',
  maxWidth: '170px',
  [theme.breakpoints.down('md')]: {
    height: '30px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '11px',
  },
});

const editAuditor = theme => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: '#450e5d',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& p': {
    fontSize: '12px!important',
    marginLeft: '8px',
  },
  [theme.breakpoints.down('xs')]: {
    '& p': {
      fontSize: '10px!important',
    },
    '& svg': {
      width: '10px',
      height: '10px',
    },
  },
});

const dateWrapper = {
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5rem',
  alignItems: 'center',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    gap: '5px',
    '& span': {
      fontSize: '8px',
    },
  },
};

const dateStyle = {
  fontSize: '11px!important',
  fontWeight: 500,
  color: '#434242',
  border: '1.8px #E5E5E5 solid',
  padding: '12px',
  width: '100%',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: '9px!important',
    padding: '10px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '8px',
    width: '70px',
    fontSize: '8px!important',
  },
  [theme.breakpoints.down(450)]: {
    padding: '5px',
  },
};

const cardWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '30px 14px',
  boxShadow:
    '0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07),' +
    ' 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275),' +
    '0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), ' +
    '0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), ' +
    '0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)',
  borderRadius: '25px',
  border: '1px solid rgba(67, 66, 66, 0.1)',
  alignItems: 'center',
  gap: '15px',
  '& h5': {
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: '22px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '33px 22px 24px',
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '25px',
    padding: '15px 20px',
    '& h5': {
      fontSize: '14px',
      fontWeight: 500,
    },
  },
  [theme.breakpoints.down(450)]: {
    gap: '10px',
    padding: '10px 15px',
  },
});
