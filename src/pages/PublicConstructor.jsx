import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import theme from '../styles/themes.js';
import FieldEditor from '../components/editor/FieldEditor.jsx';
import MarkdownEditor from '../components/markdown/Markdown-editor.jsx';
import TagsField from '../components/forms/tags-field/tags-field.jsx';
import TagsArray from '../components/tagsArray/index.jsx';
import { ProjectLinksList } from '../components/custom/ProjectLinksList.jsx';
import IssuesList from '../components/issuesPage/IssuesList.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getIssues, getPublicIssues } from '../redux/actions/issueAction.js';
import * as Yup from 'yup';
import {
  addReportAudit,
  clearMessage,
  downloadReport,
  editAuditCustomer,
  getAudit,
  getPublicReport,
  handleResetPublicAudit,
  savePublicReport,
} from '../redux/actions/auditAction.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublicIssueDetailsForm from './PublicIssueDetailForm.jsx';
import { useNavigate } from 'react-router-dom/dist';
import {
  AUDITOR,
  CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR,
  CLEAR_AUDIT,
  CUSTOMER,
  RESOLVED,
  WAITING_FOR_AUDITS,
} from '../redux/actions/types.js';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import { addTestsLabel, isAuth, reportBuilder } from '../lib/helper.js';
import { changeRolePublicAuditor } from '../redux/actions/userAction.js';
import Headings from '../router/Headings.jsx';
import { AUDIT_PARENT_ENTITY } from '../services/file_constants.js';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf.js';
import AddIcon from '@mui/icons-material/Add.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit.js';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined.js';
import AddLinkIcon from '@mui/icons-material/AddLink.js';

