import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom/dist';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Avatar,
  Box,
  Button,
  Typography,
  Tooltip,
  Divider,
  FormControlLabel,
  Switch,
  Collapse,
} from '@mui/material';
import TagsList from '../components/tagsList.jsx';
import {
  acceptAudit,
  clearMessage,
  confirmAudit,
  deleteAudit,
  deleteAuditRequest,
  downloadPublicReport,
  downloadReport,
  sendAuditFeedback,
} from '../redux/actions/auditAction.js';
import {
  AUDITOR,
  CUSTOMER,
  DONE,
  RESOLVED,
  SUBMITED,
  WAITING_FOR_AUDITS,
} from '../redux/actions/types.js';
import Markdown from '../components/markdown/Markdown.jsx';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { addTestsLabel } from '../lib/helper.js';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import CloseIcon from '@mui/icons-material/Close';
import { setCurrentChat } from '../redux/actions/chatActions.js';
import ChatIcon from '../components/icons/ChatIcon.jsx';
import ConfirmModal from '../components/modal/ConfirmModal.jsx';
import Headings from '../router/Headings.jsx';
import AuditFeedbackModal from '../components/modal/AuditFeedbackModal.jsx';
import EditDescription from '../components/EditDescription/index.jsx';
import DescriptionHistory from '../components/DescriptionHistory/index.jsx';
import EditTags from '../components/EditDescription/EditTags.jsx';
import AddCommentIcon from '@mui/icons-material/AddComment';
import IssuesList from '../components/issuesPage/IssuesList.jsx';
import { useParams } from 'react-router-dom';
import theme from '../styles/themes.js';
import EditIcon from '@mui/icons-material/Edit.js';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined.js';
import AuditUserCard from '../components/AuditUserCard/AuditUserCard.jsx';

