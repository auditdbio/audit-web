import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import theme from '../styles/themes.js';
import { Box } from '@mui/system';
import { Avatar, Tooltip, Typography } from '@mui/material';
import TagsList from './tagsList.jsx';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { ArrowBack } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addTestsLabel, isAuth } from '../lib/helper.js';
import { ASSET_URL } from '../services/urls.js';
import SalarySlider from './forms/salary-slider/salary-slider.jsx';
import { Field, Form, Formik } from 'formik';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import {
  changeRolePublicCustomer,
  changeRolePublicCustomerNoRedirect,
} from '../redux/actions/userAction.js';
import * as Yup from 'yup';
import CustomSnackbar from './custom/CustomSnackbar.jsx';
import ShareProfileButton from './custom/ShareProfileButton.jsx';
import PriceCalculation from './PriceCalculation.jsx';
import { setCurrentChat } from '../redux/actions/chatActions.js';
import ChatIcon from './icons/ChatIcon.jsx';

export default function AuditorModal({
  open,
  handleClose,
  auditor,
  isForm,
  onSubmit,
  handleError,
  setError,
  budge,
  chosen,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customerReducer = useSelector(state => state.customer.customer);
  const { user } = useSelector(s => s.user);
  const { chatList } = useSelector(s => s.chat);
  const myProjects = useSelector(state => state.project.myProjects);

  const [mode, setMode] = useState('info');
  const [message, setMessage] = useState('');
  const [scope, setScope] = useState([]);

  const handleInvite = () => {
    if (user.current_role === CUSTOMER && isAuth() && myProjects.length) {
      return navigate(`/my-projects/${auditor.user_id}`);
    } else if (
      user.current_role !== CUSTOMER &&
      isAuth() &&
      !customerReducer?.first_name &&
      handleError
    ) {
      dispatch(changeRolePublicCustomer(CUSTOMER, user.id));
      handleError();
    } else if (
      user.current_role !== CUSTOMER &&
      isAuth() &&
      customerReducer?.first_name &&
      handleError
    ) {
      dispatch(
        changeRolePublicCustomerNoRedirect(CUSTOMER, user.id, customerReducer),
      );
      handleError();
    } else if (
      user.current_role === CUSTOMER &&
      isAuth() &&
      !myProjects.length
    ) {
      setMessage('No active projects');
    } else {
      navigate('/sign-in');
    }
  };

  const handleSendMessage = () => {
    window.scrollTo(0, 0);

    const existingChat = chatList.find(chat =>
      chat.members?.find(
        member =>
          member.id === auditor?.user_id &&
          member.role?.toLowerCase() === AUDITOR,
      ),
    );
    const chatId = existingChat ? existingChat.id : auditor?.user_id;
    const members = [auditor?.user_id, user.id];

    dispatch(
      setCurrentChat(chatId, {
        name: auditor.first_name,
        avatar: auditor.avatar,
        role: AUDITOR,
        isNew: !existingChat,
        members,
      }),
    );
    localStorage.setItem('path', window.location.pathname);
    navigate(`/chat/${existingChat ? existingChat.id : auditor?.user_id}`);
  };

  useEffect(() => {
    if (open && !isForm) {
      setMode('info');
    } else if (open && isForm) {
      setMode('invite');
    } else {
      setMode('');
    }
  }, [open, isForm]);

  useEffect(() => {
    if (chosen) {
      setScope(chosen.reduce((acc, project) => [...acc, ...project.scope], []));
    }
  }, [chosen]);

  return (
    <Dialog open={open} onClose={handleClose} sx={dialogSx}>
      <Box className="auditor-modal" sx={{ overflowX: 'hidden' }}>
        {mode === 'info' && (
          <DialogContent sx={modalWindow}>
            <CustomSnackbar
              autoHideDuration={10000}
              open={!!message}
              onClose={() => setMessage(null)}
              severity="error"
              text={message}
            />
            <Box sx={contentWrapper}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={auditor.avatar && `${ASSET_URL}/${auditor.avatar}`}
                  sx={avatarStyle}
                  alt={`${auditor.first_name} photo`}
                />
              </Box>
              <ShareProfileButton
                userId={auditor.link_id || auditor.user_id}
                sx={{ fontSize: '12px' }}
                isModal
                role={AUDITOR}
                isPublic
              />
              <Box sx={infoStyle}>
                <Box sx={infoInnerStyle}>
                  <Box sx={infoWrapper}>
                    <span>First Name</span>
                    <Typography noWrap={true}>{auditor.first_name}</Typography>
                  </Box>
                  <Box sx={infoWrapper}>
                    <span>Last name</span>
                    <Typography noWrap={true}>{auditor.last_name}</Typography>
                  </Box>
                  <Box sx={infoWrapper}>
                    <span>Telegram</span>
                    <Box sx={{ display: 'grid' }}>
                      <Tooltip
                        title={
                          auditor?.contacts?.public_contacts
                            ? auditor.contacts?.telegram
                            : 'Hidden'
                        }
                        arrow
                        placement={'top'}
                      >
                        <Typography noWrap={true}>
                          {auditor?.contacts?.public_contacts
                            ? auditor.contacts?.telegram
                            : 'Hidden'}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>
                  {(auditor.price_range.from > 0 ||
                    auditor.price_range.to > 0) && (
                    <Box sx={infoWrapper}>
                      <span>Price:</span>
                      {auditor.price_range.from && (
                        <Typography>
                          ${auditor.price_range.from} - {auditor.price_range.to}{' '}
                          per line
                        </Typography>
                      )}
                    </Box>
                  )}
                  <Box sx={infoWrapper}>
                    <span>E-mail</span>
                    <Box sx={{ display: 'grid' }}>
                      <Tooltip
                        title={
                          auditor?.contacts?.public_contacts
                            ? auditor.contacts?.email
                            : 'Hidden'
                        }
                        arrow
                        placement="top"
                      >
                        <Typography noWrap={true}>
                          {auditor?.contacts?.public_contacts
                            ? auditor.contacts?.email
                            : 'Hidden'}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>

                  {auditor?.about && (
                    <Box sx={[infoWrapper, aboutSx]}>
                      <Typography>
                        <span>About</span> {auditor?.about}
                      </Typography>
                    </Box>
                  )}
                  <TagsList data={auditor.tags} fullView={true} />
                </Box>
              </Box>
            </Box>

            <Box sx={fieldButtonContainer}>
              <Box sx={{ mb: '10px', display: 'flex' }}>
                <Button
                  variant={budge ? 'outlined' : 'contained'}
                  color="secondary"
                  sx={findButton}
                  onClick={handleClose}
                  {...addTestsLabel('auditor-modal_back-button')}
                >
                  Back
                </Button>
                <Button
                  variant={budge ? 'outlined' : 'contained'}
                  color="primary"
                  sx={findButton}
                  onClick={handleInvite}
                  {...addTestsLabel('auditor-modal_invite-button')}
                >
                  Invite to project
                </Button>
                {!budge && (
                  <Button
                    variant="text"
                    // sx={[findButton, messageButton]}
                    onClick={handleSendMessage}
                    disabled={auditor?.user_id === user.id}
                    {...addTestsLabel('message-button')}
                  >
                    <ChatIcon />
                  </Button>
                )}
              </Box>
            </Box>
          </DialogContent>
        )}

        {mode === 'invite' && (
          <Formik
            validator={() => ({})}
            validationSchema={MakeOfferSchema}
            initialValues={{
              auditor_id: auditor?.user_id,
              auditor_contacts: { ...auditor?.contacts },
              customer_contacts: { ...customerReducer?.contacts },
              customer_id: customerReducer?.user_id,
              last_changer: CUSTOMER,
              price: '50',
              price_range: {
                from: '',
                to: '',
              },
              time: {
                from: new Date(),
                to: new Date(),
              },
            }}
            onSubmit={values => {
              const newValue = {
                ...values,
                price: parseInt(values.price),
                price_range: {
                  from: parseInt(values.price),
                  to: parseInt(values.price),
                },
              };
              if (newValue.auditor_id !== newValue.customer_id) {
                onSubmit(newValue);
              } else {
                setError('You cannot create an audit request with yourself');
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
                  <DialogContent sx={offerDialogStyle}>
                    <Box
                      sx={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Box>
                        <IconButton
                          onClick={() => {
                            handleClose();
                          }}
                          {...addTestsLabel('go-back-button')}
                        >
                          <ArrowBack style={{ color: 'orange' }} />
                        </IconButton>
                      </Box>

                      <Box sx={{ paddingX: '10%' }}>
                        <Typography
                          style={{
                            ...rateLabel(),
                            color: 'black',
                            marginBottom: '10px',
                            fontSize: '13px',
                          }}
                        >
                          Add some information
                        </Typography>
                        <Typography style={rateLabel()}>
                          Choose audit timeline
                        </Typography>
                        <Box sx={dateWrapper}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Field
                              component={DatePicker}
                              name={'time.from'}
                              value={dayjs(values.time?.from)}
                              sx={dateStyle}
                              onChange={e => {
                                const value = new Date(e);
                                setFieldValue('time.from', value.toString());
                              }}
                              disablePast
                              inputFormat="DD.MM.YYYY"
                              minDate={new Date()}
                            />
                            <Typography variant={'caption'}>-</Typography>
                            <Field
                              component={DatePicker}
                              name={'time.to'}
                              value={dayjs(values.time?.to)}
                              sx={dateStyle}
                              onChange={e => {
                                const value = new Date(e);
                                setFieldValue('time.to', value.toString());
                              }}
                              disablePast
                              inputFormat="DD.MM.YYYY"
                              minDate={dayjs(values.time?.from)}
                            />
                          </LocalizationProvider>
                        </Box>
                        <Typography style={rateLabel()}>
                          Price per line of code
                        </Typography>
                        <Box
                          sx={{
                            marginY: '20px',
                          }}
                        >
                          <SalarySlider name={'price'} />
                          {/*<PriceCalculation*/}
                          {/*  price={values.price}*/}
                          {/*  sx={priceCalc}*/}
                          {/*  scope={scope}*/}
                          {/*/>*/}
                        </Box>
                        <Box sx={{ justifyContent: 'center', display: 'flex' }}>
                          <Button
                            sx={sendButton}
                            type={'submit'}
                            {...addTestsLabel('send-button')}
                          >
                            Send
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </DialogContent>
                </Form>
              );
            }}
          </Formik>
        )}
      </Box>
    </Dialog>
  );
}

const MakeOfferSchema = Yup.object().shape({
  auditor_contacts: Yup.object(),
  auditor_id: Yup.string(),
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

const modalWindow = theme => ({
  backgroundColor: theme.palette.background,
  overflow: 'unset',
  width: '600px',
  display: 'flex',
  gap: '30px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '30px',
  [theme.breakpoints.down('sm')]: {
    padding: '25px',
    height: '100%',
    width: '100%',
    gap: '20px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '20px 10px',
  },
});

const findButton = theme => ({
  padding: '10px 0',
  fontSize: '16px',
  textTransform: 'unset',
  fontWeight: 600,
  mr: '20px',
  width: '210px',
  borderRadius: '10px',
  ':last-child': { mr: 0 },
  [theme.breakpoints.down('md')]: {
    padding: '11px 0',
  },
  [theme.breakpoints.down('sm')]: {
    width: '170px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '110px',
    height: '50px',
    fontSize: '12px',
    mr: '6px',
  },
});

const infoInnerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const infoStyle = theme => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    gap: '10px',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '16px',
    margin: 0,
  },
});

const avatarStyle = theme => ({
  width: '120px',
  height: '120px',
  [theme.breakpoints.down('xs')]: {
    width: '100px',
    height: '100px',
  },
});

const dialogSx = theme => ({
  '& .MuiPaper-root': {
    [theme.breakpoints.down('md')]: {
      width: '680px !important',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100% !important',
    },
  },
});

const contentWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '20px',
  },
});

