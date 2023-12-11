import { Box, Card, Typography } from '@mui/material';
import AuditLogo from '../../icons/Company-logo.jsx';

const FeedbackCard = ({ info }) => {
  return (
    <Card sx={cardWrapper}>
      <Typography sx={descriptionStyle}>{info.description}</Typography>
      <Box sx={detailsWrapper}>
        <Box sx={detailsInnerWrapper}>
          <Typography sx={interestsStyle}>{info.name}</Typography>
          <Typography sx={interestsStyle}>{info.interests}</Typography>
        </Box>
        <AuditLogo width={'100px'} />
      </Box>
    </Card>
  );
};

const cardWrapper = theme => ({
  minHeight: '420px',
  width: '100%',
  maxWidth: '350px',
  borderRadius: '27px',
  background: '#FFFFFF',
  border: '1px solid rgba(67, 66, 66, 0.1)',
  zIndex: 1,
  boxShadow:
    '0px 14.326px 17.1057px rgba(0, 0, 0, 0.0517275),' +
    '0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), ' +
    '0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), ' +
    '0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)',
  marginBottom: '40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '40px',
  gap: '3rem',
  [theme.breakpoints.down('xs')]: {
    minHeight: '380px',
    gap: '2rem',
  },
});

const descriptionStyle = theme => ({
  fontSize: '20px',
  fontWeight: 500,
  textAlign: 'center',
  marginY: 'auto',
  color: '#222222',
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
});

const detailsWrapper = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const detailsInnerWrapper = {
  maxWidth: '190px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '20px',
};

const avatarStyle = {
  width: '100px',
  height: '100px',
  wordWrap: 'break-word',
};

const interestsStyle = {
  fontSize: '22px',
  fontWeight: 500,
  color: '#434242',
  wordWrap: 'break-word',
};
export default FeedbackCard;
