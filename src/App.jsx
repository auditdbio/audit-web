import "./App.css";
import "@fontsource/montserrat";

const divStyle = {
	height: "500px",
	width: "500px",
	// backgroundColor: "red",
};

function App() {
	return (
		<div className="App">
			<div style={divStyle}></div>
			<div style={divStyle}></div>
			<div style={divStyle}></div>
			<div style={divStyle}></div>
			<div style={divStyle}></div>
			<div style={divStyle}></div>
		</div>
	);
}

export default App;
