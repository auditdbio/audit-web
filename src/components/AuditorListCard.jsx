import React, { useState } from "react";
import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import AuditRequestInfo from "./audit-request-info.jsx";
import TagsList from "./tagsList.jsx";
import CircleIcon from "@mui/icons-material/Circle";
import theme from "../styles/themes.js";
import AuditorModal from "./AuditorModal.jsx";
import { isAuth } from "../lib/helper.js";
import { useNavigate } from "react-router-dom";
import {ASSET_URL} from "../services/urls.js";

const AuditorListCard = ({ auditor }) => {
  const navigate = useNavigate();

  const [isOpenView, setIsOpenView] = useState(false);
  const [isOpenInvite, setIsOpenInvite] = useState(false);

  const handleOpenView = () => {
    setIsOpenView(true);
  };
  const handleCloseView = () => {
    setIsOpenView(false);
  };

  const handleOpenInvite = () => {
    if (!isAuth()) {
      navigate("/sign-up");
      return;
    } else {
      navigate('/my-projects')
    }
    setIsOpenInvite(true);
  };
  const handleCloseInvite = () => {
    setIsOpenInvite(false);
  };

  return (
    <Box sx={wrapper}>
      <Box sx={cardLeftSide}>
        <Box sx={avatarDescription}>
          <Box>
            <Avatar src={`${ASSET_URL}/${auditor.avatar}`} sx={avatarStyle} />
          </Box>
          <Box sx={descriptionStyle(theme)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Typography sx={nameStyle}>
                {auditor.first_name} {auditor.last_name}
              </Typography>
              <Typography sx={projectStyle}>{auditor.company}</Typography>
            </Box>
            <Box sx={statusGroup(theme)}>
              <CircleIcon sx={statusCircle} />
              <Typography sx={statusTextStyle}>Ready to audit</Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <TagsList data={auditor.tags} />
        </Box>
      </Box>
      <Box sx={cardRightSide}>
        <Typography sx={priceStyle}>{auditor.tax} $</Typography>
        <Button
          color={"secondary"}
          size={"small"}
          sx={viewButtonStyle}
          variant={"contained"}
          onClick={handleOpenView}
        >
          View more
        </Button>
        <Button
          color={"primary"}
          size={"small"}
          sx={inviteButtonStyle(theme)}
          variant={"contained"}
          onClick={handleOpenInvite}
        >
          Invite to project
        </Button>
      </Box>

      <AuditorModal
        open={isOpenView}
        handleClose={handleCloseView}
        auditor={auditor}
      />
    </Box>
  );
};

export default AuditorListCard;

const wrapper = (theme) => ({
  padding: "32px 38px 32px 38px",
  border: "0.5px solid #B2B3B3",
  display: "flex",
  gap: "10px",
  height: "100%",
  justifyContent: "space-between",
  [theme.breakpoints.down("xs")]: {
    padding: "15px",
  },
});

const cardLeftSide = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  gap: "24px",
  [theme.breakpoints.down("xs")]: {
    gap: "15px",
  },
};

const cardRightSide = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  [theme.breakpoints.down("xs")]: {
    gap: "12px",
  },
};

const avatarDescription = (theme) => ({
  display: "flex",
  flexDirection: "row",
  gap: "30px",
  [theme.breakpoints.down("xs")]: {
    gap: "10px",
  },
});

const descriptionStyle = (theme) => ({
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  [theme.breakpoints.down("xs")]: {
    gap: "8px",
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
  fontSize: {
    zero: "11px",
    sm: "14px",
    md: "20px",
    lg: "20px",
  },
  color: "#152BEA",
};

const projectStyle = {
  fontWeight: 500,
  fontSize: {
    zero: "9px",
    sm: "11px",
    md: "13px",
    lg: "14px",
  },
  color: "#434242",
};

const statusGroup = (theme) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  [theme.breakpoints.down("xs")]: {
    gap: "5px",
  },
});

const statusCircle = (theme) => ({
  fontSize: "14px",
  color: "#09C010",
  [theme.breakpoints.down("xs")]: {
    fontSize: "9px",
  },
});
const statusTextStyle = {
  fontWeight: 400,
  fontSize: {
    zero: "9px",
    sm: "11px",
    md: "13px",
    lg: "14px",
  },
  color: "#434242",
};

const priceStyle = {
  fontSize: "20px",
  color: "#434242",
  [theme.breakpoints.down("xs")]: {
    fontSize: "9px",
  },
};

const viewButtonStyle = (theme) => ({
  width: "200px",
  textTransform: "unset",
  boxShadow: "0",

  [theme.breakpoints.down("sm")]: {
    width: "85px",
    fontSize: "8px",
  },
});

const inviteButtonStyle = (theme) => ({
  width: "200px",
  textTransform: "unset",
  boxShadow: "0",
  [theme.breakpoints.down("sm")]: {
    width: "85px",
    fontSize: "8px",
  },
});

const fakeTagsArray = ["Python", "Java", "Audit", "Big Four"];
