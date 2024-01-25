import React from 'react';
import { useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addTestsLabel } from '../../lib/helper.js';
import { createRequest } from '../../redux/actions/auditAction.js';
import SalarySlider from '../forms/salary-slider/salary-slider.jsx';
import theme from '../../styles/themes.js';

const OfferModal = ({
  auditor,
  project,
  user,
  redirect,
  setError,
  onClose,
  handleClose,
}) => {
  const dispatch = useDispatch();

  return (
    <Box sx={modalWrapper}>
      <Button
        className={'audit-request-back-btn'}
        onClick={handleClose}
        {...addTestsLabel('go-back-button')}
      >
        <ArrowBackIcon color={'secondary'} />
      </Button>
      <Formik
        validationSchema={MakeOfferSchema}
        validator={() => ({})}
        initialValues={{
          auditor_id: auditor?.user_id,
          auditor_contacts: { ...auditor?.contacts },
          customer_contacts: { ...project?.creator_contacts },
          customer_id: project?.customer_id,
          last_changer: user.current_role,
          price: project?.price || '',
          description: project?.description || '',
          price_range: {
            from: project?.price || '',
            to: project?.price || '',
          },
          time: {
            from: dayjs(project?.time?.from) || new Date(),
            to: dayjs(project?.time?.to) || new Date(),
          },
          project_id: project?.project_id || project?.id,
          scope: project?.scope,
          time_frame: '',
        }}
        onSubmit={values => {
          const newValue = {
            ...values,
            auditor_id: auditor?.user_id,
            auditor_contacts: { ...auditor?.contacts },
            price: parseInt(values.price),
            price_range: {
              from: parseInt(values.price),
              to: parseInt(values.price),
            },
          };
          if (newValue.auditor_id !== newValue.customer_id) {
            dispatch(createRequest(newValue, redirect));
          } else {
            setError('You cannot create an audit request for your own project');
          }
          handleClose();
          if (onClose) {
            onClose();
          }
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Typography
                variant={'h5'}
                sx={{ width: '100%', textAlign: 'center' }}
              >
                Add more info
              </Typography>
              <Box sx={{ width: '100%' }}>
                <Typography variant={'caption'}>
                  Price per line of code
                </Typography>
                <SalarySlider name={'price'} />
                <Box sx={calcPriceSx}></Box>
              </Box>
              <Box>
                <Typography variant={'caption'}>Time frame</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '20px',
                    marginTop: '15px',
                    alignItems: 'center',
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Field
                      component={DatePicker}
                      name={'time.from'}
                      value={dayjs(values.time?.from)}
                      sx={dateStyle}
                      inputFormat="DD.MM.YYYY"
                      onChange={e => {
                        const value = new Date(e);
                        setFieldValue('time.from', value.toString());
                      }}
                      disablePast
                      minDate={new Date()}
                    />
                    <Typography variant={'caption'}>-</Typography>
                    <Field
                      component={DatePicker}
                      value={dayjs(values.time?.to)}
                      sx={dateStyle}
                      onChange={e => {
                        const value = new Date(e);
                        setFieldValue('time.to', value.toString());
                      }}
                      minDate={dayjs(values.time?.from)}
                      disablePast
                      inputFormat="DD.MM.YYYY"
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
              <Button
                variant={'contained'}
                sx={submitBtn}
                type={'submit'}
                color={'secondary'}
                {...addTestsLabel('send-offer-button')}
              >
                Send offer
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default OfferModal;

const MakeOfferSchema = Yup.object().shape({
  auditor_id: Yup.string(),
  auditor_contacts: Yup.object(),
  customer_contacts: Yup.object(),
  customer_id: Yup.string(),
  opener: Yup.string(),
  price: Yup.number(),
  price_range: Yup.object(),
  project_id: Yup.string(),
  scope: Yup.array(),
  time_frame: Yup.string(),
  time: Yup.object().shape({
    from: Yup.date(),
    to: Yup.date().required().min(Yup.ref('from')),
  }),
});

const dateStyle = {
  width: '150px',
  '& .MuiPickersDay-day': {
    fontSize: '0.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '0.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.8rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    width: '130px',
  },
};

const modalWrapper = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  backgroundColor: '#fff',
  border: '1.5px solid #D9D9D9',
  boxShadow:
    '0px 71.4286px 57.1429px rgba(0, 0, 0, 0.07),' +
    ' 0px 29.8412px 23.8729px rgba(0, 0, 0, 0.0503198), ' +
    '0px 15.9545px 12.7636px rgba(0, 0, 0, 0.0417275), ' +
    '0px 8.94397px 7.15517px rgba(0, 0, 0, 0.035), ' +
    '0px 4.75007px 3.80006px rgba(0, 0, 0, 0.0282725), ' +
    '0px 1.97661px 1.58129px rgba(0, 0, 0, 0.0196802)',
  borderRadius: '10.7143px',
  '& form': {
    paddingX: '100px',
    paddingY: '60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '50px',
    alignItems: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    width: 380,
    '& form': {
      paddingX: '20px',
      paddingY: '30px',
      gap: '30px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    width: 350,
  },
});

const submitBtn = theme => ({
  textTransform: 'unset',
  width: '360px',
  paddingY: '24px',
  fontWeight: 600,
  fontSize: '18px',
  borderRadius: '10px',
  [theme.breakpoints.down('sm')]: {
    width: '140px',
    paddingY: '12px',
  },
});

const calcPriceSx = {
  border: '1px solid #e0e0e0',
  borderRadius: '5px',
  width: '100%',
  padding: '15px',
  color: '#333',
  fontSize: '14px',
  fontWeight: 500,
  '& > div': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};
