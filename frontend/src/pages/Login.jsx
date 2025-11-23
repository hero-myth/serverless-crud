import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { Box, Paper, TextField, Button, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await signIn({ username: email, password });
			navigate("/items");
		} catch (err) {
			console.error(err);
			const name = err?.name || "";
			const msg = err?.message || "";
			if (name === "UserNotFoundException") {
				setError("No account found for this email. Please sign up first.");
			} else if (name === "UserNotConfirmedException") {
				setError("Your account is not confirmed. Please check your email for the confirmation code.");
			} else if (name === "NotAuthorizedException") {
				setError("Incorrect email or password.");
			} else {
				setError(msg || "Login failed. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
			<Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
				<Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
				<Stack spacing={2} component="form" onSubmit={onSubmit}>
					<TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					<TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					{error && <Typography color="error">{error}</Typography>}
					<Button type="submit" variant="contained" disabled={loading}>
						{loading ? "Signing in..." : "Sign In"}
					</Button>
					<Typography variant="body2">
						Don't have an account?{" "}
						<Link component={RouterLink} to="/signup">Sign up</Link>
					</Typography>
				</Stack>
			</Paper>
		</Box>
	);
}


