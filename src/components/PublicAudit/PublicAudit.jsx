import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom/dist';
import dayjs from 'dayjs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { CustomCard } from '../custom/Card.jsx';
import Headings from '../../router/Headings.jsx';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DragAndDropInput from '../DrgaAndDrop/DragAndDrop.jsx';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import theme from '../../styles/themes.js';
import EditIcon from '@mui/icons-material/Edit.js';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined.js';

const PublicAudit = ({
  audit,
  auditRequest,
  issues,
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
          sx={backButtonSx}
          onClick={() => {
            if (localStorage.getItem('prevPath')) {
              navigate(localStorage.getItem('prevPath'));
              localStorage.removeItem('prevPath');
            } else {
              navigate('/profile/audits');
            }
          }}
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon color="secondary" />
        </Button>
        {audit?.status?.toLowerCase() === RESOLVED.toLowerCase() &&
          (audit?.customer_id === user.id || audit?.auditor_id === user.id) && (
            <FormControlLabel
              control={
                <Switch
                  checked={publicView}
                  onChange={e => setPublicView(e.target.checked)}
                />
              }
              sx={{
                '& .MuiTypography-root': { fontSize: '14px' },
                top: '-20px',
                position: 'absolute',
              }}
              label="Public view"
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
            borderBottom: '1px solid #E5E5E5',
          },
        }}
      >
        <Collapse in={true} collapsedSize={showFull ? undefined : 80}>
          <Box sx={descriptionWrapper(theme, showFull)}>
            <Box sx={contentWrapper}>
              <Box>
                <Typography sx={roleTitleSx} align={'center'}>
                  Auditor
                </Typography>
                <Box sx={useContentSx}>
                  <Box sx={userWrapper}>
                    <Avatar
                      src={audit?.avatar ? `${ASSET_URL}/${audit?.avatar}` : ''}
                      alt="auditor photo"
                    />
                    <Link
                      to={`/a/${audit.auditor_id}`}
                      style={{ display: 'grid', textAlign: 'center' }}
                    >
                      <Tooltip
                        title={audit?.auditor_first_name}
                        arrow
                        placement="top"
                      >
                        <Typography noWrap={true} sx={userNameWrapper}>
                          {audit?.auditor_first_name}
                        </Typography>
                      </Tooltip>
                      <Tooltip
                        title={audit?.auditor_last_name}
                        arrow
                        placement="top"
                      >
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
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography align={'center'} sx={roleTitleSx}>
                  Customer
                </Typography>
                <Box sx={useContentSx}>
                  <Box sx={userWrapper}>
                    <Avatar
                      src={
                        audit?.customer_avatar
                          ? `${ASSET_URL}/${audit?.customer_avatar}`
                          : ''
                      }
                      alt="auditor photo"
                    />
                    <Link
                      to={`/a/${audit.customer_id}`}
                      style={{ display: 'grid', textAlign: 'center' }}
                    >
                      <Tooltip
                        title={audit?.customer_first_name}
                        arrow
                        placement="top"
                      >
                        <Typography noWrap={true} sx={userNameWrapper}>
                          {audit?.customer_first_name}
                        </Typography>
                      </Tooltip>
                      <Tooltip
                        title={audit?.customer_last_name}
                        arrow
                        placement="top"
                      >
                        <Typography noWrap={true} sx={userNameWrapper}>
                          {audit?.customer_last_name}
                        </Typography>
                      </Tooltip>
                    </Link>
                  </Box>
                  <Box sx={userInfoWrapper}>
                    <Box sx={infoWrapper}>
                      <span>E-mail:</span>
                      <Box sx={{ display: 'grid' }}>
                        {!!audit?.customer_contacts?.email ? (
                          <Tooltip
                            title={audit?.customer_contacts?.email}
                            arrow
                            placement="top"
                          >
                            <Typography noWrap={true}>
                              {audit?.customer_contacts?.email}
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
                        {!!audit?.customer_contacts?.telegram ? (
                          <Tooltip
                            title={audit?.customer_contacts?.telegram}
                            arrow
                            placement="top"
                          >
                            <Typography noWrap={true}>
                              {audit?.customer_contacts?.telegram}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography noWrap={true}>Not specified</Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
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
              boxShadow: '0px -24px 14px -8px rgba(252, 250, 246, 1)',
            },
          ]}
        >
          <Button
            onClick={() => setShowFull(!showFull)}
            sx={[
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
            <ExpandLessOutlinedIcon
              sx={[
                showFull ? {} : { transform: 'rotate(180deg)' },
                {
                  transition: '0.2s',
                  // marginRight: '0',
                  // marginLeft: 'auto',
                  width: '20px',
                  height: '20px',
                },
              ]}
            />
          </Button>
        </Box>
        <EditDescription
          isPublic={isPublic}
          auditRequest={request}
          audit={audit}
        />
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
            onClick={() => {
              if (!isPublic) {
                dispatch(downloadReport(audit));
              } else {
                dispatch(downloadPublicReport(audit, code));
              }
            }}
            sx={[buttonSx]}
            {...addTestsLabel('report-button')}
          >
            <PictureAsPdfIcon />
            {/*Download report*/}
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
  maxHeight: showFull ? 'none' : 80,
  overflow: 'hidden',
});

const roleTitleSx = theme => ({
  fontSize: '20px',
  margin: 'unset!important',
});

const useContentSx = theme => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '20px',
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

const userNameWrapper = theme => ({
  maxWidth: '190px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'unset',
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
  justifyContent: 'space-evenly',
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
//
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
      margin: '0 0 5px',
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
  gap: '20px',
  marginTop: '20px',
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
  },
});

const buttonSx = theme => ({
  padding: '11px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  width: '50px',
  borderRadius: '10px',
  ':last-child': { mr: 0 },
  // [theme.breakpoints.down('md')]: {
  //   width: '210px',
  // },
  // [theme.breakpoints.down('sm')]: {
  //   width: '170px',
  // },
  // [theme.breakpoints.down('xs')]: {
  //   width: '100px',
  // },
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
