import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import theme from "../styles/themes.js";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Slider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAuditors } from "../redux/actions/auditorAction.js";
import { createRequest } from "../redux/actions/auditAction.js";

export default function WaitingListModal({ open, handleClose, handleSubmit }) {
  const dispatch = useDispatch();
  const auditorReducer = useSelector((state) => state.auditor.auditors);

  const [submitted, setSubmitted] = useState(false);

  const [selectedAuditor, setSelectedAuditor] = useState({});

  const [inputValue, setInputValue] = useState("");
  const [taxInput, setTaxInput] = useState(50);

  const [query, setQuery] = useState("");
  console.log("auditor reducer", auditorReducer);
  useEffect(() => {
    console.log("searching...");
    dispatch(getAuditors(query));
  }, [query]);

  const handleSendEmail = (event) => {
    event.preventDefault();
    axios
      .post("https://dev.auditdb.io/api/waiting_list", { email: inputValue })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
        alert("Error submitting form!");
      });
    handleClose();
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={modalWindow}>
        <Box sx={{ maxWidth: "80%" }}>
          <Typography sx={modalTitle(theme)}>
            If you want to be placed to waiting list, fill in the form, please
          </Typography>
        </Box>
        <Box sx={fieldButtonContainer}>
          <TextField
            variant="outlined"
            onChange={handleInputChange}
            id="name"
            sx={searchField}
            type="text"
          />
          <Button sx={findButton} onClick={handleSendEmail}>
            Send
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

const modalWindow = {
  backgroundColor: theme.palette.primary.main,
  width: "700px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    height: "100%",
    width: "100%",
  },
};

const modalTitle = (theme) => ({
  color: "white",
  textAlign: "center",
  fontSize: "30px",
  fontWeight: 500,
  marginBottom: "20px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
});

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
