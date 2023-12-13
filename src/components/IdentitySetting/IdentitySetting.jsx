import React, { useState } from 'react';
import { Box, Button, Checkbox, ClickAwayListener, Modal } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';

const IdentitySetting = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={modalSx}>
            <Box sx={{ height: '100%', padding: '30px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  >
                    <GitHubIcon />
                    <RouterLink
                      href={'https://github.com/auditdbio/audit-web/tree/prod'}
                    >
                      https://github.com/auditdbio/audit-web/tree/prod
                    </RouterLink>
                  </Box>
                  <Checkbox defaultChecked />
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  >
                    <GitHubIcon />
                    <RouterLink
                      href={'https://github.com/auditdbio/audit-web/tree/prod'}
                    >
                      https://github.com/auditdbio/audit-web/tree/prod
                    </RouterLink>
                  </Box>
                  <Checkbox defaultChecked />
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}
                  >
                    <GitHubIcon />
                    <RouterLink
                      href={'https://github.com/auditdbio/audit-web/tree/prod'}
                    >
                      https://github.com/auditdbio/audit-web/tree/prod
                    </RouterLink>
                  </Box>
                  <Checkbox defaultChecked />
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
            <AddModal />
          </Box>
        </Modal>
      </Box>
      <Button sx={buttonSx} variant={'contained'} onClick={() => setOpen(true)}>
        Connect identity
      </Button>
    </>
  );
};

const AddModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen} variant={'contained'} sx={buttonSx}>
        Add account
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...modalSx, width: 200 }}>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </>
  );
};

export default IdentitySetting;

const modalSx = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
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
    width: '88px',
    padding: '9px 10px',
  },
});
