import {
  Box,
  Card,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import theme from '../styles/themes.js';
import { CustomButton } from './custom/Button.jsx';
import { useNavigate } from 'react-router-dom/dist';
import { useDispatch } from 'react-redux';
import { confirmAudit, makeAuditPublic } from '../redux/actions/auditAction.js';
import {
  CUSTOMER,
  DONE,
  IN_PROGRESS,
  RESOLVED,
  SUBMITED,
  WAITING_FOR_AUDITS,
} from '../redux/actions/types.js';
import dayjs from 'dayjs';
import { addTestsLabel } from '../lib/helper.js';
import { handleViewReport } from '../lib/viewReport.js';

const AuditCard = ({ audit, request, isOwner, isPrivate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePublish = e => {
    const value = { ...audit, isPublic: e.target.checked };
    dispatch(makeAuditPublic(value));
  };

  return (
    <Card sx={cardWrapper} className={'audit-wrapper'}>
      <Tooltip title={audit.project_name} arrow placement={'top'}>
        <Typography sx={auditNameStyle} className={'name-style'}>
          {audit.project_name}
        </Typography>
      </Tooltip>
      <Box sx={{ display: 'grid' }}>
        <Tooltip
          title={
            audit?.auditor_contacts.email !== null
              ? audit?.auditor_contacts?.email
              : 'Hidden'
          }
          arrow
          placement={'top'}
        >
          <Typography sx={nameTextStyle} noWrap={true}>
            {audit?.auditor_contacts.email !== null
              ? audit?.auditor_contacts?.email
              : 'Hidden'}
          </Typography>
        </Tooltip>
      </Box>
      <Typography sx={priceTextStyle}>${audit?.price} per line</Typography>
      <Box sx={dateWrapper}>
        <Typography sx={dateStyle} className={'date-style'}>
          {dayjs(audit?.time?.from).format('DD.MM.YYYY')}
        </Typography>
        <Typography variant={'caption'}>-</Typography>
        <Typography sx={dateStyle} className={'date-style'}>
          {dayjs(audit?.time?.to).format('DD.MM.YYYY')}
        </Typography>
      </Box>

      {!request ? (
        <Box sx={statusWrapper}>
          {audit.status !== SUBMITED && (
            <>
              {audit.status.toLowerCase() === RESOLVED.toLowerCase() ? (
                <Box sx={{ backgroundColor: '#52176D' }} />
              ) : (
                audit.status.toLowerCase() ===
                  WAITING_FOR_AUDITS.toLowerCase() && (
                  <Box sx={{ backgroundColor: '#FF9900' }} />
                )
              )}
              {audit.status.toLowerCase() !== RESOLVED.toLowerCase() &&
                audit.status.toLowerCase() !==
                  WAITING_FOR_AUDITS.toLowerCase() && (
                  <Box sx={{ backgroundColor: '#09C010' }} />
                )}
            </>
          )}
          <Typography>{audit.status}</Typography>
        </Box>
      ) : (
        <Box sx={statusWrapper}>
          <Box sx={{ backgroundColor: '#FF9900' }} />
          <Typography>Request</Typography>
        </Box>
      )}
      {!audit.status && (
        <CustomButton
          variant={'contained'}
          sx={[
            acceptButtonStyle,
            audit?.last_changer?.toLowerCase() === CUSTOMER
              ? { backgroundColor: '#d7d7d7' }
              : {},
          ]}
          disabled={audit?.last_changer?.toLowerCase() === CUSTOMER}
          onClick={() => dispatch(confirmAudit(audit))}
          {...addTestsLabel('audits_accept-button')}
        >
          Accept
        </CustomButton>
      )}
      {isOwner && audit?.status?.toLowerCase() === RESOLVED.toLowerCase() && (
        <FormControlLabel
          sx={switchStyle}
          control={
            <Switch
              checked={audit?.isPublic}
              onChange={handlePublish}
              name="public"
              size={'small'}
            />
          }
          label="Make it public"
        />
      )}
      {isOwner || isPrivate ? (
        <CustomButton
          sx={viewButtonStyle}
          variant={'contained'}
          onClick={() => handleViewReport(audit)}
          {...addTestsLabel('audits_view-button')}
        >
          View report
        </CustomButton>
      ) : (
        <CustomButton
          sx={viewButtonStyle}
          variant={'contained'}
          onClick={() =>
            request
              ? navigate(`/audit-request/${audit.id}/customer`)
              : navigate(`/audit-info/${audit.id}/customer`)
          }
          {...addTestsLabel('audits_view-button')}
        >
          View
        </CustomButton>
      )}
    </Card>
  );
};

const btnWrapper = () => ({
  display: 'flex',
  gap: '12px',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    gap: '12px',
  },
});

const switchStyle = theme => ({
  '.MuiTypography-root': {
    fontSize: '12px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('xs')]: {
    marginRight: 0,
    marginLeft: '-6px',
    '.MuiTypography-root': {
      fontSize: '10px',
    },
  },
});

const cardWrapper = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#FFFFFF',
  padding: '24px 18px 24px',
  borderRadius: '1.5rem',
  gap: '15px',
  boxShadow:
    '0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07),' +
    ' 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275),' +
    '0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), ' +
    '0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), ' +
    '0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)',
  [theme.breakpoints.down('sm')]: {
    padding: '4vw 5vw',
    gap: '10px',
  },
  [theme.breakpoints.down(560)]: {
    padding: '10px',
  },
};

const acceptButtonStyle = {
  fontSize: '15px!important',
  backgroundColor: '#52176D',
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
    fontSize: '11px!important',
  },
};

const viewButtonStyle = {
  fontSize: '15px!important',
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
    fontSize: '11px!important',
  },
};

const statusWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  width: '100%',
  '& p': {
    fontSize: '10px',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      fontSize: '8px',
    },
  },
  '& div': {
    width: '17px',
    height: '17px',
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '10px',
      height: '10px',
    },
  },
  margin: '0',
});

const nameTextStyle = {
  color: '#152BEA',
  fontWeight: '500',
  fontSize: '14px!important',
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px!important',
  },
};

const priceTextStyle = {
  fontWeight: '500',
  fontSize: '14px!important',
  [theme.breakpoints.down('sm')]: {
    fontSize: '11.5px!important',
  },
};

const auditNameStyle = {
  height: '55px',
  overflow: 'hidden',
  wordBreak: 'break-word',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  display: '-webkit-box',
  fontWeight: '500',
  fontSize: '18px!important',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px!important',
    height: '45px',
  },
};

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
  [theme.breakpoints.down(480)]: {
    gap: '3px',
  },
};

const dateStyle = {
  fontSize: '11px!important',
  fontWeight: 500,
  color: '#434242',
  border: '1.8px #E5E5E5 solid',
  padding: '1rem',
  width: '100%',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '9px!important',
    padding: '10px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '8px',
    fontSize: '7px!important',
  },
  [theme.breakpoints.down(450)]: {
    padding: '5px',
  },
};
export default AuditCard;
