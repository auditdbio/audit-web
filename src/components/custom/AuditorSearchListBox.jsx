import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import theme from "../../styles/themes.js";

const AuditorSearchListBox = ({ auditor }) => {
  return (
    <Box sx={mainContainer}>
      <Box>
        <Typography style={nameStyle}>{auditor}</Typography>
      </Box>

      <Box sx={statusContainer}>
        <CircleIcon sx={circleStyle} />

        <Typography style={statusStyle}>Free to audit</Typography>
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

const nameStyle = {
  fontSize: "9px",
  fontWeight: "500px",
  width: "150px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "9px",
  },
};

const statusStyle = {
  fontSize: "10px",
  fontWeight: "500",
  color: "#434242",
  [theme.breakpoints.down("sm")]: {
    fontSize: "8px",
  },
};

const circleStyle = {
  fontSize: "10px",
  color: "#09C010",
  [theme.breakpoints.down("sm")]: {
    fontSize: "8px",
  },
};
