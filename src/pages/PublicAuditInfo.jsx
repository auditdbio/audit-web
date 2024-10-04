import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom/dist';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import {
  Box,
  Button,
  Typography,
  Tooltip,
  useMediaQuery,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import theme from '../styles/themes.js';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import {
  addReportAudit,
  clearMessage,
  downloadReport,
  getAudit,
  getPublicReport,
  startAudit,
} from '../redux/actions/auditAction.js';
import AuditUpload from '../components/forms/audit-upload/index.jsx';
import Loader from '../components/Loader.jsx';
import {
  AUDITOR,
  CLEAR_AUDIT,
  CUSTOMER,
  RESOLVED,
  SUBMITED,
  WAITING_FOR_AUDITS,
} from '../redux/actions/types.js';
import Markdown from '../components/markdown/Markdown.jsx';
import { addTestsLabel, isAuth, reportBuilder } from '../lib/helper.js';
import CustomLink from '../components/custom/CustomLink.jsx';
import IssueDetailsForm from '../components/issuesPage/IssueDetailsForm/IssueDetailsForm.jsx';
import IssuesList from '../components/issuesPage/IssuesList.jsx';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { getIssues } from '../redux/actions/issueAction.js';
import NotFound from './Not-Found.jsx';
import { FIXED, NOT_FIXED } from '../components/issuesPage/constants.js';
import { setCurrentChat } from '../redux/actions/chatActions.js';
import ChatIcon from '../components/icons/ChatIcon.jsx';
import Headings from '../router/Headings.jsx';
import MarkdownEditor from '../components/markdown/Markdown-editor.jsx';
import EditIcon from '@mui/icons-material/Edit.js';
import { BASE_URL } from '../services/urls.js';
import ResolveAuditConfirmation from '../components/issuesPage/ResolveAuditConfirmation.jsx';
import PriceCalculation from '../components/PriceCalculation.jsx';

