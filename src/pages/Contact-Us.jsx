import React from 'react';
import Layout from '../styles/Layout.jsx';
import { Box, Button, Typography } from '@mui/material';
import { CustomCard } from '../components/custom/Card.jsx';
import { Form, Formik } from 'formik';
import SimpleField from '../components/forms/fields/simple-field.jsx';
import { radiusOfComponents } from '../styles/themes.js';
import DescriptionField from '../components/forms/create-project/DescriptionField.jsx';
import {
  clearFormMessage,
  sendContactMessage,
} from '../redux/actions/contactUsAction.js';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../lib/helper.js';

const AuditDb = () => {
  const dispatch = useDispatch();
  const errorMessage = useSelector(s => s.contactUs.errorMessage);
  const successMessage = useSelector(s => s.contactUs.successMessage);

  const initialValues = {
    email: '',
    name: '',
    company: '',
    message: '',
  };

  return (
    <Layout>
      <CustomSnackbar
        autoHideDuration={3000}
        open={errorMessage || successMessage}
        onClose={() => dispatch(clearFormMessage())}
        severity={errorMessage ? 'error' : 'success'}
        text={errorMessage || successMessage}
      />

      <CustomCard>
        <Formik
          initialValues={initialValues}
          validationSchema={ContactUsValidationSchema}
          onSubmit={(values, { resetForm }) => {
            dispatch(sendContactMessage(values));
            resetForm();
          }}
        >
          {({ handleSubmit }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <Box sx={{ padding: '40px' }}>
                  <Box sx={wrapper}>
                    <Box sx={[contentWrapper, imgWrapper]}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '5px',
                        }}
                      >
                        <Typography variant="h3">
                          Leave us a message, or write to
                        </Typography>
                        <Typography variant="h3" color="primary">
                          hello@auditdb.io
                        </Typography>
                      </Box>
                      <svg
                        width="258"
                        height="223"
                        viewBox="0 0 258 223"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.362 4.50736H239.068C246.651 4.50736 252.852 10.7067 252.852 18.2832V140.09C252.852 147.666 246.651 153.861 239.068 153.861H18.362C10.7782 153.861 4.57755 147.666 4.57755 140.09V18.2832C4.57755 10.7067 10.7782 4.50736 18.362 4.50736ZM14.6453 0H243.015C251.069 0 257.66 6.58478 257.66 14.6313V144.024C257.66 152.07 251.069 158.65 243.015 158.65H14.6453C6.59111 158.65 0 152.07 0 144.024C0 102.513 0 61.0067 0 19.5005V14.6313C0 6.58478 6.59111 0 14.6453 0Z"
                          fill="#47115F"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M224.055 126.417L153.91 84.1967L228.576 27.7161L128.6 91.7685L28.5709 27.6738L102.814 83.8677L26.5762 129.486L109.184 88.1165L128.402 100.125L147.804 87.576L224.055 126.417Z"
                          fill="#2B2A29"
                        />
                        <path
                          d="M140.413 44.171V44.8337L139.015 45.5951V44.5752L134.41 41.915L129.804 39.2595L125.198 41.915L120.597 44.5752V55.202L121.143 55.5216V57.1244L119.2 56.0011V43.7715L124.502 40.7118L129.804 37.6567L135.106 40.7118L140.413 43.7715V44.171ZM140.413 54.8401V56.0058L135.106 59.0608L129.804 62.1205L127.781 60.9549L129.131 60.123L129.804 60.5131L134.41 57.8576L139.015 55.202V54.1116L140.413 54.8401Z"
                          fill="#020202"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M121.736 45.6797L138.065 54.356L121.938 63.1404L121.736 45.6797Z"
                          fill="#47115F"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M142.102 54.9812L132.434 49.8441L141.984 44.6411L142.102 54.9812Z"
                          fill="#FE9900"
                        />
                        <path
                          d="M72.8127 172.52H43.188C41.1791 172.52 39.556 174.142 39.556 176.144C39.556 178.151 41.1791 179.772 43.188 179.772H72.8127C74.8168 179.772 76.4399 178.151 76.4399 176.144C76.4399 174.142 74.8168 172.52 72.8127 172.52Z"
                          fill="#FE9900"
                        />
                        <path
                          d="M151.61 214.905H151.605L82.5465 215.042C80.5423 215.042 78.9193 216.668 78.924 218.675C78.9287 220.672 80.5517 222.294 82.5559 222.294H82.5606L151.619 222.157C153.618 222.153 155.246 220.527 155.237 218.524C155.232 216.522 153.609 214.905 151.61 214.905Z"
                          fill="#FE9900"
                        />
                        <path
                          d="M215.785 193.045H171.867C169.863 193.045 168.24 194.667 168.24 196.669C168.24 198.676 169.863 200.298 171.867 200.298H215.785C217.789 200.298 219.417 198.676 219.417 196.669C219.417 194.667 217.789 193.045 215.785 193.045Z"
                          fill="#FE9900"
                        />
                      </svg>
                    </Box>
                    <Box sx={contactWrapper}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '15px',
                          width: '100%',
                        }}
                      >
                        {/*<Snackbar*/}
                        {/*    autoHideDuration={10000}*/}
                        {/*    open={!!error}*/}
                        {/*    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}*/}
                        {/*    onClose={() => {*/}
                        {/*        // dispatch(clearUserError())*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <Stack sx={{ width: '100%', flexDirection: 'column', gap: 2 }} spacing={2}>*/}
                        {/*        <Alert severity='success'>*/}
                        {/*            <AlertTitle>{error}</AlertTitle>*/}
                        {/*        </Alert>*/}
                        {/*    </Stack>*/}
                        {/*</Snackbar>*/}
                        <SimpleField name="name" label="Name" emptyPH={true} />
                        <SimpleField
                          name="company"
                          label="Company"
                          emptyPH={true}
                        />
                        <SimpleField
                          name="email"
                          label="E-mail"
                          emptyPH={true}
                        />
                        <Box sx={fieldWrapper}>
                          <DescriptionField
                            name="message"
                            label="Your text there"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={submitButton}
                    {...addTestsLabel('send-button')}
                  >
                    Send
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomCard>
    </Layout>
  );
};

