import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { Button, Modal, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import theme from '../../styles/themes.js';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { readMessage } from '../../redux/actions/websocketAction.js';
import { useNavigate } from 'react-router-dom/dist';
import NotificationMessage from '../NotificationMessage.jsx';

const CustomMessage = ({ message }) => {
  const role = useSelector(s => s.user.user.current_role);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const messageRef = useRef(null);
  const [renderMessage, setRenderMessage] = React.useState('');

  const handleClose = id => {
    dispatch(readMessage(id));
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (messageRef) {
      const renderedSubstitutions = message.inner.substitutions
        .map(substitution => {
          return `<span style="font-weight: ${substitution.styles[0]}">${substitution.text}</span>`;
        })
        .join('');
      setRenderMessage(
        message.inner.message.replace('{}', renderedSubstitutions),
      );
      messageRef.current.innerHTML = message.inner.message.replace(
        '{}',
        renderedSubstitutions,
      );
    }
  }, [message.inner.substitutions, message.inner.message, messageRef]);

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
      <Box>
        {message.inner.title && (
          <Typography onClick={handleOpen} sx={titleStyle}>
            {message.inner.title}
          </Typography>
        )}
        <Typography
          sx={textStyle}
          onClick={handleOpen}
          ref={messageRef}
        ></Typography>
      </Box>
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
            <Box>
              {message.inner.title && (
                <Typography sx={messageTitle}>{message.inner.title}</Typography>
              )}
              <NotificationMessage
                sx={messageDescription}
                id={'modal-modal-description'}
                innerData={renderMessage}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '15px',
              }}
            >
              <Box>
                {message.inner.title && (
                  <Typography sx={titleStyle}>{message.inner.title}</Typography>
                )}
                <NotificationMessage
                  sx={messageDescription}
                  id={'modal-modal-description'}
                  innerData={renderMessage}
                />
              </Box>
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

const messageDescription = theme => ({
  color: '#000',
  fontSize: '22px!important',
  textAlign: 'left',
  overflow: 'hidden',
  display: '-webkit-box',
  minHeight: '20px',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  textOverflow: 'ellipsis',
  [theme.breakpoints.down('lg')]: {
    fontSize: '18px!important',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '14px!important',
  },
});

const messageTitle = theme => ({
  color: '#000',
  fontSize: '28px!important',
  textAlign: 'left',
  overflow: 'hidden',
  display: '-webkit-box',
  minHeight: '20px',
  fontWeight: 600,
  '-webkit-line-clamp': '1',
  '-webkit-box-orient': 'vertical',
  textOverflow: 'ellipsis',
  marginBottom: '15px',
  [theme.breakpoints.down('lg')]: {
    fontSize: '20px!important',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '16px!important',
  },
});

const titleStyle = theme => ({
  color: '#000',
  fontSize: '18px!important',
  textAlign: 'left',
  overflow: 'hidden',
  display: '-webkit-box',
  minHeight: '20px',
  fontWeight: 600,
  '-webkit-line-clamp': '1',
  '-webkit-box-orient': 'vertical',
  textOverflow: 'ellipsis',
  [theme.breakpoints.down('lg')]: {
    fontSize: '16px!important',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '14px!important',
  },
});

const textStyle = theme => ({
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
