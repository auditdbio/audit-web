import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import {
  Box,
  Button,
  Collapse,
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
import {
  addReportAudit,
  clearMessage,
  getAudit,
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
} from '../redux/actions/types.js';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import { isAuth } from '../lib/helper.js';
import { changeRolePublicAuditor } from '../redux/actions/userAction.js';
import Headings from '../router/Headings.jsx';
import { AUDIT_PARENT_ENTITY } from '../services/file_constants.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit.js';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined.js';
import AddLinkIcon from '@mui/icons-material/AddLink.js';
import { SCOPE_LINKS } from '../services/constants.js';
import ScopeSelection from '../components/ScopeSelection.jsx';

const PublicConstructor = ({ saved, isPublic }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));

  const report = JSON.parse(localStorage.getItem('report') || '{}');
  const publicIssues = JSON.parse(localStorage.getItem('publicIssues') || '[]');

  const { auditor } = useSelector(s => s.auditor);
  const { audit, error } = useSelector(s => s.audits);
  const auditMessage = useSelector(s => s.audits.successMessage);
  const { issues, successMessage } = useSelector(s => s.issues);
  const { user } = useSelector(s => s.user);

  const [openMessage, setOpenMessage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [editConclusion, setEditConclusion] = useState(false);
  const [tab, setTab] = useState(0);

  const { auditId } = useParams();
  const descriptionRef = useRef();

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
        ...createInitialValues(report, publicIssues),
        status: 'Started',
        auditor_name: user?.name ? user.name : report?.auditor_name || '',
      }
    : {
        ...createInitialValues(audit),
        status: audit?.status,
        auditor_full_name:
          `${audit?.auditor_first_name} ${audit?.auditor_last_name}` || '',
        ...audit,
      };

  const handleResetForm = setFieldValue => {
    setFieldValue('project_name', '');
    setFieldValue('report', '');
    setFieldValue('description', '');
    setFieldValue('conclusion', '');
    setFieldValue('scope', { type: SCOPE_LINKS, content: [] });
    setFieldValue('tags', []);
    setFieldValue('issues', []);
    setFieldValue('isCreated', false);
    !isAuth() ? setFieldValue('auditor_name', '') : null;
    setFieldValue('auditId', Date.now());
    dispatch(handleResetPublicAudit());
    localStorage.removeItem('report');
    localStorage.removeItem('publicIssues');
  };

  const handleSavePublicAudit = async (handleSubmit, report) => {
    handleSubmit();
    const filteredReport = Object.fromEntries(
      Object.entries(report).filter(([_, value]) => value != null && value),
    );
    if (report?.auditor_name && report?.project_name && report?.description) {
      if (isAuth()) {
        if (user?.current_role?.toLowerCase() === CUSTOMER.toLowerCase()) {
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
        }}
      >
        <Headings title="Audit Builder" />

        <CustomCard sx={wrapper}>
          <Button
            onClick={() =>
              !saved ? navigate('/') : navigate('/profile/audits')
            }
            sx={backBtnSx}
          >
            <ArrowBackIcon color={'secondary'} />
          </Button>
          <Formik
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
            {({ handleSubmit, setFieldValue, setFieldTouched, values }) => {
              return (
                <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <CustomSnackbar
                    autoHideDuration={5000}
                    open={!!successMessage || !!error}
                    severity={'success'}
                    text={successMessage || error}
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
                            setTab(newValue);
                            if (editConclusion) {
                              setEditConclusion(false);
                            }
                          }}
                          indicatorColor="none"
                          textColor={'primary'}
                          aria-label="secondary tabs example"
                          sx={tabsSx}
                        >
                          <Tab
                            sx={[
                              tabSx,
                              {
                                borderRadius: '8px 0 0 0',
                                marginRight: '15px',
                              },
                              tab === 0 ? { color: '#52176D' } : selectedTabSx,
                            ]}
                            value={0}
                            label={'Description'}
                          />
                          {values.conclusion ? (
                            <Tab
                              sx={[
                                tabSx,
                                {
                                  paddingRight: '0',
                                  width: '150px',
                                  borderRadius: '0 0 0 0',
                                  borderRight: 'unset',
                                },
                                conclusionSx,
                                tab === 1
                                  ? { color: '#52176D' }
                                  : selectedTabSx,
                              ]}
                              value={1}
                              label={'Conclusion'}
                            />
                          ) : (
                            <Button
                              sx={[
                                tabSx,
                                tab === 0
                                  ? { color: 'rgba(0, 0, 0, 0.6)' }
                                  : selectedTabSx,
                              ]}
                              value={1}
                              onClick={() => {
                                setEditConclusion(true);
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
                                {
                                  width: '32px',
                                  minWidth: '32px',
                                  paddingLeft: 0,
                                  color: 'rgba(0, 0, 0, 0.6)',
                                },
                                tab === 1
                                  ? { color: '#FF9900!important' }
                                  : selectedButtonSx,
                              ]}
                              onClick={() => {
                                setFieldValue('conclusion', '');
                              }}
                            >
                              <DeleteForeverIcon />
                            </Button>
                          )}
                        </Tabs>
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
                              <Box sx={tagsWrapperSx}>
                                <Box sx={{ width: '100%' }}>
                                  <TagsField
                                    size={'small'}
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
                                  <ScopeSelection
                                    scope={values.scope}
                                    project={saved ? audit : report}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    onBlur={handleSubmit}
                                    sx={scopeSelectionSx}
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
                          </Collapse>
                        )}
                        <Box
                          sx={[
                            {
                              display: 'flex',
                              justifyContent: 'center',
                              position: 'relative',
                              paddingTop: '8px',
                            },
                            !showFull
                              ? {
                                  borderTop: '1px solid #E5E5E5',
                                  boxShadow:
                                    '0px -24px 14px -8px rgba(252, 250, 246, 1)',
                                }
                              : {},
                          ]}
                        >
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
                            variant="outlined"
                          >
                            <span>{showFull ? 'Hide' : `Show`}</span>
                            {tab === 0 && <AddLinkIcon />}
                            <EditIcon sx={{ width: '20px' }} />
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

const createInitialValues = (data, issues = []) => ({
  id: data?.id || Date.now(),
  project_name: data?.project_name || '',
  report: data?.report || '',
  description: data?.description || '',
  conclusion: data?.conclusion || '',
  scope: data?.scope?.type ? data.scope : { type: SCOPE_LINKS, content: [] },
  tags: data?.tags?.length ? data.tags : [],
  issues: data?.issues?.length ? data.issues : issues,
  last_modified: Date.now(),
});

const actionWrapper = {
  display: 'flex',
  gap: '25px',
  justifyContent: 'center',
};

const tagsWrapperSx = theme => ({
  display: 'flex',
  gap: '10px',
  my: '20px',
  '& input': {
    fontSize: '22px!important',
    paddingY: '8px!important',
  },
  '& label': {
    top: '0px!important',
    fontSize: '20px!important',
  },
  [theme.breakpoints.down('lg')]: {
    '& label': {
      fontSize: '18px!important',
      top: '3px!important',
    },
  },
  [theme.breakpoints.down('md')]: {
    '& label': {
      fontSize: '16px!important',
    },
  },
  [theme.breakpoints.down(700)]: {
    flexDirection: 'column',
  },
});

const backBtnSx = theme => ({
  position: 'absolute',
  top: '10px',
  left: '15px',
  minWidth: '40px',
  [theme.breakpoints.down('xs')]: {
    left: '5px',
  },
});

const selectedTabSx = {
  borderWidth: '0.991146px 0.991146px 0px 0.991146px',
  borderColor: '#B2B3B3',
};

const selectedButtonSx = {
  borderWidth: '0.991146px 0.991146px 0px 0.991146px',
  borderColor: '#B2B3B3',
};

const layoutSx = theme => ({
  padding: '10px!important',
  position: 'relative',
  [theme.breakpoints.down(780)]: {
    padding: '10px 0!important',
  },
});

const tabSx = theme => ({
  textTransform: 'unset',
  width: '150px',
  minHeight: '32px',
  height: '34.5px!important',
  margin: '0 1px',
  fontWeight: 600,
  borderRadius: '0 8px 8px 0',
  fontSize: '20px',
  [theme.breakpoints.down('md')]: {
    height: '34.5px',
    fontSize: '16px',
  },
});

const conclusionSx = theme => ({
  width: '150px',
  [theme.breakpoints.down('md')]: {
    width: '120px',
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
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  },
});

const fieldsWrapperSx = theme => ({
  mt: '25px',
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  [theme.breakpoints.down('lg')]: {
    '& label': {
      top: '3px!important',
    },
  },
  [theme.breakpoints.down('md')]: {
    '& label': {
      top: '3px!important',
    },
  },
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
  height: '47px',
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

const scopeSelectionSx = theme => ({
  '& label': { top: '-5px!important' },
  [theme.breakpoints.down('sm')]: {
    '& label': { top: '3px!important' },
  },
});