const AuditInfo = ({
  audit,
  auditRequest,
  issues,
  confirmed,
  handleClose,
  request,
  code,
  isPublic,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { successMessage, error } = useSelector(s => s.audits);
  const { user } = useSelector(s => s.user);
  const { chatList } = useSelector(s => s.chat);
  const { auditId } = useParams();
  const [showFull, setShowFull] = useState(false);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleConfirm = () => {
    dispatch(confirmAudit(audit, true));
  };

  const handleDecline = () => {
    if (audit?.status) {
      dispatch(deleteAudit(audit.id));
    } else {
      dispatch(deleteAuditRequest(audit.id));
    }
    handleClose();
  };

  const handleAcceptAudit = () => {
    dispatch(
      acceptAudit({
        id: audit.id,
        report: audit.report,
        status: SUBMITED,
      }),
    );
  };

  const handleSendMessage = () => {
    window.scrollTo(0, 0);

    const existingChat = chatList.find(chat =>
      chat.members?.find(
        member =>
          member.id === audit?.auditor_id &&
          member.role?.toLowerCase() === AUDITOR,
      ),
    );
    const chatId = existingChat ? existingChat.id : audit?.auditor_id;
    const members = [audit?.auditor_id, user.id];

    dispatch(
      setCurrentChat(chatId, {
        name: audit?.auditor_first_name,
        avatar: audit.avatar,
        role: AUDITOR,
        isNew: !existingChat,
        members,
      }),
    );
    localStorage.setItem('path', window.location.pathname);
    navigate(`/chat/${audit?.auditor_id}`);
  };

  const goToIssues = () => {
    navigate(`/issues/audit-issue/${audit?.id}`);
  };

  const handleSendFeedback = values => {
    const feedback = { audit_id: audit.id, ...values };
    dispatch(sendAuditFeedback(feedback));
    setIsFeedbackModalOpen(false);
  };

  return (
    <>
      <Headings title={audit?.project_name || 'Audit Info'} />
      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error || !!successMessage}
        severity={error ? 'error' : 'success'}
        text={error || successMessage}
        onClose={() => dispatch(clearMessage())}
      />
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Button
          sx={[
            backButtonSx,
            auditRequest
              ? { top: '-20px!important', left: '-30px!important' }
              : {},
          ]}
          onClick={() => {
            if (!isPublic) {
              if (handleClose) {
                handleClose();
              } else {
                if (localStorage.getItem('prevPath')) {
                  navigate(localStorage.getItem('prevPath'));
                  localStorage.removeItem('prevPath');
                } else navigate('/profile/audits');
              }
            } else {
              if (localStorage.getItem('prevPath')) {
                navigate(localStorage.getItem('prevPath'));
                localStorage.removeItem('prevPath');
              } else {
                navigate(-1);
              }
            }
          }}
          aria-label="Go back"
          {...addTestsLabel('go-back-button')}
        >
          {!handleClose ? <ArrowBackIcon /> : <CloseIcon />}
        </Button>
        <Button
          variant="text"
          onClick={handleSendMessage}
          sx={[pdfButtonSx, chatBtnSx]}
          disabled={audit?.auditor_id === user.id}
          {...addTestsLabel('message-button')}
        >
          <ChatIcon />
        </Button>
      </Box>
      <Box
        sx={[
          {
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            flexDirection: 'column',
          },
          auditRequest
            ? {
                marginTop: '-20px',
                [theme.breakpoints.down(600)]: {
                  marginTop: '0',
                },
              }
            : {},
        ]}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {confirmed ? (
            <Typography
              variant="h3"
              sx={{
                width: '100%',
                textAlign: 'center',
                wordBreak: 'break-word',
              }}
            >
              <Link
                style={{ color: '#000' }}
                to={`/projects/${audit.project_id}`}
              >
                {audit?.project_name}
              </Link>
            </Typography>
          ) : (
            <Typography sx={{ width: '100%', textAlign: 'center' }}>
              You have offer to audit for&nbsp;
              <span style={{ fontWeight: 500, wordBreak: 'break-word' }}>
                <Link
                  style={{ color: '#000' }}
                  to={`/projects/${audit.project_id}`}
                >
                  {audit?.project_name}
                </Link>
              </span>
              &nbsp;project!
            </Typography>
          )}
          <>
            <EditTags isPublic={isPublic} audit={audit} confirmed={confirmed} />
          </>
        </Box>
        <Divider sx={{ mt: '15px' }} />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Collapse
          sx={{ width: '100%' }}
          in={true}
          collapsedSize={showFull ? undefined : 300}
        >
          <Box sx={descriptionWrapper(theme, showFull)}>
            <Box
              sx={[
                contentWrapper,
                isPublic ? { alignItems: 'flex-start' } : {},
              ]}
            >
              <AuditUserCard
                avatar={audit?.avatar}
                name={
                  audit?.auditor_first_name + ' ' + audit?.auditor_last_name
                }
                email={audit?.auditor_contacts?.email}
                telegram={audit?.auditor_contacts?.telegram}
              />
              {!!audit?.time?.from && !isPublic && (
                <Box sx={projectWrapper}>
                  <Typography>Time for project:</Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    <Box sx={dateWrapper}>
                      {dayjs(audit?.time?.from).format('DD.MM.YYYY')}
                    </Box>
                    -
                    <Box sx={dateWrapper}>
                      {dayjs(audit?.time?.to).format('DD.MM.YYYY')}
                    </Box>
                  </Box>
                  <TagsList />
                </Box>
              )}
            </Box>
            <EditDescription
              isPublic={isPublic}
              auditRequest={request}
              audit={audit}
            />
          </Box>
        </Collapse>
        <Box
          sx={[
            {
              // border: '1px solid #E5E5E5',
              borderTop: '1px solid #E5E5E5',
              display: 'flex',
              width: '100%',
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
            onClick={() => setShowFull(!showFull)}
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
            <span>{showFull ? 'Hide' : `Show`}</span>
            <EditIcon sx={{ width: '20px' }} />
            <ExpandLessOutlinedIcon
              sx={[
                showFull ? {} : { transform: 'rotate(180deg)' },
                {
                  transition: '0.2s',
                  width: '20px',
                  height: '20px',
                },
              ]}
            />
          </Button>
          {/*)}*/}
        </Box>
      </Box>
      {audit?.conclusion && (
        <Box sx={{ border: '2px solid #E5E5E5', width: '100%' }}>
          <Box sx={conclusionTitle}>Conclusion</Box>
          <Markdown value={audit.conclusion} />
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: '15px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          {/*<Box sx={historySx}>*/}
          <DescriptionHistory audit={audit} request={request} />

          {/*</Box>*/}
          {auditRequest && (
            <Button
              variant={'contained'}
              sx={buttonSx}
              disabled={audit?.last_changer?.toLowerCase() === CUSTOMER}
              onClick={handleConfirm}
              {...addTestsLabel('accept-button')}
            >
              Accept
            </Button>
          )}
          {auditRequest && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsConfirmModalOpen(true)}
              sx={buttonSx}
              {...addTestsLabel('decline-button')}
            >
              Decline
            </Button>
          )}
          {audit?.report && !issues?.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant={'contained'}
                color={'secondary'}
                onClick={() => dispatch(downloadReport(audit))}
                sx={[buttonSx, pdfButtonSx]}
                {...addTestsLabel('report-button')}
              >
                {/*Download Report*/}
                <PictureAsPdfIcon />
              </Button>
            </Box>
          )}
        </Box>

        {audit?.report && !!issues?.length && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant={'contained'}
              color={'secondary'}
              onClick={() => {
                if (!isPublic) {
                  dispatch(downloadReport(audit));
                } else {
                  dispatch(downloadPublicReport(audit, code));
                }
              }}
              sx={[buttonSx, pdfButtonSx]}
              {...addTestsLabel('report-button')}
            >
              {/*Download Report*/}
              <PictureAsPdfIcon />
            </Button>
          </Box>
        )}

        {audit?.status?.toLowerCase() === RESOLVED.toLowerCase() &&
          !isPublic &&
          !audit.no_customer && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {!audit.feedback ? (
                <Tooltip title={'Leave feedback'} arrow top>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsFeedbackModalOpen(true)}
                    sx={[buttonSx, pdfButtonSx]}
                    {...addTestsLabel('feddback-button')}
                  >
                    <AddCommentIcon />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title={'My feedback'} arrow top>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsFeedbackModalOpen(true)}
                    sx={[buttonSx, pdfButtonSx]}
                    {...addTestsLabel('feddback-button')}
                  >
                    <FeedbackIcon />
                  </Button>
                </Tooltip>
              )}
            </Box>
          )}

        {audit?.status !== SUBMITED && audit?.status === DONE && (
          <Button
            variant="contained"
            sx={buttonSx}
            onClick={handleAcceptAudit}
            {...addTestsLabel('confirm-button')}
          >
            Confirm
          </Button>
        )}
      </Box>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        handleAgree={handleDecline}
        handleDisagree={() => setIsConfirmModalOpen(false)}
      />
      <AuditFeedbackModal
        isOpen={isFeedbackModalOpen}
        handleClose={() => setIsFeedbackModalOpen(false)}
        handleSend={handleSendFeedback}
        feedback={audit.feedback}
      />
      {!!audit?.issues?.length && <IssuesList auditId={auditId} />}
    </>
  );
};

