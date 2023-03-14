import { Box, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import MenuItem from "@mui/material/MenuItem";
import { useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom/dist";
import Discord from "../icons/Discord.jsx";
import Telegram from "../icons/Telegram.jsx";

const Footer = () => {
	const isMobile = useMediaQuery("(max-width: 768px)");

	return (
		<Box sx={footerContainerStyles}>
			<Box sx={mainFooterStyles(isMobile)}>
				<Box sx={footerStyle(isMobile)}>
					<Box sx={logoIconsStyle(isMobile)}>
						<Box sx={{ display: "flex" }}>
							<Typography style={auditStyles(isMobile)}>Audit</Typography>
							<Typography style={dbStyles(isMobile)}>DB</Typography>
						</Box>
						<Box sx={iconsStyle}>
							<Link to={"https://twitter.com/auditdbio?t=oOdybhqGYlv129TyT8y-2g&s=09"}
							target={'_blank'}>
								<TwitterIcon sx={iconStyle} />
							</Link>
							<Link to={"https://discord.gg/2Wg6GGs93C"} target={'_blank'}>
								<Discord style={iconStyle} />
							</Link>
							<Link to={"https://t.me/+B6deDZFIg3k4Y2Zi"} target={'_blank'}>
								<Telegram style={iconStyle} />
							</Link>
						</Box>
					</Box>
					<Box
						sx={menuItems(isMobile)}
					>
						{pages.map((page) => (
							<MenuItem
								sx={menuItemWrap(isMobile)}
								disableGutters
								disableRipple
								key={page.id}
							>
								<Box sx={menuItem(isMobile)}>
									<Link to={page.path}>{page.name}</Link>
								</Box>
							</MenuItem>
						))}
					</Box>
				</Box>

			</Box>
		</Box>
	);
};

const footerContainerStyles = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "center",
	backgroundColor: "#FF9900",
	paddingBottom: '35px'
};

const mainFooterStyles = (isMobile) => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	maxWidth: "1512px",
	width: "100%",
	padding: isMobile ? "35px 30px 28px 30px" : "24px 45px 8px 45px",
	gap: "30px",
});

const footerStyle = (isMobile) => ({
	display: isMobile ? "flex" : "grid",
	flexDirection: isMobile ? "column" : "none",
	gap: isMobile ? "30px" : "0",
	gridTemplateColumns: {
		zero: "1fr repeat(3, auto)",
		sm: "1fr repeat(3, auto)",
		md: "1fr repeat(3, auto) 1fr",
		lg: "1fr repeat(3, auto) 1fr",
	},
	justifyItems: "center",
});

const logoIconsStyle = (isMobile) => ({
	display: "flex",
	flexDirection: "column",
	marginRight: "auto",
	gap: isMobile ? "30px" : "22px",
	alignSelf: "flex-start",
});

const auditStyles = (isMobile) => ({
	fontSize: isMobile ? "30px" : "40px",
	color: "#52176D",
	fontWeight: "800",
});

const dbStyles = (isMobile) => ({
	fontSize: isMobile ? "30px" : "40px",
	color: "#FCFAF6",
	fontWeight: "800",
});

const iconsStyle = {
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	gap: "25px",
};

const iconStyle = {
	color: "#52176D",
	height: "25px",
	width: "30px",
};

const menuItems = () => ({
	display: "grid",
	gridTemplateColumns: {
		zero: "repeat(2, auto)",
		sm: "repeat(3, auto)",
		md: "repeat(3, auto)",
	},
	gap: "0 50px",
});

const menuItem = (isMobile) => ({
	fontSize: isMobile ? "22px" : "26px",
	'& a': {
		color: '#fff'
	}
});

const menuItemWrap = (isMobile) => ({
	backgroundColor: "transparent",
	textAlign: "left",
	color: "#FCFAF6",
	fontFamily: "Montserrat",
	marginX: isMobile ? "0" : "2rem",

	paddingLeft: "0px",
	fontWeight: "400",
});

const rightsStyles = (isMobile) => ({
	fontSize: isMobile ? "9px" : "18px",
	fontWeight: "400",
	textAlign: "center",
});

const pages = [
	{
		id: 1,
		name: "For customers",
		path: '/for-customers'
	},
	{
		id: 2,
		name: "For auditors",
		path: '/for-auditors'
	},
	// {
	// 	id: 3,
	// 	name: "Product",
	// },
	{
		id: 3,
		name: "AuditDB",
		path: "/audit-db",
	},
	{
		id: 5,
		name: "Contact us",
		path: "/contact-us",
	},
	// {
	// 	id: 6,
	// 	name: "About Us",
	// },
];

export default Footer;