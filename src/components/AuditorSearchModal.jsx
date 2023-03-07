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
import { Paper } from "@mui/material";

export default function AuditorSearchModal({ open, handleClose }) {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [auditorsList, setAuditorsList] = useState([]);

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
            options={auditorNames}
            ListboxProps={{ sx: listBox }}
            PaperComponent={CustomPaper}
            // sx={autocompleteDropdown }
            renderInput={(params) => (
              <TextField
                onChange={handleInputChange}
                {...params}
                id="name"
                sx={searchField}
                fullWidth
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
          <Button sx={findButton}>Find</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

const CustomPaper = (props) => {
  return <Paper {...props} sx={customDropdown} />;
};

const modalWindow = {
  backgroundColor: theme.palette.primary.main,
  maxWidth: "700px",
  height: "170px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    height: "100px",
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
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.background.default,
    // border: "1px solid #434242",
    borderRadius: "4px",
    padding: "5px 13px",
    height: "45px",
    fontSize: "24px",
    width: "460px",
    [theme.breakpoints.down("sm")]: {
      // width: "100%",
      height: "25px",
      fontSize: "11px",
      // padding: "0",
    },
  },
  "& .MuiAutocomplete-inputRoot": {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      // height: "25px",
      fontSize: "11px",
      padding: "0",
    },
  },
};

const customDropdown = {
  // border: "1px solid #434242",
  borderRadius: "0px",
  // backgroundColor: "transparent",
  boxShadow: "0",
};

const autocompleteDropdown = {
  fontSize: "14px",
  width: "460px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    fontSize: "11px",
  },
  backgroundColor: "#FF9900",
};

const listBox = {
  border: "1px solid #434242",
  "& :hover": {
    backgroundColor: "#FCFAF6",
  },
  "& li": {
    //list item specific styling
    backgroundColor: "#FCFAF6",
    borderBottom: "1px solid #434242",
    borderRadius: 0,
    height: "60px",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0px",
    padding: "0px",
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
    height: "25px",
    fontSize: "11px",
    padding: "6px 31px",
  },
};

const auditorNames = [
  { label: "Testov test", status: "Free to audit" },
  { label: "Ivan Ivanov", status: "Free to audit" },
  { label: "Akhmet Akhmetov", status: "Free to audit" },
  { label: "Aket Ahmetov", status: "Free to audit" },
];
