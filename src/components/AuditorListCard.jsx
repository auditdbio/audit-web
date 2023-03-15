import React, { useState } from "react";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import AuditRequestInfo from "./audit-request-info.jsx";
import TagsList from "./tagsList.jsx";
import CircleIcon from "@mui/icons-material/Circle";

const AuditorListCard = () => {
  const [isOpenView, setIsOpenView] = useState(false);

  const [isOpenInvite, setIsOpenInvite] = useState(false);

  const handleOpenView = () => {
    setIsOpenView(true);
  };
  const handleCloseView = () => {
    setIsOpenView(false);
  };

  const handleOpenInvite = () => {
    setIsOpenInvite(true);
  };
  const handleCloseInvite = () => {
    setIsOpenInvite(false);
  };

  return (
    <Box sx={wrapper}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "30px" }}>
          <Box>
            <Avatar src="" sx={avatarStyle} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography style={nameStyle}>Kiril Sitnikov</Typography>
              <Typography style={projectStyle}>AuditDB Network</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CircleIcon sx={{ fontSize: "15px", color: "#09C010" }} />
              <Typography style={statusTextStyle}>Ready to audit</Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <TagsList />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Typography style={{ fontSize: "14px", color: "#434242" }}>
          150 $
        </Typography>
        <Button
          color={"secondary"}
          size={"small"}
          sx={{
            width: "200px",
            textTransform: "unset",
            boxShadow: "0",
          }}
          variant={"contained"}
          onClick={handleOpenView}
        >
          View more
        </Button>
        <Button
          color={"primary"}
          size={"small"}
          sx={{
            width: "200px",
            textTransform: "unset",
            boxShadow: "0",
          }}
          variant={"contained"}
          onClick={handleOpenInvite}
        >
          Invite to project
        </Button>
      </Box>

      {/*<Modal*/}
      {/*  open={isOpen}*/}
      {/*  onClose={handleClose}*/}
      {/*  aria-labelledby="parent-modal-title"*/}
      {/*  aria-describedby="parent-modal-description"*/}
      {/*>*/}
      {/*  <Box sx={modalWrapper}>*/}
      {/*    <AuditRequestInfo*/}
      {/*      onClose={handleClose}*/}
      {/*      project={project}*/}
      {/*      modal={true}*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*</Modal>*/}
    </Box>
  );
};

export default AuditorListCard;

const wrapper = (theme) => ({
  padding: "32px 38px 32px 38px",
  border: "1px solid #B2B3B3",
  display: "flex",
  justifyContent: "space-between",
  [theme.breakpoints.down("xs")]: {
    padding: "20px",
    width: "100%",
  },
});
const avatarStyle = (theme) => ({
  width: "65px",
  height: "65px",
  [theme.breakpoints.down("xs")]: {
    width: "38px",
    height: "38px",
  },
});

const nameStyle = {
  fontWeight: "600",
  fontSize: "14px",
  color: "#152BEA",
};

const projectStyle = {
  fontWeight: 500,
  fontSize: "10px",
  color: "#434242",
};

const statusTextStyle = {
  fontWeight: 500,
  fontSize: "10px",
  color: "#434242",
};
