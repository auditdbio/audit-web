import React, { useRef, useState } from 'react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { addTestsLabel } from '../lib/helper.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CustomCard } from '../components/custom/Card.jsx';
import Layout from '../styles/Layout.jsx';
import {
  addReportAudit,
  clearMessage,
  startAudit,
} from '../redux/actions/auditAction.js';
import { Form, Formik } from 'formik';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import EmailIcon from '@mui/icons-material/Email.js';
import TelegramIcon from '@mui/icons-material/Telegram.js';
import Markdown from '../components/markdown/Markdown.jsx';
import CustomLink from '../components/custom/CustomLink.jsx';
import {
  RESOLVED,
  SUBMITED,
  WAITING_FOR_AUDITS,
} from '../redux/actions/types.js';
import { FIXED, NOT_FIXED } from '../components/issuesPage/constants.js';
import AuditUpload from '../components/forms/audit-upload/index.jsx';
import * as Yup from 'yup';
import theme from '../styles/themes.js';
import MarkdownEditor from '../components/markdown/Markdown-editor.jsx';
//
const PublicConstructor = () => {
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [editDescription, setEditDescription] = useState(true);

  const descriptionRef = useRef();
  const issue = [];
  return (
    <Layout>
      <CustomCard sx={wrapper}>
        <Button
          sx={backButtonSx}
          onClick={() => navigate(-1)}
          {...addTestsLabel('go-back-button')}
        >
          <ArrowBackIcon color="secondary" />
        </Button>
        <Formik
          initialValues={{
            id: '',
            status: 'done',
            report: '',
            report_name: '',
          }}
          validationSchema={SubmitValidation}
          onSubmit={values => {
            console.log(values);
          }}
        >
          {({ handleSubmit, setFieldValue, setFieldTouched }) => {
            return (
              <Form
                onSubmit={handleSubmit}
                style={{ width: '100%', maxWidth: '1300px' }}
              >
                {/*<CustomSnackbar*/}
                {/*  autoHideDuration={5000}*/}
                {/*  open={!!error || !!successMessage}*/}
                {/*  severity={error ? 'error' : 'success'}*/}
                {/*  text={error || successMessage}*/}
                {/*  onClose={() => dispatch(clearMessage())}*/}
                {/*/>*/}

                <Box sx={{ width: '100%' }}>
                  <Box sx={infoWrapper}>
                    <Box sx={descriptionSx(showFull)}>
                      {editDescription ? (
                        <MarkdownEditor
                          name="description"
                          setFieldTouched={setFieldTouched}
                          mdProps={
                            {
                              // view: { menu: true, md: true, html: !matchXs },
                            }
                          }
                        />
                      ) : (
                        <Box ref={descriptionRef}>
                          <Markdown value={''} />
                        </Box>
                      )}
                    </Box>
                    {/*{showReadMoreButton && (*/}
                    {/*  <Button*/}
                    {/*    onClick={() => setShowFull(!showFull)}*/}
                    {/*    sx={readAllButton}*/}
                    {/*  >*/}
                    {/*    {showFull ? 'Hide ▲' : `Read all ▼`}*/}
                    {/*  </Button>*/}
                    {/*)}*/}

                    {/*<Box sx={linkWrapper}>*/}
                    {/*  {audit?.scope?.map((el, idx) => (*/}
                    {/*    <CustomLink link={el} key={idx} />*/}
                    {/*  ))}*/}
                    {/*</Box>*/}

                    {/*{audit?.status?.toLowerCase() ===*/}
                    {/*WAITING_FOR_AUDITS.toLowerCase() ? (*/}
                    {/*  <Box*/}
                    {/*    sx={{*/}
                    {/*      display: 'flex',*/}
                    {/*      justifyContent: 'center',*/}
                    {/*      maxWidth: '400px',*/}
                    {/*      margin: '0 auto',*/}
                    {/*      paddingBottom: '25px',*/}
                    {/*    }}*/}
                    {/*  >*/}
                    {/*    <Button*/}
                    {/*      sx={[*/}
                    {/*        workflowButton(auditDBWorkflow),*/}
                    {/*        {*/}
                    {/*          borderRadius: '10px',*/}
                    {/*          width: '180px',*/}
                    {/*        },*/}
                    {/*      ]}*/}
                    {/*      onClick={() => dispatch(startAudit(audit, true))}*/}
                    {/*    >*/}
                    {/*      Start audit*/}
                    {/*    </Button>*/}
                    {/*  </Box>*/}
                    {/*) : (*/}
                    {/*  <Box sx={workflowToggleBox}>*/}
                    {/*    <Button*/}
                    {/*      onClick={() => setAuditDBWorkflow(true)}*/}
                    {/*      sx={workflowButton(auditDBWorkflow)}*/}
                    {/*      disabled={*/}
                    {/*        audit?.status?.toLowerCase() ===*/}
                    {/*          RESOLVED.toLowerCase() && !issues?.length*/}
                    {/*      }*/}
                    {/*    >*/}
                    {/*      {issues?.length*/}
                    {/*        ? `Issues (${issues.length})`*/}
                    {/*        : 'New issue'}*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*      onClick={() => setAuditDBWorkflow(false)}*/}
                    {/*      disabled={*/}
                    {/*        !issues?.every(*/}
                    {/*          issue =>*/}
                    {/*            issue.status === FIXED ||*/}
                    {/*            issue.status === NOT_FIXED ||*/}
                    {/*            !issue.include,*/}
                    {/*        )*/}
                    {/*      }*/}
                    {/*      sx={workflowButton(!auditDBWorkflow)}*/}
                    {/*    >*/}
                    {/*      Upload audit*/}
                    {/*    </Button>*/}
                    {/*  </Box>*/}
                    {/*)}*/}

                    {/*{!auditDBWorkflow &&*/}
                    {/*  audit?.status.toLowerCase() !==*/}
                    {/*    WAITING_FOR_AUDITS.toLowerCase() && (*/}
                    {/*    <Box sx={fileWrapper}>*/}
                    {/*      <Typography sx={subTitleSx}>Upload audit</Typography>*/}
                    {/*      <Box sx={{ display: 'flex' }}>*/}
                    {/*        <AuditUpload*/}
                    {/*          disabled={audit?.status === SUBMITED}*/}
                    {/*          auditId={audit?.id}*/}
                    {/*          auditorId={audit?.auditor_id}*/}
                    {/*          auditReportName={audit?.report_name}*/}
                    {/*          customerId={audit?.customer_id}*/}
                    {/*          name={'report'}*/}
                    {/*          setFieldValue={setFieldValue}*/}
                    {/*        />*/}
                    {/*      </Box>*/}
                    {/*    </Box>*/}
                    {/*  )}*/}
                  </Box>
                </Box>

                {/*{!auditDBWorkflow && (*/}
                {/*  <Box*/}
                {/*    sx={{*/}
                {/*      display: 'flex',*/}
                {/*      flexDirection: 'column',*/}
                {/*      alignItems: 'center',*/}
                {/*      mb: '30px',*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <Button*/}
                {/*      variant="contained"*/}
                {/*      type="submit"*/}
                {/*      color="secondary"*/}
                {/*      sx={[buttonSx, { mb: '15px' }]}*/}
                {/*      {...addTestsLabel('send-button')}*/}
                {/*    >*/}
                {/*      Send to customer*/}
                {/*    </Button>*/}
                {/*  </Box>*/}
                {/*)}*/}
              </Form>
            );
          }}
        </Formik>
      </CustomCard>
    </Layout>
  );
};

