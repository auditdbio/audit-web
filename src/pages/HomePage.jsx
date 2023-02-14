import React from "react";
import Layout from "../styles/Layout.jsx";
import MainText from "../components/homepage/MainText.jsx";
import SearchSection from "../components/homepage/search-section/SearchSection.jsx";

const HomePage = () => {
	return (
		<Layout>
			<MainText />
			<SearchSection />
		</Layout>
	);
};

export default HomePage;
