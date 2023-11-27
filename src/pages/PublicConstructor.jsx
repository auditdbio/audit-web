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
import { getPublicIssues } from '../redux/actions/issueAction.js';
import * as Yup from 'yup';
import { isAuth } from '../lib/helper.js';
import { handleResetPublicAudit } from '../redux/actions/auditAction.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublicIssueDetailsForm from './PublicIssueDetailForm.jsx';
import { useNavigate } from 'react-router-dom/dist';

const PublicConstructor = () => {
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const report = JSON.parse(localStorage.getItem('report') || '{}');
  const publicIssues = JSON.parse(localStorage.getItem('publicIssues') || '[]');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const issues = useSelector(state => state.issues.issues);
  const [openMessage, setOpenMessage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    dispatch(getPublicIssues(publicIssues, report.auditId));
  }, []);

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

  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', top: '10px', left: '10px' }}
        >
          <ArrowBackIcon color={'secondary'} />
        </Button>
        <Formik
          // validationSchema={SubmitValidation}
          initialValues={{
            auditId: report?.auditId || Date.now(),
            project_name: report?.project_name || '',
            report: report?.report || '',
            report_name: report?.report_name || '',
            description: report?.description || '',
            scope: report?.scope?.length ? report?.scope : [],
            tags: report?.tags?.length ? report?.tags : [],
            issues: report?.issues?.length ? report?.issues : publicIssues,
            isCreated: report?.isCreated || false,
            auditor_name: report?.auditor_name || '',
          }}
          onSubmit={values => {
            if (values.id) {
              localStorage.setItem('report', JSON.stringify(values));
            } else {
              const newValues = { ...values, id: Date.now() };
              localStorage.setItem('report', JSON.stringify(newValues));
            }
            setOpenMessage(true);
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
                {/*<CustomSnackbar*/}
                {/*  autoHideDuration={5000}*/}
                {/*  open={openMessage}*/}
                {/*  severity={'success'}*/}
                {/*  text={'Saved successfully'}*/}
                {/*  onClose={() => setOpenMessage(false)}*/}
                {/*/>*/}
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
                    name={'auditor_name'}
                    label={'Auditor name'}
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
                    <Typography sx={[{ mb: '10px' }]} variant={'h6'}>
                      Project description
                    </Typography>
                    <MarkdownEditor
                      name="description"
                      handleBlur={handleSubmit}
                      setFieldTouched={setFieldTouched}
                      mdProps={{
                        view: { menu: true, md: true, html: !matchXs },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: '10px' }}>
                    <Box sx={{ width: '100%' }}>
                      <TagsField
                        size={matchMd ? 'small' : 'medium'}
                        name="tags"
                        label="Tags"
                        setFieldTouched={setFieldTouched}
                        onBlur={handleSubmit}
                      />
                      <TagsArray name="tags" />
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
                      <ProjectLinksList name="scope" />
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
                      Are you sure you want to delete the audit? You can save it
                      after registration.
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
                <Box
                  sx={{
                    display: 'flex',
                    gap: '25px',
                    mt: '25px',
                    justifyContent: 'flex-end',
                  }}
                >
                  {!issues.length && (
                    <Button
                      variant={'contained'}
                      type={'button'}
                      color={'secondary'}
                      onClick={() => setIsOpen(true)}
                      sx={btnSx}
                    >
                      Reset form
                    </Button>
                  )}
                  {/*<Button*/}
                  {/*  variant={'contained'}*/}
                  {/*  type={'submit'}*/}
                  {/*  sx={{*/}
                  {/*    display: 'block',*/}
                  {/*  }}*/}
                  {/*  disabled={!dirty}*/}
                  {/*>*/}
                  {/*  Save*/}
                  {/*</Button>*/}
                </Box>
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
                      auditId={report.auditId}
                      isPublic={true}
                      handleSubmit={handleSubmit}
                    />
                  </Box>
                )}
              </Form>
            );
          }}
        </Formik>
        {!issues?.length && <PublicIssueDetailsForm />}
      </CustomCard>
    </Layout>
  );
};

export default PublicConstructor;

const fieldsWrapperSx = theme => ({
  mt: '40px',
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
  padding: '48px 74px 40px',
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
    padding: '38px 44px 30px',
    '& h3': {
      fontSize: '30px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '38px 20px 30px',
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