export default AuditInfo;

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

const descriptionWrapper = (theme, showFull) => ({
  maxHeight: showFull ? 'none' : 300,
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
  maxWidth: '100%',
  width: '100%',
});

const chatBtnSx = theme => ({
  position: 'absolute',
  top: '-20px',
  right: '-20px',
  [theme.breakpoints.down('md')]: {
    top: '-12px',
    right: '-14px',
  },
  [theme.breakpoints.down('md')]: {
    top: '-22px',
    right: '-10px',
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  left: '-38px',
  top: '-20px',
  [theme.breakpoints.down('sm')]: {
    top: '-30px',
    left: '-20px',
  },
});

const contentWrapper = theme => ({
  display: 'flex',
  gap: '70px',
  alignItems: 'center',
  mb: '30px',
  [theme.breakpoints.down('md')]: {
    gap: '30px',
    mb: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    maxWidth: '400px',
    marginX: 'auto',
  },
});

const pdfButtonSx = theme => ({
  padding: '8.5px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  height: '50px',
  width: '50px!important',
  minWidth: '50px',
  borderRadius: '10px',
  [theme.breakpoints.down('lg')]: {
    height: '47px',
  },
  [theme.breakpoints.down('md')]: {
    height: '45px',
  },
});

const buttonSx = theme => ({
  padding: '11px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  width: '270px',
  borderRadius: '10px',
  ':last-child': { mr: 0 },
  [theme.breakpoints.down('md')]: {
    width: '210px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '170px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '100px',
  },
});

const dateWrapper = theme => ({
  border: '1.5px solid #E5E5E5',
  width: '120px',
  padding: '18px 0',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    width: '110px',
  },
  [theme.breakpoints.down('sm')]: {
    paddingY: '10px',
  },
});

const projectWrapper = theme => ({
  display: 'flex',
  textAlign: 'center',
  flexDirection: 'column',
  gap: '25px',
  '& p': {
    color: '#B2B3B3',
    fontSize: '15px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    textAlign: 'left',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
    gap: '5px',
    '& p': {
      fontSize: '12px',
    },
  },
});

const conclusionTitle = theme => ({
  padding: '10px 0',
  fontSize: '20px',
  fontWeight: 500,
  textAlign: 'center',
});
