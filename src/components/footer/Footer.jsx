import { Box, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				backgroundColor: "#FF9900",
				paddingTop: "40px",
				paddingBottom: "22px",
				padding: "1rem",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
				}}
			>
				<Box sx={{ display: "flex" }}>
					<Typography
						style={{
							fontSize: "40px",
							color: "#52176D",
							fontWeight: "800",
						}}
					>
						Audit
					</Typography>
					<Typography
						style={{
							fontSize: "40px",
							color: "#FCFAF6",
							fontWeight: "800",
						}}
					>
						DB
					</Typography>
				</Box>
				<Box>
					<TwitterIcon sx={IconStyle} />
					<YouTubeIcon sx={IconStyle} />
					<InstagramIcon sx={IconStyle} />
				</Box>
			</Box>

			<Typography
				style={{
					fontSize: "18px",
					fontWeight: "500",
					textAlign: "center",
				}}
			>
				2022 All rights reserved.
			</Typography>
		</Box>
	);
};

const IconStyle = {
	color: "#52176D",
};

export default Footer;
