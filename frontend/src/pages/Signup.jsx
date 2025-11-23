import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { Box, Paper, TextField, Button, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function Signup() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [step, setStep] = useState(1);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const onSignup = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await signUp({ username: email, password, options: { userAttributes: { email } } });
			setStep(2);
		} catch (err) {
			console.error(err);
			setError("Signup failed. Try a stronger password.");
		} finally {
			setLoading(false);
		}
	};

	const onConfirm = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await confirmSignUp({ username: email, confirmationCode: code });
			navigate("/login");
		} catch (err) {
			console.error(err);
			setError("Invalid confirmation code.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
			<Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
				<Typography variant="h5" sx={{ mb: 2 }}>Sign Up</Typography>
				{step === 1 ? (
					<Stack spacing={2} component="form" onSubmit={onSignup}>
						<TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						<TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
						{error && <Typography color="error">{error}</Typography>}
						<Button type="submit" variant="contained" disabled={loading}>
							{loading ? "Signing up..." : "Sign Up"}
						</Button>
						<Typography variant="body2">
							Already have an account?{" "}
							<Link component={RouterLink} to="/login">Login</Link>
						</Typography>
					</Stack>
				) : (
					<Stack spacing={2} component="form" onSubmit={onConfirm}>
						<TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						<TextField label="Confirmation Code" value={code} onChange={(e) => setCode(e.target.value)} required />
						{error && <Typography color="error">{error}</Typography>}
						<Button type="submit" variant="contained" disabled={loading}>
							{loading ? "Confirming..." : "Confirm"}
						</Button>
					</Stack>
				)}
			</Paper>
		</Box>
	);
}


