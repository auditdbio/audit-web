import { Avatar, Box, Card, Typography } from "@mui/material";

const FeedbackCard = ({ info }) => {
	return (
		<Card sx={cardWrapper}>
			<Typography style={descriptionStyle}>{info.description}</Typography>
			<Box sx={detailsWrapper}>
				<Box
					sx={{
						maxWidth: "100px",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-around",
					}}
				>
					<Typography style={descriptionStyle}>{info.name}</Typography>
					<Typography style={interestsStyle}>{info.interests}</Typography>
				</Box>
				<Avatar sx={avatarStyle}></Avatar>
			</Box>
		</Card>
	);
};

const cardWrapper = {
	height: "540px",
	width: "385px",
	borderRadius: "27px",
	background: "#FFFFFF",
	border: "1px solid rgba(67, 66, 66, 0.1)",
	zIndex: "1000",
	boxShadow:
		"0px 64.1377px 40.5824px rgba(0, 0, 0, 0.07)," +
		"0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275)," +
		"0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), " +
		"0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), " +
		"0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)",
	marginBottom: "75px",
	marginLeft: "1.5rem",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	padding: "40px",
};

const descriptionStyle = {
	fontSize: "20px",
	fontWeight: 500,
	lineHeight: "24px",
	color: "#222222",
};

const detailsWrapper = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
};

const avatarStyle = {
	width: "100px",
	height: "100px",
	wordWrap: "break-word",
};

const interestsStyle = {
	fontSize: "14px",
	fontWeight: 500,
	lineHeight: "17px",
	color: "#434242",
	wordWrap: "break-word",
};
export default FeedbackCard;
