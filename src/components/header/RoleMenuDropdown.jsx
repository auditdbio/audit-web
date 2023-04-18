import * as React from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { KeyboardArrowUp } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import { changeRole } from "../../redux/actions/userAction.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Menu from "@mui/material/Menu";
import { useEffect, useState } from "react";
//
const options = [
  {
    id: 1,
    title: "Customer",
    value: "customer",
    style: {
      backgroundColor: "#FF9900",
    },
  },
  {
    id: 2,
    title: "Auditor",
    value: "auditor",
    style: {
      backgroundColor: "#52176D",
    },
  },
];

const displayButton = {
  auditor: "Auditor",
  customer: "Customer",
};

export default function RoleMenuDropdown() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.user);

  const [currentRole, setCurrentRole] = useState(
    reduxUser.current_role ?? "auditor"
  );

  useEffect(() => {
    setCurrentRole(reduxUser.current_role);
  }, [reduxUser.current_role]);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleMenuItemClick = (option) => {
    setOpen(false);
    setCurrentRole(option.value);
    dispatch(changeRole(option.value, reduxUser.id));
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        disableRipple
        sx={roleButtonStyle(currentRole)}
        variant="contained"
        ref={anchorRef}
        endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDownIcon />}
        aria-controls={open ? "split-button-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-label="select merge strategy"
        aria-haspopup="menu"
        onClick={handleToggle}
      >
        {displayButton[currentRole]}
      </Button>

      <Menu
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            sx={[currentRole === option.value ? menuItemStyled : {}, {
              width: {
                zero: "0px",
                sm: "0px",
                md: "190px",
                lg: "230px",
              },
              display: option.value === currentRole ? "none" : "",
              justifyContent: "center",
            }]}
            key={option.id}
            onClick={() => handleMenuItemClick(option)}
          >
            {option.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const roleButtonStyle = (currentRole) => ({
  display: {
    zero: "none",
    sm: "none",
    md: "flex",
    lg: "flex",
  },
  height: "60px",
  width: "30%",
  backgroundColor: currentRole === "auditor" ? "#52176D" : "#FF9900",
  minWidth: {
    zero: "0px",
    sm: "0px",
    md: "190px",
    lg: "230px",
  },
  borderRadius: "0",
  fontSize: {
    zero: "20px",
    sm: "22px",
    md: "24px",
    lg: "26px",
  },
  fontWeight: "500",
  color: "#FCFAF6",
  textTransform: "none",
  lineHeight: "32px",
  ":hover": {
    backgroundColor: currentRole === "auditor" ? "#52176D" : "#FF9900",
    boxShadow: "0",
  },
  boxShadow: "0",
});

const menuItemStyled = {
  height: "60px",
  width: "280px",
  marginX: "auto",
  textAlign: "center",
};
