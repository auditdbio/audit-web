import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import CustomMenu from "../custom/CustomMenu.jsx";
import theme from "../../styles/themes.js";
import { CustomButton } from "../custom/Button.jsx";
import { useNavigate, Link } from "react-router-dom/dist";
import { Typography, useMediaQuery, Avatar } from "@mui/material";
import { isAuth } from "../../lib/helper.js";
import { CustomBadge } from "../custom/Badge.jsx";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { UserMenu } from "./UserMenu.jsx";
import RoleMenuDropdown from "./RoleMenuDropdown.jsx";
import { useSelector } from "react-redux";
import {AUDITOR, CUSTOMER} from "../../redux/actions/types.js";

const Header = () => {
  const reduxUser = useSelector((state) => state.user.user);
  const [currentUsername] = useState(reduxUser.name || 'User');
  const auditor = useSelector((state) => state.auditor.auditor);
  const customer = useSelector((state) => state.customer.customer);

  const navigate = useNavigate();
  const matchSm = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [anchorElRole, setAnchorElRole] = useState(null);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  // const [isAuditor, setIsAudito] = useState(false)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // const handleOpenRoleMenu = (event) => {
  //   setAnchorElRole(event.currentTarget);
  //   setIsRoleMenuOpen(!isUserMenuOpen);
  // };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false);
    setAnchorElUser(null);
  };

  const handleCloseRoleMenu = () => {
    setIsRoleMenuOpen(false);
    setAnchorElRole(null);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container
        // maxWidth="xl"
        sx={{
          maxWidth: "1512px",
          paddingTop: "60px",
          [theme.breakpoints.down("xs")]: {
            paddingTop: "20px",
          },
        }}
      >
        <Toolbar disableGutters>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Link to={"/"} style={linkStyle}>
              <Box sx={logoStyle}/>
            </Link>

            {/* For Unauthorized user */}
            {!isAuth() && (
              <>
                {matchSm && (
                  <>
                    <Box sx={{ flexGrow: 0, display: "flex" }}>
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
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                          display: "block",
                        }}
                        PaperProps={{
                          sx: { width: "300px", borderRadius: "15px" },
                        }}
                      >
                        <MenuItem sx={{ marginTop: "1rem" }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              gap: "1rem",
                              marginX: "1rem",
                            }}
                          >
                            <CustomButton
                              sx={signInButton}
                              onClick={handleSignIn}
                            >
                              Sign In
                            </CustomButton>
                            <CustomButton
                              sx={signUpButton}
                              onClick={handleSignUp}
                            >
                              Sign Up
                            </CustomButton>
                          </Box>
                        </MenuItem>
                        {pages.map((page) => (
                          <MenuItem
                            key={page.id}
                            onClick={handleCloseNavMenu}
                            sx={{
                              ":active": {
                                backgroundColor: "orange",
                                color: "color",
                              },
                            }}
                          >
                            <Box
                              textAlign="center"
                              sx={{
                                marginX: "1rem",
                                fontSize: "22px",
                                fontWeight: "500",
                              }}
                            >
                              {page.name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  </>
                )}
                {!matchSm && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      {pages.map((page) => (
                        <CustomMenu
                          key={page.id}
                          options={page.menuOptions}
                          buttonText={page.name}
                        />
                      ))}
                    </Box>
                    <Box
                      sx={{
                        flexGrow: 1,
                        maxWidth: "500px",
                        display: "flex",
                        gap: "1rem",
                      }}
                    >
                      <CustomButton sx={signInButton} onClick={handleSignIn}>
                        Sign In
                      </CustomButton>
                      <CustomButton sx={signUpButton} onClick={handleSignUp}>
                        Sign Up
                      </CustomButton>
                    </Box>
                  </>
                )}
              </>
            )}

            {/* For Authorized user */}
            {isAuth() && (
              <>
                {/*   Mobile Screen  */}
                {matchSm && (
                  <Box
                    sx={{
                      flexGrow: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <IconButton
                      disableRipple
                      aria-label="message"
                      sx={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "#D9D9D9",
                        borderRadius: "50px",
                        marginY: "auto",
                      }}
                    >
                      <CustomBadge
                        badgeContent={0}
                        color="secondary"
                        sx={{ color: "black" }}
                      >
                        <NotificationsIcon />
                      </CustomBadge>
                    </IconButton>
                    <Avatar
                        src={reduxUser.current_role === AUDITOR ? `https://dev.auditdb.io/api/files/get/${auditor?.avatar}`
                            : `https://dev.auditdb.io/api/files/get/${customer?.avatar}`}
                      style={{
                        width: "35px",
                        height: "35px",
                      }}
                    />
                    <IconButton
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleOpenUserMenu}
                      color="inherit"
                      sx={{ padding: 0 }}
                    >
                      <MenuIcon fontSize="large" />
                    </IconButton>
                    <UserMenu
                      open={isUserMenuOpen}
                      handleClose={handleCloseUserMenu}
                      anchor={anchorElUser}
                    />
                  </Box>
                )}
                {/* //   Desktop Screen  */}
                {!matchSm && (
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "2rem" }}
                  >
                    {authorizedPages.map((page) => (
                      <CustomMenu
                        key={page.id}
                        options={page.menuOptions}
                        buttonText={page.name}
                      />
                    ))}
                    <IconButton
                      disableRipple
                      aria-label="message"
                      sx={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "#D9D9D9",
                        borderRadius: "50px",
                        marginY: "auto",
                      }}
                    >
                      <CustomBadge
                        badgeContent={0}
                        color="secondary"
                        sx={{ color: "black" }}
                      >
                        <NotificationsIcon />
                      </CustomBadge>
                    </IconButton>
                    <Typography
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "26px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Hello, {currentUsername}!
                    </Typography>
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ ml: 1 }}
                      aria-controls={anchorElUser ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={anchorElUser ? "true" : undefined}
                      disableRipple
                    >
                      <Avatar
                          src={reduxUser.current_role === AUDITOR ? `https://dev.auditdb.io/api/files/get/${auditor?.avatar}`
                              : `https://dev.auditdb.io/api/files/get/${customer?.avatar}`}
                        sx={avatarStyle}
                      />
                      <UserMenu
                        open={isUserMenuOpen}
                        handleClose={handleCloseUserMenu}
                        anchor={anchorElUser}
                      />
                    </IconButton>
                    <RoleMenuDropdown
                      open={isRoleMenuOpen}
                      handleClose={handleCloseRoleMenu}
                      anchor={anchorElRole}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const pages = [
  {
    id: 1,
    name: "Product",
    menuOptions: [
      {
        id: 1,
        itemName: "AuditDB",
        link: "/audit-db",
      },
      {
        id: 2,
        itemName: "For customers",
        link: "/for-customers",
      },
      {
        id: 3,
        itemName: "For auditors",
        link: "/for-auditors",
      },
      // {
      //   id: 4,
      //   itemName: "Our projects",
      //   link: "/projects",
      // },
    ],
  },
  {
    id: 2,
    name: "About Us",
    menuOptions: [
      {
        id: 3,
        itemName: "Contact us",
        link: "/contact-us",
      },
      {
        id: 4,
        itemName: "FAQ",
        link: "/FAQ",
      },
      {
        id: 5,
        itemName: "Screencast",
        link: "https://youtu.be/J7L4yAhS6Rw",
      },
      // {
      //   id: 5,
      //   itemName: "Our auditors",
      //   link: '/auditors'
      // },
    ],
  },
  // {
  //   id: 3,
  //   name: "Community",
  //   menuOptions: [
  //     {
  //       id: 2,
  //       itemName: "Contact",
  //       link: "/",
  //     },
  //     {
  //       id: 3,
  //       itemName: "Our team",
  //       link: "/",
  //     },
  //     {
  //       id: 4,
  //       itemName: "Our projects",
  //       link: "/projects",
  //     },
  //   ],
  // },
];

const authorizedPages = [
  {
    id: 1,
    name: "Audits",
    menuOptions: [
      {
        id: 1,
        itemName: "Our projects",
        link: '/projects'
      },
      {
        id: 2,
        itemName: "New project",
        link: '/create-project'
      },
      {
        id: 3,
        itemName: "My audits",
        link: '/'
      },
      {
        id: 4,
        itemName: "My audits requests",
        link: '/'
      },
      {
        id: 5,
        itemName: "Audits history",
        link: '/'
      },
    ],
  },
  {
    id: 2,
    name: "Projects",
    role: CUSTOMER,
    menuOptions: [
      {
        id: 1,
        itemName: "Our projects",
        link: '/projects'
      },
      {
        id: 2,
        itemName: "New project",
        link: '/create-project'
      },
      {
        id: 3,
        itemName: "My audits",
        link: '/profile/audits'
      },
      {
        id: 4,
        itemName: "My audits requests",
        link: '/profile/audits'
      },
      {
        id: 3,
        name: "Projects",
        role: AUDITOR,
        menuOptions: [
          {
            id: 1,
            itemName: "Our projects",
            link: '/projects'
          },
          {
            id: 2,
            itemName: "New project",
            link: '/create-project'
          },
          {
            id: 3,
            itemName: "My audits",
            link: '/profile/projects'
          },
          {
            id: 4,
            itemName: "My audits requests",
            link: '/profile/audits'
          },
        ],
      },
    ],
  },
];

const signInButton = {
  backgroundColor: "orange",
  color: "white",
  ":hover": {
    backgroundColor: "orange",
    color: "white",
  },
};

const signUpButton = {
  backgroundColor: "transparent",
  color: "#222222",
  border: "3px solid #52176D",
  ":hover": {
    backgroundColor: "transparent",
    color: "black",
  },
};

const linkStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const logoStyle = {
  height: "50px",
  width: "200px",
  backgroundImage: "url(/welcome_page/logo.svg)",
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  marginY: "auto",
  [theme.breakpoints.down("sm")]: {
    height: "40px",
    width: "160px",
  },
};

const avatarStyle = {
  width: "100px",
  height: "100px",
};

export default Header;
