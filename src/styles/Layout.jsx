import React from "react";
import theme, { ContentWrapper } from "./themes.js";
import Header from "../components/Header.jsx";
import Box from "@mui/material/Box";

const Layout = ({ children, sx }) => {
	return (
		<ContentWrapper>
			<Header />
			<Box
				sx={[
					{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "100%",
						paddingY: "150px",
						[theme.breakpoints.down("xl")]: {
							paddingY: "100px",
						},
						[theme.breakpoints.down("md")]: {
							paddingY: "3rem",
						},
						// minHeight: 'calc(100vh - 184px)'
					},
					sx,
				]}
			>
				{children}
			</Box>
		</ContentWrapper>
	);
};

export default Layout;
