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
  getAudit,
  getAuditFeedback,
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
import { addTestsLabel, getAverageFeedbackRating } from '../lib/helper.js';
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
import ResolveAuditConfirmation from '../components/issuesPage/ResolveAuditConfirmation.jsx';
import Star from '../components/icons/Star.jsx';
import AuditFeedbackModal from '../components/modal/AuditFeedbackModal.jsx';
import EditPrice from '../components/EditDescription/EditPrice.jsx';

const AuditOffer = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const descriptionRef = useRef();

  const [resolveConfirmation, setResolveConfirmation] = useState(false);
  const [allIssuesClosed, setAllIssuesClosed] = useState(false);
  const [auditDBWorkflow, setAuditDBWorkflow] = useState(true);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showFullHeader, setShowFullHeader] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [editConclusion, setEditConclusion] = useState(false);
  const [mdRef, setMdRef] = useState(null);

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

  useEffect(() => {
    if (
      audit &&
      !audit.no_customer &&
      audit.status.toLowerCase() === RESOLVED.toLowerCase()
    ) {
      dispatch(getAuditFeedback(AUDITOR, audit.auditor_id, audit.id));
    }
  }, [audit?.id]);

  useEffect(() => {
    dispatch(getAudit(auditId));
    return () => {
      dispatch({ type: CLEAR_AUDIT });
    };
  }, [auditId]);

  useEffect(() => {
    setTimeout(() => {
      if (
        descriptionRef?.current?.children[0]?.children[0]?.offsetHeight > 150
      ) {
        setShowReadMoreButton(true);
      }
    }, 500);
  }, [descriptionRef?.current]);

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
        issue.status === FIXED ||
        issue.status === NOT_FIXED ||
        issue.status === 'WillNotFix' ||
        !issue.include,
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
        sx={{ padding: '10px!important' }}
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
                  mt: '15px',
                }}
              >
                {audit?.project_name}
              </Typography>
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

            <Box sx={{ width: '100%' }}>
              <Collapse sx={{ mt: '15px' }} in={showFullHeader}>
                <Box sx={contentWrapper}>
                  <Box sx={headInfoSx}>
                    <EditTags audit={audit} confirmed={true} />
                    <EditPrice audit={audit} user={user} role={role} />
                    <Box
                      sx={[
                        { display: 'flex', gap: '10px' },
                        contactWrapper,
                        { marginTop: 'unset', flexDirection: 'row!important' },
                      ]}
                    >
                      {audit?.customer_contacts?.email && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <EmailIcon sx={{ height: '32px' }} />
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
                          <TelegramIcon sx={{ height: '32px' }} />
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
                  </Box>
                  {audit?.feedback?.rating && (
                    <Tooltip
                      title="Feedback from the customer"
                      arrow
                      placement="top"
                    >
                      <Button
                        type="button"
                        onClick={() => setShowFeedback(p => !p)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          color: 'black',
                        }}
                      >
                        <Star size={20} />
                        {getAverageFeedbackRating(audit?.feedback?.rating)}
                      </Button>
                    </Tooltip>
                  )}
                  <Divider sx={{ width: '100%' }} />
                </Box>
              </Collapse>
              <Button
                sx={readAllButton}
                onClick={() => setShowFullHeader(!showFullHeader)}
              >
                {!showFullHeader ? 'Show ▼' : 'Hide ▲'}
                {'  '}
                <span style={{ marginLeft: '10px' }}>
                  {!showFullHeader &&
                    (audit?.price
                      ? `$${audit?.price} per line`
                      : `${audit?.total} total cost`)}
                </span>
              </Button>
              <Box sx={infoWrapper} className={'qwe'}>
                {/*<Box sx={descriptionSx(showFull)}>*/}
                {/*  <Box ref={descriptionRef}>*/}
                {/*    <Markdown value={audit?.description} />*/}
                {/*  </Box>*/}
                {/*</Box>*/}
                <Collapse in={true} collapsedSize={showFull ? undefined : 150}>
                  <Box
                    sx={descriptionWrapper(theme, showFull)}
                    ref={descriptionRef}
                  >
                    <EditDescription audit={audit} />
                  </Box>
                </Collapse>
                {showReadMoreButton && (
                  <Button
                    onClick={() => setShowFull(!showFull)}
                    sx={readAllButton}
                  >
                    {showFull ? 'Hide ▲' : `Read all ▼`}
                  </Button>
                )}

                {/*<Box sx={linkWrapper}>*/}
                {/*  {audit?.scope?.map((el, idx) => (*/}
                {/*    <CustomLink link={el} key={idx} />*/}
                {/*  ))}*/}
                {/*</Box>*/}

                {/*<Box sx={{ display: 'flex', justifyContent: 'center' }}>*/}
                {/*  */}
                {/*</Box>*/}
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
                    <Form onSubmit={handleSubmit}>
                      {/*{matchMd &&*/}
                      {/*  audit?.status?.toLowerCase() !==*/}
                      {/*    RESOLVED.toLowerCase() && (*/}
                      {/*    <>*/}
                      {/*      <Typography variant={'h3'} sx={{ mb: '10px' }}>*/}
                      {/*        Audit actions*/}
                      {/*      </Typography>*/}
                      {/*      <Divider sx={{ mb: '25px' }} />*/}
                      {/*    </>*/}
                      {/*  )}*/}
                      {audit?.status?.toLowerCase() !==
                        RESOLVED.toLowerCase() && (
                        <Box
                          sx={[
                            buttonWrapper,
                            {
                              width: '100%',
                              maxWidth: 'unset',
                              paddingBottom: 'unset',
                            },
                            auditActionWrapperSx,
                          ]}
                        >
                          {!audit?.conclusion && (
                            <Button
                              sx={[
                                buttonSx,
                                {
                                  marginX: '0!important',
                                  marginTop: '20px',
                                },
                              ]}
                              type="button"
                              variant="contained"
                              color="secondary"
                              disabled={
                                audit?.status?.toLowerCase() ===
                                WAITING_FOR_AUDITS.toLowerCase()
                              }
                              onClick={() => handleConclusion(handleSubmit)}
                            >
                              {editConclusion
                                ? 'Save conclusion'
                                : 'Add conclusion'}
                            </Button>
                          )}
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
                <Box sx={bottomActionSx}>
                  <DescriptionHistory
                    buttonStyle={buttonSx}
                    audit={audit}
                    spaceY={false}
                    wrapperStyle={historyWrapperSx}
                  />
                  {/*<Box sx={auditActionSx}>*/}
                  {audit?.status?.toLowerCase() ===
                  WAITING_FOR_AUDITS.toLowerCase() ? (
                    <Box>
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
                    <Box sx={uploadSx}>
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
                    </Box>
                  )}
                  <Box sx={bottomActionInnerWrapper}>
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
                            {
                              marginRight: '0!important',
                              ml: '15px',
                            },
                          ]}
                          {...addTestsLabel('resolve-button')}
                        >
                          Resolve audit
                        </Button>
                      </span>
                    </Tooltip>
                  </Box>
                  {/*</Box>*/}
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
                      <Form onSubmit={handleSubmit}>
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

        <AuditFeedbackModal
          feedback={audit?.feedback}
          isOpen={showFeedback}
          handleClose={() => setShowFeedback(false)}
          readOnly
        />
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

