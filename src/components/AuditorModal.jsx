import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import theme from "../styles/themes.js";
import { Box } from "@mui/system";
import {Avatar, Snackbar, Stack, Typography} from "@mui/material";
import TagsList from "./tagsList.jsx";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { ArrowBack } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../lib/helper.js";
import {ASSET_URL} from "../services/urls.js";
import SalarySlider from "./forms/salary-slider/salary-slider.jsx";
import {Field, Form, Formik} from "formik";
import {CUSTOMER} from "../redux/actions/types.js";
import {changeRolePublicCustomer, changeRolePublicCustomerNoRedirect} from "../redux/actions/userAction.js";
import {Alert, AlertTitle} from "@mui/lab";
import * as Yup from "yup";

export default function AuditorModal({ open, handleClose, auditor, isForm, onSubmit, handleError }) {
  const navigate = useNavigate();
  const auditorReducer = useSelector((state) => state.auditor.auditors);
  const customerReducer = useSelector((state) => state.customer.customer);
  const user = useSelector(s=> s.user.user)
  const [mode, setMode] = useState("info");
  const [message, setMessage] = useState('')
  const myProjects = useSelector((state) => state.project.myProjects);
  const dispatch = useDispatch();

  const handleInvite = () => {
    if (user.current_role === CUSTOMER && isAuth() && myProjects.length){
      return navigate(`/my-projects/${auditor.user_id}` )
    } else if (user.current_role !== CUSTOMER && isAuth() && !customerReducer?.first_name && !customerReducer?.last_name){
      dispatch(changeRolePublicCustomer(CUSTOMER, user.id, customerReducer))
    } else if (user.current_role !== CUSTOMER && isAuth() && customerReducer?.first_name && customerReducer?.last_name && handleError){
      dispatch(changeRolePublicCustomerNoRedirect(CUSTOMER, user.id, customerReducer))
      handleError()
    } else if (user.current_role === CUSTOMER && isAuth() && !myProjects.length){
      setMessage('No active projects')
    } else {
      navigate('/sign-in')
    }
  };

  useEffect(() => {
    if (open && !isForm) {
      setMode("info")
    } else {
      setMode("invite")
    }
  }, [open, isForm]);

  return (
    <Dialog open={open} onClose={handleClose}>
      {mode === "info" && (
        <DialogContent sx={modalWindow}>
          <Snackbar
              autoHideDuration={10000}
              open={!!message}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              onClose={() => setMessage(null)}
          >
            <Stack sx={{ width: '100%', flexDirection: 'column', gap: 2 }} spacing={2}>
              <Alert severity='error'>
                <AlertTitle>{message}</AlertTitle>
              </Alert>
            </Stack>
          </Snackbar>
          <Box sx={contentWrapper}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={`${ASSET_URL}/${auditor.avatar}`} sx={avatarStyle} />
            </Box>
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
                  <Typography noWrap={true}>
                    {auditor?.public_contacts ? auditor.contacts?.telegram : 'Hidden'}
                  </Typography>
                </Box>
                <Box sx={infoWrapper}>
                  <span>Price:</span>
                  {auditor.price_range.from && (
                    <Typography>${auditor.price_range.from} - {auditor.price_range.to} per line</Typography>
                  )}
                </Box>
                <Box sx={infoWrapper}>
                  <span>E-mail</span>
                  <Typography noWrap={true}>
                    {auditor?.public_contacts ?  auditor.contacts?.email : 'Hidden'}
                  </Typography>
                </Box>
                <TagsList data={auditor.tags} fullView={true} />
              </Box>
              <Box sx={infoInnerStyle}/>
            </Box>
          </Box>
          <Box sx={fieldButtonContainer}>
            <Button
                variant={'contained'}
                sx={[findButton, {backgroundColor: theme.palette.secondary.main}]}
                onClick={handleClose}
            >
              Back
            </Button>
            <Button
                variant={'contained'}
                sx={findButton}
                onClick={handleInvite}
            >
              Invite to project
            </Button>
          </Box>
        </DialogContent>
      )}
      {mode === "invite" && (
          <Formik
              validator={() => ({})}
              validationSchema={MakeOfferSchema}
              initialValues={{
                auditor_id: auditor?.user_id,
                auditor_contacts: {...auditor?.contacts},
                customer_contacts: {...customerReducer?.contacts},
                customer_id: customerReducer?.user_id,
                last_changer: CUSTOMER,
                price:  '50',
                price_range: {
                  from: '',
                  to: ''
                },
                time: {
                  from: new Date(),
                  to: new Date()
                },
              }}
              onSubmit={(values) => {
                const newValue = {...values,
                  price: parseInt(values.price),
                  price_range: {
                    from: parseInt(values.price),
                    to: parseInt(values.price)
                  }}
                onSubmit(newValue)
                handleClose()
                if (onClose){
                  onClose()
                }
              }}
          >
            {({handleSubmit, setFieldValue, values}) => {
              return (
                  <Form onSubmit={handleSubmit}>
                    <DialogContent sx={offerDialogStyle}>
                      <Box
                          sx={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                      >
                        <Box>
                          <IconButton
                              onClick={() => {
                                handleClose()
                              }}
                          >
                            <ArrowBack style={{ color: "orange" }} />
                          </IconButton>
                        </Box>

                        <Box sx={{ paddingX: "10%" }}>
                          <Typography
                              style={{
                                ...rateLabel(),
                                color: "black",
                                marginBottom: "10px",
                                fontSize: "13px",
                              }}
                          >
                            Add some information
                          </Typography>
                          <Typography style={rateLabel()}>Choose audit timeline</Typography>
                          <Box sx={dateWrapper}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <Field
                                  component={DatePicker}
                                  name={'time.from'}
                                  value={dayjs(values.time?.from)}
                                  sx={dateStyle}
                                  onChange={(e) => {
                                    const value = new Date(e)
                                    setFieldValue('time.from', value.toString())
                                  }}
                                  disablePast
                                  inputFormat='DD.MM.YYYY'
                                  minDate={new Date()}
                              />
                              <Typography variant={"caption"}>-</Typography>
                              <Field
                                  component={DatePicker}
                                  name={'time.to'}
                                  value={dayjs(values.time?.to)}
                                  sx={dateStyle}
                                  onChange={(e) => {
                                    const value = new Date(e)
                                    setFieldValue('time.to', value.toString())
                                  }}
                                  disablePast
                                  inputFormat='DD.MM.YYYY'
                                  minDate={dayjs(values.time?.from)}
                              />
                            </LocalizationProvider>
                          </Box>
                          <Typography style={rateLabel()}>
                            Price per line of code
                          </Typography>
                          <Box
                              sx={{
                                marginY: "20px",
                              }}
                          >
                            <SalarySlider name={'price'}/>
                          </Box>
                          <Box sx={{ justifyContent: "center", display: "flex" }}>
                            <Button sx={sendButton} type={'submit'}>
                              Send
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </DialogContent>
                  </Form>
              )
            }}
          </Formik>
      )}
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
    to: Yup.date()
        .required()
        .min(Yup.ref('from'))
  })
});

