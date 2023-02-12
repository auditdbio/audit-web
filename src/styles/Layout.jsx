import React from "react";
import { ContentWrapper } from "./themes.js";
import Header from "../components/Header.jsx";
import Box from "@mui/material/Box";

const Layout = ({ children, sx }) => {
	return (
		<ContentWrapper>
			<Header />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
					minHeight: "calc(100vh - 184px)",
				}}
			>
				{children}
			</Box>
		</ContentWrapper>
	);
};

export default Layout;
