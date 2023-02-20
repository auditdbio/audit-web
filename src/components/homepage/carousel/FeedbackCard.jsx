import { Card } from "@mui/material";

const FeedbackCard = () => {
	return <Card sx={cardWrapper}></Card>;
};

const cardWrapper = {
	height: "540px",
	width: "380px",
	borderRadius: "27px",
	background: "#FFFFFF",
	border: "1px solid rgba(67, 66, 66, 0.1)",
	boxShadow:
		"0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07)," +
		" 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275)," +
		"0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), " +
		"0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), " +
		"0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)",
};

export default FeedbackCard;
