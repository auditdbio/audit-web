import {Card, Avatar, Box, Typography, Stack, Alert, AlertTitle, Snackbar, Tooltip} from "@mui/material";
import theme from "../../../styles/themes";
import { CustomButton } from "../../custom/Button";
import Currency from "../../icons/Currency";
import Star from "../../icons/Star";
import React, { useState } from "react";
import AuditorModal from "../../AuditorModal.jsx";
import {ASSET_URL} from "../../../services/urls.js";
import {useNavigate} from "react-router-dom/dist";
import {useSelector} from "react-redux";

const AuditorCard = ({ auditor }) => {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const userProjects = useSelector(s => s.project.myProjects)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleView = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleError = () => {
    setErrorMessage(null)
    setMessage('Switched to customer role')
    const delayedFunc = setTimeout(() => {
      if (userProjects.length) {
        navigate(`/my-projects/${auditor.user_id}`)
      } else {
        setMessage(null)
        setErrorMessage('No active projects')
      }
    }, 1000)
    return () => clearTimeout(delayedFunc)
  }

  return (
    <Card sx={cardStyle}>
      <AuditorModal
        open={openModal}
        handleClose={handleCloseModal}
        auditor={auditor}
        handleError={handleError}
      />
      <Snackbar
          autoHideDuration={3000}
          open={!!message || !!errorMessage}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          onClose={() => {
            setErrorMessage(null)
            setMessage(null)
          }}
      >
        <Stack sx={{ width: '100%', flexDirection: 'column', gap: 2 }} spacing={2}>
          <Alert severity={!errorMessage ? 'success' : 'error'}>
            <AlertTitle>{message || errorMessage}</AlertTitle>
          </Alert>
        </Stack>
      </Snackbar>
      <Avatar src={`${ASSET_URL}/${auditor.avatar}`} sx={avatarStyle} />
      <Box sx={{display: 'grid'}}>
        <Tooltip title={`${auditor.first_name} ${auditor.last_name}`}
                 arrow placement={'top'}>
          <Typography sx={mainTextStyle} noWrap={true}>
          {auditor.first_name} {auditor.last_name}
          </Typography>
        </Tooltip>
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
            <Typography sx={priceSx}>{auditor.price_range.from} - {auditor.price_range.to}</Typography>
          </Box>
          <Box sx={infoStyle}>
            <Star />
            <Typography sx={priceSx}>150</Typography>
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

const cardStyle = (theme) => ({
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
    padding: '14px',
    gap: '1rem'
  },
});

const priceSx = (theme) => ({
  fontSize: '16px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px'
  }
})

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

const badgesStyle = (theme) => ({
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  gap: "2rem",
  [theme.breakpoints.down('sm')]: {
    gap: '10px'
  }
});

const infoStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
};

const badgeFontStyle = (theme) => ({
  fontSize: "19px!important",
  textAlign: "center",
  display: '-webkit-box',
  '-webkit-line-clamp': '3',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  height: '86px',
  overflow: 'hidden',
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px!important",
    height: '45px'
  },
});

const mainTextStyle = (theme) => ({
  fontWeight: 500,
  fontSize: "26px",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "15px",
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px'
  }
});
export default AuditorCard;
