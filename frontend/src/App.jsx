import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { signOut } from "aws-amplify/auth";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Items from "./pages/Items.jsx";

const isAuthenticated = async () => {
	try {
		const { getCurrentUser } = await import("aws-amplify/auth");
		await getCurrentUser();
		return true;
	} catch {
		return false;
	}
};

const RequireAuth = ({ children }) => {
	const location = useLocation();
	const [auth, setAuth] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			setLoading(true);
			setAuth(await isAuthenticated());
			setLoading(false);
		})();
	}, [location.pathname]);
	if (loading) return null;
	return auth ? children : <Navigate to="/login" replace />;
};

import { useState } from "react";

export default function App() {
	// Amplify is configured by a bootstrap import in main.jsx

	const handleLogout = async () => {
		try {
			await signOut();
			window.location.href = "/login";
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Box sx={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
			<AppBar position="static">
				<Toolbar sx={{ display: "flex", gap: 2 }}>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						ServerlessGuru CRUD
					</Typography>
					<Button color="inherit" component={RouterLink} to="/">Home</Button>
					<Button color="inherit" component={RouterLink} to="/items">Items</Button>
					<Button color="inherit" onClick={handleLogout}>Logout</Button>
				</Toolbar>
			</AppBar>
			<Container sx={{ py: 3, flexGrow: 1 }}>
				<Routes>
					<Route path="/" element={<Navigate to="/items" replace />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/items" element={
						<RequireAuth>
							<Items />
						</RequireAuth>
					} />
					<Route path="*" element={<Navigate to="/items" replace />} />
				</Routes>
			</Container>
			<Box component="footer" sx={{ textAlign: "center", p: 2, color: "text.secondary" }}>
				<Typography variant="body2">© {new Date().getFullYear()} Serverless CRUD Demo</Typography>
			</Box>
		</Box>
	);
}


