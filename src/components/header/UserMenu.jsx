import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { changeRole, logout } from "../../redux/actions/userAction.js";
import { useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom/dist";
import { useSelector } from "react-redux";
import React, {useMemo, useState} from "react";
import {AUDITOR} from "../../redux/actions/types.js";

export const UserMenu = ({ open, handleClose, anchor, userAvatar }) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.user);
  const navigate = useNavigate()
  const auditor = useSelector((state) => state.auditor.auditor);
  const customer = useSelector((state) => state.customer.customer);

  const [isAuditor, setIsAuditor] = useState(
    reduxUser.current_role ?? "customer"
  );

  const user = {
    fullName: reduxUser.name || "Mishail Voronnikov",
    interests: reduxUser.interests || "Criptography, Games",
    email: reduxUser.email || "mishailvoron@gmail.com",
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMyAccountClick = () => {
      navigate('/profile/user-info');
  };

  return (
    <Menu
      anchorEl={anchor}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          boxShadow:
            "0px 67px 80px rgba(0, 0, 0, 0.07), 0px 14.9653px 17.869px rgba(0, 0, 0, 0.0417275), 0px 8.38944px 10.0172px rgba(0, 0, 0, 0.035), 0px 4.45557px 5.32008px rgba(0, 0, 0, 0.0282725), 0px 1.85406px 2.21381px rgba(0, 0, 0, 0.0196802)",
          mt: "2rem",
          borderRadius: "26px",
          paddingTop: "1rem",
          paddingX: "1.5rem",
          "& .MuiMenuItem-root": {
            display: "flex",
            justifyContent: "center",
            ":hover": {
              backgroundColor: "transparent",
            },
          },
          "& .MuiButton-root": {
            ":hover": {
              backgroundColor: "transparent",
            },
          },
          "& .MuiDivider-root": {
            border: "0.5px orange solid",
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "center" }}
    >
      <MenuItem onClick={handleClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
              src={userAvatar ? `https://dev.auditdb.io/api/files/get/${userAvatar}` : ''}
            sx={{
              width: "100px",
              height: "100px",
            }}
          />
          <Button
            size="small"
            startIcon={<EditIcon />}
            sx={editTextStyle}
            disableRipple
          >
            Edit photo
          </Button>
          <Typography style={mainTextStyle}>{user.fullName}</Typography>
          <Typography style={secondaryTextStyle}>{user.interests}</Typography>
          <Typography style={secondaryTextStyle}>{user.email}</Typography>
        </Box>
      </MenuItem>
      <Tabs
        value={isAuditor}
        onChange={(e, newValue) => {
          setIsAuditor(newValue);
          dispatch(changeRole(newValue));
        }}
        name={"role"}
        sx={tabsSx}
        indicatorColor="none"
      >
        <Tab
          value={"auditor"}
          sx={[
            isAuditor === "auditor"
              ? auditorTabSx
              : { backgroundColor: "#D9D9D9" },
            tabSx,
          ]}
          label="Auditor"
        />
        <Tab
          value={"customer"}
          sx={[
            isAuditor === "customer"
              ? customerTabSx
              : { backgroundColor: "#D9D9D9" },
            tabSx,
          ]}
          label="Customer"
        />
      </Tabs>

      <Divider sx={{
        display: {
          zero: "none",
          sm: "none",
          md: "flex",
          lg: "flex",
        },
      }} />
      <MenuItem onClick={handleClose}>
        <Typography style={mainTextStyle} onClick={handleMyAccountClick}>
          My Account
        </Typography>
      </MenuItem>
      <Divider
      />
      <MenuItem onClick={handleClose}>
        <Button
          onClick={handleLogout}
          style={mainTextStyle}
          sx={{
            width: "100%",
            textTransform: "none",
          }}
          disableRipple
        >
          Logout
        </Button>
      </MenuItem>
    </Menu>
  );
};

const editTextStyle = {
  fontSize: "14px",
  fontWeight: "500",
  textTransform: "none",
};



const mainTextStyle = {
  fontSize: "26px",
  fontWeight: "500",
  color: "#222222",
};

const secondaryTextStyle = {
  fontSize: "18px",
  color: "#222222",
};

const tabsSx = {
  display: {
    zero: "flex",
    sm: "flex",
    md: "none",
    lg: "none",
  },
};

const tabSx = (theme) => ({
  width: "50%",
  color: "#222222",
  fontSize: "16px",
  textTransform: "capitalize",
  [theme.breakpoints.down("md")]: {
    minHeight: "41px",
    height: "41px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
  },
});

const auditorTabSx = (theme) => ({
  backgroundColor: theme.palette.secondary.main,
  color: "#FCFAF6!important",
});

const customerTabSx = (theme) => ({
  color: "#FCFAF6!important",
  backgroundColor: theme.palette.primary.main,
});