const PublicConstructor = ({ saved, isPublic }) => {
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const report = JSON.parse(localStorage.getItem('report') || '{}');
  const publicIssues = JSON.parse(localStorage.getItem('publicIssues') || '[]');
  const auditor = useSelector(s => s.auditor.auditor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { issues, successMessage } = useSelector(state => state.issues);
  const [openMessage, setOpenMessage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const audit = useSelector(s => s.audits.audit);
  const { auditId } = useParams();
  const descriptionRef = useRef();
  const [showFull, setShowFull] = useState(false);
  const { user } = useSelector(s => s.user);
  const [editConclusion, setEditConclusion] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(true);
  const auditMessage = useSelector(s => s.audits.successMessage);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (saved) {
      dispatch(getAudit(auditId));
    }
    return () => {
      dispatch({ type: CLEAR_AUDIT });
    };
  }, []);

  useEffect(() => {
    if (!saved) {
      dispatch(getPublicIssues(publicIssues, report.auditId));
    } else {
      dispatch(getIssues(auditId));
    }
  }, []);

  const initialValues = !saved
    ? {
        id: report?.id || Date.now(),
        project_name: report?.project_name || '',
        report: report?.report || '',
        description: report?.description || '',
        conclusion: report?.conclusion || '',
        scope: report?.scope?.length ? report?.scope : [],
        tags: report?.tags?.length ? report?.tags : [],
        issues: report?.issues?.length ? report?.issues : publicIssues,
        auditor_name: user?.name ? user.name : report?.auditor_name || '',
        status: 'Started',
        last_modified: Date.now(),
      }
    : {
        id: audit?.id,
        auditor_id: audit?.auditor_id,
        project_name: audit?.project_name || '',
        report: audit?.report || '',
        description: audit?.description || '',
        conclusion: audit?.conclusion || '',
        scope: audit?.scope?.length ? audit?.scope : [],
        tags: audit?.tags?.length ? audit?.tags : [],
        issues: audit?.issues?.length ? audit?.issues : [],
        auditor_full_name:
          audit?.auditor_first_name + ' ' + audit?.auditor_last_name || '',
        status: audit?.status,
        last_modified: audit?.last_modified || Date.now(),
        ...audit,
      };

  const handleResetForm = setFieldValue => {
    setFieldValue('project_name', '');
    setFieldValue('report', '');
    setFieldValue('description', '');
    setFieldValue('conclusion', '');
    setFieldValue('scope', []);
    setFieldValue('tags', []);
    setFieldValue('issues', []);
    setFieldValue('isCreated', false);
    setFieldValue('auditor_name', '');
    setFieldValue('auditId', Date.now());
    dispatch(handleResetPublicAudit());
    localStorage.removeItem('report');
    localStorage.removeItem('publicIssues');
  };

  const handleSavePublicAudit = async (handleSubmit, report) => {
    handleSubmit();
    const filteredReport = Object.fromEntries(
      Object.entries(report).filter(([key, value]) => value != null && value),
    );
    if (report?.auditor_name && report?.project_name && report?.description) {
      if (isAuth()) {
        if (user.current_role === CUSTOMER) {
          const data = {
            ...filteredReport,
            isPublic: true,
            issues: [...issues],
          };
          await dispatch(changeRolePublicAuditor(AUDITOR, user.id, data, true));
        } else {
          const data = {
            auditor_id: auditor.user_id,
            auditor_first_name: auditor.first_name,
            auditor_last_name: auditor.last_name,
            auditor_contacts: auditor.contacts,
            avatar: auditor.avatar,
            ...filteredReport,
            isPublic: true,
            issues: [...issues],
            status: 'Started',
          };
          if (auditor?.user_id) {
            await dispatch(savePublicReport(data));
          } else {
            dispatch({
              type: CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR,
              payload: user,
            });
            navigate('/profile/user-info');
          }
        }
      } else {
        navigate('/sign-in');
      }
    } else {
      setOpenMessage(true);
    }
  };

  const handleCloseSnack = () => {
    setOpenMessage(false);
    if (auditMessage) {
      dispatch(clearMessage());
    }
  };

  const handleGenerateReport = (handleSubmit, values) => {
    if (isPublic) {
      if (values?.auditor_name && values?.project_name && values?.description) {
        handleSubmit();
        const newData = reportBuilder(values, issues);
        dispatch(getPublicReport(newData, { generate: true }));
      } else {
        setOpenMessage(true);
      }
    } else {
      dispatch(downloadReport(audit, { generate: true }));
    }
  };

  if (!audit?.id && saved) {
    return (
      <Layout>
        <Headings title="Audit Builder" />
        <CustomCard
          sx={[wrapper, { height: '100%', justifyContent: 'center' }]}
        >
          <Loader />
        </CustomCard>
      </Layout>
    );
  }

  if ((saved && audit) || (!audit && !saved)) {
    return (
      <Layout
        sx={layoutSx}
        containerSx={{
          maxWidth: 'unset!important',
          padding: '0 35px!important',
        }}
      >
        <Headings title="Audit Builder" />

        <CustomCard sx={wrapper}>
          <Button
            onClick={() =>
              !saved ? navigate('/') : navigate('/profile/audits')
            }
            sx={{ position: 'absolute', top: '10px', left: '10px' }}
          >
            <ArrowBackIcon color={'secondary'} />
          </Button>
          <Formik
            // validationSchema={SubmitValidation}
            initialValues={initialValues}
            onSubmit={values => {
              if (saved) {
                delete values.auditor_full_name;
                dispatch(addReportAudit(values, true));
              } else {
                if (values.id) {
                  localStorage.setItem('report', JSON.stringify(values));
                } else {
                  const newValues = { ...values, id: Date.now() };
                  localStorage.setItem('report', JSON.stringify(newValues));
                }
              }
            }}
          >
            {({
              handleSubmit,
              setFieldValue,
              setFieldTouched,
              errors,
              dirty,
              values,
              resetForm,
            }) => {
              useEffect(() => {
                if (!values.description) {
                  setShowFull(true);
                }
              }, []);
              return (
                <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <CustomSnackbar
                    autoHideDuration={5000}
                    open={!!successMessage}
                    severity={'success'}
                    text={successMessage}
                    onClose={() => dispatch(clearMessage())}
                  />
                  <Typography sx={titleSx} variant={'h4'}>
                    Audit builder
                  </Typography>
                  <Box sx={fieldsWrapperSx}>
                    <FieldEditor
                      handleBlur={handleSubmit}
                      name={'project_name'}
                      label={'Project name'}
                    />

                    <FieldEditor
                      handleBlur={handleSubmit}
                      name={saved ? 'auditor_full_name' : 'auditor_name'}
                      label={'Auditor name'}
                      disabled={saved || user?.name}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '35px',
                      mt: '25px',
                    }}
                  >
                    <Box>
                      <Box sx={{ width: '100%' }}>
                        <Tabs
                          value={tab}
                          onChange={(e, newValue) => {
                            setShowFull(false);
                            setTab(newValue);
                            if (editConclusion) {
                              setEditConclusion(false);
                            }
                          }}
                          textColor={'primary'}
                          indicatorColor="primary"
                          aria-label="secondary tabs example"
                          sx={tabsSx}
                        >
                          {/*{tab !== 0 && (*/}
                          <Tab
                            sx={[tabSx, tab === 1 ? { color: '#52176D' } : {}]}
                            value={0}
                            label={'Description'}
                          />
                          {values.conclusion ? (
                            <Tab
                              sx={[
                                tabSx,
                                { paddingRight: '0', width: '160px' },
                                tab === 0 ? { color: '#52176D' } : {},
                              ]}
                              value={1}
                              label={'Conclusion'}
                            />
                          ) : (
                            <Button
                              sx={[
                                tabSx,
                                tab === 0 ? { color: '#52176D' } : {},
                              ]}
                              value={1}
                              onClick={() => {
                                setEditConclusion(true);
                                setShowFull(true);
                                setTab(1);
                              }}
                            >
                              + Conclusion
                            </Button>
                          )}
                          {values.conclusion && (
                            <Button
                              sx={[
                                tabSx,
                                { width: '40px', minWidth: '40px' },
                                tab === 0 ? { color: '#52176D' } : {},
                              ]}
                              // value={1}
                              onClick={() => {
                                setFieldValue('conclusion', '');
                              }}
                            >
                              <DeleteForeverIcon />
                            </Button>
                          )}
                        </Tabs>
                        {/*)}*/}
                        {tab === 0 ? (
                          <Collapse
                            in={true}
                            collapsedSize={showFull ? undefined : 150}
                          >
                            <Box
                              sx={descriptionWrapper(theme, showFull)}
                              ref={descriptionRef}
                            >
                              <MarkdownEditor
                                saved={saved}
                                name="description"
                                handleBlur={handleSubmit}
                                fastSave={true}
                                setFieldTouched={setFieldTouched}
                                mdProps={{
                                  view: {
                                    menu: true,
                                    md: true,
                                    html: !matchXs,
                                  },
                                }}
                                parentEntity={
                                  audit?.id
                                    ? {
                                        id: audit.id,
                                        source: AUDIT_PARENT_ENTITY,
                                      }
                                    : {}
                                }
                              />
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: '10px',
                                  my: '20px',
                                }}
                              >
                                <Box sx={{ width: '100%' }}>
                                  <TagsField
                                    size={matchMd ? 'small' : 'medium'}
                                    name="tags"
                                    label="Tags"
                                    setFieldTouched={setFieldTouched}
                                    onBlur={handleSubmit}
                                  />
                                  <TagsArray
                                    handleSubmit={handleSubmit}
                                    name="tags"
                                  />
                                </Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                    width: '100%',
                                  }}
                                >
                                  <TagsField
                                    size={matchMd ? 'small' : 'medium'}
                                    name="scope"
                                    label="Project links"
                                    setFieldTouched={setFieldTouched}
                                    onBlur={handleSubmit}
                                  />
                                  <ProjectLinksList
                                    handleSubmit={handleSubmit}
                                    name="scope"
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Collapse>
                        ) : (
                          <Collapse
                            in={true}
                            collapsedSize={showFull ? undefined : 150}
                          >
                            <Box sx={descriptionWrapper(theme, showFull)}>
                              <Box>
                                <MarkdownEditor
                                  saved={saved}
                                  name="conclusion"
                                  handleBlur={handleSubmit}
                                  setFieldTouched={setFieldTouched}
                                  mdProps={{
                                    style: { height: '250px' },
                                    view: {
                                      menu: true,
                                      md: true,
                                      html: !matchXs,
                                    },
                                  }}
                                  parentEntity={
                                    audit?.id
                                      ? {
                                          id: audit.id,
                                          source: AUDIT_PARENT_ENTITY,
                                        }
                                      : {}
                                  }
                                />
                              </Box>
                            </Box>
                          </Collapse>
                        )}
                        {showReadMoreButton && (
                          <Box
                            sx={[
                              {
                                // border: '1px solid #E5E5E5',
                                borderTop: '1px solid #E5E5E5',
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                                paddingTop: '8px',
                              },
                              !showFull
                                ? {
                                    boxShadow:
                                      '0px -24px 14px -8px rgba(252, 250, 246, 1)',
                                  }
                                : {},
                            ]}
                          >
                            {/*{tab === 0 && (*/}
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
                              {tab === 0 && <AddLinkIcon />}
                              <EditIcon sx={{ width: '20px' }} />
                              <ExpandLessOutlinedIcon
                                sx={[
                                  showFull
                                    ? {}
                                    : { transform: 'rotate(180deg)' },
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
                            {/*)}*/}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={modalSx}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Are you sure you want to delete the audit? All data will
                        be lost.
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '15px',
                          mt: '25px',
                        }}
                      >
                        <Button
                          variant={'contained'}
                          onClick={() => {
                            handleResetForm(setFieldValue);
                            setIsOpen(false);
                          }}
                          color={'secondary'}
                        >
                          Reset
                        </Button>
                        <Button
                          variant={'contained'}
                          onClick={() => setIsOpen(false)}
                        >
                          Close
                        </Button>
                      </Box>
                    </Box>
                  </Modal>

                  {!issues.length && (
                    <Box sx={actionWrapper}>
                      <CustomSnackbar
                        autoHideDuration={5000}
                        open={openMessage || auditMessage}
                        severity={
                          (auditMessage && 'success') ||
                          (openMessage && 'error')
                        }
                        text={
                          auditMessage
                            ? auditMessage
                            : openMessage &&
                              'Please fill in all mandatory fields'
                        }
                        onClose={handleCloseSnack}
                      />
                      {!saved && (
                        <Tooltip
                          title={'Save to AuditDB'}
                          arrow
                          placement={'top'}
                        >
                          <Button
                            sx={[
                              buttonSx,
                              { marginRight: '0!important' },
                              btnSx,
                            ]}
                            onClick={() => {
                              handleSavePublicAudit(handleSubmit, values);
                            }}
                            variant={'contained'}
                          >
                            <SaveIcon />
                          </Button>
                        </Tooltip>
                      )}
                      <Tooltip arrow title={'Reset form'} placement={'top'}>
                        <Button
                          variant={'contained'}
                          type={'button'}
                          color={'secondary'}
                          onClick={() => setIsOpen(true)}
                          sx={btnSx}
                        >
                          <RefreshIcon />
                        </Button>
                      </Tooltip>
                    </Box>
                  )}
                  {!!issues?.length && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        width: '100%',
                        mt: '25px',
                        [theme.breakpoints.down('xs')]: {
                          gap: '10px',
                        },
                      }}
                    >
                      <IssuesList
                        setIsOpenReset={setIsOpen}
                        auditId={!saved ? report.auditId : audit?.id}
                        isPublic={isPublic}
                        saved={saved}
                        handleSubmit={handleSubmit}
                      />
                    </Box>
                  )}
                </Form>
              );
            }}
          </Formik>
          {!issues?.length && <PublicIssueDetailsForm saved={saved} />}
        </CustomCard>
      </Layout>
    );
  }
};