export default PublicConstructor;

const wrapper = theme => ({
  padding: '48px 45px 80px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    padding: '38px 44px 60px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '38px 20px 30px',
  },
});

const backButtonSx = {
  position: 'absolute',
  left: '0',
  top: '5px',
};

const SubmitValidation = Yup.object().shape({
  report: Yup.string().required('File is required'),
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
    fontSize: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
  },
});

const salaryWrapper = theme => ({
  display: 'flex',
  gap: '50px',
  fontSize: '26px',
  fontWeight: 500,
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
  },
});

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
  fontSize: '21px',
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
    gap: '15px',
    fontSize: '18px',
  },
  [theme.breakpoints.down('sm')]: {
    columnGap: '40px',
    marginTop: '25px',
    gap: '10px',
    '& p': {
      fontSize: '15px',
    },
  },
});

const buttonSx = theme => ({
  padding: '19px 0',
  fontSize: '18px',
  textTransform: 'unset',
  fontWeight: 600,
  margin: '0 12px',
  width: '270px',
  borderRadius: '10px',
  [theme.breakpoints.down('md')]: {
    padding: '11px 0',
  },
  [theme.breakpoints.down('sm')]: {
    width: '240px',
  },
  [theme.breakpoints.down('xs')]: {
    margin: '0 6px',
  },
});

const workflowToggleBox = theme => ({
  maxWidth: '510px',
  margin: '0 auto 50px',
  padding: '3px 1px',
  display: 'flex',
  justifyContent: 'center',
  border: '1px solid #B2B3B3',
  borderRadius: '38px',
  [theme.breakpoints.down('xs')]: {
    width: '248px',
    margin: '0 auto 20px',
  },
});

const workflowButton = useWorkflow => ({
  fontWeight: 600,
  fontSize: '20px',
  color: useWorkflow ? 'white' : 'black',
  textTransform: 'none',
  padding: '15px 0',
  width: '250px',
  borderRadius: '38px',
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
