import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  Modal,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '../icons/FacebookIcon.jsx';
import MediumLogo from '../icons/Medium-logo.jsx';
import GitcoinIcon from '../icons/GitcoinIcon.jsx';
import LinkedinIcon from '../icons/LinkedinIcon.jsx';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import XTwitterLogo from '../icons/XTwitter-logo.jsx';

const IdentitySetting = () => {
  const [open, setOpen] = useState(false);

  const handleConnectGithub = () => {
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&redirect_uri=${BASE_URL}github/auditor&scope=read:user,user:email`,
      '_self',
    );
  };

  const handleConnectLinkedin = () => {
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&redirect_uri=${BASE_URL}github/auditor&scope=read:user,user:email`,
      '_self',
    );
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={modalSx}>
          <Box sx={{ height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                height: '100%',
              }}
            >
              <Box
                sx={[cardSx, { border: '1px solid green' }]}
                onClick={handleConnectGithub}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    width: '100%',
                  }}
                >
                  <GitHubIcon
                    sx={{ width: '50px', height: '50px', padding: '4px' }}
                  />
                  <Typography>Github</Typography>
                </Box>
                <Tooltip placement={'top'} arrow title={'Show in profile'}>
                  <Checkbox
                    defaultChecked
                    icon={<VisibilityOffIcon />}
                    checkedIcon={<RemoveRedEyeIcon />}
                  />
                </Tooltip>
              </Box>
              <Box
                sx={[cardSx, { border: '1px solid green' }]}
                onClick={handleConnectLinkedin}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    width: '100%',
                  }}
                >
                  <LinkedinIcon />
                  <Typography>Linkedin</Typography>
                </Box>
                <Tooltip arrow placement={'top'} title={'Show in profile'}>
                  <Checkbox
                    icon={<VisibilityOffIcon />}
                    checkedIcon={<RemoveRedEyeIcon />}
                  />
                </Tooltip>
              </Box>
              <Box sx={cardSx}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    width: '100%',
                  }}
                >
                  <FacebookIcon />
                  <Typography>Facebook</Typography>
                </Box>
                {/*<Checkbox*/}
                {/*  icon={<VisibilityOffIcon />}*/}
                {/*  checkedIcon={<RemoveRedEyeIcon />}*/}
                {/*/>*/}
              </Box>
              <Box sx={[cardSx]}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    width: '100%',
                    '& svg': {
                      padding: '4px',
                    },
                  }}
                >
                  <XTwitterLogo width={'50px'} height={'50px'} space />
                  <Typography>Twitter</Typography>
                </Box>
              </Box>
              <Box sx={cardSx}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    width: '100%',
                    '& svg': {
                      padding: '4px',
                    },
                  }}
                >
                  <GitcoinIcon />
                  <Typography>Gitcoin</Typography>
                </Box>
              </Box>
              <Box>
                <Button
                  sx={[
                    buttonSx,
                    { width: '100%', paddingY: '10px', marginTop: '15px' },
                  ]}
                  variant={'contained'}
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: 'auto',
                marginBottom: '0',
                display: 'flex',
                justifyContent: 'center',
              }}
            ></Box>
          </Box>
        </Box>
      </Modal>
      <Button sx={buttonSx} variant={'contained'} onClick={() => setOpen(true)}>
        Connect identity
      </Button>
    </>
  );
};

export default IdentitySetting;

const cardSx = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  gap: '10px',
  borderRadius: '10px',
  border: '1px solid transparent',
  '& p': {
    fontWeight: 600,
  },
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '10px 10px',
  },
});

const modalSx = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  pt: '24px',
  px: '32px',
  pb: '24px',
  [theme.breakpoints.down('xs')]: {
    width: '80%',
    height: '497px',
    overflow: 'auto',
    padding: '10px 15px',
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