export default PublicConstructor;

const actionWrapper = theme => ({
  display: 'flex',
  gap: '25px',
  justifyContent: 'center',
});

const layoutSx = theme => ({
  padding: '10px!important',
  [theme.breakpoints.down(780)]: {
    padding: '10px 0!important',
  },
});

const tabSx = theme => ({
  // border: '1px solid rgba(255, 153, 0, 0.5)',
  textTransform: 'unset',
  width: '170px',
  minHeight: '32px',
  height: '38.5px!important',
  // color: '#FF9900',
  fontWeight: 600,
  borderRadius: '0 8px 8px 0',
  fontSize: '20px',
  [theme.breakpoints.down('md')]: {
    height: '34.5px',
    fontSize: '16px',
  },
});

const descriptionWrapper = (theme, showFull) => ({
  maxHeight: showFull ? 'none' : '150px',
  '& .rc-md-editor': {
    height: '100%!important',
    minHeight: '340px',
  },
  overflow: 'hidden',
  transition: 'max-height 0.3s ease',
  '& .rc-md-editor .editor-container>.section': {
    borderRight: 'unset',
  },
  // '& .editor-container': {
  //   borderBottom: '1px solid #e0e0e0',
  // },
});

const tabsSx = theme => ({
  height: '38.5px',
  minHeight: 'unset',
  backgroundColor: '#f0f0f0',
  borderRadius: '8px 8px 0 0 ',
  '& .MuiTabs-scroller': { height: '38.5px!important' },
  [theme.breakpoints.down('md')]: {
    height: '34.5px',
    '& .MuiTabs-scroller': { height: '34.5px!important' },
  },
});