const PublicAuditInfo = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const [resolveConfirmation, setResolveConfirmation] = useState(false);
  const [allIssuesClosed, setAllIssuesClosed] = useState(false);
  const role = useSelector(s => s.user?.user?.current_role);
  const { successMessage, error } = useSelector(s => s.issues);
  const { issues, issuesAuditId } = useSelector(s => s.issues);
  const { successMessage: auditSuccessMessage, error: auditError } =
    useSelector(s => s.audits);
  const audit = useSelector(s =>
    s.audits.publicAudits.find(el => el.id === auditId),
  );
  const { user } = useSelector(s => s.user);
  const { chatList } = useSelector(s => s.chat);
  const notFound = useSelector(s => s.notFound.error);
  const { auditor } = useSelector(s => s.auditor);
  const { customer } = useSelector(s => s.customer);

  const [auditDBWorkflow, setAuditDBWorkflow] = useState(true);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [editConclusion, setEditConclusion] = useState(false);
  const [mdRef, setMdRef] = useState(null);

  const descriptionRef = useRef();

  // useEffect(() => {
  //   dispatch(getAudit(auditId));
  //   return () => {
  //     dispatch({ type: CLEAR_AUDIT });
  //   };
  // }, [auditId]);

  useEffect(() => {
    setTimeout(() => {
      if (descriptionRef?.current?.offsetHeight > 400) {
        setShowReadMoreButton(true);
      }
    }, 500);
  }, [descriptionRef.current]);

  // useEffect(() => {
  //   if (issuesAuditId !== auditId) {
  //     dispatch(getIssues(auditId));
  //   }
  // }, []);

  useEffect(() => {
    if (
      audit?.status?.toLowerCase() === RESOLVED.toLowerCase() &&
      !issues?.length
    ) {
      setAuditDBWorkflow(false);
    }
  }, [audit, issues]);

  const handleSendMessage = () => {
    window.scrollTo(0, 0);

    const existingChat = chatList.find(chat =>
      chat.members?.find(
        member =>
          member.id === audit?.customer_id &&
          member.role?.toLowerCase() === CUSTOMER,
      ),
    );
    const chatId = existingChat ? existingChat.id : audit?.customer_id;
    const members = [audit?.customer_id, user.id];

    dispatch(
      setCurrentChat(chatId, {
        role: CUSTOMER,
        isNew: !existingChat,
        userDataId: audit?.customer_id,
        members,
      }),
    );
    localStorage.setItem('path', window.location.pathname);
    navigate(`/chat/${audit?.customer_id}`);
  };

  const handleConclusion = handleSubmit => {
    if (editConclusion) {
      mdRef?.current?.setView({ menu: false, md: false, html: true });
      handleSubmit();
      setTimeout(() => setEditConclusion(prev => !prev), 500);
    } else {
      mdRef?.current?.setView({ menu: true, md: true, html: !matchXs });
      setEditConclusion(prev => !prev);
    }
  };

  useEffect(() => {
    const allClosed = issues?.every(
      issue =>
        issue.status === FIXED || issue.status === NOT_FIXED || !issue.include,
    );
    setAllIssuesClosed(allClosed);
  }, [issues]);

  const handleGenerateReport = () => {
    // if (isPublic) {
    //   if (report?.auditor_name && report?.project_name && report?.description) {
    //     if (isAuth()) {
    //       if (user.current_role === AUDITOR) {
    //         const linkId = auditor.link_id || auditor.user_id;
    //         report.profile_link = linkId
    //           ? `${BASE_URL}a/${linkId}`
    //           : `${BASE_URL}disclaimer/`;
    //       } else if (user.current_role === CUSTOMER) {
    //         const linkId = customer.link_id || customer.user_id;
    //         report.profile_link = linkId
    //           ? `${BASE_URL}c/${linkId}`
    //           : `${BASE_URL}disclaimer/`;
    //       }
    //     }
    //     const newData = reportBuilder(report, issuesArray);
    //     dispatch(getPublicReport(newData, { generate: true }));
    //   } else {
    //     handleSubmit();
    //     setOpenMessage(true);
    //   }
    //
    //   setMenuAnchorEl(null);
    // } else {
    dispatch(downloadReport(audit, { generate: true }));
    // setMenuAnchorEl(null);
    // }
  };

  if (!audit?.id && !notFound) {
    return (
      <Layout>
        <Headings title="Audit" />
        <CustomCard
          sx={[wrapper, { height: '100%', justifyContent: 'center' }]}
        >
          <Loader />
        </CustomCard>
      </Layout>
    );
  }

  if (audit && !notFound) {
    return (
      <Layout
        sx={{ padding: '40px' }}
        containerSx={{
          maxWidth: 'unset!important',
          padding: '0 35px!important',
        }}
      >
        <Headings title={`${audit?.project_name} | Audit`} />
        <ResolveAuditConfirmation
          isOpen={resolveConfirmation}
          setIsOpen={setResolveConfirmation}
          audit={audit}
        />
        <CustomCard sx={wrapper}>
          <Box sx={{ width: '100%' }}>
            <CustomSnackbar
              autoHideDuration={5000}
              severity={error || auditError ? 'error' : 'success'}
              onClose={() => dispatch(clearMessage())}
              text={
                error || successMessage || auditSuccessMessage || auditError
              }
              open={
                !!error ||
                !!successMessage ||
                !!auditSuccessMessage ||
                !!auditError
              }
            />

            <Box
              sx={{
                display: 'flex',
                width: '100%',
                position: 'relative',
              }}
            >
              <Button
                sx={backButtonSx}
                onClick={() => navigate('/profile/audits')}
                {...addTestsLabel('go-back-button')}
              >
                <ArrowBackIcon color="secondary" />
              </Button>
              <Typography
                variant="h3"
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                }}
              >
                {audit?.project_name}
              </Typography>
            </Box>

            <Box sx={{ width: '100%' }}>
              <Box sx={contentWrapper}>
                <Typography sx={titleSx}>
                  {audit?.tags?.map(el => el).join(', ') ?? ''}
                </Typography>
                <Box sx={salaryWrapper}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 27 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.6131 0.249512C11.1111 0.249512 8.66532 0.991432 6.58501 2.38145C4.5047 3.77147 2.8833 5.74716 1.92583 8.05868C0.968372 10.3702 0.717856 12.9137 1.20597 15.3676C1.69408 17.8215 2.89889 20.0756 4.66805 21.8447C6.43721 23.6139 8.69125 24.8187 11.1451 25.3068C13.599 25.7949 16.1426 25.5444 18.4541 24.5869C20.7656 23.6295 22.7413 22.0081 24.1313 19.9278C25.5213 17.8474 26.2633 15.4017 26.2633 12.8997C26.2568 9.54663 24.922 6.33274 22.551 3.96177C20.18 1.59079 16.9661 0.255941 13.6131 0.249512ZM15.0727 18.7382H14.5862V19.7113C14.5862 19.9694 14.4836 20.2169 14.3012 20.3994C14.1187 20.5819 13.8712 20.6844 13.6131 20.6844C13.355 20.6844 13.1075 20.5819 12.925 20.3994C12.7425 20.2169 12.64 19.9694 12.64 19.7113V18.7382H10.6938C10.4357 18.7382 10.1882 18.6357 10.0057 18.4532C9.82324 18.2707 9.72071 18.0232 9.72071 17.7651C9.72071 17.5071 9.82324 17.2596 10.0057 17.0771C10.1882 16.8946 10.4357 16.7921 10.6938 16.7921H15.0727C15.4598 16.7921 15.8311 16.6383 16.1048 16.3645C16.3786 16.0908 16.5323 15.7195 16.5323 15.3324C16.5323 14.9453 16.3786 14.574 16.1048 14.3003C15.8311 14.0266 15.4598 13.8728 15.0727 13.8728H12.1534C11.2502 13.8728 10.3839 13.514 9.74516 12.8752C9.10645 12.2365 8.74762 11.3702 8.74762 10.467C8.74762 9.56369 9.10645 8.6974 9.74516 8.05869C10.3839 7.41997 11.2502 7.06115 12.1534 7.06115H12.64V6.08806C12.64 5.82998 12.7425 5.58247 12.925 5.39998C13.1075 5.21749 13.355 5.11497 13.6131 5.11497C13.8712 5.11497 14.1187 5.21749 14.3012 5.39998C14.4836 5.58247 14.5862 5.82998 14.5862 6.08806V7.06115H16.5323C16.7904 7.06115 17.0379 7.16367 17.2204 7.34616C17.4029 7.52865 17.5054 7.77616 17.5054 8.03424C17.5054 8.29232 17.4029 8.53983 17.2204 8.72232C17.0379 8.90481 16.7904 9.00733 16.5323 9.00733H12.1534C11.7663 9.00733 11.3951 9.16111 11.1213 9.43485C10.8476 9.70858 10.6938 10.0798 10.6938 10.467C10.6938 10.8541 10.8476 11.2253 11.1213 11.4991C11.3951 11.7728 11.7663 11.9266 12.1534 11.9266H15.0727C15.976 11.9266 16.8423 12.2854 17.481 12.9241C18.1197 13.5629 18.4785 14.4291 18.4785 15.3324C18.4785 16.2357 18.1197 17.102 17.481 17.7407C16.8423 18.3794 15.976 18.7382 15.0727 18.7382Z"
                        fill="#FF9900"
                      />
                    </svg>
                    {audit?.price}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.2559 25.5499C20.2424 25.5499 25.9061 19.8862 25.9061 12.8997C25.9061 5.91319 20.2424 0.249512 13.2559 0.249512C6.26939 0.249512 0.605713 5.91319 0.605713 12.8997C0.605713 19.8862 6.26939 25.5499 13.2559 25.5499Z"
                        fill="#52176D"
                      />
                      <path
                        d="M13.257 4.64941L15.4702 9.71865L20.4071 10.5528L16.8321 14.4671L17.6833 20.0496L13.257 17.4188L8.83078 20.0496L9.68199 14.4671L6.10693 10.5528L11.0439 9.71865L13.257 4.64941Z"
                        fill="#FFCA28"
                      />
                    </svg>
                    150
                  </Box>
                </Box>
              </Box>

              <Box sx={[{ display: 'flex', gap: '25px' }, contactWrapper]}>
                {audit?.customer_contacts?.email && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <EmailIcon />
                    <Box sx={{ display: 'grid' }}>
                      <Tooltip
                        title={audit?.customer_contacts?.email}
                        arrow
                        placement="top"
                      >
                        <Typography variant="caption" noWrap={true}>
                          {audit?.customer_contacts?.email}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>
                )}
                {audit?.customer_contacts?.telegram && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <TelegramIcon />
                    <Box sx={{ display: 'grid' }}>
                      <Tooltip
                        title={audit?.customer_contacts?.telegram}
                        arrow
                        placement="top"
                      >
                        <Typography variant="caption" noWrap={true}>
                          {audit?.customer_contacts?.telegram}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>
                )}
              </Box>

              <Box sx={infoWrapper}>
                <Box sx={descriptionSx(showFull)}>
                  <Box ref={descriptionRef}>
                    <Markdown value={audit?.description} />
                  </Box>
                </Box>
                {showReadMoreButton && (
                  <Button
                    onClick={() => setShowFull(!showFull)}
                    sx={readAllButton}
                  >
                    {showFull ? 'Hide ▲' : `Read all ▼`}
                  </Button>
                )}

                <Box sx={linkWrapper}>
                  {audit?.scope?.map((el, idx) => (
                    <CustomLink link={el} key={idx} />
                  ))}
                </Box>

                {/*<PriceCalculation*/}
                {/*  price={audit?.price}*/}
                {/*  sx={priceCalc}*/}
                {/*  color="secondary"*/}
                {/*  scope={audit?.scope}*/}
                {/*/>*/}

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="text"
                    color="secondary"
                    sx={[buttonSx, sendMessageButton]}
                    onClick={handleSendMessage}
                    disabled={audit?.customer_id === user.id}
                    {...addTestsLabel('message-button')}
                  >
                    <ChatIcon />
                  </Button>
                </Box>

                {/*<Formik*/}
                {/*  initialValues={{*/}
                {/*    id: audit?.id,*/}
                {/*    status: 'done',*/}
                {/*    report: audit?.report || '',*/}
                {/*    report_name: audit?.report_name || '',*/}
                {/*  }}*/}
                {/*  validationSchema={SubmitValidation}*/}
                {/*  onSubmit={values => {*/}
                {/*    dispatch(addReportAudit(values));*/}
                {/*  }}*/}
                {/*>*/}
                {/*  {({ handleSubmit, setFieldValue }) => {*/}
                {/*    return (*/}
                {/*      <Form onSubmit={handleSubmit} style={{ width: '100%' }}>*/}
                {/*        {audit?.status?.toLowerCase() ===*/}
                {/*        WAITING_FOR_AUDITS.toLowerCase() ? (*/}
                {/*          <Box sx={buttonWrapper}>*/}
                {/*            <Button*/}
                {/*              sx={[buttonSx, { marginX: 0 }]}*/}
                {/*              variant="contained"*/}
                {/*              color="secondary"*/}
                {/*              type="button"*/}
                {/*              onClick={() => dispatch(startAudit(audit, true))}*/}
                {/*            >*/}
                {/*              Start audit*/}
                {/*            </Button>*/}
                {/*          </Box>*/}
                {/*        ) : (*/}
                {/*          <Box sx={workflowToggleBox}>*/}
                {/*            <Button*/}
                {/*              onClick={() => setAuditDBWorkflow(true)}*/}
                {/*              sx={workflowButton(auditDBWorkflow)}*/}
                {/*              type="button"*/}
                {/*              disabled={*/}
                {/*                audit?.status?.toLowerCase() ===*/}
                {/*                  RESOLVED.toLowerCase() && !issues?.length*/}
                {/*              }*/}
                {/*            >*/}
                {/*              {issues?.length*/}
                {/*                ? `Issues (${issues.length})`*/}
                {/*                : 'New issue'}*/}
                {/*            </Button>*/}
                {/*            <Button*/}
                {/*              onClick={() => setAuditDBWorkflow(false)}*/}
                {/*              type="button"*/}
                {/*              disabled={*/}
                {/*                !issues?.every(*/}
                {/*                  issue =>*/}
                {/*                    issue.status === FIXED ||*/}
                {/*                    issue.status === NOT_FIXED ||*/}
                {/*                    !issue.include,*/}
                {/*                )*/}
                {/*              }*/}
                {/*              sx={workflowButton(!auditDBWorkflow)}*/}
                {/*            >*/}
                {/*              Upload audit*/}
                {/*            </Button>*/}
                {/*          </Box>*/}
                {/*        )}*/}
                {/*      </Form>*/}
                {/*    );*/}
                {/*  }}*/}
                {/*</Formik>*/}
                <IssuesList auditId={auditId} />
              </Box>
            </Box>
          </Box>
        </CustomCard>
      </Layout>
    );
  }

  if (notFound && !audit?.id) {
    return <NotFound role={role} />;
  }
};

