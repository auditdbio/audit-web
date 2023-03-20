import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import theme from "../styles/themes.js";
import { Box } from "@mui/system";
import { Avatar, Slider, Typography } from "@mui/material";
import TagsList from "./tagsList.jsx";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { ArrowBack } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { getAuditors } from "../redux/actions/auditorAction.js";
import { createRequest } from "../redux/actions/auditAction.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuth } from "../lib/helper.js";

export default function AuditorModal({ open, handleClose, auditor }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const auditorReducer = useSelector((state) => state.auditor.auditors);
  const projectReducer = useSelector((state) => state.project);
  const customerReducer = useSelector((state) => state.customer);

  const [mode, setMode] = useState("info");
  const [submitted, setSubmitted] = useState(false);
  const [openDrop, setOpenDrop] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [taxInput, setTaxInput] = useState(50);
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [query, setQuery] = useState("");

  const handleInvite = () => {
    if (!isAuth()) {
      navigate("/sign-up");
      return
    }
    setMode("invite");
  };

  // useEffect(() => {
  //   // console.log("searching...");
  //   dispatch(getAuditors(query));
  // }, [query]);

  const handleStartTimeChange = (e) => {
    setStartTime(e);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e);
  };

  // useEffect(() => {
  //   if (submitted) {
  //     const request = {
  //       auditor_contacts: selectedAuditor.contacts ?? {},
  //       auditor_id: selectedAuditor.user_id,
  //       customer_contacts: customerReducer.customer
  //           ? customerReducer.customer.contacts
  //           : {},
  //       customer_id: customerReducer.customer.user_id,
  //       description: projectReducer.recentProject.description,
  //       opener: "Customer",
  //       price: taxInput.toString(),
  //       price_range: {
  //         lower_bound: "",
  //         upper_bound: "string",
  //       },
  //       project_id: projectReducer.recentProject.id,
  //       scope: projectReducer.recentProject.scope,
  //       time: {
  //         begin: startTime.format("YYYY-MM-DD"),
  //         end: endTime.format("YYYY-MM-DD"),
  //       },
  //       time_frame: "string",
  //     };
  //     dispatch(createRequest(request));
  //     // navigate("/edit-project", {
  //     //   state: { project: projectReducer.recentProject },
  //     // });
  //     setMode("search");
  //     setSubmitted(false);
  //   }
  // }, [projectReducer.recentProject]);

  // const handleInputChange = (event) => {
  //   setQuery(event.target.value);
  // };
  //
  // const handleOptionChange = (option) => {
  //   // console.log(option);
  //   setSelectedAuditor(option);
  //   setMode("offer");
  // };

  const handleSend = async () => {
    const isStartDateValid = dayjs(startTime, "DD.MM.YYYY").isValid();
    const isEndDateValid = dayjs(endTime, "DD.MM.YYYY").isValid();
    // console.log("start", startTime.format('YYYY-MM-DD'));
    // console.log("end", endTime.format('YYYY-MM-DD'));
    if (!isStartDateValid) {
      setErrorStart("Enter start date");
    } else {
      setErrorStart(null);
    }
    if (!isEndDateValid) {
      setErrorEnd("Enter end date");
    } else {
      setErrorEnd(null);
    }
    handleSubmit();
    setSubmitted(true);
    handleClose();
  };

  const [errorStart, setErrorStart] = React.useState(null);
  const [errorEnd, setErrorEnd] = React.useState(null);

  return (
    <Dialog open={open} onClose={handleClose}>
      {mode === "info" && (
        <DialogContent sx={modalWindow}>
          <Box sx={contentWrapper}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar src={auditor.avatar} sx={avatarStyle} />
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
                    {auditor.contacts?.telegram}
                  </Typography>
                </Box>
                <Box sx={infoWrapper}>
                  <span>Price:</span>
                  {auditor?.tax && (
                    <Typography>${auditor?.tax} per line</Typography>
                  )}
                </Box>
                <Box sx={infoWrapper}>
                  <span>Company</span>
                  <Typography noWrap={true}>{auditor.company}</Typography>
                </Box>
                <Box sx={infoWrapper}>
                  <span>E-mail</span>
                  <Typography noWrap={true}>
                    {auditor.contacts?.email}
                  </Typography>
                </Box>
                <TagsList data={auditor.tags} />
              </Box>
              <Box sx={infoInnerStyle}></Box>
            </Box>
          </Box>
          <Box sx={fieldButtonContainer}>
            <Button sx={backButton} onClick={handleClose}>
              Back
            </Button>
            <Button sx={findButton} onClick={handleInvite}>
              Invite to project
            </Button>
          </Box>
        </DialogContent>
      )}
      {mode === "invite" && (
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
                  setMode("info");
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
              {/*<Box sx={dateWrapper}>*/}
              {/*  <TextField*/}
              {/*    type={"date"}*/}
              {/*    placeholder={""}*/}
              {/*    value={dayjs(startTime).format("YYYY-MM-DD")}*/}
              {/*    onChange={handleStartTimeChange}*/}
              {/*    sx={dateStyle}*/}
              {/*    inputProps={{*/}
              {/*      inputMode: "numeric", // specify that the input should be numeric only*/}
              {/*      inputFormat: ''*/}
              {/*    }}*/}
              {/*  />*/}
              {/*  <Typography variant={"caption"}>-</Typography>*/}
              {/*  <TextField*/}
              {/*    type={"date"}*/}
              {/*    placeholder={""}*/}
              {/*    value={endTime ? endTime.format("YYYY-MM-DD") : ""}*/}
              {/*    onChange={handleEndTimeChange}*/}
              {/*    inputProps={{*/}
              {/*      min: minDate,*/}
              {/*    }}*/}
              {/*    sx={dateStyle}*/}
              {/*  />*/}
              {/*</Box>*/}
              <Box sx={dateWrapper}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={startTime}
                    onChange={handleStartTimeChange}
                    sx={dateStyle}
                    disablePast
                    slotProps={{
                      textField: {
                        helperText: errorStart,
                      },
                    }}
                  />
                  <Typography variant={"caption"}>-</Typography>
                  <DatePicker
                    value={endTime}
                    onChange={handleEndTimeChange}
                    sx={dateStyle}
                    disablePast
                    slotProps={{
                      textField: {
                        helperText: errorEnd,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              {/*{startTime.format("DD/MM/YYYY")}*/}
              {/*{endTime.format("DD/MM/YYYY")}*/}
              <Typography style={rateLabel()}>
                Price per line of code
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginY: "20px",
                }}
              >
                <Slider
                  value={taxInput}
                  name={"taxField.name"}
                  valueLabelDisplay="off"
                  sx={sliderSx}
                  color={"primary"}
                  onChange={(e) =>
                    setTaxInput(Number(e.target.value.toString()))
                  }
                />
                <Box sx={infoWrapper}>{taxInput || 0}</Box>
              </Box>
              <Box sx={{ justifyContent: "center", display: "flex" }}>
                <Button sx={sendButton} onClick={handleSend}>
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
}

const modalWindow = {
  backgroundColor: theme.palette.background,

  width: "600px",
  display: "flex",
  gap: "50px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: {
    zero: "25px",
    sm: "25px",
    md: "45px",
    lg: "50px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "100%",
    width: "100%",
    gap: "20px",
  },
};

const findButton = {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.default,
  borderRadius: "4px",
  height: "45px",
  width: {
    zero: "100px",
    sm: "100px",
    md: "150px",
    lg: "230px",
  },
  textTransform: "none",
  ":hover": {
    backgroundColor: theme.palette.primary.main,
  },
  [theme.breakpoints.down("sm")]: {
    height: "30px",
    fontSize: "10px",
  },
};

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
      maxWidth: "190px",
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

const fieldButtonContainer = {
  display: "flex",
  gap: "10px",
};

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
