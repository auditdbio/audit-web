import { Card, Avatar, Box, Typography } from "@mui/material";
import { CustomButton } from "../../custom/Button";

const AuditorCard = () => {
	return (
		<Card sx={cardStyle}>
			<Box
				sx={{
					...columnStyle,
					gap: "2rem",
				}}
			>
				<Avatar src="/static/images/avatar/1.jpg" sx={avatarStyle} />
				<Box sx={columnStyle}>
					<Typography variant="body1">Mishail Voronnikov</Typography>
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
						<Box sx={badgeStyle}>
							<Box sx={dollarBadgeStyle}></Box>
							<Typography sx={badgeFontStyle}>3.1k</Typography>
						</Box>
						<Box sx={badgeStyle}>
							<Box sx={starBadgeStyle}></Box>
							<Typography sx={badgeFontStyle}>150</Typography>
						</Box>
					</Box>
					<CustomButton sx={buttonStyle}>More info</CustomButton>
				</Box>
			</Box>
		</Card>
	);
};

const buttonStyle = {
	backgroundColor: "orange",
	color: "white",
	":hover": { backgroundColor: "orange", color: "white" },
};

const cardStyle = {
	width: "340px",
	marginY: "1.5rem",
	borderRadius: "1.5rem",
};

const avatarStyle = {
	width: "150px",
	height: "150px",
	marginX: "auto",
};

const columnStyle = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
};

const badgesStyle = {
	display: "flex",
	justifyContent: "space-evenly",
	alignItems: "center",
	gap: "2rem",
};

const badgeStyle = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	gap: "0.5rem",
};

const dollarBadgeStyle = {
	height: "17px",
	width: "17px",
	backgroundImage: "url(/welcome_page/dollar.svg)",
	backgroundSize: "contain",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	marginY: "auto",
};

const starBadgeStyle = {
	height: "17px",
	width: "17px",
	backgroundImage: "url(/welcome_page/star.svg)",
	backgroundSize: "contain",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	marginY: "auto",
};

const badgeFontStyle = {
	fontSize: "19px",
};
export default AuditorCard;
