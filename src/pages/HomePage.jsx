import React from "react";
import Layout from "../styles/Layout.jsx";
import MainText from "../components/homepage/MainText.jsx";
import SearchTab from "../components/homepage/SearchTab.jsx";

const HomePage = () => {
	return (
		<Layout>
			<MainText />
			<SearchTab />
		</Layout>
	);
};

export default HomePage;