const infoWrapper = theme => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  color: '#434242',
  '& p': {
    fontSize: 'inherit',
  },
  '& span': {
    width: '95px',
    marginRight: '20px',
    color: '#B2B3B3',
  },
  fontSize: '14px',
  [theme.breakpoints.down('md')]: {
    '& span': {
      width: '90px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
    '& span': {
      width: '80px',
      marginRight: '10px',
    },
  },
});

const aboutSx = theme => ({
  '& span': {
    marginRight: '66px',
  },
  [theme.breakpoints.down('md')]: {
    '& span': {
      marginRight: '61px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    '& span': {
      marginRight: '51px',
    },
  },
});

const backButton = {
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.background.default,
  borderRadius: '4px',
  width: {
    zero: '100px',
    sm: '100px',
    md: '150px',
    lg: '230px',
  },
  height: '45px',
  textTransform: 'none',
  ':hover': {
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down('sm')]: {
    height: '30px',
    fontSize: '10px',
  },
};

const fieldButtonContainer = theme => ({
  display: 'flex',
  flexDirection: 'column',
  mb: '10px',
  [theme.breakpoints.down('xs')]: {
    '& svg': {
      width: '50px',
    },
  },
});

const offerDialogStyle = {
  backgroundColor: 'white',
  padding: '10px',
  width: '720px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: '30px',
    height: '100%',
    width: '100%',
  },
};
const searchIcon = {
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
};

