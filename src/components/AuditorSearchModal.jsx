import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import theme from "../styles/themes.js";
import { Box } from "@mui/system";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Cookies from "js-cookie";
import axios from "axios";
import { AUDITOR, GET_AUDITOR } from "../redux/actions/types.js";
import { Paper, Slider, Typography } from "@mui/material";
import AuditorSearchListBox from "./custom/AuditorSearchListBox.jsx";
import SalarySlider from "./forms/salary-slider/salary-slider.jsx";
import IconButton from "@mui/material/IconButton";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../redux/actions/projectAction.js";
import { getAuditors } from "../redux/actions/auditorAction.js";
import { createRequest } from "../redux/actions/auditAction.js";
import { customerReducer } from "../redux/reducers/customerReducer.js";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import star from "./icons/Star.jsx";
import { useNavigate } from "react-router-dom";

export default function AuditorSearchModal({
  open,
  handleClose,
  handleSubmit,
    setState,
  editMode,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const auditorReducer = useSelector((state) => state.auditor.auditors);
  const projectReducer = useSelector((state) => state.project);
  const customerReducer = useSelector((state) => state.customer);

  const [auditorsList, setAuditorsList] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const [selectedAuditor, setSelectedAuditor] = useState({});

  const [openDrop, setOpenDrop] = useState(false);
  const [mode, setMode] = useState("search");

  const [inputValue, setInputValue] = useState("");
  const [taxInput, setTaxInput] = useState(50);
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [query, setQuery] = useState("");


  useEffect(() => {
    // console.log("searching...");
    dispatch(getAuditors(query));
  }, [query]);

  const handleStartTimeChange = (e) => {
    setStartTime(e);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e);
  };

  useEffect(() => {
    if (submitted) {
      const request = {
        auditor_contacts: selectedAuditor.contacts ?? {},
        auditor_id: selectedAuditor.user_id,
        customer_contacts: customerReducer.customer
          ? customerReducer.customer.contacts
          : {},
        customer_id: customerReducer.customer.user_id,
        description: projectReducer.recentProject.description,
        opener: "Customer",
        price: parseInt(taxInput),
        price_range: {
          from: parseInt(taxInput),
          to: parseInt(taxInput),
        },
        project_id: projectReducer.recentProject.id,
        scope: projectReducer.recentProject.scope,
        time: {
          from: startTime.format("YYYY-MM-DD"),
          to: endTime.format("YYYY-MM-DD"),
        },
        time_frame: "string",
      };
      dispatch(createRequest(request));
      // navigate("/edit-project", {
      //   state: { project: projectReducer.recentProject },
      // });
      setMode("search");
      setSubmitted(false);
    }
  }, [projectReducer.recentProject]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setState(event.target.value);
  };

  const handleOptionChange = (option) => {
    // console.log(option);
    setSelectedAuditor(option);
    setMode("offer");
  };

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

  const handleSearch = () => {
    handleSubmit()
    navigate(`/auditors?search=${query}`, );
  }

  const [errorStart, setErrorStart] = React.useState(null);
  const [errorEnd, setErrorEnd] = React.useState(null);

  return (
    <Dialog open={open} onClose={handleClose}>
      {mode === "search" && (
        <DialogContent sx={modalWindow}>
          <Box sx={fieldButtonContainer}>
            {auditorReducer && (
              <Autocomplete
                open={openDrop}
                onOpen={() => {
                  if (inputValue) {
                    setOpenDrop(true);
                  }
                }}
                openOnFocus={true}
                onClose={() => setOpenDrop(false)}
                inputValue={inputValue}
                onInputChange={(e, value, reason) => {
                  setInputValue(value);
                  if (!value) {
                    setOpenDrop(false);
                  }
                }}
                freeSolo
                onChange={handleOptionChange}
                options={auditorReducer}
                filterOptions={(options) => options} // <-- return all options as is
                getOptionLabel={(option) => option.user_id}
                renderOption={(props, option) => (
                  <AuditorSearchListBox
                    {...props}
                    auditor={option}
                    handleSelectOption={() => handleOptionChange(option)}
                  />
                )}
                PaperComponent={CustomPaper}
                renderInput={(params) => (
                  <TextField
                    variant="outlined"
                    onChange={handleInputChange}
                    {...params}
                    id="name"
                    sx={searchField}
                    // fullWidth
                    type="text"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <SearchIcon sx={searchIcon} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
            <Button
                sx={findButton}
            onClick={handleSearch}
            >
              Find
            </Button>
          </Box>
        </DialogContent>
      )}
      {mode === "offer" && (
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
                  setMode("search");
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
              <Typography style={rateLabel()}>Price per line of code</Typography>
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

const CustomPaper = (props) => {
  return <Paper className={"sss"} {...props} sx={customDropdown} />;
};

const modalWindow = {
  backgroundColor: theme.palette.primary.main,
  width: "700px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    height: "100%",
    width: "100%",
  },
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

const fieldButtonContainer = {
  display: "flex",
  gap: "10px",
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
const findButton = {
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.background.default,
  borderRadius: "4px",
  padding: "12px 63px",
  height: "45px",
  textTransform: "none",
  [theme.breakpoints.down("sm")]: {
    height: "30px",
    fontSize: "11px",
    padding: "6px 31px",
  },
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

const infoWrapper = (theme) => ({
  border: "1.42857px solid #E5E5E5",
  width: "100px",
  padding: "15px 0",
  textAlign: "center",
});
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
const auditorNames = [
  {
    label: "Testov test",
    status: "Free to audit",
  },
  {
    label: "Ivan Ivanov",
    status: "Free to audit",
  },
  {
    label: "Akhmet Akhmetov",
    status: "Free to audit",
  },
  {
    label: "Aket Ahmetov",
    status: "Free to audit",
  },
  {
    label: "Abraham Linkoln Barrows",
    status: "Free to audit",
  },
];
