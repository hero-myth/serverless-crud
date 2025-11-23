import "dotenv/config";
import { Amplify } from "aws-amplify";
import { signIn, fetchAuthSession, signOut } from "aws-amplify/auth";

const required = (n) => {
	const v = process.env[n];
	if (!v) throw new Error(`Missing env var: ${n}`);
	return v;
};

const COGNITO_REGION = required("COGNITO_REGION");
const COGNITO_USER_POOL_ID = required("COGNITO_USER_POOL_ID");
const COGNITO_CLIENT_ID = required("COGNITO_CLIENT_ID");
const TEST_USER_EMAIL = required("TEST_USER_EMAIL");
const TEST_USER_PASSWORD = required("TEST_USER_PASSWORD");

Amplify.configure({
	Auth: {
		Cognito: {
			region: COGNITO_REGION,
			userPoolId: COGNITO_USER_POOL_ID,
			userPoolClientId: COGNITO_CLIENT_ID
		}
	}
});

await signIn({ username: TEST_USER_EMAIL, password: TEST_USER_PASSWORD });
const session = await fetchAuthSession();
const token = session?.tokens?.idToken?.toString() || session?.tokens?.accessToken?.toString();
if (!token) {
	throw new Error("Failed to fetch token");
}
console.log(token);
await signOut();



