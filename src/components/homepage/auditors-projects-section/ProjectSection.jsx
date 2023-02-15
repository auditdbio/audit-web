import { Box, Typography, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PublicProjectCard from "./PublicProjectCard";
import theme from "../../../styles/themes";

const ProjectSection = () => {
	return (
		<Box
			sx={{
				width: "100%",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					flexDirection: { xs: "column", sm: "row" },
					alignItems: "center",
					gap: "2rem",
				}}
			>
				<Typography variant="h1" sx={{ fontWeight: 500 }}>
					Projects
				</Typography>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						border: "2px white solid",
						borderRadius: "15px",
						padding: "0",
						maxHeight: "42px",
						width: "60%",
						[theme.breakpoints.down("sm")]: {
							width: "100%",
						},
					}}
				>
					<InputBase
						sx={{
							ml: 1,
							flex: 1,
							// height: "42px",
							white: "color",
							padding: "0",
						}}
						inputProps={{
							"aria-label": "search google maps",
							style: {
								color: "white",
								lineHeight: "26px",
								padding: "0",
							},
						}}
					/>
					<IconButton
						type="button"
						sx={{ p: "10px", color: "white" }}
						aria-label="search"
						disableRipple
					>
						<SearchIcon />
					</IconButton>
				</Box>
			</Box>

			<Box sx={{ height: "2rem" }}></Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
				}}
			>
				<PublicProjectCard />
				<PublicProjectCard />
				<PublicProjectCard />
				<Box
					sx={{
						display: {
							xs: "none",
							md: "none",
							xl: "block",
						},
					}}
				>
					<PublicProjectCard />
				</Box>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "end",
					alignItems: "center",
				}}
			>
				<Typography variant="body2">view more...</Typography>
			</Box>
		</Box>
	);
};

export default ProjectSection;
