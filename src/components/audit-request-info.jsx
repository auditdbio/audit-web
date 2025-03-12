import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  Modal,
  Tooltip,
  Collapse,
  Popover,
  Avatar,
  ListItemAvatar,
  ListItem,
  ListItemText,
  List,
} from '@mui/material';
import { CustomCard } from './custom/Card.jsx';
import theme from '../styles/themes.js';
import {
  clearMessage,
  confirmAudit,
  deleteAuditRequest,
} from '../redux/actions/auditAction.js';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import {
  changeRolePublicAuditor,
  changeRolePublicAuditorNoRedirect,
} from '../redux/actions/userAction.js';
import OfferModal from './modal/OfferModal.jsx';
import ShareProjectButton from './custom/ShareProjectButton.jsx';
import { setCurrentChat } from '../redux/actions/chatActions.js';
import ChatIcon from './icons/ChatIcon.jsx';
import ConfirmModal from './modal/ConfirmModal.jsx';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import EditDescription from './EditDescription/index.jsx';
import DescriptionHistory from './DescriptionHistory/index.jsx';
import EditTags from './EditDescription/EditTags.jsx';
import EditPrice from './EditDescription/EditPrice.jsx';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined.js';
import EditIcon from '@mui/icons-material/Edit.js';
import Star from './icons/Star.jsx';
import Currency from './icons/Currency.jsx';
import { ASSET_URL } from '../services/urls.js';
import ListItemButton from '@mui/material/ListItemButton';
import TypeChat from './Chat/TypeChat.jsx';

