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
import { GET_AUDITOR } from "../redux/actions/types.js";
import { Paper, Typography } from "@mui/material";
import AuditorSearchListBox from "./custom/AuditorSearchListBox.jsx";
import SalarySlider from "./forms/salary-slider/salary-slider.jsx";

export default function AuditorSearchModal({ open, handleClose }) {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [auditorsList, setAuditorsList] = useState([]);

  const [selectedAuditor, setSelectedAuditor] = useState("");

  const [openDrop, setOpenDrop] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [query, setQuery] = useState("");

  const sendRequest = debounce(() => {
    const token = Cookies.get("token");
    // return () => {
    axios
      .get(`${API_URL}/auditors`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        console.log(data["auditors"]);
        setAuditorsList(data["auditors"]);
        // dispatch({type: GET_AUDITOR, payload: data})
      })
      .catch(({ response }) => {
        console.log(response, "res");
      });
  }, 500);

  useEffect(() => {
    sendRequest();
  }, [query]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleOptionChange = (event, value) => {
    console.log(value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={modalWindow}>
        <Box sx={fieldButtonContainer}>
          <Autocomplete
            open={openDrop}
            onOpen={() => {
              if (inputValue) {
                setOpenDrop(true);
              }
            }}
            onClose={() => setOpenDrop(false)}
            inputValue={inputValue}
            onInputChange={(e, value, reason) => {
              setInputValue(value);

              // only open when inputValue is not empty after the user typed something
              if (!value) {
                setOpenDrop(false);
              }
            }}
            freeSolo
            onChange={handleOptionChange}
            options={auditorNames}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <AuditorSearchListBox {...props} auditor={option.label} />
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
                  // className: classes.input,
                  // sx: {
                  //   color: "red",
                  //   // height: "40px",
                  //   padding: "0px",
                  // },
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
          <Button sx={findButton}>Find</Button>
        </Box>
        {/*<Box>*/}
        {/*  <Box>*/}
        {/*    <Typography sx={rateLabel}>Tax rate per stroke</Typography>*/}
        {/*    <SalarySlider />*/}
        {/*  </Box>*/}
        {/*</Box>*/}
      </DialogContent>
    </Dialog>
  );
}

const CustomPaper = (props) => {
  return <Paper {...props} sx={customDropdown} />;
};

const modalWindow = {
  backgroundColor: theme.palette.primary.main,
  width: "700px",
  height: "170px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    height: "100px",
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

const rateLabel = (theme) => ({
  fontSize: "15px",
  color: "#B2B3B3",
  fontWeight: 500,
});

const auditorNames = [
  { label: "Testov test", status: "Free to audit" },
  { label: "Ivan Ivanov", status: "Free to audit" },
  { label: "Akhmet Akhmetov", status: "Free to audit" },
  { label: "Aket Ahmetov", status: "Free to audit" },
  { label: "Abraham Linkoln Barrows", status: "Free to audit" },
];
