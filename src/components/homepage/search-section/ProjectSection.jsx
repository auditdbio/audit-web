import { Box, Typography } from "@mui/material";
import ProjectCard from "../../Project-card";

const ProjectSection = () => {
	return (
		<Box
			sx={{
				width: "100%",
			}}
		>
			<Typography variant="h1" sx={{ fontWeight: 500 }}>
				Projects
			</Typography>
			<Box sx={{ height: "2rem" }}></Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
				}}
			>
				<ProjectCard />
				<ProjectCard />
				<ProjectCard />
				<ProjectCard />
			</Box>
		</Box>
	);
};

export default ProjectSection;
