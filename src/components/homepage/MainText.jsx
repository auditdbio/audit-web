import { Box } from "@mui/system";
import CustomButton from "../custom/CustomButton";
import theme, { buttonResponsiveStyles } from "../../styles/themes";
import { Typography } from "@mui/material";
import { responsiveFontSizes } from "@mui/material/styles";

const MainText = () => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				marginX: "3%",
			}}
		>
			<img
				width="30%"
				src="/welcome_page/person_skate.svg"
				alt="person_skate"
			/>
			<Box maxWidth={720} sx={textWrapper}>
				<Typography style={headingStyle} theme={theme} variant="h1">
					{headingText}
				</Typography>
				<Typography style={paragraphStyle} theme={theme} variant="body1">
					{paragraphText}
				</Typography>
				<Box
					sx={{
						flexGrow: 1,
						display: "flex",
						justifyContent: "space-evenly",
					}}
				>
					<CustomButton props={auditorButton} />
					<CustomButton
						sx={{
							xl: buttonResponsiveStyles.large,
							lg: buttonResponsiveStyles.medium,
						}}
						props={projectButton}
					/>
				</Box>
			</Box>
			<img
				width="30%"
				src="/welcome_page/person_bitcoin.svg"
				alt="person_bitcoin"
			/>
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
	// [theme.breakpoints.down("lg")]: {
	// 	maxWidth: "600px",
	// },
};
const paragraphStyle = {
	fontWeight: 500,
	lineHeight: "37px",
	textAlign: "center",
	maxWidth: "690px",
	// [theme.breakpoints.down("lg")]: {
	// 	maxWidth: "500px",
	// },
};
const headingText = "Start your project right now or audit like expert";
const paragraphText =
	"AuditDb is a blockchain-based jobs platform that helps clients and freelancers connect. We provide efficient transactions with cryptocurrency, and robust protection through smart contracts - wherever you're based!";

const auditorButton = {
	text: "Become auditor",
	to: "/",
	styles: {
		backgroundColor: "#52176D",
		color: "white",
		width: "350px",
		paddingX: "2rem",
	},
};

const projectButton = {
	text: "Show your project",
	to: "/",
	styles: {
		backgroundColor: "orange",
		color: "white",
		paddingX: "2rem",
	},
};

const textWrapper = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	flexGrow: 1,
	marginY: "auto",
	gap: "1rem",
};
export default MainText;
