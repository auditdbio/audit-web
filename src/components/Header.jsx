import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import CustomMenu from "./CustomMenu";
import CustomButton from "./CustomButton";

const pages = [
	{
		id: 1,
		pageName: "Product",
		menuOptions: [
			{
				id: 2,
				itemName: "Contact",
			},
			{
				id: 3,
				itemName: "Our team",
			},
			{
				id: 4,
				itemName: "Our projects",
			},
		],
	},
	{
		id: 2,
		pageName: "About Us",
		menuOptions: [
			{
				id: 2,
				itemName: "Contact",
			},
			{
				id: 3,
				itemName: "Our team",
			},
			{
				id: 4,
				itemName: "Our projects",
			},
		],
	},
	{
		id: 3,
		pageName: "Community",
		menuOptions: [
			{
				id: 2,
				itemName: "Contact",
			},
			{
				id: 3,
				itemName: "Our team",
			},
			{
				id: 4,
				itemName: "Our projects",
			},
		],
	},
];
const settings = ["Profile", "Account", "Dashboard", "Logout"];
const signInButton = {
	text: "Sign In",
	to: "/login",
	styles: {
		backgroundColor: "orange",
		color: "white",
	},
};

const signUpButton = {
	text: "Sign Up",
	to: "/registration",
	styles: {
		backgroundColor: "transparent",
		color: "#222222",
		border: "3px solid #52176D",
	},
};

const Header = () => {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const brandStyle = {
		display: "inline-flex",
	};

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position="static" color="transparent" elevation={0}>
			<Container
				maxWidth="xl"
				sx={{
					marginTop: { xs: "40px", md: "60px" },
					marginBottom: { xs: "40px", md: "60px" },
				}}
			>
				<Toolbar disableGutters>
					<Box
						sx={{
							flexGrow: 1,
							width: "100%",
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<img
							style={brandStyle}
							src="welcome_page/logo.svg"
							alt="audit db logo"
						/>
						<Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleOpenNavMenu}
								color="inherit"
							>
								<MenuIcon />
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
									display: { xs: "block", md: "none" },
								}}
							>
								{/* {pages.map((page) => (
									<MenuItem key={page} onClick={handleCloseNavMenu}>
										<Typography textAlign="center">{page}</Typography>
									</MenuItem>
								))} */}
							</Menu>
						</Box>
						<Box
							sx={{
								display: { xs: "none", md: "flex" },
								gap: "30px",
							}}
						>
							{pages.map((page) => (
								<CustomMenu key={page.id} props={page} />
							))}
							{/* <CustomMenu />
							<CustomMenu />
							<CustomMenu /> */}
						</Box>
						<Box
							sx={{
								display: { xs: "none", md: "flex" },
								gap: "30px",
							}}
						>
							<CustomButton props={signInButton} />
							<CustomButton props={signUpButton} />
						</Box>
					</Box>
					{/* <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
						{pages.map((page) => (
							<Button
								key={page}
								onClick={handleCloseNavMenu}
								sx={{ my: 2, color: "black", display: "block" }}
							>
								{page}
							</Button>
						))}
					</Box> */}
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Header;
