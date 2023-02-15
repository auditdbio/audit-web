import { Card, Avatar, Box, Typography } from "@mui/material";
import theme from "../../../styles/themes";
import { CustomButton } from "../../custom/Button";
import Currency from "../../icons/Currency";
import Star from "../../icons/Star";

const AuditorCard = () => {
	return (
		<Card sx={cardStyle}>
			<Avatar sx={avatarStyle} />
			<Box sx={columnStyle}>
				<Typography sx={mainTextStyle}>Mishail Voronnikov</Typography>
				<Typography sx={badgeFontStyle}>Cryptography, Games</Typography>
			</Box>
			<Box
				sx={{
					...columnStyle,
					gap: "1rem",
					width: "100%",
				}}
			>
				<Box sx={badgesStyle}>
					<Box sx={infoStyle}>
						<Currency />
						<Typography sx={badgeFontStyle}>3.1k</Typography>
					</Box>
					<Box sx={infoStyle}>
						<Star />
						<Typography sx={badgeFontStyle}>150</Typography>
					</Box>
				</Box>
				<CustomButton sx={buttonStyle}>More info</CustomButton>
			</Box>
		</Card>
	);
};

const buttonStyle = {
	backgroundColor: "orange",
	color: "white",
	":hover": { backgroundColor: "orange", color: "white" },
	[theme.breakpoints.down("sm")]: {
		fontSize: "13px",
	},
};

const cardStyle = {
	width: "340px",
	height: "450px",
	marginY: "1.5rem",
	borderRadius: "1.5rem",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "space-between",
	[theme.breakpoints.down("sm")]: {
		width: "200px",
		height: "280px",
	},
};

const avatarStyle = {
	width: "150px",
	height: "150px",
	marginX: "auto",
	[theme.breakpoints.down("sm")]: {
		width: "90px",
		height: "90px",
	},
};

const columnStyle = {
	width: "100%",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "space-between",
};

const badgesStyle = {
	display: "flex",
	justifyContent: "space-evenly",
	alignItems: "center",
	gap: "2rem",
};

const infoStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	gap: "0.5rem",
};

const badgeFontStyle = {
	fontSize: "19px",
	[theme.breakpoints.down("sm")]: {
		fontSize: "10px",
	},
};

const mainTextStyle = {
	fontWeight: 500,
	fontSize: "26px",
	[theme.breakpoints.down("sm")]: {
		fontSize: "15px",
	},
};
export default AuditorCard;