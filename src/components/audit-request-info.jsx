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
  Divider,
} from '@mui/material';
import { CustomCard } from './custom/Card.jsx';
import theme from '../styles/themes.js';
import {
  clearMessage,
  confirmAudit,
  deleteAuditRequest,
} from '../redux/actions/auditAction.js';
import Markdown from './markdown/Markdown.jsx';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import {
  changeRolePublicAuditor,
  changeRolePublicAuditorNoRedirect,
} from '../redux/actions/userAction.js';
import CustomLink from './custom/CustomLink.jsx';
import OfferModal from './modal/OfferModal.jsx';
import ShareProjectButton from './custom/ShareProjectButton.jsx';
import { setCurrentChat } from '../redux/actions/chatActions.js';
import ChatIcon from './icons/ChatIcon.jsx';
import ConfirmModal from './modal/ConfirmModal.jsx';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import PriceCalculation from './PriceCalculation.jsx';
import EditDescription from './EditDescription/index.jsx';
import DescriptionHistory from './DescriptionHistory/index.jsx';
import EditTags from './EditDescription/EditTags.jsx';
import EditPrice from './EditDescription/EditPrice.jsx';
import Star from './icons/Star.jsx';
import Currency from './icons/Currency.jsx';

const AuditRequestInfo = ({
  project,
  onClose,
  handleError,
  redirect,
  isModal,
  setError,
  stayHere,
  hideChange,
}) => {
  const navigate = useNavigate();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [open, setOpen] = useState(false);
  const [confirmDeclineOpen, setConfirmDeclineOpen] = useState(false);
  const [showAcceptButton, setShowAcceptButton] = useState(true);

  const { auditor } = useSelector(s => s.auditor);
  const { auditRequest, auditRequests, successMessage } = useSelector(
    s => s.audits,
  );
  const { user } = useSelector(s => s.user);
  const { chatList } = useSelector(s => s.chat);

  const dispatch = useDispatch();

  const handleOpen = () => {
    if (user.current_role === AUDITOR && isAuth() && auditor?.first_name) {
      setOpen(true);
    } else if (
      user.current_role !== AUDITOR &&
      isAuth() &&
      auditor?.first_name
    ) {
      dispatch(changeRolePublicAuditorNoRedirect(AUDITOR, user.id, auditor));
      handleError();
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
      setOpen(true);
    } else {
      navigate('/sign-in');
    }
  };

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
    );
    if (isRequestFound) {
      dispatch(confirmAudit(auditRequest, true, '/profile/audits'));
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
      </Box>
      <Box sx={{ width: '100%' }} className="audit-content">
        <Box sx={contentWrapper} className="audit-request-content-wrapper">
          <Typography sx={titleSx} className="audit-request-title">
            <EditTags hideChange={hideChange} audit={project} />
          </Typography>
          <Divider sx={{ width: '100%' }} />

          <Box sx={salaryWrapper} className={'audit-request-salary'}>
            <EditPrice
              hideChange={hideChange}
              audit={project}
              request={true}
              user={user}
            />
            {/*<Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>*/}
            {/*  <svg*/}
            {/*    width="26"*/}
            {/*    height="26"*/}
            {/*    viewBox="0 0 26 26"*/}
            {/*    fill="none"*/}
            {/*    xmlns="http://www.w3.org/2000/svg"*/}
            {/*  >*/}
            {/*    <path*/}
            {/*      d="M13.2559 25.5499C20.2424 25.5499 25.9061 19.8862 25.9061 12.8997C25.9061 5.91319 20.2424 0.249512 13.2559 0.249512C6.26939 0.249512 0.605713 5.91319 0.605713 12.8997C0.605713 19.8862 6.26939 25.5499 13.2559 25.5499Z"*/}
            {/*      fill="#52176D"*/}
            {/*    />*/}
            {/*    <path*/}
            {/*      d="M13.257 4.64941L15.4702 9.71865L20.4071 10.5528L16.8321 14.4671L17.6833 20.0496L13.257 17.4188L8.83078 20.0496L9.68199 14.4671L6.10693 10.5528L11.0439 9.71865L13.257 4.64941Z"*/}
            {/*      fill="#FFCA28"*/}
            {/*    />*/}
            {/*  </svg>*/}
            {/*  150*/}
            {/*</Box>*/}
          </Box>

          {!matchXs && (
            <Box sx={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
              {(project?.creator_contacts?.email ||
                (project?.customer_contacts?.email !== null &&
                  project?.customer_contacts?.email.length)) && (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <EmailIcon />
                  <Box sx={{ display: 'grid' }}>
                    {project?.creator_contacts ? (
                      <Tooltip
                        title={project?.creator_contacts?.email}
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="caption"
                          sx={contactStyle}
                          noWrap={true}
                        >
                          {project?.creator_contacts?.email}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={
                          project?.customer_contacts?.email !== null
                            ? project?.customer_contacts?.email
                            : 'Hidden'
                        }
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="caption"
                          sx={contactStyle}
                          noWrap={true}
                        >
                          {project?.customer_contacts?.email !== null
                            ? project?.customer_contacts?.email
                            : 'Hidden'}
                        </Typography>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              )}
              {(project?.creator_contacts?.telegram ||
                (project?.customer_contacts?.telegram !== null &&
                  !!project?.customer_contacts?.telegram.length)) && (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <TelegramIcon />
                  <Box sx={{ display: 'grid' }}>
                    {project?.creator_contacts ? (
                      <Tooltip
                        title={project?.creator_contacts?.telegram}
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="caption"
                          sx={contactStyle}
                          noWrap={true}
                        >
                          {project?.creator_contacts?.telegram}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={
                          project?.customer_contacts?.telegram !== null
                            ? project?.customer_contacts?.telegram
                            : 'Hidden'
                        }
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="caption"
                          sx={contactStyle}
                          noWrap={true}
                        >
                          {project?.customer_contacts?.telegram !== null
                            ? project?.customer_contacts?.telegram
                            : 'Hidden'}
                        </Typography>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ textAlign: 'center', mt: '10px' }}>
          <ShareProjectButton
            projectId={project?.project_id}
            sx={{ fontSize: '12px' }}
            showIcon
            isModal
          />
        </Box>

        <Box sx={infoWrapper} className="audit-request-info">
          {/*<Markdown value={project?.description} />*/}
          <EditDescription
            hideChange={hideChange}
            audit={project}
            auditRequest={true}
          />
          {!hideChange && <DescriptionHistory audit={project} request={true} />}
          {matchXs && (
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {(project?.creator_contacts?.email ||
                (project?.customer_contacts?.email !== null &&
                  project?.customer_contacts?.email.length)) && (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <EmailIcon />
                  <Box sx={{ display: 'grid' }}>
                    {project?.creator_contacts ? (
                      <Tooltip
                        title={project?.creator_contacts?.email}
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="caption"
                          sx={contactStyle}
                          noWrap={true}
                        >
                          {project?.creator_contacts?.email}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={
                          project?.customer_contacts?.email !== null
                            ? project?.customer_contacts?.email
                            : 'Hidden'
                        }
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="caption"
                          sx={contactStyle}
                          noWrap={true}
                        >
                          {project?.customer_contacts?.email !== null
                            ? project?.customer_contacts?.email
                            : 'Hidden'}
                        </Typography>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              )}
              {(project?.creator_contacts?.telegram ||
                (project?.customer_contacts?.telegram !== null &&
                  !!project?.customer_contacts?.telegram.length)) && (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <TelegramIcon />
                  <Box sx={{ display: 'grid' }}>
                    {project?.creator_contacts ? (
                      <Tooltip
                        title={project?.creator_contacts?.telegram}
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="caption"
                          sx={contactStyle}
                          noWrap={true}
                        >
                          {project?.creator_contacts?.telegram}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={
                          project?.customer_contacts?.telegram !== null
                            ? project?.customer_contacts?.telegram
                            : 'Hidden'
                        }
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="caption"
                          sx={contactStyle}
                          noWrap={true}
                        >
                          {project?.customer_contacts?.telegram !== null
                            ? project?.customer_contacts?.telegram
                            : 'Hidden'}
                        </Typography>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
          <Box sx={linkWrapper} className="audit-request-links">
            {(project?.project_scope || project?.scope)?.map((link, idx) => (
              <CustomLink link={link} key={idx} />
            ))}
          </Box>
        </Box>
      </Box>

      {/*{!isModal && (*/}
      {/*  <PriceCalculation*/}
      {/*    price={project?.price}*/}
      {/*    sx={priceCalc}*/}
      {/*    color="secondary"*/}
      {/*    scope={project?.project_scope || project?.scope}*/}
      {/*  />*/}
      {/*)}*/}

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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
        disableScrollLock
      >
        <OfferModal
          auditor={auditor}
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

const contactStyle = theme => ({
  // display: 'flex',
  // alignItems: 'center',
  // gap: '10px'
});

const wrapper = theme => ({
  overflowY: 'auto',
  height: '100%',
  padding: '30px 60px 60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  '& h3': {
    fontSize: '24px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('md')]: {
    padding: '20px 44px 60px',
    '& h3': {
      fontSize: '25px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '38px 20px 30px',
  },
});

const buttonWrapper = theme => ({
  mt: '40px',
  display: 'flex',
  mb: '10px',
  maxWidth: '450px',
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

const titleSx = {
  fontSize: '16px',
  fontWeight: 500,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '5px',
};

const salaryWrapper = {
  display: 'flex',
  gap: '50px',
  fontSize: '14px',
  fontWeight: 500,
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

const linkWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '30px',
  padding: '0 15px',
  '& p': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: '25px',
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  left: '-28px',
  top: '-20px',
  [theme.breakpoints.down('sm')]: {
    left: '-25px',
    // top: '-30px',
  },
});

const buttonSx = theme => ({
  padding: '10px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  mr: '20px',
  width: '100%',
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

const messageButton = theme => ({
  width: '560px',
  padding: '4px 0',
  [theme.breakpoints.down('md')]: {
    width: '440px',
    padding: '4px 0',
  },
  [theme.breakpoints.down('sm')]: {
    width: '360px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '290px',
  },
  [theme.breakpoints.down('xxs')]: {
    width: '254px',
  },
});

const priceCalc = {
  width: '100%',
  '& .head': { justifyContent: 'center' },
};
