import React, { useState } from "react";
import { useNavigate } from "react-router-dom/dist";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import theme from "../../styles/themes.js";
import CustomMenu from "../custom/CustomMenu.jsx";
import { CustomButton } from "../custom/Button.jsx";
import { pages } from "./constants.js"


const UnauthorizedOptions = () => {
  const navigate = useNavigate();
  const matchSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/*  Mobile Screen  */}
      {
        matchSm && <Box sx={{ flexGrow: 0, display: "flex" }}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            keepMounted
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={!!anchorElNav}
            onClose={handleCloseNavMenu}
            sx={{ display: "block" }}
            PaperProps={{
              sx: { width: "300px", borderRadius: "15px" },
            }}
          >
            <MenuItem sx={{ marginTop: "1rem" }}>
              <Box sx={authBlock}>
                <CustomButton sx={signInButton} onClick={handleSignIn}>
                  Sign In
                </CustomButton>
                <CustomButton sx={signUpButton} onClick={handleSignUp}>
                  Sign Up
                </CustomButton>
              </Box>
            </MenuItem>
            {pages.map((page) =>
              page.menuOptions.map(el =>
                <MenuItem
                  key={el.id}
                  onClick={() => handleNavigate(el.link)}
                  sx={mobileMenuOption}
                >
                  <Box textAlign="center" sx={popupLinkSx}>
                    {el.itemName}
                  </Box>
                </MenuItem>
              )
            )}
          </Menu>
        </Box>
      }


      {/*  Desktop Screen  */}
      {
        !matchSm && <>
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            {pages.map((page) => (
              <CustomMenu
                key={page.id}
                options={page.menuOptions}
                buttonText={page.name}
              />
            ))}
          </Box>
          <Box sx={desktopAuthBlock}>
            <CustomButton sx={signInButton} onClick={handleSignIn}>
              Sign In
            </CustomButton>
            <CustomButton sx={signUpButton} onClick={handleSignUp}>
              Sign Up
            </CustomButton>
          </Box>
        </>
      }
    </>
  )
}


const popupLinkSx = (theme) => ({
  marginX: "1rem",
  fontSize: "22px",
  fontWeight: "500",
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px'
  }
});

const authBlock = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "1rem",
  marginX: "1rem",
};

const desktopAuthBlock = {
  flexGrow: 1,
  maxWidth: "500px",
  display: "flex",
  gap: "1rem",
};

const signInButton = {
  backgroundColor: "orange",
  color: "white",
  ":hover": {
    backgroundColor: "orange",
    color: "white",
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px'
  }
};

const signUpButton = {
  backgroundColor: "transparent",
  color: "#222222",
  border: "3px solid #52176D",
  ":hover": {
    backgroundColor: "transparent",
    color: "black",
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px'
  }
};

const mobileMenuOption = {
  ":active": {
    backgroundColor: "orange",
    color: "color",
  },
};

export default UnauthorizedOptions;
