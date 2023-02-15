import AuditorCard from "./AuditorCard";
import { Box, Typography, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import theme from "../../../styles/themes";

const AuditorSection = () => {
	return (
		<Box
			sx={{
				width: "100%",
			}}
		>
			<Box sx={headerWrapper}>
				<Typography variant="h1" sx={{ fontWeight: 500 }}>
					Auditors
				</Typography>
				<Box sx={searchWrapper}>
					<InputBase
						sx={{
							ml: 1,
							flex: 1,
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
				<AuditorCard />
				<AuditorCard />
				<AuditorCard />
				<Box
					sx={{
						display: {
							xs: "block",
							sm: "none",
							xl: "block",
						},
					}}
				>
					<AuditorCard />
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

const headerWrapper = {
	display: "flex",
	justifyContent: "space-between",
	flexDirection: { xs: "column", sm: "row" },
	alignItems: "center",
	gap: "2rem",
};

const searchWrapper = {
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
};
export default AuditorSection;
