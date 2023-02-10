import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import theme, { radiusOfComponents } from "../../styles/themes";

export const CustomButton = styled(Button)({
	width: "100%",
	borderRadius: radiusOfComponents,
	fontSize: "26px",
	textTransform: "none",
	[theme.breakpoints.down("xl")]: {
		fontSize: "22px",
	},
});