const AuditRequestInfo = ({
  project = null,
  onClose,
  handleError,
  redirect,
  isModal,
  setError,
  stayHere,
  hideChange,
  navigateTo,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDeclineOpen, setConfirmDeclineOpen] = useState(false);
  const [showAcceptButton, setShowAcceptButton] = useState(true);
  const [showFullHeader, setShowFullHeader] = useState(false);
  const [visible, setVisible] = useState(false);
  const organizations = useSelector(state => state.organization.organizations);
  const { auditor } = useSelector(s => s.auditor);
  const [auditorData, setAuditorData] = useState({});
  const { auditRequest, auditRequests, successMessage, organizationAuditRequests } = useSelector(
    s => s.audits,
  );
  const { user } = useSelector(s => s.user);
  const { chatList } = useSelector(s => s.chat);
  const [showFull, setShowFull] = useState(false);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    setVisible(true);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const anchorOrigin = {
    vertical: visible ? 'bottom' : 'top',
    horizontal: 'left',
  };

  const transformOrigin = {
    vertical: visible ? 'top' : 'bottom',
    horizontal: 'left',
  };

  const openAnchor = Boolean(anchorEl);
  const id = openAnchor ? 'simple-popover' : undefined;

  const handleOpen = event => {
    if (user.current_role === AUDITOR && isAuth() && auditor?.first_name) {
      if (!organizations.length) {
        setAuditorData(auditor);
        setOpen(true);
      } else {
        if (auditRequest?.auditor_organization) {
          handleChose(auditRequest?.auditor_organization);
        } else {
          handleClick(event);
        }
      }
    } else if (
      user.current_role !== AUDITOR &&
      isAuth() &&
      auditor?.first_name
    ) {
      dispatch(changeRolePublicAuditorNoRedirect(AUDITOR, user.id, auditor));
      handleError();
      setAuditorData(auditor);
      setOpen(true);
    } else if (
      !auditor?.first_name &&
      user.current_role === AUDITOR &&
      isAuth()
    ) {
      dispatch(changeRolePublicAuditor(AUDITOR, user.id, auditor));
    } else if (
      user.current_role !== AUDITOR &&
      isAuth() &&
      !auditor?.first_name
    ) {
      dispatch(changeRolePublicAuditor(AUDITOR, user.id, auditor));
      handleError();
      setAuditorData(auditor);
      setOpen(true);
    } else {
      navigate('/sign-in');
    }
  };

  const handleChose = auditor => {
    setAuditorData(auditor);
    setOpen(true);
  };
  //
  const handleClose = () => {
    setOpen(false);
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleSendMessage = () => {
    window.scrollTo(0, 0);

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
    localStorage.setItem('path', window.location.pathname);
    navigate(`/chat/${project?.customer_id}`);
  };

  const handleDecline = () => {
    setConfirmDeclineOpen(false);
    dispatch(deleteAuditRequest(project.id, stayHere));
    onClose();
  };

  const handleAccept = () => {

    
    const isRequestFound = auditRequests?.find(
      req => req.id === auditRequest.id,
    ) || organizationAuditRequests?.find(
      req => req.id === auditRequest.id,
    );
    if (isRequestFound) {
      if (isRequestFound?.auditor_organization) {
        dispatch(confirmAudit({ ...isRequestFound, auditor_organization: isRequestFound?.auditor_organization.id }, true, `/audit/${isRequestFound.id}`));
      } else {
        dispatch(confirmAudit(isRequestFound, true, `/audit/${isRequestFound.id}`));
      }
    }
  };

  return (
    <CustomCard sx={wrapper} className="audit-request-wrapper">
      <CustomSnackbar
        open={!!successMessage}
        severity="success"
        autoHideDuration={5000}
        onClose={() => dispatch(clearMessage())}
        text={successMessage}
      />

      <Box sx={{ display: 'flex', width: '100%', position: 'relative' }}>
        <Button
          sx={backButtonSx}
          className={'audit-request-back-btn'}
          onClick={handleBack}
          {...addTestsLabel('go-back-button')}
        >
          {onClose ? (
            <CloseRoundedIcon color={'secondary'} />
          ) : (
            <ArrowBackIcon color={'secondary'} />
          )}
        </Button>
        <ShareProjectButton
          projectId={project?.project_id || project?.id}
          sx={{ position: 'absolute', top: '-20px', right: '40px' }}
          showIcon
          isModal
        />
        <Button
          variant="text"
          color="secondary"
          className={'chat-btn'}
          sx={[buttonSx, sendMessageButton]}
          onClick={handleSendMessage}
          disabled={project?.customer_id === user.id}
          {...addTestsLabel('message-button')}
        >
          <ChatIcon />
        </Button>
      </Box>
      <Typography
        variant="h3"
        sx={{
          width: '100%',
          textAlign: 'center',
          wordBreak: 'break-word',
          px: '10px',
        }}
      >
        {project?.name || project?.project_name}
      </Typography>
      <Box sx={{ width: '100%' }} className={'request-content-sx'}>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={[
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: '10px',
              },
            ]}
          >
            <Button
              sx={[readAllButton]}
              variant={'outlined'}
              onClick={() => setShowFullHeader(!showFullHeader)}
            >
              {showFullHeader ? <span>Hide</span> : <span>Show</span>}
              <TelegramIcon sx={{ width: '22px', height: '22px' }} />
              <EmailIcon sx={{ width: '22px', height: '22px' }} />
              {project?.price
                ? `${project?.price} per line`
                : `${project?.total_cost} total cost`}
              <ExpandLessOutlinedIcon
                sx={[
                  showFullHeader ? {} : { transform: 'rotate(180deg)' },
                  {
                    transition: '0.2s',
                    width: '20px',
                    height: '20px',
                  },
                ]}
              />
            </Button>
          </Box>
          <Collapse in={showFullHeader}>
            <Box sx={contentWrapper}>
              <Box sx={headInfoSx}>
                <Box
                  sx={{
                    [theme.breakpoints.down('sm')]: {
                      width: '280px',
                      paddingRight: '5px',
                      display: 'flex',
                      justifyContent: 'flex-start',
                    },
                  }}
                >
                  <EditTags hideChange={hideChange} audit={project} />
                </Box>
                <Box
                  sx={{
                    [theme.breakpoints.down('sm')]: {
                      width: '280px',
                      paddingLeft: '5px',
                      display: 'flex',
                      justifyContent: 'flex-start',
                    },
                  }}
                >
                  <EditPrice
                    hideChange={hideChange}
                    audit={project}
                    request={true}
                    user={user}
                  />
                </Box>
                <Box
                  sx={[
                    { display: 'flex', gap: '10px' },
                    contactWrapper,
                    {
                      marginTop: 'unset',
                      flexDirection: 'row!important',
                    },
                  ]}
                >
                  {project?.customer_contacts?.email && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        [theme.breakpoints.down('sm')]: {
                          width: '280px',
                          paddingRight: '5px',
                          display: 'flex',
                          justifyContent: 'flex-start',
                        },
                      }}
                    >
                      <EmailIcon sx={{ height: '32px' }} />
                      <Box sx={{ display: 'grid' }}>
                        <Tooltip
                          title={project?.customer_contacts?.email}
                          arrow
                          placement="top"
                        >
                          <Typography variant="caption" noWrap={true}>
                            {project?.customer_contacts?.email}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
                  {project?.customer_contacts?.telegram && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        [theme.breakpoints.down('sm')]: {
                          width: '280px',
                          paddingLeft: '5px',
                          display: 'flex',
                          justifyContent: 'flex-start',
                        },
                      }}
                    >
                      <TelegramIcon sx={{ height: '32px' }} />
                      <Box sx={{ display: 'grid' }}>
                        <Tooltip
                          title={project?.customer_contacts?.telegram}
                          arrow
                          placement="top"
                        >
                          <Typography variant="caption" noWrap={true}>
                            {project?.customer_contacts?.telegram}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </Box>
        <Box sx={{ width: '100%' }} className="audit-content">
          <>
            <Collapse
              in={true}
              collapsedSize={showFull ? undefined : isModal ? 150 : 300}
            >
              <Box sx={descriptionWrapper(theme, showFull, isModal)}>
                <Box sx={infoWrapper} className="audit-request-info">
                  <EditDescription
                    hideChange={hideChange}
                    audit={project}
                    auditRequest={true}
                  />
                </Box>
              </Box>
            </Collapse>
            <Box
              sx={[
                {
                  borderTop: '1px solid #E5E5E5',
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative',
                  paddingTop: '8px',
                },
                !showFull
                  ? {
                      boxShadow: '0px -24px 14px -8px rgba(252, 250, 246, 1)',
                    }
                  : {},
              ]}
            >
              <Button
                onClick={() => {
                  if (isModal) {
                    if (navigateTo) {
                      navigate(navigateTo);
                    } else {
                      navigate(`/project/${project.id}`);
                    }
                  } else {
                    setShowFull(!showFull);
                  }
                }}
                sx={[
                  readAllButton,
                  {
                    position: 'relative',
                    top: !showFull ? '-25px' : 0,
                    backgroundColor: '#fcfaf6',
                    zIndex: '1',
                    marginBottom: showFull ? '20px' : 0,
                    '&:hover': {
                      backgroundColor: '#fcfaf6',
                    },
                  },
                ]}
                variant={'outlined'}
              >
                {!isModal ? (
                  <span>{showFull ? 'Hide' : `Show`}</span>
                ) : (
                  <span>{showFull ? 'Hide' : `Show full`}</span>
                )}
                {!isModal && <EditIcon sx={{ width: '20px' }} />}
                <ExpandLessOutlinedIcon
                  sx={[
                    showFull ? {} : { transform: 'rotate(180deg)' },
                    {
                      transition: '0.2s',
                      width: '20px',
                      height: '20px',
                    },
                    isModal ? { transform: 'rotate(90deg)' } : {},
                  ]}
                />
              </Button>
            </Box>
          </>
        </Box>
        {!hideChange && <DescriptionHistory audit={project} request={true} />}

        <Box sx={buttonWrapper} className="audit-request-button-wrapper">
          <Button
            variant="contained"
            color="secondary"
            sx={buttonSx}
            onClick={() => {
              if (isModal) {
                handleBack();
              } else {
                setConfirmDeclineOpen(true);
              }
            }}
            {...addTestsLabel('project-modal_cancel-button')}
          >
            {isModal ? 'Cancel' : 'Decline'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={buttonSx}
            onClick={handleOpen}
            {...addTestsLabel('project-modal_make-offer-button')}
          >
            Make offer
          </Button>
          <Popover
            id={id}
            open={openAnchor}
            anchorEl={anchorEl}
            onClose={handleCloseAnchor}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
          >
            <List
              dense
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            >
              <ListItem disablePadding onClick={() => handleChose(auditor)}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      alt={user.name}
                      // src={org.avatar && `${ASSET_URL}/${org.avatar}`}
                    />
                  </ListItemAvatar>
                  <ListItemText id={user.name} primary={user.name} />
                </ListItemButton>
              </ListItem>
              {organizations.map(org => {
                const member = org.members.find(
                  member => member.user_id === user.id,
                );
                const hasEditorAccess =
                  member.access_level === 'Editor' ||
                  member.access_level === 'Owner';

                return (
                  <ListItem
                    key={org.id}
                    disablePadding
                    disabled={!hasEditorAccess}
                    onClick={() => {
                      if (hasEditorAccess) {
                        handleChose(org);
                      }
                    }}
                  >
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar
                          alt={org.name}
                          src={
                            org.avatar
                              ? `${ASSET_URL}/${org.avatar}`
                              : undefined
                          }
                        />
                      </ListItemAvatar>
                      <ListItemText id={org.id} primary={org.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Popover>
          {showAcceptButton &&
            auditRequest &&
            !isModal &&
            auditRequest?.last_changer?.toLowerCase() === CUSTOMER && (
              <Button
                variant="contained"
                sx={buttonSx}
                onClick={handleAccept}
                {...addTestsLabel('accept-button')}
              >
                Accept
              </Button>
            )}
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        disableScrollLock
      >
        <OfferModal
          auditor={auditorData}
          project={project}
          user={user}
          redirect={redirect}
          setError={setError}
          onClose={onClose}
          stayHere={stayHere}
          handleClose={handleClose}
          onSubmit={() => {
            setShowAcceptButton(false);
            if (onClose) {
              onClose();
            }
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={confirmDeclineOpen}
        handleAgree={handleDecline}
        handleDisagree={() => setConfirmDeclineOpen(false)}
      />
    </CustomCard>
  );
};

export default AuditRequestInfo;

const descriptionWrapper = (theme, showFull, isModal) => ({
  maxHeight: showFull ? 'none' : isModal ? 150 : 300,
  '& .rc-md-editor': {
    height: '100%!important',
  },
  overflow: 'hidden',
  transition: 'max-height 0.3s ease',
  '& .rc-md-editor .editor-container>.section': {
    borderRight: 'unset',
  },
  '& .editor-container': {
    borderBottom: '1px solid #e0e0e0',
  },
});

const readAllButton = theme => ({
  p: '3px',
  paddingX: '8px',
  minWidth: 'unset',
  textTransform: 'unset',
  boxShadow: 'unset',
  fontWeight: 600,
  borderRadius: '8px',
  width: '280px',
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  },
});

const headInfoSx = theme => ({
  display: 'flex',
  alignItems: 'flex-start',
  mt: '15px',
  gap: '15px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    gap: '10px',
  },
});

const contactWrapper = theme => ({
  maxWidth: '500px',
  margin: '15px auto 0',
  justifyContent: 'center',
  '& span': {
    fontSize: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    margin: '15px 0 0',
    flexWrap: 'wrap',
    maxWidth: 'unset',
    gap: 'unset',
    width: '100%',
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    margin: 'unset',
    width: 'unset',
    alignItems: 'center',
  },
});

const sendMessageButton = theme => ({
  width: 'unset!important',
  position: 'absolute',
  top: '-20px',
  right: '-20px',
  paddingY: 'unset!important',
  marginRight: 'unset',
  minWidth: 'unset',
  '& svg': {
    width: '45px',
    height: '45px',
  },
  [theme.breakpoints.down('sm')]: {
    top: '-20px',
    right: '-10px',
  },
});

const wrapper = theme => ({
  padding: '25px 30px 60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 'unset',
  gap: '20px',
  '& h3': {
    fontSize: '24px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('md')]: {
    padding: '20px 24px 20px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '30px 20px 20px',
    '& h3': {
      fontSize: '20px',
    },
  },
  [theme.breakpoints.down(780)]: {
    borderRadius: '0!important',
  },
});

const buttonWrapper = theme => ({
  mt: '40px',
  display: 'flex',
  mb: '10px',
  width: '100%',
  justifyContent: 'center',
  [theme.breakpoints.down(500)]: {
    flexDirection: 'column-reverse',
    '& button': {
      mb: '10px',
      width: '100%',
    },
  },
});

const contentWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
};

const infoWrapper = theme => ({
  marginTop: '20px',
  [theme.breakpoints.down('sm')]: {
    '& span': {
      fontSize: '15px',
      fontWeight: 500,
    },
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  left: '-28px',
  top: '-20px',
  [theme.breakpoints.down('sm')]: {
    left: '-25px',
  },
});

const buttonSx = theme => ({
  padding: '10px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  mr: '20px',
  width: '200px',
  borderRadius: '10px',
  '&:last-child': { mr: 0 },
  [theme.breakpoints.down('md')]: {
    width: '210px',
    padding: '11px 0',
  },
  [theme.breakpoints.down('sm')]: {
    width: '170px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '140px',
    mr: '10px',
    fontSize: '12px',
  },
  [theme.breakpoints.down('xxs')]: {
    width: '122px',
  },
});
