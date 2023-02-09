import * as React from "react";
import Button from "@mui/material/Button";
import {Link} from 'react-router-dom';

export default function CustomButton({ props }) {
	const styles = props.styles;
	const buttonText = props.text;
	const buttonStyle = {
		backgroundColor: styles.backgroundColor,
		color: styles.color,
		borderRadius: "15px",
		fontSize: "26px",
		fontFamily: "Montserrat",
		textTransform: "none",
		width: "200px",
		border: styles.border,
		":hover": {
			backgroundColor: styles.backgroundColor,
			color: styles.color,
		},
	};

	return (
		<Link to={props.to}>
			<Button variant="standart" sx={buttonStyle}>
				{buttonText}
			</Button>
		</Link>
	);
}
