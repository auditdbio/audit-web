import { Card, Avatar, Box, Typography } from "@mui/material";
import theme from "../../../styles/themes";
import { CustomButton } from "../../custom/Button";
import Currency from "../../icons/Currency";
import Star from "../../icons/Star";
import { useState } from "react";
import AuditorModal from "../../AuditorModal.jsx";

const AuditorCard = ({ auditor }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleView = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Card sx={cardStyle}>
      <AuditorModal
        open={openModal}
        handleClose={handleCloseModal}
        auditor={auditor}
      />
      <Avatar src={auditor.avatar} sx={avatarStyle} />
      <Box sx={columnStyle}>
        <Typography sx={mainTextStyle}>
          {/*Mihael Sorokin*/}
          {auditor.first_name} {auditor.last_name}
        </Typography>

        {/*{auditor.tags.map((tag) => (*/}
        {/*    <Typography sx={badgeFontStyle} key={tag}>*/}
        {/*{tag},*/}
        {/*    </Typography>*/}
        {/*    ))}*/}
        <Typography sx={badgeFontStyle}>
          {auditor.tags
            .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
            .join(", ")}
        </Typography>
      </Box>
      <Box
        sx={{
          ...columnStyle,
          gap: "1rem",
          width: "100%",
        }}
      >
        <Box sx={badgesStyle}>
          <Box sx={infoStyle}>
            <Currency />
            <Typography sx={badgeFontStyle}>{`${auditor.tax}`}</Typography>
          </Box>
          <Box sx={infoStyle}>
            <Star />
            <Typography sx={badgeFontStyle}>150</Typography>
          </Box>
        </Box>
        <CustomButton sx={buttonStyle} onClick={handleView}>
          More info
        </CustomButton>
      </Box>
    </Card>
  );
};

const buttonStyle = {
  backgroundColor: "orange",
  color: "white",
  ":hover": { backgroundColor: "orange", color: "white" },
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
  },
};

const cardStyle = {
  width: "100%",
  height: "100%",
  // maxWidth: "340px",
  // marginY: "1.5rem",
  borderRadius: "1.5rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "2rem",
  [theme.breakpoints.down("sm")]: {
    // maxWidth: "200px",
  },
};

const avatarStyle = {
  width: "150px",
  height: "150px",
  marginX: "auto",
  [theme.breakpoints.down("sm")]: {
    width: "90px",
    height: "90px",
  },
};

const columnStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
};

const badgesStyle = {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  gap: "2rem",
};

const infoStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
};

const badgeFontStyle = {
  fontSize: "19px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
  },
};

const mainTextStyle = {
  fontWeight: 500,
  fontSize: "26px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "15px",
  },
};
export default AuditorCard;
