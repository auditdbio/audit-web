import * as React from "react";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { changeRole } from "../../redux/actions/userAction.js";
import Menu from "@mui/material/Menu";

const options = ["Customer", "Auditor"];

export default function RoleMenuDropdown() {
  const dispatch = useDispatch();

  const initialValues = {
    current_role: "auditor",
  };

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleMenuItemClick = (event, index, value) => {
    // const newValue = { ...values, current_role: isAuditor };
    // dispatch(changeRole(newValue));
    console.log(value);
    setSelectedIndex(index);
    setOpen(false);
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
        sx={roleButtonStyle(selectedIndex)}
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
        {options[selectedIndex]}
      </Button>

      <Menu
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            sx={menuItemStyled}
            key={option}
            disabled={index === 2}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

const roleButtonStyle = (selectedIndex) => ({
  display: {
    zero: "none",
    sm: "none",
    md: "flex",
    lg: "flex",
  },
  height: "60px",
  width: "30%",
  backgroundColor: selectedIndex === 1 ? "#52176D" : "#FF9900",
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
    backgroundColor: selectedIndex === 1 ? "#52176D" : "#FF9900",
    boxShadow: "0",
  },
  boxShadow: "0",
});

const menuItemStyled = {
  height: "60px",
  width: "230px",
};
