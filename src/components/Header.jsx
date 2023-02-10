import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import CustomMenu from "./custom/CustomMenu.jsx";
import { CustomButton } from "./custom/Button.jsx";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();

	const handleSignIn = () => {
		navigate("/sign-in");
	};

	const handleSignUp = () => {
		navigate("/sign-up");
	};

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
						<Link to={"/"}>
							<img
								style={brandStyle}
								src="/welcome_page/logo.svg"
								alt="audit db logo"
							/>
						</Link>
						<Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
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
									display: { xs: "block", md: "none" },
								}}
							>
								{pages.map((page) => (
									<MenuItem key={page.id} onClick={handleCloseNavMenu}>
										<Typography textAlign="center">{page.pageName}</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<Box
							sx={{
								display: { xs: "none", md: "flex" },
								gap: "0.5rem",
							}}
						>
							{pages.map((page) => (
								<CustomMenu key={page.id} props={page} />
							))}
						</Box>
						<Box
							sx={{
								width: "30%",
								maxWidth: "500px",
								display: { xs: "none", md: "flex" },
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

const menuIconStyle = {
	width: "50px",
};

export default Header;