const descriptionWrapper = (theme, showFull) => ({
  maxHeight: showFull ? 'none' : 150,
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
});

const bottomActionInnerWrapper = {
  [theme.breakpoints.down(630)]: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '15px',
  },
};

const headInfoSx = theme => ({
  display: 'flex',
  alignItems: 'flex-start',
  mt: '15px',
  gap: '15px',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

const historyWrapperSx = theme => ({
  width: '396px',
  [theme.breakpoints.down(1400)]: {
    width: '335px',
  },
  [theme.breakpoints.down(1124)]: {
    width: 'unset',
    '& .btn-history,': {
      width: '270px!important',
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .btn-history,': {
      width: '240px!important',
    },
  },
  [theme.breakpoints.down(920)]: {
    '& .btn-history,': {
      width: '160px!important',
    },
  },
  [theme.breakpoints.down(630)]: {
    width: '100%',
    '& .btn-history,': {
      width: '100%!important',
    },
    '& .MuiBadge-root': {
      width: '100%!important',
    },
  },
});

const bottomActionSx = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '25px',
  marginTop: '20px',
  [theme.breakpoints.down(1124)]: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '15px',
  },
  [theme.breakpoints.down(630)]: {
    flexDirection: 'column',
  },
});

const auditActionSx = theme => ({
  display: 'flex',
  alignItems: 'center',
  mt: '10px',
  justifyContent: 'flex-end',
  gap: '25px',
  [theme.breakpoints.down(950)]: {
    flexWrap: 'wrap',
  },
});

const uploadSx = theme => ({
  [theme.breakpoints.down(1124)]: {
    order: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
});
//
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
  padding: '25px 30px 60px',
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
    padding: '20px 24px 20px',
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '30px 20px 20px',
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
  '& .tags-wrapper': {
    marginTop: 'unset',
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
  left: '-38px',
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
  width: '190px',
  borderRadius: '10px',
  [theme.breakpoints.down(1400)]: {
    width: '160px',
  },
  [theme.breakpoints.down(1124)]: {
    height: '42px!important',
    width: '270px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '42px!important',
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
  [theme.breakpoints.down(630)]: {
    margin: 'unset',
    width: '100%',
  },
});

const sendMessageButton = theme => ({
  width: 'unset!important',
  position: 'absolute',
  top: '-15px',
  right: '-15px',
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

const workflowToggleBox = theme => ({
  padding: '3px 1px',
  display: 'flex',
  justifyContent: 'center',
  border: '1px solid #B2B3B3',
  borderRadius: '30px',
  height: '55px',
  [theme.breakpoints.down(900)]: {
    width: '248px',
    // margin: '0 auto 20px',
  },
  [theme.breakpoints.down('xs')]: {
    // width: '248px',
    // margin: '0 auto 20px',
  },
});

const workflowButton = useWorkflow => ({
  fontWeight: 600,
  fontSize: '16px',
  color: useWorkflow ? 'white' : 'black',
  textTransform: 'none',
  padding: '10px 0',
  width: '160px',
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
  mt: '20px',
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
