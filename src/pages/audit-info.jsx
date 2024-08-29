import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom/dist';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CustomCard } from '../components/custom/Card.jsx';
import {
  Avatar,
  Box,
  Button,
  Typography,
  Tooltip,
  Divider,
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
import { ASSET_URL } from '../services/urls.js';
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
import EditPrice from '../components/EditDescription/EditPrice.jsx';
import IssuesList from '../components/issuesPage/IssuesList.jsx';

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
      <Box sx={{ maxWidth: '100%', width: '100%' }}>
        <Box sx={contentWrapper}>
          <Box sx={userWrapper}>
            <Avatar
              src={audit?.avatar ? `${ASSET_URL}/${audit?.avatar}` : ''}
              alt="auditor photo"
            />
            <Link
              to={`/a/${audit.auditor_id}`}
              style={{ display: 'grid', textAlign: 'center' }}
            >
              <Tooltip title={audit?.auditor_first_name} arrow placement="top">
                <Typography noWrap={true} sx={userNameWrapper}>
                  {audit?.auditor_first_name}
                </Typography>
              </Tooltip>
              <Tooltip title={audit?.auditor_last_name} arrow placement="top">
                <Typography noWrap={true} sx={userNameWrapper}>
                  {audit?.auditor_last_name}
                </Typography>
              </Tooltip>
            </Link>
          </Box>
          <Box sx={userInfoWrapper}>
            <Box sx={infoWrapper}>
              <span>E-mail:</span>
              <Box sx={{ display: 'grid' }}>
                {!!audit?.auditor_contacts?.email ? (
                  <Tooltip
                    title={audit?.auditor_contacts?.email}
                    arrow
                    placement="top"
                  >
                    <Typography noWrap={true}>
                      {audit?.auditor_contacts?.email}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography noWrap={true}>Not specified</Typography>
                )}
              </Box>
            </Box>
            <Box sx={infoWrapper}>
              <span>Telegram:</span>
              <Box sx={{ display: 'grid' }}>
                {!!audit?.auditor_contacts?.telegram ? (
                  <Tooltip
                    title={audit?.auditor_contacts?.telegram}
                    arrow
                    placement="top"
                  >
                    <Typography noWrap={true}>
                      {audit?.auditor_contacts?.telegram}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography noWrap={true}>Not specified</Typography>
                )}
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                color: '#434242',
                '& p': {
                  fontSize: '15px!important',
                  maxWidth: '200px',
                  fontWeight: 400,
                },
              }}
            >
              <Box sx={infoWrapper}>
                <span>Price:</span>
              </Box>
              <EditPrice
                hideIcon={true}
                audit={audit}
                user={user}
                isPublic={isPublic}
                request={request}
              />
            </Box>
          </Box>

          {!!audit?.time?.from && (
            <Box sx={projectWrapper}>
              <Typography>Time for project:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        {!isPublic && <DescriptionHistory audit={audit} request={request} />}
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
            mt: '20px',
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
            sx={{ mb: '15px' }}
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
              sx={[buttonSx, { marginBottom: '20px' }]}
              {...addTestsLabel('issues-button')}
            >
              Issues ({issues?.length})
            </Button>
          )}
        {/*)}*/}
      </Box>
      {isPublic && (
        <IssuesList
          isPublic={isPublic}
          hideControl={true}
          auditId={audit.id}
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
        feedback={audit.feedback}
      />
    </CustomCard>
  );
};

export default AuditInfo;

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

const userNameWrapper = theme => ({
  maxWidth: '190px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'unset',
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

const userWrapper = theme => ({
  '& .MuiAvatar-root': {
    width: '120px',
    height: '120px',
  },
  '& p': {
    color: '#434242',
    fontSize: '15px',
    fontWeight: 500,
    '&:nth-of-type(1)': {
      margin: '13px 0 5px',
    },
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiAvatar-root': {
      width: '90px',
      height: '90px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '20px',
    '& p': {
      color: '#434242',
      fontSize: '15px',
      fontWeight: 500,
      '&:nth-of-type(1)': {
        margin: '0 0 18px',
      },
    },
  },
});

const userInfoWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
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

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  color: '#434242',
  '& p': {
    fontSize: 'inherit',
    maxWidth: '200px',
  },
  '& span': {
    width: '85px',
    marginRight: '30px',
    color: '#B2B3B3',
  },
  fontSize: '15px',
  [theme.breakpoints.down('md')]: {
    '& span': {
      width: '90px',
      marginRight: '20px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& p': {
      maxWidth: '300px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
});

const conclusionTitle = theme => ({
  padding: '10px 0',
  fontSize: '20px',
  fontWeight: 500,
  textAlign: 'center',
});