export default AuditDb;

const ContactUsValidationSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email('Invalid email').required('required'),
  message: Yup.string().required('required'),
  company: Yup.string(),
});

const imgWrapper = theme => ({
  gap: '90px',
  [theme.breakpoints.down('md')]: {
    gap: '70px',
  },
  [theme.breakpoints.down('xs')]: {
    gap: '40px',
  },
});

const contentWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  width: '50%',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    '& svg': {
      width: '350px',
    },
  },
});

const formLabelSx = theme => ({
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '24px',
  color: '#434242',
  [theme.breakpoints.down('lg')]: {
    fontSize: '14px',
  },
});

const textFieldSx = theme => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: radiusOfComponents,
  },
  '& .MuiOutlinedInput-input': {
    padding: '15px 20px',
    fontSize: '16px',
    fontWeight: 400,
    color: '#000000',
  },
});
const contactWrapper = theme => ({
  flexDirection: 'column',
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
  width: '50%',
  '& form': {
    width: '100%',
    height: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});

const submitButton = theme => ({
  display: 'block',
  padding: '11px 140px',
  color: '#FCFAF6',
  textTransform: 'unset',
  fontWeight: 600,
  lineHeight: 1.2,
  maxWidth: '402px',
  margin: '45px auto 0',
  borderRadius: '15px',
  fontSize: '14px',
  [theme.breakpoints.down('sm')]: {
    width: '225px',
    padding: '13px 80px',
  },
});

const wrapper = theme => ({
  display: 'flex',
  gap: '25px',
  '& h3': {
    fontSize: '26px',
    fontWeight: 600,
    textAlign: 'center',
    width: '300px',
  },
  [theme.breakpoints.down('md')]: {
    minHeight: '500px',
    '& h3': {
      fontSize: '22px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& h3': {
      width: 'unset',
    },
  },
});

const fieldWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    '& .MuiInputBase-root': {
      height: '44px',
      '& input': {
        paddingY: '7px',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    gap: '16px',
    '& .password-wrapper, .field-wrapper': {
      gap: '16px',
    },
  },
});
