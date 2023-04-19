import React, {useState} from 'react';
import Box from "@mui/material/Box";
import {ClickAwayListener, Typography} from "@mui/material";
import {CustomBadge} from "../custom/Badge.jsx";
import NotificationsIcon from "@mui/icons-material/Notifications.js";
import IconButton from "@mui/material/IconButton";
import {useSelector} from "react-redux";
import {AUDITOR} from "../../redux/actions/types.js";
import theme from "../../styles/themes.js";

const CustomBudge = () => {
    const [isOpen, setIsOpen] = useState(false)
    const currentRole = useSelector(s => s.user.user.current_role)
    return (
        <IconButton
            disableRipple
            aria-label="message"
            onClick={() => setIsOpen(!isOpen)}
            sx={{
                width: "35px",
                height: "35px",
                backgroundColor: "#D9D9D9",
                borderRadius: "50px",
                marginY: "auto",
                position: 'relative'
            }}
        >
            { isOpen &&
                <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                    <Box sx={modalWrapper(currentRole, theme)}>
                        <Typography sx={{color: '#000'}}>
                            No notifications
                        </Typography>
                    </Box>
                </ClickAwayListener>
            }
            <CustomBadge
                badgeContent={0}
                color="secondary"
                sx={{ color: "black" }}
            >
                <NotificationsIcon />
            </CustomBadge>
        </IconButton>
    );
};

export default CustomBudge;

const modalWrapper = (role, theme) => ({
    position: "absolute",
    top: '44px',
    width: '250px',
    padding: '0.5rem',
    backgroundColor: '#fff',
    borderRadius: '5px',
    border: '1px solid',
    borderColor: role === AUDITOR ? theme.palette.secondary?.main : theme.palette.primary.main,
})