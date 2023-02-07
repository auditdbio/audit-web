import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function CustomButton() {
	const buttonStyle = {
		backgroundColor: "orange",
		color: "white",
		borderRaduis: "15px",
		fontFamily: "Montserrat",
		// padding: "14px 60px",
		// fontFamily: "Montserrat",
		textTransform: "none",
		width: "200px",
		":hover": {
			backgroundColor: "#FF9900",
			color: "white",
		},
	};

	return (
		<Stack spacing={2} direction="row">
			{/* <Button variant="text">Text</Button>
			<Button variant="contained">Contained</Button> */}
			<Button variant="standart" sx={buttonStyle}>
				Sign in
			</Button>
		</Stack>
	);
}