const modalWindow = (theme) => ({
  backgroundColor: theme.palette.background,

  width: "600px",
  display: "flex",
  gap: "50px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "45px",
  [theme.breakpoints.down("sm")]: {
    padding: '25px',
    height: "100%",
    width: "100%",
    gap: "20px",
  },
  [theme.breakpoints.down('xs')]: {
    padding: '20px 5px'
  }
})

const findButton = (theme) => ({
  padding: '19px 0',
  fontSize: '18px',
  textTransform: 'unset',
  fontWeight: 600,
  margin: '0 12px',
  width: '180px',
  borderRadius: '10px',
  [theme.breakpoints.down('md')]: {
    width: '210px',
    padding: '11px 0'
  },
  [theme.breakpoints.down('sm')]: {
    width: '170px'
  },
  [theme.breakpoints.down('xs')]: {
    width: '134px',
    height: '50px',
    fontSize: '12px',
    margin: '0 6px',
  }
});

const infoInnerStyle = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const infoStyle = (theme) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    gap: "10px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "16px",
    margin: 0,
  },
});

const avatarStyle = (theme) => ({
  width: "150px",
  height: "150px",
  [theme.breakpoints.down("xs")]: {
    width: "100px",
    height: "100px",
  },
});

const contentWrapper = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: "50px",
  [theme.breakpoints.down("md")]: {
    gap: "50px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "40px",
  },
});

