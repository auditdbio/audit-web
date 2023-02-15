import { Box, Divider } from "@mui/material";
import theme from "../../../styles/themes";

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
					backgroundColor: "white",
					color: "white",
				}}
				light
			/>
			<ProjectSection />
		</Box>
	);
};

const AuditorsProjectsSectionStyle = {
	width: "100%",
	backgroundColor: "#52176D",
	paddingX: "10%",
	paddingY: "5rem",
	display: "flex",
	flexDirection: { xs: "column", xl: "column" },
	justifyContent: "space-between",
	gap: "3rem",
	color: "white",
	[theme.breakpoints.down("lg")]: {
		paddingX: "5%",
		gap: "1rem",
	},
};

export default AuditorsProjectsSection;
