import { Box } from "@mui/system";
import theme, { buttonResponsiveStyles } from "../../styles/themes";
import { Typography } from "@mui/material";
import { responsiveFontSizes } from "@mui/material/styles";
import { CustomButton } from "../custom/Button";

const MainText = () => {
	return (
		<div>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					marginX: "3%",
				}}
			>
				<Box sx={imageStyle}>
					<img
						width="100%"
						src="/welcome_page/person_skate.svg"
						alt="person_skate"
					/>
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
					<img
						width="100%"
						src="/welcome_page/person_bitcoin.svg"
						alt="person_bitcoin"
					/>
				</Box>
			</Box>
			<Box sx={imagesStyle}>
				<img
					width="40%"
					src="/welcome_page/person_skate.svg"
					alt="person_skate"
				/>
				<img
					width="40%"
					src="/welcome_page/person_bitcoin.svg"
					alt="person_bitcoin"
				/>
			</Box>
		</div>
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
	[theme.breakpoints.down("lg")]: {
		maxWidth: "600px",
	},
};
const paragraphStyle = {
	marginX: "auto",
	fontWeight: 500,
	lineHeight: "37px",
	textAlign: "center",
	maxWidth: "690px",
	[theme.breakpoints.down("lg")]: {
		maxWidth: "500px",
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
	display: { xs: "none", md: "block" },
	width: "25%",
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
};

export default MainText;
