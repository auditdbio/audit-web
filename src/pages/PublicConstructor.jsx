import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import { Box, Button, Modal, Typography, useMediaQuery } from '@mui/material';
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
import { isAuth } from '../lib/helper.js';
import {
  addReportAudit,
  clearMessage,
  getAudit,
  handleResetPublicAudit,
} from '../redux/actions/auditAction.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublicIssueDetailsForm from './PublicIssueDetailForm.jsx';
import { useNavigate } from 'react-router-dom/dist';
import { CLEAR_AUDIT } from '../redux/actions/types.js';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import Markdown from '../components/markdown/Markdown.jsx';
import TagsList from '../components/tagsList.jsx';

const PublicConstructor = ({ saved, isPublic }) => {
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const report = JSON.parse(localStorage.getItem('report') || '{}');
  const publicIssues = JSON.parse(localStorage.getItem('publicIssues') || '[]');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { issues, successMessage } = useSelector(state => state.issues);
  const [openMessage, setOpenMessage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const audit = useSelector(s => s.audits.audit);
  const { auditId } = useParams();
  const descriptionRef = useRef();
  const [showFull, setShowFull] = useState(false);

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
        scope: report?.scope?.length ? report?.scope : [],
        tags: report?.tags?.length ? report?.tags : [],
        issues: report?.issues?.length ? report?.issues : publicIssues,
        auditor_name: report?.auditor_name || '',
        status: 'Started',
        last_modified: Date.now(),
      }
    : {
        id: audit?.id,
        auditor_id: audit?.auditor_id,
        project_name: audit?.project_name || '',
        report: audit?.report || '',
        description: audit?.description || '',
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
    setFieldValue('report_name', '');
    setFieldValue('description', '');
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

  if (!audit?.id && saved) {
    return (
      <Layout>
        <CustomCard
          sx={[wrapper, { height: '100%', justifyContent: 'center' }]}
        >
          <Loader />
        </CustomCard>
      </Layout>
    );
  }
  //
  if ((saved && audit) || (!audit && !saved)) {
    return (
      <Layout sx={layoutSx}>
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
                setOpenMessage(true);
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
              return (
                <Form
                  onSubmit={handleSubmit}
                  style={{
                    width: '100%',
                    maxWidth: '1300px',
                  }}
                >
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
                      disabled={saved}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '35px',
                      mt: '20px',
                    }}
                  >
                    <Box>
                      <Typography sx={descriptionTitleSx} variant={'h6'}>
                        Project description
                      </Typography>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={descriptionSx(showFull)}>
                          <Box ref={descriptionRef}>
                            <MarkdownEditor
                              saved={saved}
                              name="description"
                              handleBlur={handleSubmit}
                              setFieldTouched={setFieldTouched}
                              mdProps={{
                                view: { menu: true, md: true, html: !matchXs },
                              }}
                            />{' '}
                          </Box>
                          <Box
                            sx={{ display: 'flex', gap: '10px', my: '15px' }}
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
                        <Button
                          onClick={() => setShowFull(!showFull)}
                          sx={readAllButton}
                        >
                          {showFull ? 'Hide ▲' : `Expand ▼`}
                        </Button>
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
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '25px',
                        mt: '25px',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        variant={'contained'}
                        type={'button'}
                        color={'secondary'}
                        onClick={() => setIsOpen(true)}
                        sx={btnSx}
                      >
                        Reset form
                      </Button>
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
                        auditId={report.auditId || audit?.id}
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

const layoutSx = theme => ({
  paddingY: '10px',
  [theme.breakpoints.down('md')]: {
    padding: '10px 20px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 20px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '20px 30px',
  },
});

const descriptionTitleSx = theme => ({
  mb: '10px',
  fontSize: '16px',
});

const readAllButton = theme => ({
  width: '100%',
  padding: '8px',
  fontWeight: 600,
  fontSize: '21px',
  color: 'black',
  textTransform: 'none',
  lineHeight: '25px',
  background: '#E5E5E5',
  borderRadius: 0,
  boxShadow: '0px -24px 14px -8px rgba(252, 250, 246, 1)',
  ':hover': { background: '#D5D5D5' },
  [theme.breakpoints.down('xs')]: {
    fontSize: '14px',
    border: 'none',
  },
});
const descriptionSx = full => ({
  maxHeight: full ? 'unset' : '110px',
  overflow: 'hidden',
  transition: 'max-height 1s',
  scrollBehavior: 'smooth',
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
  padding: '28px 34px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  gap: '20px',
  '& h3': {
    fontSize: '37px',
    fontWeight: 500,
  },
  [theme.breakpoints.down('md')]: {
    padding: '18px 44px 20px',
    '& h3': {
      fontSize: '30px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '18px 20px 20px',
    '& h3': {
      fontSize: '24px',
    },
  },
});

const btnSx = theme => ({
  padding: '15px 24px',
  flexShrink: 0,
  fontWeight: '600!important',
  fontSize: '20px',
  lineHeight: '25px',
  textTransform: 'none',
  borderRadius: '10px',
  mr: '20px',
  '&:last-child': { mr: 0 },
  [theme.breakpoints.down('lg')]: {
    padding: '12px 24px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '10px 24px',
    fontWeight: 500,
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
