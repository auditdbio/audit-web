import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ORANGE_COLOR = "#FF9900";
const BLACK_COLOR = "#222222";

const StyledMenu = styled((props) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "left",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "left",
		}}
		{...props}
	/>
))(({ theme }) => ({
	"& .MuiPaper-root": {
		borderRadius: 10,
		marginTop: theme.spacing(0),
		minWidth: 180,
		fontWeight: 500,
		color:
			theme.palette.mode === "light"
				? "rgb(55, 65, 81)"
				: theme.palette.grey[300],
		boxShadow:
			"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
		"& .MuiMenu-list": {
			padding: "4px 0",
		},
		"& .MuiMenuItem-root": {
			"& .MuiSvgIcon-root": {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			// "&:active": {
			// 	backgroundColor: alpha(
			// 		theme.palette.primary.main,
			// 		theme.palette.action.selectedOpacity
			// 	),
			// },
			":hover": {
				backgroundColor: ORANGE_COLOR, // theme.palette.primary.main
				color: "white",
			},
		},
	},
}));

export default function CustomMenu() {
	const buttonName = "Product";
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button
				id="demo-customized-button-1"
				aria-controls={open ? "demo-customized-menu-1" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				variant="contained"
				disableElevation
				onClick={handleClick}
				endIcon={<KeyboardArrowDownIcon />}
				disableRipple
				sx={{
					background: "transparent",
					color: BLACK_COLOR,
					fontSize: "26px",
					// lineHeight: "32px",
					fontWeight: "400",
					fontFamily: "Montserrat",
					":hover": {
						backgroundColor: "transparent", // theme.palette.primary.main
						color: ORANGE_COLOR,
					},
					textTransform: "none",
				}}
			>
				{buttonName}
			</Button>
			<StyledMenu
				id="demo-customized-menu-1"
				MenuListProps={{
					"aria-labelledby": "demo-customized-button",
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={handleClose} disableRipple>
					AuditDB
				</MenuItem>
				<Divider sx={{ my: 0, backgroundColor: "orange", mx: "15px" }} />
				<MenuItem onClick={handleClose} disableRipple>
					Contact
				</MenuItem>

				<MenuItem onClick={handleClose} disableRipple>
					Our team
				</MenuItem>
				<MenuItem onClick={handleClose} disableRipple>
					Our projects
				</MenuItem>
			</StyledMenu>
		</div>
	);
}