const buttonSx = theme => ({
  padding: '10px 24px',
  flexShrink: 0,
  fontWeight: '600!important',
  fontSize: '16px',
  lineHeight: '25px',
  textTransform: 'none',
  borderRadius: '10px',
  mr: '20px',
  '&:last-child': { mr: 0 },
  [theme.breakpoints.down('md')]: {
    fontWeight: '500!important',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '7px 24px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '7px 10px',
  },
});

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
  // maxWidth: '300px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  },
});

const fieldsWrapperSx = theme => ({
  mt: '25px',
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
  },
});

const modalSx = () => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
});

const titleSx = theme => ({
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '26px',
  },
});

const SubmitValidation = Yup.object().shape({
  project_name: Yup.string().required('File is required'),
  description: Yup.string().required('File is required'),
  auditor_name: Yup.string().required('File is required'),
});

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
  [theme.breakpoints.down(780)]: {
    borderRadius: '0!important',
  },
});

const btnSx = theme => ({
  padding: '15px 24px',
  flexShrink: 0,
  fontWeight: '600!important',
  fontSize: '16px',
  lineHeight: '25px',
  textTransform: 'none',
  borderRadius: '10px',
  width: '50px!important',
  minWidth: '50px',
  height: '45px',
  mr: '20px',
  '&:last-child': { mr: 0 },
  [theme.breakpoints.down('lg')]: {
    padding: '12px 24px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '10px 24px',
    fontWeight: '500!important',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '7px 24px',
    fontSize: '16px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '7px 10px',
    fontWeight: 400,
  },
});
