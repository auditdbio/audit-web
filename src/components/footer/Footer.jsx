import { Box, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MenuItem from '@mui/material/MenuItem';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom/dist';
import Tiktok from '../icons/Tiktok.jsx';
import Vk from '../icons/Vk.jsx';
import Instagram from '../icons/Instagram.jsx';
import Discord from '../icons/Discord.jsx';
import Telegram from '../icons/Telegram.jsx';
import MediumLogo from '../icons/Medium-logo.jsx';

const Footer = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box sx={footerContainerStyles} component="footer">
      <Box sx={mainFooterStyles(isMobile)}>
        <Box sx={footerStyle(isMobile)}>
          <Box sx={logoIconsStyle(isMobile)}>
            <Box sx={{ display: 'flex' }}>
              <Typography style={auditStyles(isMobile)}>Audit</Typography>
              <Typography style={dbStyles(isMobile)}>DB</Typography>
            </Box>
            <Box sx={iconsStyle}>
              <a
                target="_blank"
                href="https://twitter.com/auditdbio?t=oOdybhqGYlv129TyT8y-2g&s=09"
                aria-label="Twitter"
              >
                <TwitterIcon sx={iconStyle} />
              </a>
              <a
                target="_blank"
                href="https://discord.gg/2Wg6GGs93C"
                aria-label="Discord"
              >
                <Discord style={iconStyle} />
              </a>
              <a
                target="_blank"
                href="https://t.me/+B6deDZFIg3k4Y2Zi"
                aria-label="Telegram"
              >
                <Telegram style={iconStyle} />
              </a>
              <a
                target="_blank"
                href="https://medium.com/auditdb"
                aria-label="Medium"
              >
                <MediumLogo style={iconStyle} />
              </a>
            </Box>
          </Box>
          <Box sx={menuItems} component="ul" role="menu">
            {pages.map(page => (
              <MenuItem
                sx={menuItemWrap(isMobile)}
                disableGutters
                disableRipple
                key={page.id}
              >
                {/*<Box sx={menuItem(isMobile)}>*/}
                <Link to={page.path}>{page.name}</Link>
                {/*</Box>*/}
              </MenuItem>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const footerContainerStyles = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  backgroundColor: '#FF9900',
  paddingBottom: '35px',
  marginBottom: 0,
  marginTop: 'auto',
};

const mainFooterStyles = isMobile => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  maxWidth: '1512px',
  width: '100%',
  padding: isMobile ? '35px 30px 28px 30px' : '24px 45px 8px 45px',
  gap: '30px',
});

const footerStyle = isMobile => ({
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'none',
  gap: isMobile ? '30px' : '0',
  alignItems: isMobile ? 'flex-start' : 'center',
  justifyContent: 'space-between',
});

const logoIconsStyle = isMobile => ({
  display: 'flex',
  flexDirection: 'column',
  gap: isMobile ? '30px' : '22px',
  alignSelf: 'flex-start',
});

const auditStyles = isMobile => ({
  fontSize: isMobile ? '30px' : '40px',
  color: '#52176D',
  fontWeight: '800',
});

const dbStyles = isMobile => ({
  fontSize: isMobile ? '30px' : '40px',
  color: '#FCFAF6',
  fontWeight: '800',
});

const iconsStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '25px',
};

const iconStyle = {
  color: '#52176D',
  height: '25px',
  width: '30px',
};

const menuItems = theme => ({
  display: 'flex',
  gap: '65px',
  [theme.breakpoints.down('lg')]: {
    gap: '30px',
  },
  [theme.breakpoints.down('md')]: {
    gap: '10px',
    '& li': {
      margin: 0,
      '& a': {
        fontSize: '18px',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& li': {
      '& a': {
        fontSize: '15px',
      },
    },
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
  },
});

const menuItem = isMobile => ({
  // fontSize: isMobile ? '18px' : '26px',
  '& a': {
    color: '#fff',
  },
});

const menuItemWrap = isMobile => ({
  backgroundColor: 'transparent',
  textAlign: 'left',
  padding: '5px 10px',
  color: '#FCFAF6',
  fontFamily: 'Montserrat',
  minHeight: 'unset',
  fontWeight: '400',
  lineHeight: '100%',
  '& a': {
    color: '#fff',
  },
  '&:hover': {
    backgroundColor: 'unset',
  },
});

const rightsStyles = isMobile => ({
  fontSize: isMobile ? '9px' : '18px',
  fontWeight: '400',
  textAlign: 'center',
});

const pages = [
  {
    id: 1,
    name: 'For customers',
    path: '/for-customers',
  },
  {
    id: 2,
    name: 'For auditors',
    path: '/for-auditors',
  },
  // {
  // 	id: 3,
  // 	name: "Product",
  // },
  {
    id: 3,
    name: 'AuditDB',
    path: '/audit-db',
  },
  {
    id: 5,
    name: 'Contact us',
    path: '/contact-us',
  },
  // {
  // 	id: 6,
  // 	name: "About Us",
  // },
];

export default Footer;
