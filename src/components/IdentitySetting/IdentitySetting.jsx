import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  Modal,
  Tooltip,
  Typography,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LinkedinIcon from '../icons/LinkedinIcon.jsx';
import XTwitterLogo from '../icons/XTwitter-logo.jsx';
import {
  GITHUB_CLIENT_ID,
  LINKEDIN_CLIENT_ID,
  TWITTER_CLIENT_ID,
  BASE_URL,
} from '../../services/urls.js';
import {
  changeAccountVisibility,
  handleDeleteLinkedAccount,
} from '../../redux/actions/userAction.js';
import { encodeBase64url } from '../../lib/helper.js';
import WalletConnect from './WalletConnect.jsx';

const IdentitySetting = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const { user } = useSelector(s => s.user);
  const role = useSelector(state => state.user.user.current_role);
  const linkedAccounts = useSelector(state => state.user.user.linked_accounts);

  const handleConnectGithub = () => {
    if (!linkedAccounts?.find(el => el.name.toLowerCase() === 'github')) {
      const state = encodeBase64url(
        JSON.stringify({
          service: 'GitHub',
          role,
        }),
      );
      window.open(
        `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${BASE_URL}oauth/callback&scope=read:user,user:email&state=${state}`,
        '_self',
      );
    }
  };

  const handleConnectLinkedin = () => {
    if (!linkedAccounts?.find(el => el.name.toLowerCase() === 'linkedin')) {
      const state = encodeBase64url(
        JSON.stringify({
          service: 'LinkedIn',
          role,
        }),
      );
      window.open(
        `https://linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${BASE_URL}oauth/callback&scope=profile%20email%20openid&state=${state}`,
        '_self',
      );
    }
  };

  const handleConnectTwitter = () => {
    if (!linkedAccounts?.find(el => el.name.toLowerCase() === 'x')) {
      const state = encodeBase64url(
        JSON.stringify({
          service: 'X',
          role,
        }),
      );
      window.open(
        `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${BASE_URL}oauth/callback&scope=tweet.read%20users.read%20follows.read%20offline.access&code_challenge=challenge&code_challenge_method=plain&state=${state}`,
        '_self',
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (e, data) => {
    const value = {
      is_public: e.target.checked,
    };
    dispatch(changeAccountVisibility(user.id, value, data.id));
  };

  const handleDelete = id => {
    dispatch(handleDeleteLinkedAccount(user.id, id));
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
                sx={[
                  cardSx,
                  linkedAccounts?.find(el => el.name.toLowerCase() === 'github')
                    ? { border: '1px solid green' }
                    : {},
                ]}
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
                {linkedAccounts
                  ?.filter(el => el.name.toLowerCase() === 'github')
                  ?.map(el => (
                    <>
                      <Tooltip
                        key={el.id}
                        arrow
                        placement="top"
                        title="Show in profile"
                      >
                        <Checkbox
                          key={el.id}
                          checked={el.is_public}
                          onChange={e => handleCheckboxChange(e, el)}
                          icon={<VisibilityOffIcon />}
                          checkedIcon={<RemoveRedEyeIcon />}
                        />
                      </Tooltip>
                      <Button
                        onClick={() => handleDelete(el.id)}
                        sx={{ minWidth: '30px' }}
                      >
                        <DeleteForeverIcon color={'error'} />
                      </Button>
                    </>
                  ))}
              </Box>
              <Box
                sx={[
                  cardSx,
                  linkedAccounts?.find(
                    el => el.name.toLowerCase() === 'linkedin',
                  )
                    ? { border: '1px solid green' }
                    : {},
                ]}
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
                {linkedAccounts
                  ?.filter(el => el.name.toLowerCase() === 'linkedin')
                  ?.map(el => (
                    <>
                      <Tooltip
                        key={el.id}
                        arrow
                        placement="top"
                        title="Show in profile"
                      >
                        <Checkbox
                          key={el.id}
                          checked={el.is_public}
                          onChange={e => handleCheckboxChange(e, el)}
                          icon={<VisibilityOffIcon />}
                          checkedIcon={<RemoveRedEyeIcon />}
                        />
                      </Tooltip>
                      <Button
                        onClick={() => handleDelete(el.id)}
                        sx={{ minWidth: '30px' }}
                      >
                        <DeleteForeverIcon color={'error'} />
                      </Button>
                    </>
                  ))}
              </Box>
              <Box
                sx={[
                  cardSx,
                  linkedAccounts?.find(el => el.name.toLowerCase() === 'x')
                    ? { border: '1px solid green' }
                    : {},
                ]}
              >
                <Box
                  onClick={handleConnectTwitter}
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
                {linkedAccounts
                  ?.filter(el => el.name.toLowerCase() === 'x')
                  ?.map(el => (
                    <>
                      <Tooltip
                        key={el.id}
                        arrow
                        placement="top"
                        title="Show in profile"
                      >
                        <Checkbox
                          key={el.id}
                          checked={el.is_public}
                          onChange={e => handleCheckboxChange(e, el)}
                          icon={<VisibilityOffIcon />}
                          checkedIcon={<RemoveRedEyeIcon />}
                        />
                      </Tooltip>
                      <Button
                        onClick={() => handleDelete(el.id)}
                        sx={{ minWidth: '30px' }}
                      >
                        <DeleteForeverIcon color={'error'} />
                      </Button>
                    </>
                  ))}
              </Box>

              <WalletConnect sx={cardSx} linkedAccounts={linkedAccounts} />

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
  cursor: 'pointer',
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
    overflow: 'auto',
    padding: '15px',
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