const searchField = {
  '& .MuiAutocomplete-input': {
    fontSize: '14px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '11px',
    },
  },
  '&  .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.default,
    padding: '0px',
    height: '45px',
    borderRadius: '4px',
    paddingLeft: '8px',
    fontSize: '14px !important',
    width: '465px',
    [theme.breakpoints.down('sm')]: {
      width: '120px',
      height: '30px',
      fontSize: '11px',
      // padding: "0",
    },
  },
};
const customDropdown = {
  '& .MuiAutocomplete-listbox': {
    padding: '0',
  },
  border: '1px solid #434242',
  borderRadius: '0px',
  boxShadow: '0',
  padding: 0,
};

const sendButton = {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.default,
  borderRadius: '4px',
  padding: '12px 63px',
  height: '45px',
  fontWeight: 600,
  width: '50%',
  textTransform: 'none',
  [theme.breakpoints.down('sm')]: {
    height: '30px',
    fontSize: '11px',
    padding: '6px 31px',
  },
  ':hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.default,
  },
};
const rateLabel = theme => ({
  fontSize: '11px',
  color: '#B2B3B3',
  fontWeight: 500,
});

const sliderSx = theme => ({
  height: '9px',
  '& .MuiSlider-track, .MuiSlider-rail': {
    backgroundColor: '#B9B9B9',
    border: 'none',
  },
});

const dateWrapper = {
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5rem',
  alignItems: 'center',
  width: '100%',
  marginTop: '5px',
  marginBottom: '30px',
  [theme.breakpoints.down('sm')]: {
    gap: '5px',
    '& span': {
      fontSize: '8px',
    },
  },
};
const dateStyle = {
  width: '150px',
  height: '40px',
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
};

const priceCalc = {
  width: '100%',
  margin: '30px 0',
  '& .head': { justifyContent: 'center' },
};
