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
import { useState } from "react";

export default function AuditorSearchModal({ open, handleClose }) {
  const [openDrop, setOpenDrop] = useState(false);
  const [inputValue, setInputValue] = useState("");

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
            // id="combo-box-demo"
            options={auditorNames}
            sx={{ autocompleteDropdown }}
            renderInput={(params) => (
              <TextField
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
                        <SearchIcon />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {/*<TextField*/}
          {/*  type="search"*/}
          {/*  autoFocus*/}
          {/*  id="name"*/}
          {/*  type="text"*/}
          {/*  fullWidth*/}
          {/*  variant="outlined"*/}
          {/*  sx={searchField}*/}
          {/*  InputProps={{*/}
          {/*    startAdornment: (*/}
          {/*      <InputAdornment position="start">*/}
          {/*        <SearchIcon sx={searchIcon} />*/}
          {/*      </InputAdornment>*/}
          {/*    ),*/}
          {/*    // disableUnderline: true,*/}
          {/*  }}*/}
          {/*/>*/}
          <Button sx={findButton}>Find</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

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

const auditorNames = [
  { label: "Testov test", status: "Free to audit" },
  { label: "Ivan Ivanov", status: "Free to audit" },
  { label: "Akhmet Akhmetov", status: "Free to audit" },
  { label: "Aket Ahmetov", status: "Free to audit" },
];

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
    padding: "6px 13px",
    // height: "45px",
    fontSize: "24px",
    width: "460px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "25px",
      fontSize: "11px",
    },
  },
};

const autocompleteDropdown = {
  fontSize: "14px",
  width: "460px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    fontSize: "11px",
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
