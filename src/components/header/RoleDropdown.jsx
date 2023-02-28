// import * as React from "react";
// import Button from "@mui/material/Button";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import ClickAwayListener from "@mui/material/ClickAwayListener";
// import Grow from "@mui/material/Grow";
// import Paper from "@mui/material/Paper";
// import Popper from "@mui/material/Popper";
// import MenuItem from "@mui/material/MenuItem";
// import MenuList from "@mui/material/MenuList";
// import { useDispatch } from "react-redux";
// import { changeRole } from "../../redux/actions/userAction.js";
//
// const options = ["Customer", "Auditor"];
//
// export default function RoleDropdown() {
//   const dispatch = useDispatch();
//
//   const initialValues = {
//     current_role: "auditor",
//   };
//
//   const [open, setOpen] = React.useState(false);
//   const anchorRef = React.useRef(null);
//   const [selectedIndex, setSelectedIndex] = React.useState(1);
//
//   const handleClick = () => {
//     console.info(`You clicked ${options[selectedIndex]}`);
//   };
//
//   const handleMenuItemClick = (event, index) => {
//     changeRole();
//     setSelectedIndex(index);
//     setOpen(false);
//   };
//
//   const handleToggle = () => {
//     setOpen((prevOpen) => !prevOpen);
//   };
//
//   const handleClose = (event) => {
//     if (anchorRef.current && anchorRef.current.contains(event.target)) {
//       return;
//     }
//
//     setOpen(false);
//   };
//
//   return (
//     <React.Fragment>
//
//       <Button
//
//
//
//         disableRipple
//         // color={selectedOption === 'option1' ? 'primary' : 'secondary'}
//         sx={roleButtonStyle(selectedIndex)}
//         variant="contained"
//         // onClick={handleClick}
//         ref={anchorRef}
//         endIcon={<KeyboardArrowDownIcon />}
//         aria-controls={open ? "split-button-menu" : undefined}
//         aria-expanded={open ? "true" : undefined}
//         aria-label="select merge strategy"
//         aria-haspopup="menu"
//         onClick={handleToggle}
//       >
//         {options[selectedIndex]}
//       </Button>
//
//       <Popper
//         sx={{
//           zIndex: 1,
//           width: "230px",
//         }}
//         open={open}
//         anchorEl={anchorRef.current}
//         role={undefined}
//         transition
//         disablePortal
//       >
//         {({ TransitionProps, placement }) => (
//           <Grow
//             {...TransitionProps}
//             style={{
//               transformOrigin:
//                 placement === "bottom" ? "center top" : "center bottom",
//             }}
//           >
//             <Paper>
//               <ClickAwayListener onClickAway={handleClose}>
//                 <MenuList
//                   // sx={{ height: "60px"  }}
//                   id="split-button-menu"
//                   autoFocusItem
//                 >
//                   {options.map((option, index) => (
//                     <MenuItem
//                       // sx={{ height: "60px" }}
//                       key={option}
//                       disabled={index === 2}
//                       selected={index === selectedIndex}
//                       onClick={(event) => handleMenuItemClick(event, index)}
//                     >
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </MenuList>
//               </ClickAwayListener>
//             </Paper>
//           </Grow>
//         )}
//       </Popper>
//     </React.Fragment>
//   );
// }
//
// const roleButtonStyle = (selectedIndex) => ({
//   height: "60px",
//   width: "30%",
//   backgroundColor: selectedIndex === 1 ? "#52176D" : "#FF9900",
//   borderRadius: "0",
//   fontSize: {
//     zero: "20px",
//     sm: "22px",
//     md: "24px",
//     lg: "26px",
//   },
//   fontWeight: "500",
//   color: "#FCFAF6",
//   textTransform: "none",
//   lineHeight: "32px",
//   ":hover": {
//     backgroundColor: selectedIndex === 1 ? "#52176D" : "#FF9900",
//   },
//   boxShadow: "0",
// });
