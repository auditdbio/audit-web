import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Modal, Tooltip, Typography } from '@mui/material';
import Layout from '../styles/Layout.jsx';
import { getProjectById } from '../redux/actions/projectAction.js';
import Markdown from '../components/markdown/Markdown.jsx';
import { getCurrentCustomer } from '../redux/actions/customerAction.js';
import { ASSET_URL } from '../services/urls.js';
import CustomLink from '../components/custom/CustomLink.jsx';
import TagsList from '../components/tagsList.jsx';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import { AUDITOR, CLEAR_NOT_FOUND, CUSTOMER } from '../redux/actions/types.js';
import NotFound from './Not-Found.jsx';
import theme from '../styles/themes.js';
import Loader from '../components/Loader.jsx';
import {
  changeRolePublicAuditor,
  changeRolePublicAuditorNoRedirect,
} from '../redux/actions/userAction.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import OfferModal from '../components/modal/OfferModal.jsx';
import { clearMessage } from '../redux/actions/auditAction.js';
import { setCurrentChat } from '../redux/actions/chatActions.js';
import ChatIcon from '../components/icons/ChatIcon.jsx';

const PublicProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useSelector(s => s.user);
  const { auditor } = useSelector(s => s.auditor);
  const { successMessage, error: auditError } = useSelector(s => s.audits);
  const { currentProject: project } = useSelector(s => s.project);
  const { currentCustomer: customer } = useSelector(s => s.customer);
  const { error: notFound } = useSelector(s => s.notFound);
  const { chatList } = useSelector(s => s.chat);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const descriptionRef = useRef();

  useEffect(() => {
    dispatch(getProjectById(id));
    return () => {
      dispatch({ type: CLEAR_NOT_FOUND });
    };
  }, []);

  useEffect(() => {
    if (project) {
      dispatch(getCurrentCustomer(project.customer_id));
    }
  }, [project]);

  useEffect(() => {
    setTimeout(() => {
      if (descriptionRef?.current?.offsetHeight > 400) {
        setShowReadMoreButton(true);
      }
    }, 500);
  }, [descriptionRef.current]);

  const handleMakeOffer = () => {
    if (isAuth()) {
      if (user.current_role === AUDITOR) {
        if (!auditor?.first_name) {
          dispatch(changeRolePublicAuditor(AUDITOR, user.id, auditor));
        } else {
          setModalIsOpen(true);
        }
      } else if (user.current_role === CUSTOMER) {
        if (!auditor?.first_name) {
          setMessage('Switched to auditor role');
          setModalIsOpen(true);
          dispatch(changeRolePublicAuditor(AUDITOR, user.id, auditor));
        } else {
          setMessage('Switched to auditor role');
          setModalIsOpen(true);
          dispatch(
            changeRolePublicAuditorNoRedirect(AUDITOR, user.id, auditor),
          );
        }
      }
    } else {
      navigate('/sign-in');
    }
  };

  const handleSendMessage = () => {
    window.scrollTo(0, 0);
    console.log(123);
    const existingChat = chatList.find(chat =>
      chat.members?.find(
        member =>
          member.id === project?.customer_id &&
          member.role?.toLowerCase() === CUSTOMER,
      ),
    );
    const chatId = existingChat ? existingChat.id : project?.customer_id;
    const members = [project?.customer_id, user.id];

    dispatch(
      setCurrentChat(chatId, {
        role: CUSTOMER,
        isNew: !existingChat,
        userDataId: project?.customer_id,
        members,
      }),
    );

    navigate(`/chat/${project?.customer_id}`);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  if (notFound) {
    return <NotFound role={user?.current_role} />;
  }

  if (!project || !customer) {
    return (
      <Layout>
        <Box
          sx={[
            wrapper(user?.current_role),
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Loader role={user?.current_role} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={wrapper(user?.current_role)}>
        <CustomSnackbar
          autoHideDuration={4000}
          open={!!message || !!error || !!successMessage || !!auditError}
          onClose={() => {
            setMessage(null);
            setError(null);
            dispatch(clearMessage());
          }}
          severity={message || successMessage ? 'success' : 'error'}
          text={message || successMessage || error || auditError}
        />

        <Modal
          open={modalIsOpen}
          onClose={handleCloseModal}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
          disableScrollLock
        >
          <OfferModal
            auditor={auditor}
            project={project}
            user={user}
            handleClose={handleCloseModal}
            setError={setError}
            redirect={true}
          />
        </Modal>

        <Box>
          <Typography sx={projectNameSx}>{project?.name}</Typography>
        </Box>

        <Box sx={customerInfoBlock}>
          <Box sx={avatarBoxSx}>
            <Avatar
              src={customer?.avatar ? `${ASSET_URL}/${customer.avatar}` : ''}
              alt="customer photo"
              sx={avatarSx}
            />
          </Box>
          <Box sx={customerInfoColumn}>
            <Box sx={[customerInfoString, { mb: '15px' }]}>
              <Box sx={fieldLabel}>First Name:</Box>
              <Tooltip
                title={customer?.first_name}
                arrow
                placement="top"
                enterDelay={500}
              >
                <Typography sx={customerInfo}>
                  {customer?.first_name}
                </Typography>
              </Tooltip>
            </Box>
            {customer?.last_name && (
              <Box sx={customerInfoString}>
                <Box sx={fieldLabel}>Last Name:</Box>
                <Tooltip
                  title={customer?.last_name}
                  arrow
                  placement="top"
                  enterDelay={500}
                >
                  <Typography sx={customerInfo}>
                    {customer?.last_name}
                  </Typography>
                </Tooltip>
              </Box>
            )}
          </Box>

          {customer?.contacts?.public_contacts && (
            <Box sx={customerInfoColumn}>
              <Box sx={[customerInfoString, { mb: '15px' }]}>
                <Box sx={fieldLabel}>Email:</Box>
                <Tooltip
                  title={customer?.contacts.email}
                  arrow
                  placement="top"
                  enterDelay={500}
                >
                  <Typography sx={customerInfo}>
                    {customer?.contacts.email}
                  </Typography>
                </Tooltip>
              </Box>
              {customer?.last_name && (
                <Box sx={customerInfoString}>
                  <Box sx={fieldLabel}>Telegram:</Box>
                  <Tooltip
                    title={customer?.contacts.telegram}
                    arrow
                    placement="top"
                    enterDelay={500}
                  >
                    <Typography sx={customerInfo}>
                      {customer?.contacts.telegram}
                    </Typography>
                  </Tooltip>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ width: '100%' }}>
          <Box sx={descriptionSx(showFull)}>
            <Box ref={descriptionRef}>
              <Markdown value={project?.description} />
            </Box>
          </Box>
          {showReadMoreButton && (
            <Button onClick={() => setShowFull(!showFull)} sx={readAllButton}>
              {showFull ? 'Hide ▲' : `Read all ▼`}
            </Button>
          )}
          <Box sx={tagsSx}>
            <TagsList data={project?.tags} />
          </Box>
        </Box>

        <Box sx={linksList}>
          {project?.scope.map((link, idx) => {
            return <CustomLink link={link} key={idx} sx={linkSx} />;
          })}
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {user.id !== project.customer_id && (
            <Button
              variant="contained"
              color={user?.current_role === AUDITOR ? 'secondary' : 'primary'}
              sx={buttonSx}
              onClick={handleMakeOffer}
              {...addTestsLabel('offer-button')}
            >
              Make Offer
            </Button>
          )}
          <Button
            variant="text"
            // sx={[buttonSx, messageButton]}
            onClick={handleSendMessage}
            disabled={project?.customer_id === user.id}
            {...addTestsLabel('message-button')}
          >
            <ChatIcon />
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default PublicProject;

const wrapper = role => {
  const borderColor =
    role === AUDITOR
      ? theme.palette.secondary.main
      : theme.palette.primary.main;
  return {
    width: '100%',
    minHeight: '520px',
    display: 'flex',
    flexDirection: 'column',
    padding: '100px 100px 60px',
    gap: '50px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    border: `2px solid ${borderColor}`,
    justifyContent: 'space-between',
    [theme.breakpoints.down('lg')]: {
      padding: '60px 40px 40px',
    },
    [theme.breakpoints.down('md')]: {
      gap: '50px',
    },
    [theme.breakpoints.down('sm')]: {
      gap: '20px',
      justifyContent: 'flex-start',
      padding: '20px',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      alignItems: 'center',
      gap: '25px',
      '& .mobile-tag-wrapper': {
        maxWidth: '380px',
      },
    },
  };
};

const fieldLabel = theme => ({
  flexShrink: 0,
  width: '100px',
  color: '#B2B3B3',
  fontWeight: 500,
  mr: '40px',
  [theme.breakpoints.down('sm')]: {
    mr: '15px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '14px',
  },
});

const projectNameSx = {
  width: '100%',
  fontSize: '22px !important',
  textAlign: 'center',
  fontWeight: 500,
  wordBreak: 'break-word',
};

const customerInfoBlock = theme => ({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
  },
});

const customerInfoColumn = theme => ({
  width: '40%',
  mr: '30px',
  ':last-child': {
    mr: 0,
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    mr: 0,
    mb: '15px',
  },
});

const customerInfoString = {
  display: 'flex',
  alignItems: 'center',
};

const avatarBoxSx = theme => ({
  width: '15%',
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    mb: '30px',
  },
});

const avatarSx = theme => ({
  width: '120px',
  height: '120px',
  mr: '50px',
  [theme.breakpoints.down('sm')]: {
    width: '100px',
    height: '100px',
  },
  [theme.breakpoints.down('xs')]: {
    margin: '0 auto',
  },
});

const customerInfo = theme => ({
  color: '#434242',
  fontSize: '15px !important',
  fontWeight: 400,
  overflow: 'hidden',
  'text-overflow': 'ellipsis',
  [theme.breakpoints.down('xs')]: {
    fontSize: '14px !important',
  },
});

const descriptionSx = full => ({
  maxHeight: full ? 'unset' : '400px',
  overflow: 'hidden',
  border: '2px solid #E5E5E5',
});

const readAllButton = theme => ({
  width: '100%',
  padding: '8px',
  fontWeight: 600,
  fontSize: '21px',
  color: 'black',
  textTransform: 'none',
  lineHeight: '25px',
  background: '#E5E5E5',
  borderRadius: 0,
  boxShadow: '0px -24px 14px -8px rgba(252, 250, 246, 1)',
  ':hover': { background: '#D5D5D5' },
  [theme.breakpoints.down('xs')]: {
    fontSize: '14px',
    border: 'none',
  },
});

const tagsSx = {
  mt: '30px',
  '& .tagsWrapper': {
    width: '100%',
    maxWidth: 'unset',
  },
};

const linksList = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  '& p': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
  },
};

const linkSx = theme => ({
  fontSize: '18px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
});

const buttonSx = theme => ({
  display: 'block',
  textTransform: 'capitalize',
  fontWeight: 600,
  fontSize: '18px',
  padding: '9px 50px',
  borderRadius: '10px',
  [theme.breakpoints.down('xs')]: {
    padding: '9px 20px',
    fontSize: '12px',
  },
});
