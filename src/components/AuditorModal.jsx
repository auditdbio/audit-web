import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import theme from "../styles/themes.js";
import { Box } from "@mui/system";
import { Avatar, Typography } from "@mui/material";
import TagsList from "./tagsList.jsx";

export default function AuditorModal({ open, handleClose, auditor }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={modalWindow}>
        <Box sx={contentWrapper}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar src={auditor.avatar} sx={avatarStyle} />
          </Box>
          <Box sx={infoStyle}>
            <Box sx={infoInnerStyle}>
              <Box sx={infoWrapper}>
                <span>First Name</span>
                <Typography noWrap={true}>{auditor.first_name}</Typography>
              </Box>
              <Box sx={infoWrapper}>
                <span>Last name</span>
                <Typography noWrap={true}>{auditor.last_name}</Typography>
              </Box>
              <Box sx={infoWrapper}>
                <span>Telegram</span>
                <Typography noWrap={true}>
                  {auditor.contacts?.telegram}
                </Typography>
              </Box>
              <Box sx={infoWrapper}>
                <span>Price:</span>
                {auditor?.tax && (
                  <Typography>${auditor?.tax} per line</Typography>
                )}
              </Box>
              <Box sx={infoWrapper}>
                <span>Company</span>
                <Typography noWrap={true}>{auditor.company}</Typography>
              </Box>
              <Box sx={infoWrapper}>
                <span>E-mail</span>
                <Typography noWrap={true}>{auditor.contacts?.email}</Typography>
              </Box>
              <TagsList data={auditor.tags} />
            </Box>
            <Box sx={infoInnerStyle}></Box>
          </Box>
        </Box>
        <Box sx={fieldButtonContainer}>
          <Button sx={backButton} onClick={handleClose}>
            Back
          </Button>
          <Button sx={findButton}>Invite to project</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

const modalWindow = {
  backgroundColor: theme.palette.background,

  width: "600px",
  display: "flex",
  gap: "50px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: {
    zero: "25px",
    sm: "25px",
    md: "45px",
    lg: "50px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "100%",
    width: "100%",
    gap: "20px",
  },
};

const findButton = {
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.default,
  borderRadius: "4px",
  height: "45px",
  width: {
    zero: "100px",
    sm: "100px",
    md: "150px",
    lg: "230px",
  },
  textTransform: "none",
  ":hover": {
    backgroundColor: theme.palette.primary.main,
  },
  [theme.breakpoints.down("sm")]: {
    height: "30px",
    fontSize: "10px",
  },
};

const infoInnerStyle = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const infoStyle = (theme) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    gap: "10px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "16px",
    margin: 0,
  },
});

const avatarStyle = (theme) => ({
  width: "150px",
  height: "150px",
  [theme.breakpoints.down("xs")]: {
    width: "100px",
    height: "100px",
  },
});

const contentWrapper = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: "50px",
  [theme.breakpoints.down("md")]: {
    gap: "50px",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "40px",
  },
});

const infoWrapper = (theme) => ({
  display: "flex",
  fontWeight: 500,
  color: "#434242",
  "& p": {
    fontSize: "inherit",
    maxWidth: "250px",
  },
  "& span": {
    width: "125px",
    marginRight: "50px",
    color: "#B2B3B3",
  },
  fontSize: "15px",
  [theme.breakpoints.down("md")]: {
    "& span": {
      width: "90px",
      marginRight: "20px",
    },
    "& p": {
      maxWidth: "190px",
    },
  },
  [theme.breakpoints.down("xs")]: {
    fontSize: "12px",
  },
});

const backButton = {
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.background.default,
  borderRadius: "4px",
  width: {
    zero: "100px",
    sm: "100px",
    md: "150px",
    lg: "230px",
  },
  // padding: "12px 63px",
  height: "45px",
  textTransform: "none",
  ":hover": {
    backgroundColor: theme.palette.secondary.main,
  },
  [theme.breakpoints.down("sm")]: {
    height: "30px",
    fontSize: "10px",
    // padding: "6px 31px",
  },
};

const fieldButtonContainer = {
  display: "flex",
  gap: "10px",
};
