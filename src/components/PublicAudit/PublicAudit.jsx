import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom/dist';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  clearMessage,
  deleteAudit,
  deleteAuditRequest,
  downloadPublicReport,
  downloadReport,
  handlePublishAudit,
  sendAuditFeedback,
} from '../../redux/actions/auditAction.js';
import Headings from '../../router/Headings.jsx';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import EditTags from '../EditDescription/EditTags.jsx';
import EditDescription from '../EditDescription/index.jsx';
import Markdown from '../markdown/Markdown.jsx';
import ChatIcon from '../icons/ChatIcon.jsx';
import IssuesList from '../issuesPage/IssuesList.jsx';
import ConfirmModal from '../modal/ConfirmModal.jsx';
import AuditFeedbackModal from '../modal/AuditFeedbackModal.jsx';
import { AUDITOR, RESOLVED } from '../../redux/actions/types.js';
import { setCurrentChat } from '../../redux/actions/chatActions.js';
import { addTestsLabel } from '../../lib/helper.js';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DragAndDropInput from '../DrgaAndDrop/DragAndDrop.jsx';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import theme from '../../styles/themes.js';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import AuditUserCard from '../AuditUserCard/AuditUserCard.jsx';

const PublicAudit = ({
  audit,
  confirmed,
  handleClose,
  request,
  code,
  isPublic,
  publicView,
  setPublicView,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { successMessage, error, verifyAudit } = useSelector(s => s.audits);
  const { user } = useSelector(s => s.user);
  const { chatList } = useSelector(s => s.chat);
  const [showFull, setShowFull] = useState(false);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleDecline = () => {
    if (audit?.status) {
      dispatch(deleteAudit(audit.id));
    } else {
      dispatch(deleteAuditRequest(audit.id));
    }
    handleClose();
  };

  const handleNavigateBack = () => {
    const prevPath = localStorage.getItem('prevPath');
    if (prevPath) {
      navigate(prevPath);
      localStorage.removeItem('prevPath');
    } else {
      navigate('/profile/audits');
    }
  };

  const handlePublishToggle = (checked) => {
    dispatch(
      handlePublishAudit({
        id: audit.id,
        public: checked,
      }),
    );
    if (publicView) setPublicView(false);
  };

  const handleDownloadReport = () => {
    const isPrivateAccess = !isPublic || !audit.isPublic || 
                           audit?.auditor_id === user?.id || 
                           audit?.customer_id === user?.id;

    if (isPrivateAccess) {
      dispatch(downloadReport(audit));
    } else {
      dispatch(downloadPublicReport(audit, code));
    }
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

    const chatData = {
      name: audit?.auditor_first_name,
      avatar: audit.avatar,
      role: AUDITOR,
      isNew: !existingChat,
      members: [audit?.auditor_id, user.id],
    };

    const chatId = existingChat ? existingChat.id : audit?.auditor_id;
    
    dispatch(setCurrentChat(chatId, chatData));
    localStorage.setItem('path', window.location.pathname);
    navigate(`/chat/${audit?.auditor_id}`);
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
          sx={backButtonSx}
          onClick={handleNavigateBack}
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon color="secondary" />
        </Button>
        {audit?.status?.toLowerCase() === RESOLVED.toLowerCase() &&
          user?.current_role?.toLowerCase() === AUDITOR.toLowerCase() &&
          (audit?.customer_id === user.id || audit?.auditor_id === user.id) && (
            <FormControlLabel
              control={
                <Switch
                  checked={audit?.isPublic}
                  onChange={e => handlePublishToggle(e.target.checked)}
                  color="secondary"
                />
              }
              sx={{
                '& .MuiTypography-root': { fontSize: '14px' },
                top: '-20px',
                position: 'absolute',
                right: '30px',
              }}
              label="Publish"
            />
          )}
        <Button
          variant="text"
          onClick={handleSendMessage}
          sx={sendMessageButton}
          disabled={audit?.auditor_id === user.id}
          {...addTestsLabel('message-button')}
        >
          <ChatIcon />
        </Button>
      </Box>
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
      <Box
        sx={{
          maxWidth: '100%',
          width: '100%',
          '& .rc-md-editor': {
            borderBottom: '1px solid #E5E5E5!important',
          },
        }}
      >
        <Collapse in={true} collapsedSize={showFull ? undefined : 200}>
          <Box sx={descriptionWrapper(theme, showFull)}>
            <Box sx={contentWrapper}>
              <AuditUserCard
                avatar={audit?.avatar}
                name={
                  audit?.auditor_first_name + ' ' + audit?.auditor_last_name
                }
                email={audit?.auditor_contacts?.email}
                telegram={audit?.auditor_contacts?.telegram}
                role={'Auditor'}
                id={audit.auditor_id}
              />
              <AuditUserCard
                avatar={audit?.customer_avatar}
                name={
                  audit?.customer_first_name + ' ' + audit?.customer_last_name
                }
                email={audit?.customer_contacts?.email}
                telegram={audit?.customer_contacts?.telegram}
                role={'Customer'}
                id={audit.customer_id}
                customer={true}
              />
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
              justifyContent: 'center',
              position: 'relative',
              paddingTop: '8px',
              boxShadow: '0px -24px 14px -8px rgba(252, 250, 246, 1)',
            },
          ]}
        >
          <Button
            onClick={() => setShowFull(!showFull)}
            sx={[
              readAllButton,
              {
                p: '3px',
                paddingX: '8px',
                minWidth: 'unset',
                textTransform: 'unset',
                boxShadow: 'unset',
                fontWeight: 600,
                borderRadius: '8px',
                width: '280px',
                marginX: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
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
        </Box>
      </Box>

      {audit?.conclusion && (
        <Box sx={{ border: '2px solid #E5E5E5', width: '100%' }}>
          <Box sx={conclusionTitle}>Conclusion</Box>
          <Markdown value={audit.conclusion} />
        </Box>
      )}

      <Box>
        <Box sx={reportActionWrapperSx}>
          <Button
            variant={'contained'}
            color={'secondary'}
            onClick={handleDownloadReport}
            sx={[buttonSx]}
            {...addTestsLabel('report-button')}
          >
            <PictureAsPdfIcon />
          </Button>
          {audit?.report_sha && (
            <>
              <DragAndDropInput
                auditReportName={audit.name}
                auditor_id={audit.auditor_id}
                auditId={audit.id}
                customerId={audit.customer_id}
              />
              <Typography
                sx={{ display: 'flex', alignItems: 'center', width: '130px' }}
              >
                {`Sha: ${audit?.report_sha?.slice(
                  audit?.report_sha?.length - 7,
                )}`}{' '}
                <Box
                  sx={{
                    width: '24px',
                    marginLeft: '5px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {verifyAudit &&
                    (verifyAudit.verified ? (
                      <TaskAltIcon color={'success'} />
                    ) : (
                      <HighlightOffIcon color={'error'} />
                    ))}
                </Box>
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <IssuesList
        isPublic={isPublic}
        hideControl={true}
        auditId={audit.id}
        code={code}
      />

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
    </>
  );
};

export default PublicAudit;

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

const reportActionWrapperSx = theme => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  alignItems: 'center',
  [theme.breakpoints.down(650)]: {
    flexWrap: 'wrap',
  },
});

const descriptionWrapper = (theme, showFull) => ({
  maxHeight: showFull ? 'none' : 200,
  overflow: 'hidden',
  '& .rc-md-editor': {
    height: 'unset!important',
  },
});

const sendMessageButton = theme => ({
  width: 'unset!important',
  position: 'absolute',
  top: '-20px',
  right: '-20px',
  padding: 'unset!important',
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
  alignItems: 'flex-start',
  mb: '30px',
  justifyContent: 'space-evenly',
  [theme.breakpoints.down('md')]: {
    gap: '30px',
    mb: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '15px',
    mb: '20px',
  },
  [theme.breakpoints.down(650)]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '400px',
    marginX: 'auto',
  },
});

const buttonSx = theme => ({
  padding: '11px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  width: '50px',
  minWidth: 'unset',
  borderRadius: '10px',
  ':last-child': { mr: 0 },
});

const conclusionTitle = theme => ({
  padding: '10px 0',
  fontSize: '20px',
  fontWeight: 500,
  textAlign: 'center',
});
