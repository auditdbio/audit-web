import React from "react";
import Layout from "../styles/Layout.jsx";
import MainText from "../components/homepage/MainText.jsx";
import AuditorsProjectsSection from "../components/homepage/auditors-projects-section/AuditorsProjectsSection.jsx";
import Carousel from "../components/homepage/carousel/Carousel.jsx";

const HomePage = () => {
	return (
		<Layout
			sx={{
				flexDirection: "column",
			}}
		>
			<MainText />
			<AuditorsProjectsSection />
			<Carousel />
		</Layout>
	);
};

export default HomePage;
