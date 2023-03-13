import { Box, Card, Typography } from "@mui/material";
import theme from "../../../styles/themes";
import { CustomButton } from "../../custom/Button";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import ProjectModal from "../../ProjectModal.jsx";

const PublicProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const handleView = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Card sx={cardWrapper}>
      <ProjectModal
        open={openModal}
        handleClose={handleCloseModal}
        project={project}
      />

      <Typography sx={auditNameStyle}>{project.name}</Typography>
      <Typography sx={nameTextStyle}>Mishail Soronikov</Typography>
      <Typography sx={priceTextStyle}>20 $ per stroke</Typography>
      {/*<Box sx={dateWrapper}>*/}
      {/*  <Typography sx={dateStyle}>10.01.2023</Typography>*/}
      {/*  <Typography>-</Typography>*/}
      {/*  <Typography sx={dateStyle}>10.01.2023</Typography>*/}
      {/*</Box>*/}

      <Box sx={statusWrapper}>
        <Box />
        <Typography>{project.status}</Typography>
      </Box>
      {/*<CustomButton sx={acceptButtonStyle}>Accept</CustomButton>*/}
      <CustomButton
        sx={viewButtonStyle}
        // onClick={() => navigate(`/audit-request/${project.id}`)}
        onClick={handleView}
      >
        {" "}
        View{" "}
      </CustomButton>
    </Card>
  );
};

const cardWrapper = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#FFFFFF",
  width: "100%",
  height: "100%",
  // maxWidth: "340px",
  // maxHeight: "450px",
  gap: "1.5rem",
  // marginY: "1.5rem",
  borderRadius: "1.5rem",
  boxShadow:
    "0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07)," +
    " 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275)," +
    "0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), " +
    "0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), " +
    "0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)",
  [theme.breakpoints.down("sm")]: {
    // maxWidth: "200px",
  },
};

const acceptButtonStyle = {
  backgroundColor: "#52176D",
  color: "white",
  ":hover": { backgroundColor: "#52176D", color: "white" },
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
  },
};

const viewButtonStyle = {
  backgroundColor: "orange",
  color: "white",
  ":hover": { backgroundColor: "orange", color: "white" },
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
  },
};

const statusWrapper = (theme) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  width: "100%",
  "& p": {
    fontSize: "14px",
    fontWeight: 500,
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: "10px",
    },
  },
  "& div": {
    width: "17px",
    height: "17px",
    borderRadius: "50%",
    backgroundColor: "#09C010",
    [theme.breakpoints.down("sm")]: {
      width: "10px",
      height: "10px",
    },
  },
  margin: "0",
});

const nameTextStyle = {
  color: "#152BEA",
  fontWeight: "500",
  fontSize: "23px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
};

const priceTextStyle = {
  fontWeight: "500",
  fontSize: "23px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
};

const auditNameStyle = {
  fontWeight: "500",
  fontSize: "28px",
  textAlign: "center",
  [theme.breakpoints.down("xs")]: {
    fontSize: "18px",
  },
};

const dateWrapper = {
  display: "flex",
  flexDirection: "row",
  gap: "0.5rem",
  alignItems: "center",
};

const dateStyle = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#434242",
  border: "1.8px #E5E5E5 solid",
  padding: "1rem",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
    padding: "0.3rem",
  },
};
export default PublicProjectCard;