export default PublicAuditInfo;

const auditActionWrapperSx = {
  [theme.breakpoints.down(630)]: {
    flexDirection: 'column',
    gap: '15px',
    '& button': {
      width: '100%',
      margin: 0,
    },
  },
};

const wrapper = theme => ({
  padding: '30px 60px 60px',
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
    padding: '30px 44px 0',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '30px 20px 0',
    '& h3': {
      fontSize: '20px',
    },
  },
});

const contactWrapper = theme => ({
  maxWidth: '500px',
  margin: '15px auto 0',
  justifyContent: 'center',
  '& span': {
    fontSize: '16px',
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    width: 'unset',
    alignItems: 'center',
    gap: '10px',
  },
});

const descriptionSx = full => ({
  maxHeight: full ? 'unset' : '400px',
  overflow: 'hidden',
  border: '2px solid #E5E5E5',
});

const subTitleSx = {
  fontSize: '16px!important',
  fontWeight: 500,
};

const contentWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  '& span': {
    fontSize: '18px',
    fontWeight: 500,
  },
};

const fileWrapper = theme => ({
  margin: '22px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '30px',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '10px',
  },
});

const titleSx = theme => ({
  fontWeight: 500,
  [theme.breakpoints.down('md')]: {
    fontSize: '16px',
  },
});

