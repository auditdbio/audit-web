import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import theme from "../../styles/themes.js";

const AuditorSearchListBox = ({ auditor }) => {
  return (
    <Box sx={mainContainer}>
      <Box>
        <Typography sx={nameStyle(theme)}>{auditor}</Typography>
      </Box>

      <Box sx={statusContainer}>
        <CircleIcon sx={circleStyle} />

        <Typography sx={statusStyle(theme)}>Free to audit</Typography>
      </Box>
    </Box>
  );
};

export default AuditorSearchListBox;

const mainContainer = {
  display: "flex",
  alignItems: "start",
  height: "60px",
  gap: "120px",
  padding: "12px 12px 0px 30px",
  fontWeight: "600",
  borderBottom: "1px solid #434242",
  [theme.breakpoints.down("sm")]: {
    height: "35px",
    padding: "10px",
    gap: "10px",
    width: "120px",
  },
};

const statusContainer = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  [theme.breakpoints.down("sm")]: {
    gap: "10px",
  },
};

const nameStyle = (theme) => ({
  // fontSize: "14px",
  fontWeight: "500px",
  width: {
    zero: "100%",
    sm: "150px",
    md: "150px",
    lg: "180px",
  },

  fontSize: {
    zero: "9px",
    sm: "14px",
    md: "14px",
    lg: "14px",
  },
});

const statusStyle = (theme) => ({
  // fontSize: "10px",
  fontWeight: "500",
  color: "#434242",

  display: {
    zero: "none",
    sm: "none",
    md: "flex",
    lg: "flex",
  },
  fontSize: {
    zero: "8px",
    sm: "8px",
    md: "10px",
    lg: "10px",
  },
});

const circleStyle = (theme) => ({
  fontSize: "10px",
  color: "#09C010",

  display: {
    zero: "none",
    sm: "none",
    md: "flex",
    lg: "flex",
  },
});
