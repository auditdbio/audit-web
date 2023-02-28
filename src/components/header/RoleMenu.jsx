import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { Box, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { logout } from "../../redux/actions/userAction.js";
import { useDispatch } from "react-redux";

export const RoleMenu = ({ open, handleClose, anchor }) => {
  const dispatch = useDispatch();

  const [selectedRole, setSelectedRole] = useState("");

  const user = {
    fullName: "Mishail Voronnikov",
    interests: "Criptography, Games",
    email: "mishailvoron@gmail.com",
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const handleLogout = () => {
    dispatch(logout());
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
          // filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          boxShadow:
            "0px 67px 80px rgba(0, 0, 0, 0.07), 0px 14.9653px 17.869px rgba(0, 0, 0, 0.0417275), 0px 8.38944px 10.0172px rgba(0, 0, 0, 0.035), 0px 4.45557px 5.32008px rgba(0, 0, 0, 0.0282725), 0px 1.85406px 2.21381px rgba(0, 0, 0, 0.0196802)",
          mt: "2rem",
          borderRadius: "26px",
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
          // "&:before": {
          //   content: '""',
          //   display: "block",
          //   position: "absolute",
          //   top: 0,
          //   right: 14,
          //   width: 10,
          //   height: 10,
          //   bgcolor: "background.paper",
          //   transform: "translateY(-50%) rotate(45deg)",
          //   zIndex: 0,
          // },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "center" }}
    >
      <MenuItem onClick={handleClose}></MenuItem>
      <MenuItem onClick={handleClose}>
        <Typography style={mainTextStyle}>Customer</Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleClose}>
        <Typography style={mainTextStyle}>Auditor</Typography>
      </MenuItem>
      {/*<MenuItem onClick={handleClose}>*/}
      {/*  <Button*/}
      {/*      onClick={handleLogout}*/}
      {/*      style={mainTextStyle}*/}
      {/*      sx={{*/}
      {/*        width: '100%',*/}
      {/*        textTransform: "none",*/}
      {/*      }}*/}
      {/*      disableRipple*/}
      {/*  >*/}
      {/*    Logout*/}
      {/*  </Button>*/}
      {/*</MenuItem>*/}
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