const salaryWrapper = {
  display: 'flex',
  gap: '50px',
  fontSize: '16px',
  fontWeight: 500,
};

const infoWrapper = theme => ({
  marginTop: '30px',
  '& h4': {
    fontWeight: 600,
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    '& span': {
      fontSize: '15px',
      fontWeight: 500,
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& h4': {
      textAlign: 'start',
    },
  },
});

const readAllButton = theme => ({
  width: '100%',
  padding: '8px',
  fontWeight: 600,
  fontSize: '16px',
  color: 'black',
  textTransform: 'none',
  lineHeight: '25px',
  background: '#E5E5E5',
  borderRadius: 0,
  boxShadow: '0px -24px 14px -8px rgba(252, 250, 246, 1)',
  ':hover': { background: '#D5D5D5' },
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
    border: 'none',
  },
});

const linkWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  columnGap: '80px',
  mt: '50px',
  mb: '30px',
  '& button': {
    padding: 1,
    minWidth: 'unset',
  },
  '& p': {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '14px',
  },
  [theme.breakpoints.down('sm')]: {
    columnGap: '40px',
    marginTop: '25px',
    gap: '10px',
  },
});

const backButtonSx = theme => ({
  position: 'absolute',
  left: '-58px',
  top: '-20px',
  [theme.breakpoints.down('sm')]: {
    top: '-30px',
    left: '-20px',
  },
});

