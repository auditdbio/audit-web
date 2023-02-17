import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import CustomMenu from "./custom/CustomMenu.jsx";
import theme from "../styles/themes.js";
import { CustomButton } from "./custom/Button.jsx";
import { useNavigate, Link } from "react-router-dom";
import {useMediaQuery} from "@mui/material";

const Header = () => {
	const navigate = useNavigate();
	const matchSm = useMediaQuery(theme.breakpoints.down('sm'))

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
					paddingTop: { xs: "40px", md: "60px" },
					// paddingBottom: { xs: "40px", md: "60px" },
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
						<Link to={"/"} style={linkStyle}>
							<Box sx={logoStyle}></Box>
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
										<CustomButton sx={signInButton} onClick={handleSignIn}>
											Sign In
										</CustomButton>
										<CustomButton sx={signUpButton} onClick={handleSignUp}>
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
												color: "white",
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
											{page.pageName}
										</Box>
									</MenuItem>
								))}
							</Menu>
						</Box>
						{ !matchSm &&
							<>
								<Box
									sx={{
										display: { xs: "none", md: "flex" },
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
							</>
						}

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
		name: "About Us",
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
		name: "Community",
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

export default Header;