const infoWrapper = (theme) => ({
  display: "flex",
  fontWeight: 500,
  color: "#434242",
  "& p": {
    fontSize: "inherit",
    maxWidth: "250px",
  },
  "& span": {
    width: "125px",
    marginRight: "50px",
    color: "#B2B3B3",
  },
  fontSize: "15px",
  [theme.breakpoints.down("md")]: {
    "& span": {
      width: "90px",
      marginRight: "20px",
    },
    "& p": {
      maxWidth: "160px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    fontSize: "12px",
  },
});

const backButton = {
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.background.default,
  borderRadius: "4px",
  width: {
    zero: "100px",
    sm: "100px",
    md: "150px",
    lg: "230px",
  },
  // padding: "12px 63px",
  height: "45px",
  textTransform: "none",
  ":hover": {
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down("sm")]: {
    height: "30px",
    fontSize: "10px",
    // padding: "6px 31px",
  },
};

const fieldButtonContainer = (theme) => ({
  display: "flex",
  gap: "10px",
  [theme.breakpoints.down('xs')]: {
    gap: '5px'
  }
});

const offerDialogStyle = {
  backgroundColor: "white",
  padding: "10px",
  width: "700px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: "30px",
    height: "100%",
    width: "100%",
  },
};
const searchIcon = {
  [theme.breakpoints.down("sm")]: {
    fontSize: "15px",
  },
};

const searchField = {
  "& .MuiAutocomplete-input": {
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "11px",
    },
  },
  "&  .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.default,
    padding: "0px",
    height: "45px",
    borderRadius: "4px",
    // border: "1px solid #434242",
    paddingLeft: "8px",
    fontSize: "14px !important",
    width: "465px",
    [theme.breakpoints.down("sm")]: {
      width: "120px",
      height: "30px",
      fontSize: "11px",
      // padding: "0",
    },
  },
};
const customDropdown = {
  "& .MuiAutocomplete-listbox": {
    padding: "0",
  },
  border: "1px solid #434242",
  borderRadius: "0px",
  boxShadow: "0",
  padding: 0,
};

const sendButton = {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.default,
  borderRadius: "4px",
  padding: "12px 63px",
  height: "45px",
  width: "50%",
  textTransform: "none",
  [theme.breakpoints.down("sm")]: {
    height: "30px",
    fontSize: "11px",
    padding: "6px 31px",
  },
  ":hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.default,
  },
};
const rateLabel = (theme) => ({
  fontSize: "11px",
  color: "#B2B3B3",
  fontWeight: 500,
});

const sliderSx = (theme) => ({
  height: "9px",
  "& .MuiSlider-track, .MuiSlider-rail": {
    backgroundColor: "#B9B9B9",
    border: "none",
  },
});

// const infoWrapper = (theme) => ({
//   border: "1.42857px solid #E5E5E5",
//   width: "100px",
//   padding: "15px 0",
//   textAlign: "center",
// });
const dateWrapper = {
  display: "flex",
  flexDirection: "row",
  gap: "0.5rem",
  alignItems: "center",
  width: "100%",
  marginTop: "5px",
  marginBottom: "30px",
  [theme.breakpoints.down("sm")]: {
    gap: "5px",
    "& span": {
      fontSize: "8px",
    },
  },
};
const dateStyle = {
  width: "150px",
  height: "40px",
  "& .MuiPickersDay-day": {
    fontSize: "0.8rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "0.8rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.8rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
  },
};
