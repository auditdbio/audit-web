import React from 'react';
import Box from '@mui/material/Box';
import { Button, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import theme from '../../styles/themes.js';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { readMessage } from '../../redux/actions/websocketAction.js';
import { useNavigate } from 'react-router-dom/dist';

const CustomMessage = ({ message }) => {
  const role = useSelector(s => s.user.user.current_role);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClose = id => {
    dispatch(readMessage(id));
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box
      sx={[
        messageWrapper,
        borderSx(
          role === CUSTOMER
            ? theme.palette.primary.main
            : theme.palette.secondary.main,
        ),
      ]}
    >
      <Typography sx={titleStyle} onClick={handleOpen}>
        {message.inner.message}
      </Typography>
      <Modal
        open={open}
        onClose={() => {
          handleClose(message.id);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle(role, theme)}>
          <Button
            onClick={() => {
              handleClose(message.id);
            }}
            sx={{ minWidth: '36px', position: 'absolute', right: 0, top: 0 }}
          >
            <CloseRoundedIcon
              color={role === AUDITOR ? 'secondary' : 'primary'}
            />
          </Button>
          {!message.inner.links.length ? (
            <Typography id="modal-modal-description">
              {message.inner.message}
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '15px',
              }}
            >
              <Typography id="modal-modal-description">
                {message.inner.message}
              </Typography>
              <Button
                onClick={() => {
                  navigate(message.inner.links[0]);
                  handleClose(message.id);
                }}
                color={role === AUDITOR ? 'secondary' : 'primary'}
                sx={{
                  padding: 0,
                  textTransform: 'unset',
                  alignSelf: 'flex-end',
                  marginBottom: '-15px',
                  marginRight: '-15px',
                }}
              >
                View more &#x2192;
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomMessage;

const titleStyle = theme => ({
  color: '#000',
  fontSize: '16px!important',
  textAlign: 'left',
  overflow: 'hidden',
  display: '-webkit-box',
  minHeight: '20px',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  textOverflow: 'ellipsis',
  [theme.breakpoints.down('lg')]: {
    fontSize: '14px!important',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px!important',
  },
});

const messageWrapper = theme => ({
  padding: '5px',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
  },
});

const borderSx = color => ({
  '&:not(:last-child)': {
    borderBottom: `1px solid ${color}`,
  },
});

const modalStyle = (role, theme) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  backgroundColor: '#fff',
  borderRadius: '5px',
  maxHeight: '80%',
  overflowY: 'auto',
  border: '2px solid #000',
  boxShadow: 24,
  borderColor:
    role === AUDITOR
      ? theme.palette.secondary?.main
      : theme.palette.primary.main,
  p: 4,
  [theme.breakpoints.down('sm')]: {
    width: 500,
  },
  [theme.breakpoints.down('xs')]: {
    width: 340,
  },
});
