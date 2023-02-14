import { Box, Divider } from "@mui/material";

import AuditorSection from "./AuditorSection";
import ProjectSection from "./ProjectSection";

const AuditorsProjectsSection = () => {
	return (
		<Box sx={AuditorsProjectsSectionStyle}>
			<AuditorSection />
			<Divider
				orientation="vertical"
				flexItem
				sx={{
					// width: "0.5rem",
					backgroundColor: "white",
					color: "white",
				}}
				light
			/>
			<AuditorSection />
			{/* <ProjectSection /> */}
		</Box>
	);
};

const AuditorsProjectsSectionStyle = {
	width: "100%",
	backgroundColor: "#52176D",
	paddingX: "8rem",
	paddingY: "5rem",
	display: "flex",
	flexDirection: { xs: "column", lg: "row" },
	justifyContent: "space-between",
	alignItems: "stretch",
	gap: "3rem",
	color: "white",
};

export default AuditorsProjectsSection;