const buttonWrapper = {
  display: 'flex',
  justifyContent: 'center',
  maxWidth: '400px',
  margin: '0 auto',
  paddingBottom: '25px',
};

const buttonSx = theme => ({
  padding: '8.5px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  mr: '15px',
  width: '270px',
  borderRadius: '10px',
  [theme.breakpoints.down('sm')]: {
    width: '240px',
  },
  [theme.breakpoints.down(920)]: {
    width: '160px',
  },
  [theme.breakpoints.down('xs')]: {
    // margin: '0 6px',
    padding: '12px 0',
    fontSize: '14px',
  },
});

const sendMessageButton = theme => ({
  mb: '20px',
  [theme.breakpoints.down('xs')]: {
    mb: '15px',
  },
});

const workflowToggleBox = theme => ({
  maxWidth: '410px',
  margin: '0 auto 25px',
  padding: '3px 1px',
  display: 'flex',
  justifyContent: 'center',
  border: '1px solid #B2B3B3',
  borderRadius: '30px',
  [theme.breakpoints.down('xs')]: {
    width: '248px',
    margin: '0 auto 20px',
  },
});

const workflowButton = useWorkflow => ({
  fontWeight: 600,
  fontSize: '16px',
  color: useWorkflow ? 'white' : 'black',
  textTransform: 'none',
  padding: '10px 0',
  width: '200px',
  borderRadius: '30px',
  background: useWorkflow ? theme.palette.secondary.main : 'none',
  ':hover': { background: useWorkflow ? theme.palette.secondary.main : 'none' },
  '& span': {
    display: 'none',
  },
  [theme.breakpoints.down('xs')]: {
    width: '120px',
    padding: '10px 0',
    fontSize: '14px',
  },
});

const conclusionTitle = theme => ({
  mb: '10px',
  fontSize: '20px',
  fontWeight: 500,
  textAlign: 'center',
});

const editButton = {
  position: 'absolute',
  bottom: '10px',
  right: '20px',
};

const editButtonText = theme => ({
  ml: '6px',
  color: theme.palette.secondary.main,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '17px',
});

const priceCalc = {
  width: '100%',
  mb: '30px',
  '& .head': { justifyContent: 'center' },
};