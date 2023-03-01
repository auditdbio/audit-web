import * as React from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import { changeRole, logout } from "../../redux/actions/userAction.js";
import { useDispatch } from "react-redux";
import { history } from "../../services/history.js";
import { useSelector } from "react-redux";
import Menu from "@mui/material/Menu";
import { useState } from "react";
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

// const options = ["Customer", "Auditor"]

export default function RoleMenuDropdown() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.user.user);

  const [currentRole, setCurrentRole] = useState(
    reduxUser.current_role ?? "auditor"
  );

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (option) => {
    setOpen(false);
    console.log(option, option.value);
    setCurrentRole(option.value);
    dispatch(changeRole(option.value));
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
        // onClick={handleClick}
        ref={anchorRef}
        endIcon={<KeyboardArrowDownIcon />}
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
            style={{
              width: "230px",
              display: option.value === currentRole ? "none" : "",
            }}
            sx={
              currentRole === option.value ? menuItemStyled(option.style) : {}
            }
            key={option.id}
            // disabled={option.value !== current_role}
            // selected={true}
            onClick={(event) => handleMenuItemClick(option)}
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
    md: "230px",
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

const menuItemStyled = (option, currentRole) => ({
  height: "60px",
  width: "280px",
  // display: option.value === currentRole ? "none" : "block",
});
