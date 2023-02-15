import "./App.css";
import "./index.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import theme from "./styles/themes.js";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
