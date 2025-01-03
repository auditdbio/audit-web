import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom/dist';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Typography, Divider, Collapse } from '@mui/material';
import Headings from '../../router/Headings.jsx';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import { CustomCard } from '../custom/Card.jsx';
import CloseIcon from '@mui/icons-material/Close';
import EditTags from '../EditDescription/EditTags.jsx';
import TagsList from '../tagsList.jsx';
import EditDescription from '../EditDescription/index.jsx';
import Markdown from '../markdown/Markdown.jsx';
import ChatIcon from '../icons/ChatIcon.jsx';
import IssuesList from '../issuesPage/IssuesList.jsx';
import ConfirmModal from '../modal/ConfirmModal.jsx';
import AuditFeedbackModal from '../modal/AuditFeedbackModal.jsx';
import {
  acceptAudit,
  clearMessage,
  confirmAudit,
  deleteAudit,
  deleteAuditRequest,
  downloadPublicReport,
  downloadReport,
  sendAuditFeedback,
} from '../../redux/actions/auditAction.js';
import {
  AUDITOR,
  CUSTOMER,
  DONE,
  RESOLVED,
  SUBMITED,
  WAITING_FOR_AUDITS,
} from '../../redux/actions/types.js';
import { setCurrentChat } from '../../redux/actions/chatActions.js';
import { addTestsLabel } from '../../lib/helper.js';
import theme from '../../styles/themes.js';
import AuditUserCard from '../AuditUserCard/AuditUserCard.jsx';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import { useLocation } from 'react-router-dom';

const MessageModalCustomer = ({
  audit,
  auditRequest,
  issues,
  confirmed,
  handleClose,
  request,
  code,
  isPublic,
  navigateTo,
  isModal,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { successMessage, error } = useSelector(s => s.audits);
  const { user } = useSelector(s => s.user);
  const { chatList } = useSelector(s => s.chat);
  const [showFull, setShowFull] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const location = useLocation();
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
    <CustomCard sx={wrapper} className={'audit-info-wrapper'}>
      <Headings title={audit?.project_name || 'Audit Info'} />
      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error || !!successMessage}
        severity={error ? 'error' : 'success'}
        text={error || successMessage}
        onClose={() => dispatch(clearMessage())}
      />

      <Button
        sx={backButtonSx}
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
      <Box sx={{ width: '100%' }}>
        <Collapse
          sx={{ width: '100%' }}
          in={true}
          collapsedSize={showFull ? undefined : 250}
        >
          <Box sx={descriptionWrapper(theme, showFull)}>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
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
                      to={`/projects/${audit?.project_id}`}
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
                        to={`/projects/${audit?.project_id}`}
                      >
                        {audit?.project_name}
                      </Link>
                    </span>
                    &nbsp;project!
                  </Typography>
                )}
                <>
                  <EditTags
                    isPublic={isPublic}
                    audit={audit}
                    confirmed={confirmed}
                  />
                </>
              </Box>
              <Divider sx={{ mt: '15px' }} />
            </Box>
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
            onClick={() => {
              if (isModal) {
                if (navigateTo) {
                  localStorage.setItem('prevPath', location.pathname);
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
            {!navigateTo ? (
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
      </Box>
      {audit?.conclusion && (
        <Box sx={{ border: '2px solid #E5E5E5', width: '100%' }}>
          <Box sx={conclusionTitle}>Conclusion</Box>
          <Markdown value={audit.conclusion} />
        </Box>
      )}

      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
          }}
        >
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
          {!audit?.status && (
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
                onClick={() => dispatch(Report(audit))}
                sx={[buttonSx]}
                {...addTestsLabel('report-button')}
              >
                Download Report
              </Button>
            </Box>
          )}
          <Button
            variant="text"
            onClick={handleSendMessage}
            disabled={audit?.auditor_id === user.id}
            {...addTestsLabel('message-button')}
          >
            <ChatIcon />
          </Button>
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
              sx={[buttonSx, { marginBottom: '20px' }]}
              {...addTestsLabel('report-button')}
            >
              Download Report
            </Button>
          </Box>
        )}

        {audit?.status?.toLowerCase() === RESOLVED.toLowerCase() &&
          !isPublic &&
          !audit.no_customer && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsFeedbackModalOpen(true)}
                sx={[buttonSx, { marginBottom: '20px' }]}
                {...addTestsLabel('feddback-button')}
              >
                {audit.feedback ? 'My feedback' : 'Leave feedback'}
              </Button>
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

        {audit?.status &&
          !!issues?.length &&
          !isPublic &&
          audit?.status?.toLowerCase() !== WAITING_FOR_AUDITS.toLowerCase() && (
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={goToIssues}
              sx={[buttonSx]}
              {...addTestsLabel('issues-button')}
            >
              Issues ({issues?.length})
            </Button>
          )}
      </Box>
      {isPublic && (
        <IssuesList
          isPublic={isPublic}
          hideControl={true}
          auditId={audit?.id}
          code={code}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        handleAgree={handleDecline}
        handleDisagree={() => setIsConfirmModalOpen(false)}
      />

      <AuditFeedbackModal
        isOpen={isFeedbackModalOpen}
        handleClose={() => setIsFeedbackModalOpen(false)}
        handleSend={handleSendFeedback}
        feedback={audit?.feedback}
      />
    </CustomCard>
  );
};

export default MessageModalCustomer;

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
  maxHeight: showFull ? 'none' : 250,
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

const wrapper = theme => ({
  padding: '30px 60px 60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '40px',
  position: 'relative',
  '& h3': {
    fontSize: '24px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('sm')]: {
    gap: '40px',
    padding: '25px 20px 30px',
    '& h3': {
      fontSize: '20px',
    },
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  left: 0,
  top: '10px',
  [theme.breakpoints.down('md')]: {
    minWidth: 'unset',
    top: 0,
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
