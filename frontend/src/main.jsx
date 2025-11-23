import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./auth/bootstrap.js";
import App from "./App.jsx";
import "./styles.css";

const theme = createTheme({
	palette: {
		mode: "light",
		primary: { main: "#1e88e5" },
		secondary: { main: "#7b1fa2" }
	}
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<HashRouter>
				<App />
			</HashRouter>
		</ThemeProvider>
	</React.StrictMode>
);


