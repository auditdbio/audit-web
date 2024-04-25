import React, { useRef, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import {
  Avatar,
  Box,
  Button,
  Typography,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, Link } from 'react-router-dom/dist';
import TagsList from '../components/tagsList.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  acceptAudit,
  clearMessage,
  confirmAudit,
  deleteAudit,
  deleteAuditRequest,
  downloadReport,
  editAuditCustomer,
  editAuditRequestCustomer,
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
import MarkdownEditor from '../components/markdown/Markdown-editor.jsx';
import theme from '../styles/themes.js';
import { Form, Formik } from 'formik';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save.js';
import CloseIcon from '@mui/icons-material/Close';
import { setCurrentChat } from '../redux/actions/chatActions.js';
import ChatIcon from '../components/icons/ChatIcon.jsx';
import ConfirmModal from '../components/modal/ConfirmModal.jsx';
import Headings from '../router/Headings.jsx';

const AuditInfo = ({ audit, auditRequest, issues, confirmed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showFull, setShowFull] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { successMessage, error } = useSelector(s => s.audits);
  const { user } = useSelector(s => s.user);
  const { chatList } = useSelector(s => s.chat);
  const descriptionRef = useRef();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (descriptionRef?.current?.offsetHeight > 400) {
        setShowReadMoreButton(true);
      }
    }, 500);
  }, [descriptionRef.current]);

  const handleConfirm = () => {
    dispatch(confirmAudit(audit));
  };

  const handleDecline = () => {
    if (audit?.status) {
      dispatch(deleteAudit(audit.id));
    } else {
      dispatch(deleteAuditRequest(audit.id));
    }
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

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <Layout>
      <Headings title={audit?.project_name || 'Audit Info'} />

      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error || !!successMessage}
        severity={error ? 'error' : 'success'}
        text={error || successMessage}
        onClose={() => dispatch(clearMessage())}
      />

      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          onClick={() => {
            navigate('/profile/audits');
          }}
          aria-label="Go back"
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon />
        </Button>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          {confirmed ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
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
              <Typography sx={titleSx}>
                {audit?.tags?.map(el => el).join(', ') ?? ''}
              </Typography>
            </Box>
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
        </Box>
        <Box sx={{ maxWidth: '100%', width: '100%' }}>
          <Box sx={contentWrapper}>
            <Box sx={userWrapper}>
              <Avatar
                src={audit?.avatar ? `${ASSET_URL}/${audit?.avatar}` : ''}
                alt="auditor photo"
              />
              <Box sx={{ display: 'grid', textAlign: 'center' }}>
                <Tooltip
                  title={audit?.auditor_first_name}
                  arrow
                  placement="top"
                >
                  <Typography noWrap={true} sx={userNameWrapper}>
                    {audit?.auditor_first_name}
                  </Typography>
                </Tooltip>
                <Tooltip title={audit?.auditor_last_name} arrow placement="top">
                  <Typography noWrap={true} sx={userNameWrapper}>
                    {audit?.auditor_last_name}
                  </Typography>
                </Tooltip>
              </Box>
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
              <Box sx={infoWrapper}>
                <span>Price:</span>
                <Typography>${audit?.price} per line</Typography>
              </Box>
            </Box>

            {!!audit?.time?.from && (
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

          <Box sx={descriptionSx(showFull || editMode)}>
            <Box ref={descriptionRef}>
              {!editMode ? (
                <Markdown value={audit?.description} />
              ) : (
                <Formik
                  initialValues={{
                    description: audit?.description,
                    ...audit,
                  }}
                  onSubmit={values => {
                    if (auditRequest) {
                      dispatch(editAuditRequestCustomer(values));
                    } else {
                      dispatch(editAuditCustomer(values));
                    }
                    setEditMode(false);
                  }}
                >
                  {({ handleSubmit, setFieldTouched, dirty }) => {
                    return (
                      <Form onSubmit={handleSubmit}>
                        <Box sx={{ position: 'relative' }}>
                          <MarkdownEditor
                            name="description"
                            setFieldTouched={setFieldTouched}
                            fastSave={true}
                            mdProps={{
                              view: { menu: true, md: true, html: !matchXs },
                            }}
                          />
                          <Box sx={editBtnSx}>
                            <Button
                              variant={'text'}
                              type={'submit'}
                              disabled={!dirty}
                            >
                              <SaveIcon />
                            </Button>
                            <Button>
                              <CloseIcon
                                color={'secondary'}
                                onClick={() => setEditMode(false)}
                              />
                            </Button>
                          </Box>
                        </Box>
                      </Form>
                    );
                  }}
                </Formik>
              )}
            </Box>
          </Box>
          <Box
            sx={[
              {
                display: 'flex',
                background: '#E5E5E5',
                borderRadius: 0,
                boxShadow: '0px -24px 14px -8px rgba(252, 250, 246, 1)',
                ':hover': { background: '#D5D5D5' },
                padding: '8px',
                position: 'relative',
              },
            ]}
          >
            {showReadMoreButton && !editMode && (
              <Button onClick={() => setShowFull(!showFull)} sx={readAllButton}>
                {showFull ? 'Hide ▲' : `Read all ▼`}
              </Button>
            )}
            {!editMode &&
              audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '10px',
                  }}
                >
                  <Button variant={'text'} onClick={handleEdit}>
                    <EditIcon fontSize={'large'} />
                  </Button>
                </Box>
              )}
          </Box>
        </Box>
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
                onClick={() => setIsModalOpen(true)}
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '15px' }}>
              <Button
                variant={'contained'}
                color={'secondary'}
                onClick={() => dispatch(downloadReport(audit))}
                sx={[buttonSx, { marginBottom: '20px' }]}
                {...addTestsLabel('report-button')}
              >
                Download Report
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

          {/*{(audit?.status === DONE ||*/}
          {/*  audit?.status === SUBMITED ||*/}
          {/*  audit?.status === PENDING) && (*/}
          {audit?.status &&
            !!issues?.length &&
            audit?.status?.toLowerCase() !==
              WAITING_FOR_AUDITS.toLowerCase() && (
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={goToIssues}
                sx={[buttonSx, { mt: '7px' }]}
                {...addTestsLabel('issues-button')}
              >
                Issues ({issues?.length})
              </Button>
            )}
          {/*)}*/}
        </Box>

        <ConfirmModal
          isOpen={isModalOpen}
          handleAgree={handleDecline}
          handleDisagree={() => setIsModalOpen(false)}
        />
      </CustomCard>
    </Layout>
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

const titleSx = theme => ({
  fontWeight: 500,
  fontSize: '16px !important',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px !important',
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
      margin: '13px 0 18px',
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

const descriptionSx = full => ({
  maxHeight: full ? 'unset' : '400px',
  overflow: 'hidden',
  border: '2px solid #E5E5E5',
});

const readAllButton = theme => ({
  width: '100%',
  padding: '8px',
  fontWeight: 600,
  fontSize: '16px',
  color: 'black',
  textTransform: 'none',
  lineHeight: '25px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
    border: 'none',
  },
});

const editBtnSx = theme => ({
  position: 'absolute',
  bottom: '15px',
  display: 'flex',
  gap: '7px',
  flexDirection: 'column',
  right: '10px',
});
