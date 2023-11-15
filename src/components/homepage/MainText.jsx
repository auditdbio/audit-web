import { Box } from '@mui/system';
import theme from '../../styles/themes';
import { Typography } from '@mui/material';
import { CustomButton } from '../custom/Button';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { addTestsLabel, isAuth } from '../../lib/helper.js';
import { useDispatch, useSelector } from 'react-redux';
import { changeRole } from '../../redux/actions/userAction.js';
import { Link as MuiLink } from '@mui/material';

const MainText = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

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
    <Box
      sx={{ width: '100%', paddingBottom: '5rem', maxWidth: '1512px' }}
      component="section"
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '2rem',
        }}
      >
        {!isMobile && (
          <Box sx={imageStyle(isMobile)}>
            <div style={personSkateStyle}></div>
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
            <CustomButton sx={[auditorButton, gitCoinSx]}>
              <MuiLink
                target="_blank"
                sx={{ color: '#fff', textDecoration: 'none' }}
                href="https://explorer.gitcoin.co/#/round/424/0x98720dd1925d34a2453ebc1f91c9d48e7e89ec29/0x98720dd1925d34a2453ebc1f91c9d48e7e89ec29-91"
              >
                Support us on gitcoin
              </MuiLink>
            </CustomButton>
          </Box>
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
        </Box>
        {!isMobile && (
          <Box sx={imageStyle(isMobile)}>
            <div style={personBitcoinStyle}></div>
          </Box>
        )}
      </Box>
      {isMobile && (
        <Box sx={imagesStyle}>
          <div style={personSkateStyle}></div>
          <div style={personBitcoinStyle}></div>
        </Box>
      )}
    </Box>
  );
};

const headingStyle = {
  textTransform: 'uppercase',
  fontWeight: 600,
  color: '#52176D',
  lineHeight: '73px',
  textAlign: 'center',
  maxWidth: '720px',
  marginX: 'auto',
  paddingX: '2rem',
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    // maxWidth: "600px",
  },
  [theme.breakpoints.down('sm')]: {
    lineHeight: '40px',
  },
};
const paragraphStyle = {
  marginX: 'auto',
  fontWeight: 500,
  lineHeight: '37px',
  textAlign: 'center',
  maxWidth: '690px',
  paddingX: '2rem',
  width: '100%',
  [theme.breakpoints.down('lg')]: {
    // maxWidth: "500px",
  },
  [theme.breakpoints.down('sm')]: {
    lineHeight: '25px',
  },
};

const headingText = 'Start your project right now or audit like expert';
const paragraphText =
  "Welcome to AuditDB! Here, smart contract gurus team up with innovative builders. Whether you're crafting cutting-edge dApps or ensuring they're bug-free, this is your hub. Let's elevate the ledger together!";
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
  marginY: 'auto',
  gap: '3rem',
};

const imageStyle = isMobile => ({
  display: isMobile ? 'none' : 'inline',
  minWidth: '25%',
});

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

const gitCoinSx = theme => ({
  backgroundColor: '#44944A',
  color: 'white!important',
});

export default MainText;
