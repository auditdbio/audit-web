import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom/dist';
import { Box } from '@mui/system';
import { Typography, useMediaQuery, Link as MuiLink } from '@mui/material';
import theme from '../../styles/themes';
import { CustomButton } from '../custom/Button';
import { addTestsLabel, isAuth } from '../../lib/helper.js';
import { changeRole } from '../../redux/actions/userAction.js';

const MainText = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const report = JSON.parse(localStorage.getItem('report') || '{}');
  const auditId = report.auditId ? report.auditId : Date.now();

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  const handleBecomeAuditor = () => {
    if (user.current_role) {
      dispatch(changeRole('auditor', user.id));
    } else {
      navigate('/sign-up');
    }
  };

  const handleShowProject = () => {
    if (user.current_role) {
      dispatch(changeRole('customer', user.id));
    } else {
      navigate('/sign-up');
    }
  };

  return (
    <Box sx={wrapper} component="section">
      <Box sx={innerWrapper}>
        {!isMobile && (
          <Box sx={imageStyle(isMobile)}>
            <div style={personSkateStyle} />
          </Box>
        )}

        <Box sx={textWrapper}>
          <Typography sx={headingStyle} theme={theme} variant="h1">
            {headingText}
          </Typography>
          <Typography sx={paragraphStyle} theme={theme} variant="body1">
            {paragraphText}
          </Typography>
          <Box sx={buttonsStyle(isMobile)}>
            <CustomButton
              sx={auditorButton}
              onClick={isAuth() ? handleBecomeAuditor : handleSignUp}
              {...addTestsLabel('hero_become-auditor-button')}
            >
              Become auditor
            </CustomButton>
            <CustomButton
              sx={projectButton}
              onClick={isAuth() ? handleShowProject : handleSignUp}
              {...addTestsLabel('hero_show-project-button')}
            >
              Show your project
            </CustomButton>
          </Box>
          <Box sx={buttonsStyle(isMobile)}>
            <CustomButton
              sx={[gitCoinSx, { color: '#fff' }]}
              onClick={() => navigate(`/audit-builder/${auditId}`)}
            >
              Try audit builder
            </CustomButton>
          </Box>
        </Box>
        {!isMobile && (
          <Box sx={imageStyle(isMobile)}>
            <div style={personBitcoinStyle} />
          </Box>
        )}
      </Box>
      {isMobile && (
        <Box sx={imagesStyle}>
          <div style={personSkateStyle} />
          <div style={personBitcoinStyle} />
        </Box>
      )}
    </Box>
  );
};

const wrapper = {
  width: '100%',
  // height: '100vh',
  // minHeight: '880px',
  paddingBottom: '5rem',
  maxWidth: '1512px',
};

const innerWrapper = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2rem',
};

const headingStyle = {
  textTransform: 'uppercase',
  fontWeight: 600,
  color: '#52176D',
  lineHeight: '50px',
  textAlign: 'center',
  maxWidth: '720px',
  marginX: 'auto',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    lineHeight: '40px',
  },
};
const paragraphStyle = {
  marginX: 'auto',
  fontWeight: 500,
  lineHeight: '30px',
  textAlign: 'center',
  maxWidth: '690px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    lineHeight: '25px',
  },
};

const auditorButton = {
  backgroundColor: '#52176D',
  color: 'white',
  ':hover': {
    backgroundColor: '#52176D',
    color: 'white',
  },
};

const projectButton = {
  backgroundColor: 'orange',
  color: 'white',
  ':hover': {
    backgroundColor: 'orange',
    color: 'white',
  },
};

const textWrapper = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexGrow: 1,
  paddingX: '2rem',
  marginY: 'auto',
  gap: '3rem',
};

const imageStyle = isMobile => ({
  display: isMobile ? 'none' : 'inline',
  minWidth: '25%',
});
//
const buttonsStyle = isMobile => ({
  flexGrow: 0,
  display: 'flex',
  width: '80%',
  flexDirection: isMobile ? 'column' : 'row',
  marginX: 'auto',
  minWidth: { xs: '300px', md: '100%' },
  justifyContent: 'center',
  gap: '2rem',
  [theme.breakpoints.down('xs')]: {
    width: '90%',
  },
});

const imagesStyle = {
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  height: '250px',
};

const personSkateStyle = {
  height: '100%',
  width: '100%',
  backgroundImage: 'url(/welcome_page/person_skate.svg)',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  margin: '0 auto',
};
const personBitcoinStyle = {
  height: '100%',
  width: '100%',
  backgroundImage: 'url(/welcome_page/person_bitcoin.svg)',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  margin: '0 auto',
};

const gitCoinSx = {
  backgroundColor: '#44944A',
  paddingX: 0,
  '&:hover': {
    backgroundColor: '#326e34!important',
  },
};

const headingText = 'Start your project right now or audit like expert';

const paragraphText =
  "Welcome to AuditDB! Here, smart contract gurus team up with innovative builders. Whether you're crafting cutting-edge dApps or ensuring they're bug-free, this is your hub. Let's elevate the ledger together!";

export default MainText;
