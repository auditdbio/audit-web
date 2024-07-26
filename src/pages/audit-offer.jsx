import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom/dist';
import { FastField, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
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
  InputAdornment,
  Slider,
  Switch,
} from '@mui/material';
import theme from '../styles/themes.js';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import {
  addReportAudit,
  clearMessage,
  downloadReport,
  editAuditCustomer,
  // editAudit,
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
import DescriptionHistory from '../components/DescriptionHistory/index.jsx';
import EditDescription from '../components/EditDescription/index.jsx';
import EditIcon from '@mui/icons-material/Edit';
import EditButton from '../components/EditDescription/EditButton.jsx';
import TagsField from '../components/forms/tags-field/tags-field.jsx';
import CloseIcon from '@mui/icons-material/Close.js';
import SaveIcon from '@mui/icons-material/Save.js';
import EditTags from '../components/EditDescription/EditTags.jsx';
import MarkdownEditor from '../components/markdown/Markdown-editor.jsx';
import { BASE_URL } from '../services/urls.js';
import ResolveAuditConfirmation from '../components/issuesPage/ResolveAuditConfirmation.jsx';
import PriceCalculation from '../components/PriceCalculation.jsx';
import EditPrice from '../components/EditDescription/EditPrice.jsx';

const AuditOffer = () => {
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
  const {
    audit,
    successMessage: auditSuccessMessage,
    error: auditError,
  } = useSelector(s => s.audits);
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

  useEffect(() => {
    dispatch(getAudit(auditId));
    return () => {
      dispatch({ type: CLEAR_AUDIT });
    };
  }, [auditId]);

  useEffect(() => {
    setTimeout(() => {
      if (descriptionRef?.current?.offsetHeight > 400) {
        setShowReadMoreButton(true);
      }
    }, 500);
  }, [descriptionRef.current]);

  useEffect(() => {
    if (issuesAuditId !== auditId) {
      dispatch(getIssues(auditId));
    }
  }, []);

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
                <EditTags audit={audit} confirmed={true} />
                <Divider sx={{ width: '100%' }} />
                <EditPrice audit={audit} user={user} role={role} />
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
                {/*<Box sx={descriptionSx(showFull)}>*/}
                {/*  <Box ref={descriptionRef}>*/}
                {/*    <Markdown value={audit?.description} />*/}
                {/*  </Box>*/}
                {/*</Box>*/}
                <EditDescription audit={audit} />
                <DescriptionHistory audit={audit} />
                {/*{showReadMoreButton && (*/}
                {/*  <Button*/}
                {/*    onClick={() => setShowFull(!showFull)}*/}
                {/*    sx={readAllButton}*/}
                {/*  >*/}
                {/*    {showFull ? 'Hide ▲' : `Read all ▼`}*/}
                {/*  </Button>*/}
                {/*)}*/}

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

                <Formik
                  initialValues={{
                    id: audit?.id,
                    status: 'done',
                    report: audit?.report || '',
                    report_name: audit?.report_name || '',
                  }}
                  validationSchema={SubmitValidation}
                  onSubmit={values => {
                    dispatch(addReportAudit(values));
                  }}
                >
                  {({ handleSubmit, setFieldValue }) => {
                    return (
                      <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        {audit?.status?.toLowerCase() ===
                        WAITING_FOR_AUDITS.toLowerCase() ? (
                          <Box sx={buttonWrapper}>
                            <Button
                              sx={[buttonSx, { marginX: 0 }]}
                              variant="contained"
                              color="secondary"
                              type="button"
                              onClick={() => dispatch(startAudit(audit, true))}
                            >
                              Start audit
                            </Button>
                          </Box>
                        ) : (
                          <Box sx={workflowToggleBox}>
                            <Button
                              onClick={() => setAuditDBWorkflow(true)}
                              sx={workflowButton(auditDBWorkflow)}
                              type="button"
                              disabled={
                                audit?.status?.toLowerCase() ===
                                  RESOLVED.toLowerCase() && !issues?.length
                              }
                            >
                              {issues?.length
                                ? `Issues (${issues.length})`
                                : 'New issue'}
                            </Button>
                            <Button
                              onClick={() => setAuditDBWorkflow(false)}
                              type="button"
                              disabled={
                                !issues?.every(
                                  issue =>
                                    issue.status === FIXED ||
                                    issue.status === NOT_FIXED ||
                                    !issue.include,
                                )
                              }
                              sx={workflowButton(!auditDBWorkflow)}
                            >
                              Upload audit
                            </Button>
                          </Box>
                        )}

                        {!auditDBWorkflow &&
                          audit?.status.toLowerCase() !==
                            WAITING_FOR_AUDITS.toLowerCase() && (
                            <Box sx={fileWrapper}>
                              <Typography sx={subTitleSx}>
                                Upload audit
                              </Typography>
                              <Box sx={{ display: 'flex' }}>
                                <AuditUpload
                                  disabled={audit?.status === SUBMITED}
                                  auditId={audit?.id}
                                  auditorId={audit?.auditor_id}
                                  auditReportName={audit?.report_name}
                                  customerId={audit?.customer_id}
                                  name="report"
                                  setFieldValue={setFieldValue}
                                />
                              </Box>
                            </Box>
                          )}

                        {!auditDBWorkflow && (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              mb: '30px',
                            }}
                          >
                            <Button
                              variant="contained"
                              type="submit"
                              color="secondary"
                              sx={[buttonSx, { mb: '15px' }]}
                              {...addTestsLabel('send-button')}
                            >
                              Send to customer
                            </Button>
                          </Box>
                        )}
                      </Form>
                    );
                  }}
                </Formik>
              </Box>
            </Box>
          </Box>

          <Formik
            initialValues={{
              id: audit?.id,
              conclusion: audit?.conclusion || '',
            }}
            onSubmit={values => {
              dispatch(editAuditCustomer(values));
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                {matchMd &&
                  audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() && (
                    <>
                      <Typography variant={'h3'} sx={{ mb: '10px' }}>
                        Audit actions
                      </Typography>
                      <Divider sx={{ mb: '25px' }} />
                    </>
                  )}
                {audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() && (
                  <Box
                    sx={[
                      buttonWrapper,
                      { width: '100%', maxWidth: 'unset' },
                      auditActionWrapperSx,
                    ]}
                  >
                    {!audit?.conclusion && (
                      <Button
                        sx={[buttonSx, { marginLeft: '0!important' }]}
                        type="button"
                        variant="contained"
                        color="secondary"
                        disabled={
                          audit?.status?.toLowerCase() ===
                          WAITING_FOR_AUDITS.toLowerCase()
                        }
                        onClick={() => handleConclusion(handleSubmit)}
                      >
                        {editConclusion ? 'Save conclusion' : 'Add conclusion'}
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={[
                        buttonSx,
                        {
                          marginRight: '0!important',
                          marginLeft: '0!important',
                        },
                        // publicBtnSx
                      ]}
                      disabled={
                        audit?.status?.toLowerCase() ===
                        WAITING_FOR_AUDITS.toLowerCase()
                      }
                      onClick={handleGenerateReport}
                    >
                      Generate report
                    </Button>
                    <Tooltip
                      arrow
                      placement="top"
                      title={
                        allIssuesClosed
                          ? ''
                          : "To resolve an audit, it is necessary that the status of all issues be 'Fixed' or 'Not fixed'. Or do not include some issues in the audit."
                      }
                    >
                      <span>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setResolveConfirmation(true)}
                          disabled={!allIssuesClosed || !issues?.length}
                          sx={[
                            buttonSx,
                            { marginRight: '0!important', ml: '15px' },
                          ]}
                          {...addTestsLabel('resolve-button')}
                        >
                          Resolve audit
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                )}
                <Collapse in={editConclusion || audit?.conclusion}>
                  <Box sx={{ position: 'relative' }}>
                    {audit?.conclusion && (
                      <Box sx={conclusionTitle}>Conclusion</Box>
                    )}
                    <MarkdownEditor
                      name="conclusion"
                      setMdRef={setMdRef}
                      mdProps={{
                        style: {
                          backgroundColor: '#fcfaf6',
                          height: editConclusion ? '400px' : 'auto',
                          maxHeight: '400px',
                        },
                        view: {
                          menu: !audit?.conclusion,
                          md: !audit?.conclusion,
                          html: true,
                        },
                      }}
                    />

                    {audit?.conclusion &&
                      audit?.status?.toLowerCase() !==
                        RESOLVED.toLowerCase() && (
                        <IconButton
                          type="button"
                          aria-label="Edit description"
                          onClick={() => handleConclusion(handleSubmit)}
                          sx={editButton}
                          {...addTestsLabel('edit-conclusion-button')}
                        >
                          <EditIcon color="secondary" fontSize="small" />
                          <Box component="span" sx={editButtonText}>
                            {editConclusion ? 'Save' : 'Edit'}
                          </Box>
                        </IconButton>
                      )}
                  </Box>
                </Collapse>
              </Form>
            )}
          </Formik>

          {auditDBWorkflow &&
            audit?.status?.toLowerCase() !==
              WAITING_FOR_AUDITS.toLowerCase() && (
              <Box sx={{ width: '100%', mb: '30px' }}>
                {issues?.length ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '20px',
                      [theme.breakpoints.down('xs')]: {
                        gap: '10px',
                      },
                    }}
                  >
                    <IssuesList auditId={auditId} />
                  </Box>
                ) : audit?.status?.toLowerCase() !== RESOLVED.toLowerCase() ? (
                  <IssueDetailsForm />
                ) : null}
              </Box>
            )}
        </CustomCard>
      </Layout>
    );
  }

  if (notFound && !audit?.id) {
    return <NotFound role={role} />;
  }
};

export default AuditOffer;

const SubmitValidation = Yup.object().shape({
  report: Yup.string().required('File is required'),
});

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
  gap: '20px',
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

const editButtonSx = theme => ({
  position: 'absolute',
  right: '-58px',
  top: '-20px',
  [theme.breakpoints.down('sm')]: {
    top: '-30px',
    right: '-20px',
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
