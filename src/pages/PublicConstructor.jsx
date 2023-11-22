import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import SimpleField from '../components/forms/fields/simple-field.jsx';
import theme from '../styles/themes.js';
import FieldEditor from '../components/editor/FieldEditor.jsx';
import MarkdownEditor from '../components/markdown/Markdown-editor.jsx';
import Markdown from '../components/markdown/Markdown.jsx';
import TagsField from '../components/forms/tags-field/tags-field.jsx';
import TagsArray from '../components/tagsArray/index.jsx';
import { ProjectLinksList } from '../components/custom/ProjectLinksList.jsx';
import IssuesList from '../components/issuesPage/IssuesList.jsx';
import { GET_AUDIT, RESOLVED } from '../redux/actions/types.js';
import IssueDetailsForm from '../components/issuesPage/IssueDetailsForm/IssueDetailsForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicIssues } from '../redux/actions/issueAction.js';
import * as Yup from 'yup';
import { isAuth } from '../lib/helper.js';
import {
  clearMessage,
  createPublicReport,
} from '../redux/actions/auditAction.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';

const PublicConstructor = () => {
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchMd = useMediaQuery(theme.breakpoints.down('md'));
  const report = JSON.parse(localStorage.getItem('report') || '{}');
  const publicIssies = JSON.parse(localStorage.getItem('publicIssies') || '[]');
  const dispatch = useDispatch();
  const issues = useSelector(state => state.issues.issues);
  const [openMessage, setOpenMessage] = useState(false);
  useEffect(() => {
    dispatch(getPublicIssues(publicIssies, report.auditId));
  }, []);

  useEffect(() => {
    if (!isAuth()) {
      localStorage.setItem('isPublic', true);
    } else {
      localStorage.removeItem('isPublic');
    }
  }, []);

  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button sx={{ position: 'absolute', top: '10px', left: '10px' }}>
          <ArrowBackIcon color={'secondary'} />
        </Button>
        <Formik
          initialValues={{
            auditId: report?.auditId || Date.now(),
            project_name: report?.project_name || '',
            report: report?.report || '',
            report_name: report?.report_name || '',
            description: report?.description || '',
            scope: report?.scope?.length ? report?.scope : [],
            tags: report?.tags?.length ? report?.tags : [],
            issues: report?.issues?.length ? report?.issues : publicIssies,
            isCreated: report?.isCreated || false,
            email: report?.email || '',
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
            dirty,
            values,
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
                  open={openMessage}
                  severity={'success'}
                  text={'Saved successfully'}
                  onClose={() => setOpenMessage(false)}
                />
                <Typography sx={titleSx} variant={'h4'}>
                  Create audit report
                </Typography>
                <Box
                  sx={{
                    mt: '20px',
                  }}
                >
                  <FieldEditor name={'project_name'} label={'Project name'} />
                </Box>
                <Box
                  sx={{
                    mt: '20px',
                  }}
                >
                  <FieldEditor name={'auditor_name'} label={'Auditor name'} />
                </Box>
                <Box
                  sx={{
                    mt: '20px',
                  }}
                >
                  <FieldEditor name={'email'} label={'email'} />
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
                    <Typography sx={{ mb: '10px' }} variant={'h6'}>
                      Description
                    </Typography>
                    <MarkdownEditor
                      name="description"
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
                      />
                      <ProjectLinksList name="scope" />
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant={'contained'}
                  type={'submit'}
                  sx={{
                    marginLeft: 'auto',
                    mt: '25px',
                    marginRight: 0,
                    display: 'block',
                  }}
                  disabled={!dirty}
                >
                  Save
                </Button>
              </Form>
            );
          }}
        </Formik>
        {/*{issues?.length ? (*/}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
            [theme.breakpoints.down('xs')]: {
              gap: '10px',
            },
          }}
        >
          <IssuesList auditId={report.auditId} />
        </Box>
        {/*) : (*/}
        {/*  <IssueDetailsForm />*/}
        {/*)}*/}
      </CustomCard>
    </Layout>
  );
};

export default PublicConstructor;

const titleSx = theme => ({
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '26px',
  },
});

const SubmitValidation = Yup.object().shape({
  project_name: Yup.string().required('File is required'),
  report_name: Yup.string().required('File is required'),
  description: Yup.string().required('File is required'),
  email: Yup.string().required('File is required'),
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
    padding: '38px 44px 20px',
    '& h3': {
      fontSize: '30px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '20px',
    padding: '38px 20px 20px',
    '& h3': {
      fontSize: '24px',
    },
  },
});
