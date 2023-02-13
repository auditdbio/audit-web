import { Box } from "@mui/system";
import theme, { buttonResponsiveStyles } from "../../styles/themes";
import { Typography } from "@mui/material";
import { CustomButton } from "../custom/Button";

const MainText = () => {
	return (
		<Box sx={{ width: "100%" }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					padding: "2rem",
				}}
			>
				<Box sx={imageStyle}>
					<div style={personSkateStyle}></div>
				</Box>

				<Box sx={textWrapper}>
					<Typography sx={headingStyle} theme={theme} variant="h1">
						{headingText}
					</Typography>
					<Typography sx={paragraphStyle} theme={theme} variant="body1">
						{paragraphText}
					</Typography>
					<Box sx={buttonsStyle}>
						<CustomButton sx={auditorButton}>Become auditor</CustomButton>
						<CustomButton sx={projectButton}>Show your project</CustomButton>
					</Box>
				</Box>
				<Box sx={imageStyle}>
					<div style={personBitcoinStyle}></div>
				</Box>
			</Box>
			<Box sx={imagesStyle}>
				<div style={personSkateStyle}></div>
				<div style={personBitcoinStyle}></div>
			</Box>
		</Box>
	);
};

const headingStyle = {
	textTransform: "uppercase",
	fontWeight: 600,
	color: "#52176D",
	lineHeight: "73px",
	textAlign: "center",
	maxWidth: "720px",
	marginX: "auto",
	paddingX: "2rem",
	[theme.breakpoints.down("lg")]: {
		maxWidth: "600px",
	},
	[theme.breakpoints.down("sm")]: {
		lineHeight: "40px",
	},
};
const paragraphStyle = {
	marginX: "auto",
	fontWeight: 500,
	lineHeight: "37px",
	textAlign: "center",
	maxWidth: "690px",
	paddingX: "2rem",
	[theme.breakpoints.down("lg")]: {
		maxWidth: "500px",
	},
	[theme.breakpoints.down("sm")]: {
		lineHeight: "25px",
	},
};

const headingText = "Start your project right now or audit like expert";
const paragraphText =
	"AuditDb is a blockchain-based jobs platform that helps clients and freelancers connect. We provide efficient transactions with cryptocurrency, and robust protection through smart contracts - wherever you're based!";

const auditorButton = {
	backgroundColor: "#52176D",
	color: "white",
	":hover": {
		backgroundColor: "#52176D",
		color: "white",
	},
};

const projectButton = {
	backgroundColor: "orange",
	color: "white",
	":hover": {
		backgroundColor: "orange",
		color: "white",
	},
};

const textWrapper = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	flexGrow: 1,
	marginY: "auto",
	gap: "3rem",
};

const imageStyle = {
	display: { xs: "none", md: "inline" },
	minWidth: "25%",
};

const buttonsStyle = {
	flexGrow: 0,
	display: "flex",
	flexDirection: { xs: "column", md: "row" },
	marginX: "auto",
	minWidth: { xs: "300px", md: "100%" },
	justifyContent: "space-around",
	gap: "2rem",
};

const imagesStyle = {
	marginTop: "2rem",
	display: { xs: "flex", md: "none" },
	justifyContent: "space-around",
	height: "250px",
};

const personSkateStyle = {
	height: "100%",
	width: "100%",
	backgroundImage: "url(/welcome_page/person_skate.svg)",
	backgroundSize: "contain",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	margin: "0 auto",
};
const personBitcoinStyle = {
	height: "100%",
	width: "100%",
	backgroundImage: "url(/welcome_page/person_bitcoin.svg)",
	backgroundSize: "contain",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	margin: "0 auto",
};

export default MainText;
