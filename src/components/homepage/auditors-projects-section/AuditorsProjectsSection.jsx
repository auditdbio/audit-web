import { Box, Divider } from "@mui/material";
import theme from "../../../styles/themes";

import AuditorSection from "./AuditorSection";
import ProjectSection from "./ProjectSection";
import { useMediaQuery } from "@mui/material";

const AuditorsProjectsSection = () => {
	const isMobile = useMediaQuery("(max-width: 768px)");

	return (
		<Box sx={AuditorsProjectsSectionStyle(isMobile)}>
			<AuditorSection />
			<Divider
				orientation="vertical"
				flexItem
				sx={{
					backgroundColor: "white",
					color: "white",
				}}
				light
			/>
			<ProjectSection />
		</Box>
	);
};

const AuditorsProjectsSectionStyle = (isMobile) => ({
	width: "100%",
	backgroundColor: "#52176D",
	paddingX: "10%",
	paddingY: "5rem",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	gap: "3rem",
	color: "white",
	[theme.breakpoints.down("lg")]: {
		paddingX: "5%",
		gap: "1rem",
	},
});

export default AuditorsProjectsSection;
