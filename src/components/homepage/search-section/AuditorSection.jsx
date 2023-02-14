import { Box, Typography } from "@mui/material";
import AuditorCard from "./AuditorCard";

const AuditorSection = () => {
	return (
		<Box
			sx={{
				width: "100%",
				// paddingX: "3rem",
			}}
		>
			<Typography variant="h1" sx={{ fontWeight: 500 }}>
				Auditors
			</Typography>
			<Box sx={{ height: "2rem" }}></Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
				}}
			>
				<AuditorCard />
				<AuditorCard />
				<AuditorCard />
				<AuditorCard />
			</Box>
		</Box>
	);
};

export default AuditorSection;
