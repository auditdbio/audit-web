import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom/dist';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Avatar,
  Box,
  Button,
  Typography,
  Tooltip,
  Divider,
} from '@mui/material';
import Headings from '../../router/Headings.jsx';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import { CustomCard } from '../custom/Card.jsx';
import CloseIcon from '@mui/icons-material/Close';
import EditTags from '../EditDescription/EditTags.jsx';
import EditPrice from '../EditDescription/EditPrice.jsx';
import TagsList from '../tagsList.jsx';
import EditDescription from '../EditDescription/index.jsx';
import DescriptionHistory from '../DescriptionHistory/index.jsx';
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
import { ASSET_URL } from '../../services/urls.js';
import AuditInfo from '../../pages/audit-info.jsx';

const MessageModalCustomer = ({
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
      <AuditInfo
        audit={audit}
        auditRequest={auditRequest}
        handleClose={handleClose}
        request
      />
    </CustomCard>
  );
};

export default MessageModalCustomer;

const roleTitleSx = theme => ({
  fontSize: '20px',
  margin: 'unset!important',
  // marginBottom: '15px',
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
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
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
