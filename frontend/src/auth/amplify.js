import { Amplify } from "aws-amplify";

export const configureAmplify = () => {
	const region = import.meta.env.VITE_AWS_REGION;
	const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
	const userPoolWebClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;
	if (!region || !userPoolId || !userPoolWebClientId) {
		console.error("Amplify not configured: missing VITE_* envs (region, userPoolId, userPoolClientId).");
		return;
	}
	Amplify.configure({
		Auth: {
			Cognito: {
				region,
				userPoolId,
				userPoolClientId: userPoolWebClientId
				// loginWith can be omitted if not using OAuth/social providers
			}
		}
	});
};


