import { Amplify } from "aws-amplify";

export const configureAmplify = () => {
	const region = import.meta.env.VITE_AWS_REGION;
	const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
	const userPoolWebClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;
	if (!region || !userPoolId || !userPoolWebClientId) {
		// Intentionally not throwing to allow local non-auth testing if needed
		console.warn("Amplify not fully configured. Check VITE_* environment variables.");
	}
	Amplify.configure({
		Auth: {
			mandatorySignIn: true,
			region,
			userPoolId,
			userPoolWebClientId
		}
	});
};


