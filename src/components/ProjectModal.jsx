import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import theme from "../styles/themes.js";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function ProjectModal({ open, handleClose, project }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const projectReducer = useSelector((state) => state.project);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={modalWindow}>
        <Box sx={titlesBox}>
          <Typography sx={modalHeader}>{project.name}</Typography>
          <Typography sx={modalSubheader}>
            {" "}
            {project.tags
              .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
              .join(", ")}
          </Typography>
          <Typography sx={modalDescription}>{project.description}</Typography>
        </Box>
        <Box sx={linksList}>
          <Box sx={linkGroup}>
            <GitHubIcon sx={iconStyle} />
            <Typography sx={linkStyle}>
              https://dev.auditdb.io/swagger-ui/?urls.primaryName=audits#/audits/requests_by_id
            </Typography>
          </Box>
        </Box>
        <Box sx={fieldButtonContainer}>
          <Button sx={backButton}>Back</Button>
          <Button sx={findButton}>Make offer</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

const modalWindow = {
  backgroundColor: theme.palette.background,
  width: "700px",
  display: "flex",
  gap: "50px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    height: "100%",
    width: "100%",
    gap: "20px",
  },
};

const titlesBox = {
  display: "flex",
  flexDirection: "column",
  gap: {
    zero: "10px",
    sm: "15px",
    md: "25px",
    lg: "30px",
  },
  alignItems: "center",
};

const modalHeader = {
  fontSize: {
    zero: "30px",
    sm: "30px",
    md: "33px",
    lg: "37px",
  },
  fontWeight: "500",
};

const modalSubheader = {
  fontSize: {
    zero: "20px",
    sm: "20px",
    md: "22px",
    lg: "25px",
  },
  fontWeight: "400",
};

const modalDescription = {
  fontSize: {
    zero: "12px",
    sm: "12px",
    md: "14px",
    lg: "15px",
  },
  fontWeight: "400",
};

const linksList = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const iconStyle = {
  fontSize: {
    zero: "15px",
    sm: "20px",
    md: "25px",
    lg: "30px",
  },
};
const linkStyle = {
  fontSize: {
    zero: "12px",
    sm: "12px",
    md: "14px",
    lg: "16px",
  },
  width: {
    zero: "180px",
    sm: "300px",
    md: "400px",
    lg: "450px",
  },
  whiteSpace: "nowrap",
  color: "#152BEA",
  textDecoration: "underline",
  textOverflow: "ellipsis",
  overflow: "hidden",
};

const linkGroup = {
  maxWidth: {
    zero: "280px",
    sm: "380px",
    md: "550px",
    lg: "550px",
  },
  display: "flex",
  gap: {
    zero: "10px",
    sm: "12px",
    md: "14px",
    lg: "16px",
  },
  alignItems: "center",
};
const fieldButtonContainer = {
  display: "flex",
  gap: "10px",
};

const findButton = {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.default,
  borderRadius: "4px",
  padding: "12px 63px",
  height: "45px",
  textTransform: "none",
  ":hover": {
    backgroundColor: theme.palette.primary.main,
  },
  [theme.breakpoints.down("sm")]: {
    height: "30px",
    fontSize: "10px",
    padding: "6px 31px",
  },
};

const backButton = {
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.background.default,
  borderRadius: "4px",
  padding: "12px 63px",
  height: "45px",
  textTransform: "none",
  ":hover": {
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down("sm")]: {
    height: "30px",
    fontSize: "10px",
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
