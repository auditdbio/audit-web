import "./App.css";
import "./index.css";
import Header from "./components/Header";

const divStyle = {
	height: "500px",
	width: "500px",
};

function App() {
	return (
		<div className="App">
			<Header />
			{/* <div style={divStyle}></div>
			<div style={divStyle}></div>
			<div style={divStyle}></div>
			<div style={divStyle}></div>
			<div style={divStyle}></div>
			<div style={divStyle}></div> */}
		</div>
	);
}

export default App;
